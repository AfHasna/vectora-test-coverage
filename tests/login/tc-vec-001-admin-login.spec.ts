import { test, expect } from '../fixtures';
import {
  adminCredentials,
  completeTwoFactor,
  enterEmail,
  enterPassword,
  expectSignedIn,
  openSignIn,
  submitSignIn,
} from '../helpers/auth';
import { annotateCase } from '../helpers/reporting';
import { proofStep } from '../helpers/steps';
import { sidebarModules } from '../helpers/catalog';

/**
 * TC-VEC-001 — Successful Admin Login.
 *
 * Signs in for real, which the safety rule allows in order to obtain a session.
 * This spec runs in its own project with traces, videos and failure snapshots
 * switched off, because those artifacts would capture the credentials.
 */
test.describe('Happy path - Authentication', () => {
  test('TC-VEC-001 Successful Admin Login', async ({ page }, testInfo) => {
    await annotateCase(
      'TC-VEC-001',
      'Live sign-in also requires the SMS one-time code, which the app asks for after the password is accepted; the code comes from ADMIN_OTP.',
    );

    const { email, password } = adminCredentials();

    await proofStep(
      page,
      testInfo,
      {
        action: 'Open the Vectora Admin Portal',
        expected: 'the sign-in page loads with a Welcome heading',
      },
      async () => {
        await openSignIn(page);
        await expect(page).toHaveTitle(/Vectora Admin/i);
      },
    );

    await proofStep(
      page,
      testInfo,
      {
        action: 'Enter a valid Admin email',
        expected: 'the email is accepted into the field',
      },
      async () => {
        await enterEmail(page, email);
        await expect(page.getByRole('textbox', { name: 'Email' })).toHaveValue(email);
      },
    );

    await proofStep(
      page,
      testInfo,
      {
        action: 'Enter the correct password',
        expected: 'the password is masked in the field',
      },
      async () => {
        await enterPassword(page, password);
        await expect(page.getByRole('textbox', { name: 'Password' })).toHaveAttribute(
          'type',
          'password',
        );
      },
    );

    await proofStep(
      page,
      testInfo,
      {
        action: 'Click Sign In and complete the two-factor step',
        expected: 'the credentials are accepted and no authentication error is shown',
      },
      async () => {
        await submitSignIn(page);
        await completeTwoFactor(page);
        await expect(page.getByText(/invalid email or password/i)).toHaveCount(0);
      },
    );

    await proofStep(
      page,
      testInfo,
      {
        action: 'Wait for the Home page to load',
        expected: 'the Home dashboard opens and the account menu shows the user initials',
      },
      async () => {
        await expectSignedIn(page);
        await expect(page.getByRole('heading', { name: 'Home', exact: true })).toBeVisible();

        const accountMenu = page.getByRole('button', { name: 'Account menu' });
        await expect(accountMenu).toBeVisible();
        await expect(accountMenu).not.toHaveText('');
      },
    );

    await proofStep(
      page,
      testInfo,
      {
        action: 'Review the sidebar',
        expected: 'only the modules permitted for the role are listed',
      },
      async () => {
        const sidebar = page.getByRole('list').first();
        for (const module of sidebarModules) {
          await expect(sidebar.getByRole('link', { name: module })).toBeVisible();
        }
        await expect(sidebar.getByRole('link')).toHaveCount(sidebarModules.length);
      },
    );
  });
});
