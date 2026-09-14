import { test } from '../../fixtures/regression-test';

const PORTAL = "Service Provider Portal";
const SUITE = "SP-TS-03 — Drivers";
const TMS = "https://govectora.atlassian.net/wiki/x/6QDD";
const TOTAL = 5;

test.describe.configure({ mode: 'serial' });

test.describe(SUITE, () => {

  test("VCTR-SP-012 — Drivers list scoped to this provider", { tag: '@regression' }, async ({ runCase }) => {
    await runCase({
      portal: PORTAL,
      suite: SUITE,
      tms: TMS,
      id: "VCTR-SP-012",
      title: "Drivers list scoped to this provider",
      sequence: 1,
      total: TOTAL,
      priority: "P1",
      regression: true,
      preconditions: "`/workforce/drivers`",
      actionSteps: "1) Open list",
      expected: "Only drivers linked to this provider shown; 8 columns: Name, Status, Phone, License #, License Expiry, Compliance Status, Documents, Assigned Trips",
    });
  });

  test("VCTR-SP-013 — Add Driver form (observe only, do not submit)", { tag: '@regression' }, async ({ runCase }) => {
    await runCase({
      portal: PORTAL,
      suite: SUITE,
      tms: TMS,
      id: "VCTR-SP-013",
      title: "Add Driver form (observe only, do not submit)",
      sequence: 2,
      total: TOTAL,
      priority: "P1",
      regression: true,
      preconditions: "Drivers list → Add Driver",
      actionSteps: "1) Open Add Driver 2) Inspect required fields",
      expected: "Form opens; do not save",
    });
  });

  test("VCTR-SP-014 — \"My Requests\" sub-tab", async ({ runCase }) => {
    await runCase({
      portal: PORTAL,
      suite: SUITE,
      tms: TMS,
      id: "VCTR-SP-014",
      title: "\"My Requests\" sub-tab",
      sequence: 3,
      total: TOTAL,
      priority: "P2",
      regression: false,
      preconditions: "Workforce → My Requests",
      actionSteps: "1) Open sub-tab",
      expected: "Shows this provider's submitted request history (Driver Change Request type per Admin Request SLA config)",
    });
  });

  test("VCTR-SP-015 — Export controls", async ({ runCase }) => {
    await runCase({
      portal: PORTAL,
      suite: SUITE,
      tms: TMS,
      id: "VCTR-SP-015",
      title: "Export controls",
      sequence: 4,
      total: TOTAL,
      priority: "P3",
      regression: false,
      preconditions: "Drivers list",
      actionSteps: "1) Trigger Excel/PDF",
      expected: "Completes without error",
    });
  });

  test("VCTR-SP-016 — Column visibility (8/8 indicator)", async ({ runCase }) => {
    await runCase({
      portal: PORTAL,
      suite: SUITE,
      tms: TMS,
      id: "VCTR-SP-016",
      title: "Column visibility (8/8 indicator)",
      sequence: 5,
      total: TOTAL,
      priority: "P3",
      regression: false,
      preconditions: "Drivers list",
      actionSteps: "1) Open Columns control",
      expected: "Toggle available per column; count indicator updates (e.g. 7/8)",
    });
  });
});
