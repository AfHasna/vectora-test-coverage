import { test } from '../../../../tests/fixtures/regression-test';

const PORTAL = "Service Provider Portal";
const SUITE = "SP-TS-07 — Accounting";
const TMS = "https://govectora.atlassian.net/wiki/x/6QDD";
const TOTAL = 6;

test.describe.configure({ mode: 'serial' });

test.describe(SUITE, () => {

  test("VCTR-SP-027 — Payouts list scoped, empty state", { tag: '@regression' }, async ({ runCase }) => {
    await runCase({
      portal: PORTAL,
      suite: SUITE,
      tms: TMS,
      id: "VCTR-SP-027",
      title: "Payouts list scoped, empty state",
      sequence: 1,
      total: TOTAL,
      priority: "P1",
      regression: true,
      preconditions: "`/accounting/payouts`",
      actionSteps: "1) Open list",
      expected: "5 columns: Payout Date, Period, Amount, Status, Reference #, Download; empty rows acceptable in test tenant",
    });
  });

  test("VCTR-SP-028 — No money-movement controls present", { tag: '@regression' }, async ({ runCase }) => {
    await runCase({
      portal: PORTAL,
      suite: SUITE,
      tms: TMS,
      id: "VCTR-SP-028",
      title: "No money-movement controls present",
      sequence: 2,
      total: TOTAL,
      priority: "P1",
      regression: true,
      preconditions: "Payouts page",
      actionSteps: "1) Inspect \"Payout methods\" section copy",
      expected: "Explicitly states \"Saved for your records only — Vectora does not move money through these details\"",
    });
  });

  test("VCTR-SP-029 — Add payout method (observe only, do not submit)", async ({ runCase }) => {
    await runCase({
      portal: PORTAL,
      suite: SUITE,
      tms: TMS,
      id: "VCTR-SP-029",
      title: "Add payout method (observe only, do not submit)",
      sequence: 3,
      total: TOTAL,
      priority: "P2",
      regression: false,
      preconditions: "Payouts → Add method",
      actionSteps: "1) Open Add method 2) Inspect fields",
      expected: "Form opens; do not save",
    });
  });

  test("VCTR-SP-030 — Driver Payouts sub-tab", async ({ runCase }) => {
    await runCase({
      portal: PORTAL,
      suite: SUITE,
      tms: TMS,
      id: "VCTR-SP-030",
      title: "Driver Payouts sub-tab",
      sequence: 4,
      total: TOTAL,
      priority: "P2",
      regression: false,
      preconditions: "Accounting → Driver Payouts",
      actionSteps: "1) Open sub-tab",
      expected: "Per-driver payout breakdown renders, scoped to this provider",
    });
  });

  test("VCTR-SP-031 — Statements sub-tab", async ({ runCase }) => {
    await runCase({
      portal: PORTAL,
      suite: SUITE,
      tms: TMS,
      id: "VCTR-SP-031",
      title: "Statements sub-tab",
      sequence: 5,
      total: TOTAL,
      priority: "P3",
      regression: false,
      preconditions: "Accounting → Statements",
      actionSteps: "1) Open sub-tab",
      expected: "Renders without error",
    });
  });

  test("VCTR-SP-032 — Disputes sub-tab", async ({ runCase }) => {
    await runCase({
      portal: PORTAL,
      suite: SUITE,
      tms: TMS,
      id: "VCTR-SP-032",
      title: "Disputes sub-tab",
      sequence: 6,
      total: TOTAL,
      priority: "P2",
      regression: false,
      preconditions: "Accounting → Disputes",
      actionSteps: "1) Open sub-tab",
      expected: "Renders without error; matches Dashboard \"Payout Disputes\" panel data",
    });
  });
});
