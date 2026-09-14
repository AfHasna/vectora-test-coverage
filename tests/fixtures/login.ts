import { expect, type Locator, type Page } from '@playwright/test';
import type { PortalConfig } from './env';

const LOGIN_PATH: Record<PortalConfig['key'], string> = {
  admin: '/sign-in',
  client: '/',
  provider: '/login',
};

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
  return page.getByRole('textbox', { name: /email/i }).first();
}

function passwordField(page: Page): Locator {
  return page.getByLabel(/password/i).first();
}

function otpField(page: Page): Locator {
  return page.getByRole('textbox', { name: 'Verification code' });
}

async function submitLogin(page: Page): Promise<void> {
  const button = page.getByRole('button', { name: /sign in|log in|continue|submit/i }).first();
  await button.click();
}

export async function openLogin(page: Page, portal: PortalConfig): Promise<void> {
  await page.goto(LOGIN_PATH[portal.key]);
  await expect(emailField(page)).toBeVisible();
}

export async function login(page: Page, portal: PortalConfig, options?: { wrongPassword?: boolean; wrongOtp?: boolean }): Promise<void> {
  await openLogin(page, portal);
  await emailField(page).fill(portal.credentials.email);
  await enterSecret(
    passwordField(page),
    options?.wrongPassword ? `${portal.credentials.password}-invalid` : portal.credentials.password,
  );
  await submitLogin(page);

  if (options?.wrongPassword) {
    return;
  }

  const otpHeading = page.getByRole('heading', { name: /two-factor verification|check your email/i });
  await expect(otpHeading).toBeVisible({ timeout: 20_000 });
  await enterSecret(otpField(page), options?.wrongOtp ? '111111' : portal.credentials.otp);
  const verify = page.getByRole('button', { name: /^verify$/i });
  await expect(verify).toBeEnabled({ timeout: 10_000 });
  await verify.click();
  if (options?.wrongOtp) {
    return;
  }
  await expect(otpHeading).toBeHidden({ timeout: 30_000 });
}

function accountMenu(page: Page): Locator {
  return page.getByRole('button', { name: /account menu|user menu|profile menu/i });
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

export async function expectLoggedIn(page: Page): Promise<void> {
  await expect(accountMenu(page)).toBeVisible({ timeout: 45_000 });
  await dismissOnboarding(page);
}

export async function signOut(page: Page): Promise<void> {
  await dismissOnboarding(page);
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
