import { expect, type Locator, type Page } from '@playwright/test';
import type { PortalConfig } from './env';

const LOGIN_PATH: Record<PortalConfig['key'], string> = {
  admin: '/sign-in',
  client: '/',
  provider: '/login',
  driver: '/login',
  guardian: '/sign-in',
};

function isMobileApp(portal: PortalConfig): boolean {
  return portal.key === 'driver' || portal.key === 'guardian';
}

export async function enterSecret(field: Locator, value: string): Promise<void> {
  await field.evaluate((element, secret) => {
    const input = element as HTMLInputElement;
    const setValue = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')?.set;
    setValue?.call(input, secret);
    input.dispatchEvent(new Event('input', { bubbles: true }));
    input.dispatchEvent(new Event('change', { bubbles: true }));
  }, value);

  const typedLength = (await field.inputValue()).length;
  expect(typedLength, 'secret did not reach the field').toBe(value.length);
}

function emailField(page: Page): Locator {
  return page
    .getByRole('textbox', { name: /email/i })
    .or(page.getByPlaceholder(/email|@example\.com|@ejemplo/i))
    .or(page.locator('input[type="email"]'))
    .first();
}

function passwordField(page: Page): Locator {
  return page
    .getByLabel(/password/i)
    .or(page.getByPlaceholder(/^password$/i))
    .or(page.locator('input[type="password"]'))
    .first();
}

function otpField(page: Page): Locator {
  return page
    .getByRole('textbox', { name: /verification code|otp|code/i })
    .or(page.getByPlaceholder(/code|000000/i))
    .or(page.locator('input[autocomplete="one-time-code"]'))
    .first();
}

async function submitLogin(page: Page): Promise<void> {
  const button = page
    .getByTestId('sign-in-button')
    .or(page.getByRole('button', { name: /sign in|log in|continue|submit/i }))
    .or(page.getByText(/^sign in$/i))
    .first();
  await button.click();
}

function accountMenu(page: Page): Locator {
  return page.getByRole('button', { name: /account menu|user menu|profile menu/i });
}

function rateLimitMessage(page: Page): Locator {
  return page.getByText(/Too many attempts/i);
}

async function isRateLimited(page: Page): Promise<boolean> {
  return rateLimitMessage(page)
    .waitFor({ state: 'visible', timeout: 2_000 })
    .then(() => true)
    .catch(() => false);
}

async function submitCredentials(page: Page, portal: PortalConfig, password: string): Promise<void> {
  if (await emailField(page).waitFor({ state: 'visible', timeout: 10_000 }).then(() => true).catch(() => false)) {
    await emailField(page).fill(portal.credentials.email);
    const secret = passwordField(page);
    if (isMobileApp(portal)) {
      await secret.click();
      await secret.fill(password);
    } else {
      await enterSecret(secret, password);
    }
    await submitLogin(page);
  }
}

async function waitOutRateLimit(page: Page, portal: PortalConfig): Promise<void> {
  if (!(await isRateLimited(page))) {
    return;
  }
  const retry = page.getByRole('button', { name: /Try again/i });
  if (await retry.waitFor({ state: 'visible', timeout: 3_000 }).then(() => true).catch(() => false)) {
    await retry.click();
  }
  await expect(rateLimitMessage(page).or(otpField(page)).or(emailField(page)).or(accountMenu(page))).toBeVisible({
    timeout: 20_000,
  });
  if (await isRateLimited(page)) {
    throw new Error(
      `${portal.name} 2FA send is still rate-limited after one retry. Stop and use the existing session instead of more login attempts.`,
    );
  }
  await submitCredentials(page, portal, portal.credentials.password);
}

export async function openLogin(page: Page, portal: PortalConfig): Promise<void> {
  await page.goto(LOGIN_PATH[portal.key]);
  await expect(emailField(page).or(rateLimitMessage(page)).or(accountMenu(page))).toBeVisible({
    timeout: 30_000,
  });
}

