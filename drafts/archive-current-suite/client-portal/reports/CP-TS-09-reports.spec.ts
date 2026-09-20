import { test } from '../../../../tests/fixtures/regression-test';

const PORTAL = "Client Portal";
const SUITE = "CP-TS-09 — Reports";
const TMS = "https://govectora.atlassian.net/wiki/x/1ADD";
const TOTAL = 2;

test.describe.configure({ mode: 'serial' });

test.describe(SUITE, () => {

  test("VCTR-CP-034 — Spend Report sub-tabs render", async ({ runCase }) => {
    await runCase({
      portal: PORTAL,
      suite: SUITE,
      tms: TMS,
      id: "VCTR-CP-034",
      title: "Spend Report sub-tabs render",
      sequence: 1,
      total: TOTAL,
      priority: "P2",
      regression: false,
      preconditions: "`/reports/spend`",
      actionSteps: "1) Open Spend, Trips, Passengers, Incidents, Compliance sub-tabs in turn",
      expected: "Each renders without error, scoped to this client",
    });
  });

  test("VCTR-CP-035 — Report Filters control", async ({ runCase }) => {
    await runCase({
      portal: PORTAL,
      suite: SUITE,
      tms: TMS,
      id: "VCTR-CP-035",
      title: "Report Filters control",
      sequence: 2,
      total: TOTAL,
      priority: "P3",
      regression: false,
      preconditions: "Any report sub-tab",
      actionSteps: "1) Open Filters",
      expected: "Filter panel opens; applying/resetting works",
    });
  });
});
