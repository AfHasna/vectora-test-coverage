import { test } from '../../../../tests/fixtures/regression-test';

const PORTAL = "Client Portal";
const SUITE = "CP-TS-06 — Compliance";
const TMS = "https://govectora.atlassian.net/wiki/x/1ADD";
const TOTAL = 4;

test.describe.configure({ mode: 'serial' });

test.describe(SUITE, () => {

  test("VCTR-CP-025 — Driver Compliance tab scoped", { tag: '@regression' }, async ({ runCase }) => {
    await runCase({
      portal: PORTAL,
      suite: SUITE,
      tms: TMS,
      id: "VCTR-CP-025",
      title: "Driver Compliance tab scoped",
      sequence: 1,
      total: TOTAL,
      priority: "P1",
      regression: true,
      preconditions: "`/compliance/driver-compliance`",
      actionSteps: "1) Open tab",
      expected: "Only drivers assigned to this client's routes shown; Expiring/Expired summary tiles at top",
    });
  });

  test("VCTR-CP-026 — Compliance thresholds match Admin config", { tag: '@regression' }, async ({ runCase }) => {
    await runCase({
      portal: PORTAL,
      suite: SUITE,
      tms: TMS,
      id: "VCTR-CP-026",
      title: "Compliance thresholds match Admin config",
      sequence: 2,
      total: TOTAL,
      priority: "P1",
      regression: true,
      preconditions: "Driver Compliance list",
      actionSteps: "1) Compare \"Expiring within 30 days\" tile logic to Admin Settings Compliance Thresholds",
      expected: "Same 30-day/7-day windows apply",
    });
  });

  test("VCTR-CP-027 — Monitor Compliance sub-tab", async ({ runCase }) => {
    await runCase({
      portal: PORTAL,
      suite: SUITE,
      tms: TMS,
      id: "VCTR-CP-027",
      title: "Monitor Compliance sub-tab",
      sequence: 3,
      total: TOTAL,
      priority: "P2",
      regression: false,
      preconditions: "Compliance → Monitor Compliance",
      actionSteps: "1) Open sub-tab",
      expected: "Renders monitor compliance rows scoped to this client",
    });
  });

  test("VCTR-CP-028 — Export controls", async ({ runCase }) => {
    await runCase({
      portal: PORTAL,
      suite: SUITE,
      tms: TMS,
      id: "VCTR-CP-028",
      title: "Export controls",
      sequence: 4,
      total: TOTAL,
      priority: "P3",
      regression: false,
      preconditions: "Compliance list",
      actionSteps: "1) Trigger Excel/PDF/Print",
      expected: "Completes without error",
    });
  });
});
