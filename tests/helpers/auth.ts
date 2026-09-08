import { expect, type Locator, type Page } from '@playwright/test';

/**
 * The admin sign-in flow, in pieces.
 *
 * The URL stays on /sign-in for the whole flow, so progress is only visible
 * through data-active-page-id: auth.sign-in -> auth.mfa -> the app. The pieces
 * are separate so TC-VEC-001 can report each manual step on its own while
 * auth.setup.ts just runs them in order.
 */

export function activePageId(page: Page): Promise<string | null> {
  return page.locator('html').getAttribute('data-active-page-id');
}

export function adminCredentials(): { email: string; password: string } {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  if (!email || !password) {
    throw new Error('ADMIN_EMAIL and ADMIN_PASSWORD must be set in .env.');
  }
  return { email, password };
}

export async function openSignIn(page: Page): Promise<void> {
  await page.goto('/sign-in');
  await expect(page.getByRole('heading', { name: 'Welcome' })).toBeVisible();
}

export async function enterEmail(page: Page, email: string): Promise<void> {
  await page.getByRole('textbox', { name: 'Email' }).fill(email);
}

/**
 * locator.fill() puts the raw value in the step title, which lands in the
 * HTML/Allure reports and the trace. Set it through the DOM instead so the
 * password never reaches an artifact.
 */
export async function enterSecret(field: Locator, value: string): Promise<void> {
  await field.evaluate((element, secret) => {
    const input = element as HTMLInputElement;
    const setValue = Object.getOwnPropertyDescriptor(
      HTMLInputElement.prototype,
      'value',
    )?.set;
    setValue?.call(input, secret);
    input.dispatchEvent(new Event('input', { bubbles: true }));
    input.dispatchEvent(new Event('change', { bubbles: true }));
  }, value);

  const typedLength = (await field.inputValue()).length;
  expect(typedLength, 'secret did not reach the field').toBe(value.length);
}

export async function enterPassword(page: Page, password: string): Promise<void> {
  await enterSecret(page.getByRole('textbox', { name: 'Password' }), password);
}

/** Clicks Sign In and fails loudly with the server's own reason. */
export async function submitSignIn(page: Page): Promise<void> {
  const tokenResponse = page.waitForResponse(
    (response) => response.url().includes('grant_type=password'),
    { timeout: 30_000 },
  );
  await page.getByRole('button', { name: /sign in/i }).click();

  const token = await tokenResponse;
  if (!token.ok()) {
    throw new Error(
      `Admin sign-in was rejected with HTTP ${token.status()}: ${await token.text()}. ` +
        'Verify ADMIN_EMAIL and ADMIN_PASSWORD in .env.',
    );
  }

  await page.waitForFunction(
    () => document.documentElement.dataset.activePageId !== 'auth.sign-in',
    null,
    { timeout: 30_000 },
  );
}

/** Completes the SMS step when the app asks for it. */
export async function completeTwoFactor(page: Page): Promise<void> {
  if ((await activePageId(page)) !== 'auth.mfa') {
    return;
  }

  const code = process.env.ADMIN_OTP?.trim();
  if (!code) {
    throw new Error(
      'Sign-in requires a 6-digit SMS code. Set ADMIN_OTP in .env before running.',
    );
  }

  await expect(page.getByRole('heading', { name: /two-factor verification/i })).toBeVisible();
  await enterSecret(page.getByRole('textbox', { name: 'Verification code' }), code);
  await page.getByRole('button', { name: /^verify$/i }).click();
}

export async function expectSignedIn(page: Page): Promise<void> {
  await expect
    .poll(() => activePageId(page), {
      timeout: 60_000,
      message: 'admin app never left the auth flow',
    })
    .not.toMatch(/^auth\./);
}
