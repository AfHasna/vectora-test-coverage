import { test } from '../../../../tests/fixtures/regression-test';

const PORTAL = "Client Portal";
const SUITE = "CP-TS-03 — Passengers";
const TMS = "https://govectora.atlassian.net/wiki/x/1ADD";
const TOTAL = 5;

test.describe.configure({ mode: 'serial' });

test.describe(SUITE, () => {

  test("VCTR-CP-012 — Passengers list scoped to tenant", { tag: '@regression' }, async ({ runCase }) => {
    await runCase({
      portal: PORTAL,
      suite: SUITE,
      tms: TMS,
      id: "VCTR-CP-012",
      title: "Passengers list scoped to tenant",
      sequence: 1,
      total: TOTAL,
      priority: "P1",
      regression: true,
      preconditions: "`/passengers`",
      actionSteps: "1) Open list",
      expected: "Only this client's passengers appear (2 in test tenant); Name/Status columns present",
    });
  });

  test("VCTR-CP-013 — Add Passenger form (observe only, do not submit)", { tag: '@regression' }, async ({ runCase }) => {
    await runCase({
      portal: PORTAL,
      suite: SUITE,
      tms: TMS,
      id: "VCTR-CP-013",
      title: "Add Passenger form (observe only, do not submit)",
      sequence: 2,
      total: TOTAL,
      priority: "P1",
      regression: true,
      preconditions: "`/passengers` → Add Passenger",
      actionSteps: "1) Open Add Passenger 2) Inspect required fields",
      expected: "Form opens with the same field groupings as Admin's passenger form scoped to this client; do not save",
    });
  });

  test("VCTR-CP-014 — \"My Requests\" tab", async ({ runCase }) => {
    await runCase({
      portal: PORTAL,
      suite: SUITE,
      tms: TMS,
      id: "VCTR-CP-014",
      title: "\"My Requests\" tab",
      sequence: 3,
      total: TOTAL,
      priority: "P2",
      regression: false,
      preconditions: "Passengers page",
      actionSteps: "1) Open \"My Requests\" sub-tab",
      expected: "Shows client-submitted request history/status (Passenger Request type from Admin's Request SLA config)",
    });
  });

  test("VCTR-CP-015 — Export controls", async ({ runCase }) => {
    await runCase({
      portal: PORTAL,
      suite: SUITE,
      tms: TMS,
      id: "VCTR-CP-015",
      title: "Export controls",
      sequence: 4,
      total: TOTAL,
      priority: "P3",
      regression: false,
      preconditions: "Passengers list",
      actionSteps: "1) Trigger Excel/PDF/Print",
      expected: "Export completes without error",
    });
  });

  test("VCTR-CP-016 — Column visibility toggle", async ({ runCase }) => {
    await runCase({
      portal: PORTAL,
      suite: SUITE,
      tms: TMS,
      id: "VCTR-CP-016",
      title: "Column visibility toggle",
      sequence: 5,
      total: TOTAL,
      priority: "P3",
      regression: false,
      preconditions: "Passengers list",
      actionSteps: "1) Open Columns control 2) Toggle a column",
      expected: "Column show/hide persists during session",
    });
  });
});
