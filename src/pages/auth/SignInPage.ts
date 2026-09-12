import { expect, type Locator, type Page } from '@playwright/test';

/**
 * The admin sign-in flow.
 *
 * The URL stays on /sign-in for the whole flow, so progress is only visible
 * through data-active-page-id: auth.sign-in -> auth.mfa -> the app. The steps
 * are separate methods so TC-VEC-001 can report each manual step on its own
 * while auth.setup.ts just runs them in order.
 */
export class SignInPage {
  readonly emailField: Locator;
  readonly passwordField: Locator;
  readonly otpField: Locator;
  readonly submitButton: Locator;

  constructor(private readonly page: Page) {
    this.emailField = page.getByRole('textbox', { name: 'Email' });
    this.passwordField = page.getByRole('textbox', { name: 'Password' });
    this.otpField = page.getByRole('textbox', { name: 'Verification code' });
    this.submitButton = page.getByRole('button', { name: /sign in/i });
  }

  activePageId(): Promise<string | null> {
    return this.page.locator('html').getAttribute('data-active-page-id');
  }

  async open(): Promise<void> {
    await this.page.goto('/sign-in');
    await expect(this.page.getByRole('heading', { name: 'Welcome' })).toBeVisible();
  }

  async enterEmail(email: string): Promise<void> {
    await this.emailField.fill(email);
  }

  async enterPassword(password: string): Promise<void> {
    await this.enterSecret(this.passwordField, password);
  }

  /**
   * locator.fill() puts the raw value in the step title, which lands in the
   * HTML/Allure reports and the trace. Set it through the DOM instead so the
   * password never reaches an artifact.
   */
  private async enterSecret(field: Locator, value: string): Promise<void> {
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

  /** Clicks Sign In and fails loudly with the server's own reason. */
  async submit(): Promise<void> {
    const tokenResponse = this.page.waitForResponse(
      (response) => response.url().includes('grant_type=password'),
      { timeout: 30_000 },
    );
    await this.submitButton.click();

    const token = await tokenResponse;
    if (!token.ok()) {
      throw new Error(
        `Admin sign-in was rejected with HTTP ${token.status()}: ${await token.text()}. ` +
          'Verify ADMIN_EMAIL and ADMIN_PASSWORD in .env.',
      );
    }

    await this.page.waitForFunction(
      () => document.documentElement.dataset.activePageId !== 'auth.sign-in',
      null,
      { timeout: 30_000 },
    );
  }

  /** Completes the SMS step when the app asks for it. */
  async completeTwoFactor(code: string | undefined): Promise<void> {
    if ((await this.activePageId()) !== 'auth.mfa') {
      return;
    }

    if (!code) {
      throw new Error('Sign-in requires a 6-digit SMS code. Set ADMIN_OTP in .env before running.');
    }

    await expect(
      this.page.getByRole('heading', { name: /two-factor verification/i }),
    ).toBeVisible();
    await this.enterSecret(this.otpField, code);
    await this.page.getByRole('button', { name: /^verify$/i }).click();
  }

  async expectSignedIn(): Promise<void> {
    await expect
      .poll(() => this.activePageId(), {
        timeout: 60_000,
        message: 'admin app never left the auth flow',
      })
      .not.toMatch(/^auth\./);
  }

  async expectNoAuthError(): Promise<void> {
    await expect(this.page.getByText(/invalid email or password/i)).toHaveCount(0);
  }
}
