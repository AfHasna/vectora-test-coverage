import { test } from '../../fixtures/regression-test';

const PORTAL = "Client Portal";
const SUITE = "CP-TS-01 — Authentication";
const TMS = "https://govectora.atlassian.net/wiki/x/1ADD";
const TOTAL = 6;

test.describe.configure({ mode: 'serial' });
test.use({ storageState: { cookies: [], origins: [] } });

test.describe(SUITE, () => {

  test("VCTR-CP-001 — Valid login + OTP succeeds", { tag: '@regression' }, async ({ runCase }) => {
    await runCase({
      portal: PORTAL,
      suite: SUITE,
      tms: TMS,
      id: "VCTR-CP-001",
      title: "Valid login + OTP succeeds",
      sequence: 1,
      total: TOTAL,
      priority: "P1",
      regression: true,
      preconditions: "Logged out",
      actionSteps: "1) Go to portal.govectora.com 2) Enter valid email/password 3) Submit 4) Enter 6-digit OTP 5) Submit",
      expected: "Dashboard loads; sidebar shows the full nav list",
    });
  });

  test("VCTR-CP-002 — Invalid password rejected", { tag: '@regression' }, async ({ runCase }) => {
    await runCase({
      portal: PORTAL,
      suite: SUITE,
      tms: TMS,
      id: "VCTR-CP-002",
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

  test("VCTR-CP-003 — Invalid OTP rejected", async ({ runCase }) => {
    await runCase({
      portal: PORTAL,
      suite: SUITE,
      tms: TMS,
      id: "VCTR-CP-003",
      title: "Invalid OTP rejected",
      sequence: 3,
      total: TOTAL,
      priority: "P2",
      regression: false,
      preconditions: "At OTP screen",
      actionSteps: "1) Enter wrong 6-digit code 2) Submit",
      expected: "Error shown; access denied",
    });
  });

  test("VCTR-CP-004 — Session sign-out", { tag: '@regression' }, async ({ runCase }) => {
    await runCase({
      portal: PORTAL,
      suite: SUITE,
      tms: TMS,
      id: "VCTR-CP-004",
      title: "Session sign-out",
      sequence: 4,
      total: TOTAL,
      priority: "P1",
      regression: true,
      preconditions: "Logged in",
      actionSteps: "1) Open user menu 2) Sign out",
      expected: "Returns to login screen; protected routes unreachable",
    });
  });

  test("VCTR-CP-005 — Portal user blocked from Admin panel", { tag: '@regression' }, async ({ runCase }) => {
    await runCase({
      portal: PORTAL,
      suite: SUITE,
      tms: TMS,
      id: "VCTR-CP-005",
      title: "Portal user blocked from Admin panel",
      sequence: 5,
      total: TOTAL,
      priority: "P1",
      regression: true,
      preconditions: "Logged in as client-test",
      actionSteps: "1) Attempt to open admin.govectora.com in the same session/browser profile",
      expected: "Portal credentials do not grant Admin access (separate auth realm)",
    });
  });

  test("VCTR-CP-006 — First-run onboarding tour", async ({ runCase }) => {
    await runCase({
      portal: PORTAL,
      suite: SUITE,
      tms: TMS,
      id: "VCTR-CP-006",
      title: "First-run onboarding tour",
      sequence: 6,
      total: TOTAL,
      priority: "P3",
      regression: false,
      preconditions: "Fresh login",
      actionSteps: "1) Observe \"Skip\"/\"Next\" tour prompt",
      expected: "Tour dismissible via Skip; does not block navigation",
    });
  });
});
