import { test } from '../../../../tests/fixtures/regression-test';

const PORTAL = "Service Provider Portal";
const SUITE = "SP-TS-01 — Authentication";
const TMS = "https://govectora.atlassian.net/wiki/x/6QDD";
const TOTAL = 6;

test.describe.configure({ mode: 'serial' });
test.use({ storageState: { cookies: [], origins: [] } });

test.describe(SUITE, () => {

  test("VCTR-SP-001 — Valid login + OTP succeeds", { tag: '@regression' }, async ({ runCase }) => {
    await runCase({
      portal: PORTAL,
      suite: SUITE,
      tms: TMS,
      id: "VCTR-SP-001",
      title: "Valid login + OTP succeeds",
      sequence: 1,
      total: TOTAL,
      priority: "P1",
      regression: true,
      preconditions: "Logged out",
      actionSteps: "1) Go to provider.govectora.com/login 2) Enter valid email/password 3) Submit 4) Enter 6-digit OTP 5) Submit",
      expected: "Dashboard loads with 4 status cards and charts",
    });
  });

  test("VCTR-SP-002 — Invalid password rejected", { tag: '@regression' }, async ({ runCase }) => {
    await runCase({
      portal: PORTAL,
      suite: SUITE,
      tms: TMS,
      id: "VCTR-SP-002",
      title: "Invalid password rejected",
      sequence: 2,
      total: TOTAL,
      priority: "P1",
      regression: true,
      preconditions: "Logged out",
      actionSteps: "1) Enter valid email + wrong password 2) Submit",
      expected: "Inline error; no OTP step reached",
    });
  });

  test("VCTR-SP-003 — Invalid OTP rejected", async ({ runCase }) => {
    await runCase({
      portal: PORTAL,
      suite: SUITE,
      tms: TMS,
      id: "VCTR-SP-003",
      title: "Invalid OTP rejected",
      sequence: 3,
      total: TOTAL,
      priority: "P2",
      regression: false,
      preconditions: "At OTP screen",
      actionSteps: "1) Enter wrong 6-digit code 2) Submit",
      expected: "Error shown; access denied; \"Didn't receive it?\" resend control present",
    });
  });

  test("VCTR-SP-004 — Session sign-out", { tag: '@regression' }, async ({ runCase }) => {
    await runCase({
      portal: PORTAL,
      suite: SUITE,
      tms: TMS,
      id: "VCTR-SP-004",
      title: "Session sign-out",
      sequence: 4,
      total: TOTAL,
      priority: "P1",
      regression: true,
      preconditions: "Logged in",
      actionSteps: "1) Open profile menu 2) Sign out",
      expected: "Returns to login; protected routes unreachable",
    });
  });

  test("VCTR-SP-005 — Provider credentials blocked from Admin panel", { tag: '@regression' }, async ({ runCase }) => {
    await runCase({
      portal: PORTAL,
      suite: SUITE,
      tms: TMS,
      id: "VCTR-SP-005",
      title: "Provider credentials blocked from Admin panel",
      sequence: 5,
      total: TOTAL,
      priority: "P1",
      regression: true,
      preconditions: "Logged in as sp-test",
      actionSteps: "1) Attempt admin.govectora.com with same credentials",
      expected: "Access denied — separate auth realm/tenant claim",
    });
  });

  test("VCTR-SP-006 — Collapsible sidebar", async ({ runCase }) => {
    await runCase({
      portal: PORTAL,
      suite: SUITE,
      tms: TMS,
      id: "VCTR-SP-006",
      title: "Collapsible sidebar",
      sequence: 6,
      total: TOTAL,
      priority: "P3",
      regression: false,
      preconditions: "Any page",
      actionSteps: "1) Toggle \"Open/Close sidebar\"",
      expected: "Sidebar collapses/expands; nav links accessible in both states",
    });
  });
});
