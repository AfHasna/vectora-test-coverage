import { test } from '../../../../tests/fixtures/regression-test';

const PORTAL = 'Guardian App';
const SUITE = 'GRD-TS-01 — Authentication';
const TMS = 'https://govectora.atlassian.net/wiki/x/AQDg';
const TOTAL = 4;

test.describe.configure({ mode: 'serial' });
test.use({ storageState: { cookies: [], origins: [] } });

test.describe(SUITE, () => {
  test('VCTR-GRD-001 — Valid login (+ OTP if required) succeeds', { tag: '@regression' }, async ({ runCase }) => {
    await runCase({
      portal: PORTAL,
      suite: SUITE,
      tms: TMS,
      id: 'VCTR-GRD-001',
      title: 'Valid login (+ OTP if required) succeeds',
      sequence: 1,
      total: TOTAL,
      priority: 'P1',
      regression: true,
      preconditions: 'Logged out',
      actionSteps: '1) Go to /sign-in 2) Enter valid email/password 3) Submit 4) Enter 6-digit OTP if shown 5) Submit',
      expected: 'Guardian leaves sign-in and reaches children, trips, or home',
    });
  });

  test('VCTR-GRD-002 — Invalid password rejected', { tag: '@regression' }, async ({ runCase }) => {
    await runCase({
      portal: PORTAL,
      suite: SUITE,
      tms: TMS,
      id: 'VCTR-GRD-002',
      title: 'Invalid password rejected',
      sequence: 2,
      total: TOTAL,
      priority: 'P1',
      regression: true,
      preconditions: 'Logged out',
      actionSteps: '1) Enter valid email + wrong password 2) Submit',
      expected: 'Inline error shown; user remains on login screen; no OTP step reached',
    });
  });

  test('VCTR-GRD-003 — Invalid OTP rejected when 2FA is enabled', async ({ runCase }) => {
    await runCase({
      portal: PORTAL,
      suite: SUITE,
      tms: TMS,
      id: 'VCTR-GRD-003',
      title: 'Invalid OTP rejected when 2FA is enabled',
      sequence: 3,
      total: TOTAL,
      priority: 'P2',
      regression: false,
      preconditions: 'At OTP screen',
      actionSteps: '1) Enter incorrect 6-digit code 2) Submit',
      expected: 'Error shown; user not granted access',
    });
  });

  test('VCTR-GRD-004 — Session sign-out', { tag: '@regression' }, async ({ runCase }) => {
    await runCase({
      portal: PORTAL,
      suite: SUITE,
      tms: TMS,
      id: 'VCTR-GRD-004',
      title: 'Session sign-out',
      sequence: 4,
      total: TOTAL,
      priority: 'P1',
      regression: true,
      preconditions: 'Logged in',
      actionSteps: '1) Open profile 2) Sign out',
      expected: 'Redirected to login screen',
    });
  });
});
