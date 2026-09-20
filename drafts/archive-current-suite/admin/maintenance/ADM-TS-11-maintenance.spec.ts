import { test } from '../../../../tests/fixtures/regression-test';

const PORTAL = "Admin Portal";
const SUITE = "ADM-TS-11 — Maintenance";
const TMS = "https://govectora.atlassian.net/wiki/x/cwDE";
const TOTAL = 3;

test.describe.configure({ mode: 'serial' });

test.describe(SUITE, () => {

  test("VCTR-ADM-053 — Priority levels present", async ({ runCase }) => {
    await runCase({
      portal: PORTAL,
      suite: SUITE,
      tms: TMS,
      id: "VCTR-ADM-053",
      title: "Priority levels present",
      sequence: 1,
      total: TOTAL,
      priority: "P2",
      regression: false,
      preconditions: "Add/Edit Maintenance record (observe only)",
      actionSteps: "1) Open priority dropdown",
      expected: "Low, Medium, High, Urgent options present",
    });
  });

  test("VCTR-ADM-054 — Status lifecycle", { tag: '@regression' }, async ({ runCase }) => {
    await runCase({
      portal: PORTAL,
      suite: SUITE,
      tms: TMS,
      id: "VCTR-ADM-054",
      title: "Status lifecycle",
      sequence: 2,
      total: TOTAL,
      priority: "P1",
      regression: true,
      preconditions: "Existing maintenance record",
      actionSteps: "1) Open status control",
      expected: "Scheduled → In Progress → Completed / Cancelled",
    });
  });

  test("VCTR-ADM-055 — Overdue maintenance flags Vehicle Compliance", { tag: '@regression' }, async ({ runCase }) => {
    await runCase({
      portal: PORTAL,
      suite: SUITE,
      tms: TMS,
      id: "VCTR-ADM-055",
      title: "Overdue maintenance flags Vehicle Compliance",
      sequence: 3,
      total: TOTAL,
      priority: "P1",
      regression: true,
      preconditions: "Maintenance record past scheduled date, still Scheduled",
      actionSteps: "1) Check Vehicle Compliance / Dashboard non-compliant count",
      expected: "Overdue record counts toward Vehicle non-compliant total",
    });
  });
});
