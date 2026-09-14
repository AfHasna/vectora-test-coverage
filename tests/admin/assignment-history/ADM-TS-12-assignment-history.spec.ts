import { test } from '../../fixtures/regression-test';

const PORTAL = "Admin Portal";
const SUITE = "ADM-TS-12 — Assignment History";
const TMS = "https://govectora.atlassian.net/wiki/x/cwDE";
const TOTAL = 3;

test.describe.configure({ mode: 'serial' });

test.describe(SUITE, () => {

  test("VCTR-ADM-056 — Date range + Day/Week/Month grouping", async ({ runCase }) => {
    await runCase({
      portal: PORTAL,
      suite: SUITE,
      tms: TMS,
      id: "VCTR-ADM-056",
      title: "Date range + Day/Week/Month grouping",
      sequence: 1,
      total: TOTAL,
      priority: "P2",
      regression: false,
      preconditions: "`/vehicles/assignment-history`",
      actionSteps: "1) Apply a date range 2) Switch grouping",
      expected: "Results filter/group correctly",
    });
  });

  test("VCTR-ADM-057 — Driver/Vehicle dropdown filters", async ({ runCase }) => {
    await runCase({
      portal: PORTAL,
      suite: SUITE,
      tms: TMS,
      id: "VCTR-ADM-057",
      title: "Driver/Vehicle dropdown filters",
      sequence: 2,
      total: TOTAL,
      priority: "P2",
      regression: false,
      preconditions: "Assignment History",
      actionSteps: "1) Filter by a specific driver, then a specific vehicle",
      expected: "Table narrows to matching records only",
    });
  });

  test("VCTR-ADM-058 — Export", async ({ runCase }) => {
    await runCase({
      portal: PORTAL,
      suite: SUITE,
      tms: TMS,
      id: "VCTR-ADM-058",
      title: "Export",
      sequence: 3,
      total: TOTAL,
      priority: "P3",
      regression: false,
      preconditions: "Assignment History",
      actionSteps: "1) Trigger Excel/PDF export",
      expected: "Export completes without error",
    });
  });
});
