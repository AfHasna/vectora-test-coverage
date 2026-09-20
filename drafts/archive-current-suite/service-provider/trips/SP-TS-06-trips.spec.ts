import { test } from '../../../../tests/fixtures/regression-test';

const PORTAL = "Service Provider Portal";
const SUITE = "SP-TS-06 — Trips";
const TMS = "https://govectora.atlassian.net/wiki/x/6QDD";
const TOTAL = 4;

test.describe.configure({ mode: 'serial' });

test.describe(SUITE, () => {

  test("VCTR-SP-023 — Active Trips scoped to this provider's drivers", { tag: '@regression' }, async ({ runCase }) => {
    await runCase({
      portal: PORTAL,
      suite: SUITE,
      tms: TMS,
      id: "VCTR-SP-023",
      title: "Active Trips scoped to this provider's drivers",
      sequence: 1,
      total: TOTAL,
      priority: "P1",
      regression: true,
      preconditions: "`/trips/active-trips`",
      actionSteps: "1) Open tab",
      expected: "8 columns: Trip ID, Passenger, Driver, Monitor, Route, Start Time, Duration, Status; only this provider's trips shown",
    });
  });

  test("VCTR-SP-024 — Future Trips read-only", { tag: '@regression' }, async ({ runCase }) => {
    await runCase({
      portal: PORTAL,
      suite: SUITE,
      tms: TMS,
      id: "VCTR-SP-024",
      title: "Future Trips read-only",
      sequence: 2,
      total: TOTAL,
      priority: "P1",
      regression: true,
      preconditions: "Trips → Future Trips",
      actionSteps: "1) Open tab 2) Inspect row actions",
      expected: "No dispatch/status-change action available (today-only dispatch rule)",
    });
  });

  test("VCTR-SP-025 — Trips History", async ({ runCase }) => {
    await runCase({
      portal: PORTAL,
      suite: SUITE,
      tms: TMS,
      id: "VCTR-SP-025",
      title: "Trips History",
      sequence: 3,
      total: TOTAL,
      priority: "P2",
      regression: false,
      preconditions: "Trips → Trips History",
      actionSteps: "1) Open tab",
      expected: "Past trips listed, read-only",
    });
  });

  test("VCTR-SP-026 — Export controls", async ({ runCase }) => {
    await runCase({
      portal: PORTAL,
      suite: SUITE,
      tms: TMS,
      id: "VCTR-SP-026",
      title: "Export controls",
      sequence: 4,
      total: TOTAL,
      priority: "P3",
      regression: false,
      preconditions: "Any trips tab",
      actionSteps: "1) Trigger Excel/PDF",
      expected: "Completes without error",
    });
  });
});
