import { test } from '../../../../tests/fixtures/regression-test';

const PORTAL = "Service Provider Portal";
const SUITE = "SP-TS-08 — Reports";
const TMS = "https://govectora.atlassian.net/wiki/x/6QDD";
const TOTAL = 2;

test.describe.configure({ mode: 'serial' });

test.describe(SUITE, () => {

  test("VCTR-SP-033 — All 8 report sub-tabs render", { tag: '@regression' }, async ({ runCase }) => {
    await runCase({
      portal: PORTAL,
      suite: SUITE,
      tms: TMS,
      id: "VCTR-SP-033",
      title: "All 8 report sub-tabs render",
      sequence: 1,
      total: TOTAL,
      priority: "P1",
      regression: true,
      preconditions: "`/reports`",
      actionSteps: "1) Open Performance, Trips, Earnings, Drivers, Monitors, Vehicles, Compliance, Incidents in turn",
      expected: "Each renders without error, scoped to this provider",
    });
  });

  test("VCTR-SP-034 — Period selector", async ({ runCase }) => {
    await runCase({
      portal: PORTAL,
      suite: SUITE,
      tms: TMS,
      id: "VCTR-SP-034",
      title: "Period selector",
      sequence: 2,
      total: TOTAL,
      priority: "P2",
      regression: false,
      preconditions: "Reports page",
      actionSteps: "1) Change Period (e.g. This week → custom range) 2) Reset",
      expected: "Data reflows to selected period; Reset restores default",
    });
  });
});
