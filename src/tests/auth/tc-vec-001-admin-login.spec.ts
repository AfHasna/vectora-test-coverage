import { DEFAULT_ROLE, roleCredentials } from '@config/env';
import { MODULE, READ_ONLY, SUITE } from '@config/test-tags';
import { expect, test } from '@fixtures/pages.fixture';
import { annotateCase } from '@utils/reporting';
import { proofStep } from '@utils/steps';

/**
 * TC-VEC-001 — Successful Admin Login.
 *
 * Signs in for real, which the safety rule allows in order to obtain a session.
 * This spec runs in its own project with traces, videos and failure snapshots
 * switched off, because those artifacts would capture the credentials.
 */
test.describe('Happy path - Authentication', () => {
  test(
    'TC-VEC-001 Successful Admin Login',
    { tag: [SUITE.smoke, MODULE.auth, READ_ONLY] },
    async ({ page, signIn, home }, testInfo) => {
      await annotateCase(
        'TC-VEC-001',
        'Live sign-in also requires the SMS one-time code, which the app asks for after the password is accepted; the code comes from ADMIN_OTP.',
      );

      const credentials = roleCredentials(DEFAULT_ROLE);
      test.skip(!credentials, `No credentials for the ${DEFAULT_ROLE} role.`);
      const { email, password, otp } = credentials!;

      await proofStep(
        page,
        testInfo,
        {
          action: 'Open the Vectora Admin Portal',
          expected: 'the sign-in page loads with a Welcome heading',
        },
        async () => {
          await signIn.open();
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
          await signIn.enterEmail(email);
          await expect(signIn.emailField).toHaveValue(email);
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
          await signIn.enterPassword(password);
          await expect(signIn.passwordField).toHaveAttribute('type', 'password');
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
          await signIn.submit();
          await signIn.completeTwoFactor(otp);
          await signIn.expectNoAuthError();
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
          await signIn.expectSignedIn();
          await home.expectLoaded();
          await expect(home.accountMenu).toBeVisible();
          await expect(home.accountMenu).not.toHaveText('');
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
          await home.sidebar.expectModules();
        },
      );
    },
  );
});
