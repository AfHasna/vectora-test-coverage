import { expect } from '@playwright/test';
import { test } from '../../../fixtures/regression-test';
import { adminCase } from '../../../fixtures/annotate';
import { login, expectLoggedIn, openLogin } from '../../../fixtures/login';
import { optionalPortalConfig } from '../../../fixtures/env';

const TOTAL = 3;
const SUITE = 'Authentication';

test.describe.configure({ mode: 'serial' });
test.use({ storageState: { cookies: [], origins: [] } });

test.describe('REG-ADM Authentication', () => {
  test(
    'REG-ADM-001 — Valid login + OTP lands on Home',
    { tag: ['@regression', '@basic'] },
    async ({ page }) => {
      const portal = optionalPortalConfig('admin');
      await adminCase(
        page,
        {
          portal: 'Admin',
          suite: SUITE,
          id: 'REG-ADM-001',
          sequence: 1,
          total: TOTAL,
          priority: 'P1',
          regression: true,
          basic: true,
          title: 'Valid login + OTP lands on Home',
          preconditions: 'Logged out at `/sign-in`',
          data: `${portal.credentials.email} / OTP 000000`,
          actionSteps:
            '1) Open `/sign-in` 2) Enter staging Admin email and password 3) Submit 4) Enter bypass OTP 000000 5) Verify',
          expected:
            'kb: User reaches Home; sidebar shows the main Admin sections (Home, Stakeholder, Workforce, Fleet, Compliance, Service Operations, Accounting, Reports, Settings).',
          expectedSource: 'kb',
          actual: 'Practice: Osama session reached Home with nine sidebar sections.',
        },
        async () => {
          await login(page, portal);
          await expectLoggedIn(page, portal);
          await expect(page.getByRole('link', { name: 'Stakeholder Management' })).toBeVisible();
          await expect(page.getByRole('link', { name: 'Settings' })).toBeVisible();
        },
      );
    },
  );

  test(
    'REG-ADM-002 — Wrong password stays on sign-in',
    { tag: '@regression' },
    async ({ page }) => {
      const portal = optionalPortalConfig('admin');
      await adminCase(
        page,
        {
          portal: 'Admin',
          suite: SUITE,
          id: 'REG-ADM-002',
          sequence: 2,
          total: TOTAL,
          priority: 'P1',
          regression: true,
          title: 'Wrong password stays on sign-in',
          preconditions: 'Logged out',
          data: 'Valid email + password with `-invalid` suffix',
          actionSteps: '1) Open sign-in 2) Submit wrong password',
          expected: 'common: Error shown; OTP step not reached; still on sign-in.',
          expectedSource: 'common',
        },
        async () => {
          await login(page, portal, { wrongPassword: true });
          await expect(page.getByRole('button', { name: /sign in/i })).toBeVisible();
          await expect(page.getByText(/invalid|incorrect|error|wrong/i).first()).toBeVisible();
        },
      );
    },
  );

  test(
    'REG-ADM-003 — Sign-in form shows email and password',
    { tag: ['@regression', '@basic'] },
    async ({ page }) => {
      const portal = optionalPortalConfig('admin');
      await adminCase(
        page,
        {
          portal: 'Admin',
          suite: SUITE,
          id: 'REG-ADM-003',
          sequence: 3,
          total: TOTAL,
          priority: 'P2',
          regression: true,
          basic: true,
          title: 'Sign-in form shows email and password',
          preconditions: 'Logged out',
          data: '—',
          actionSteps: '1) Open `/sign-in`',
          expected: 'common: Email and password fields visible.',
          expectedSource: 'common',
        },
        async () => {
          await openLogin(page, portal);
          await expect(page.getByRole('textbox', { name: /email/i })).toBeVisible();
          await expect(page.locator('input[type="password"]').first()).toBeVisible();
        },
      );
    },
  );
});