export async function login(
  page: Page,
  portal: PortalConfig,
  options?: { wrongPassword?: boolean; wrongOtp?: boolean; stopAtOtp?: boolean },
): Promise<void> {
  await openLogin(page, portal);
  if (await accountMenu(page).isVisible().catch(() => false)) {
    return;
  }
  await waitOutRateLimit(page, portal);
  await submitCredentials(
    page,
    portal,
    options?.wrongPassword ? `${portal.credentials.password}-invalid` : portal.credentials.password,
  );

  if (options?.wrongPassword) {
    return;
  }

  const otpHeading = page.getByRole('heading', { name: /two-factor verification|check your email|verify your identity/i }).or(page.getByText(/Verify Your Identity/i));
  const menu = accountMenu(page);
  await waitOutRateLimit(page, portal);
  await expect(otpHeading.or(menu).or(otpField(page)).first()).toBeVisible({ timeout: 45_000 });
  if (await menu.isVisible().catch(() => false)) {
    return;
  }
  await expect(otpHeading.or(otpField(page)).first()).toBeVisible({ timeout: 15_000 });

  const field = page.locator('#mfa-code').or(otpField(page)).first();
  await field.waitFor({ state: 'attached', timeout: 10_000 });
  if (options?.stopAtOtp) {
    return;
  }
  const otpValue = options?.wrongOtp ? '111111' : portal.credentials.otp;
  if (await field.isVisible().catch(() => false)) {
    await field.click();
    await field.fill('');
    await field.pressSequentially(otpValue, { delay: 40 });
  }
  if ((await field.inputValue().catch(() => '')) !== otpValue) {
    await field.fill(otpValue).catch(() => undefined);
    await enterSecret(field, otpValue);
  }

  const verify = page
    .getByTestId('otp-submit-button')
    .or(page.getByRole('button', { name: /^verify$/i }))
    .or(page.getByRole('button', { name: /verify|continue/i }))
    .or(page.getByText(/^Verify$/))
    .first();
  await expect(verify).toBeEnabled({ timeout: 10_000 });
  await verify.click();
  if (options?.wrongOtp) {
    return;
  }
  await expect(otpHeading).toBeHidden({ timeout: 30_000 });
}

export async function dismissOnboarding(page: Page): Promise<void> {
  const skip = page.getByRole('button', { name: /^skip$/i });
  try {
    await expect(skip).toBeVisible({ timeout: 4_000 });
  } catch {
    return;
  }
  await skip.click({ force: true });
  await expect(page.getByTestId('onboarding-tour')).toBeHidden();
}

export async function expectLoggedIn(page: Page, portal?: PortalConfig): Promise<void> {
  if (portal && isMobileApp(portal)) {
    if (portal.key === 'driver') {
      const box = page.getByTestId('safety-checklist-checkbox');
      if (await box.isVisible({ timeout: 8_000 }).catch(() => false)) {
        await box.click();
        await page.getByTestId('safety-checklist-confirm').click();
      }
    }
    await expect(
      page
        .getByText(/Hello,/i)
        .or(page.getByRole('tab', { name: /home|my trips|more/i }))
        .or(page.getByText(/No trips scheduled today/i))
        .first(),
    ).toBeVisible({ timeout: 45_000 });
    await expect(emailField(page)).toBeHidden({ timeout: 10_000 }).catch(() => undefined);
    return;
  }

  await expect(accountMenu(page)).toBeVisible({ timeout: 45_000 });
  await dismissOnboarding(page);
}

export async function signOut(page: Page, portal?: PortalConfig): Promise<void> {
  await dismissOnboarding(page);
  if (portal && isMobileApp(portal)) {
    const profile = page.getByRole('tab', { name: /profile|settings|account/i }).or(page.getByText(/^profile$/i));
    if (await profile.first().isVisible().catch(() => false)) {
      await profile.first().click();
    }
    const logout = page.getByRole('button', { name: /sign out|log out|logout/i }).or(page.getByText(/sign out|log out/i));
    await expect(logout.first()).toBeVisible({ timeout: 15_000 });
    await logout.first().click();
    await expect(emailField(page)).toBeVisible({ timeout: 20_000 });
    return;
  }

  const logout = page.getByRole('menuitem', { name: /logout|sign out|log out/i });
  if (!(await logout.isVisible().catch(() => false))) {
    const menu = accountMenu(page);
    await expect(menu).toBeVisible({ timeout: 15_000 });
    await menu.click();
  }

  await expect(logout).toBeVisible();
  await logout.click();
  await expect(page.getByRole('button', { name: /sign in|log in/i })).toBeVisible({
    timeout: 20_000,
  });
}
