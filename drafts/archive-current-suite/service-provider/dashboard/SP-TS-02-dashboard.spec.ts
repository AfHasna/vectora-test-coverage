import { test } from '../../../../tests/fixtures/regression-test';

const PORTAL = "Service Provider Portal";
const SUITE = "SP-TS-02 — Dashboard";
const TMS = "https://govectora.atlassian.net/wiki/x/6QDD";
const TOTAL = 5;

test.describe.configure({ mode: 'serial' });

test.describe(SUITE, () => {

  test("VCTR-SP-007 — Status cards render", { tag: '@regression' }, async ({ runCase }) => {
    await runCase({
      portal: PORTAL,
      suite: SUITE,
      tms: TMS,
      id: "VCTR-SP-007",
      title: "Status cards render",
      sequence: 1,
      total: TOTAL,
      priority: "P1",
      regression: true,
      preconditions: "Dashboard",
      actionSteps: "1) Observe Total Active Drivers, Compliant Personnel, Compliance Expiring Soon, Non-Compliant Personnel",
      expected: "All 4 cards render with correct labels/period (Today / Next 30 days)",
    });
  });

  test("VCTR-SP-008 — Trips Overview chart (last 7 days)", async ({ runCase }) => {
    await runCase({
      portal: PORTAL,
      suite: SUITE,
      tms: TMS,
      id: "VCTR-SP-008",
      title: "Trips Overview chart (last 7 days)",
      sequence: 2,
      total: TOTAL,
      priority: "P2",
      regression: false,
      preconditions: "Dashboard",
      actionSteps: "1) Observe chart",
      expected: "Mon–Sun bars with Completed/In Progress/No Show/Cancelled legend render without error",
    });
  });

  test("VCTR-SP-009 — Today's Trip Statistics empty/populated state", async ({ runCase }) => {
    await runCase({
      portal: PORTAL,
      suite: SUITE,
      tms: TMS,
      id: "VCTR-SP-009",
      title: "Today's Trip Statistics empty/populated state",
      sequence: 3,
      total: TOTAL,
      priority: "P2",
      regression: false,
      preconditions: "Dashboard",
      actionSteps: "1) Observe panel",
      expected: "Shows \"No trips today\" or live breakdown; \"Updated just now\" / \"Every minute\" refresh label present",
    });
  });

  test("VCTR-SP-010 — Payout Disputes panel", async ({ runCase }) => {
    await runCase({
      portal: PORTAL,
      suite: SUITE,
      tms: TMS,
      id: "VCTR-SP-010",
      title: "Payout Disputes panel",
      sequence: 4,
      total: TOTAL,
      priority: "P2",
      regression: false,
      preconditions: "Dashboard",
      actionSteps: "1) Observe panel",
      expected: "Shows \"No disputes yet\" or disputes grouped by status",
    });
  });

  test("VCTR-SP-011 — Payout Overview chart (last 30 days)", async ({ runCase }) => {
    await runCase({
      portal: PORTAL,
      suite: SUITE,
      tms: TMS,
      id: "VCTR-SP-011",
      title: "Payout Overview chart (last 30 days)",
      sequence: 5,
      total: TOTAL,
      priority: "P3",
      regression: false,
      preconditions: "Dashboard",
      actionSteps: "1) Observe chart",
      expected: "Date axis (Aug 15 – Sep 9 style rolling window) and $ axis render without error",
    });
  });
});
