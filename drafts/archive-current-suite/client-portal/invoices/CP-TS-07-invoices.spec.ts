import { test } from '../../../../tests/fixtures/regression-test';

const PORTAL = "Client Portal";
const SUITE = "CP-TS-07 — Invoices";
const TMS = "https://govectora.atlassian.net/wiki/x/1ADD";
const TOTAL = 3;

test.describe.configure({ mode: 'serial' });

test.describe(SUITE, () => {

  test("VCTR-CP-029 — Invoices list scoped, empty state", { tag: '@regression' }, async ({ runCase }) => {
    await runCase({
      portal: PORTAL,
      suite: SUITE,
      tms: TMS,
      id: "VCTR-CP-029",
      title: "Invoices list scoped, empty state",
      sequence: 1,
      total: TOTAL,
      priority: "P1",
      regression: true,
      preconditions: "`/invoices`",
      actionSteps: "1) Open list",
      expected: "Only this client's invoices shown (0 in test tenant → \"No invoices found for your organization\")",
    });
  });

  // Confluence constraint: No — data-dependent, currently empty in test tenant
  test("VCTR-CP-030 — Invoice status values (data-dependent)", async ({ runCase }) => {
    await runCase({
      portal: PORTAL,
      suite: SUITE,
      tms: TMS,
      id: "VCTR-CP-030",
      title: "Invoice status values (data-dependent)",
      sequence: 2,
      total: TOTAL,
      priority: "P2",
      regression: false,
      preconditions: "An invoice exists",
      actionSteps: "1) Open an invoice",
      expected: "Status is one of Draft/Sent/Paid/Overdue",
      fixmeReason: "Confluence constraint: No — data-dependent, currently empty in test tenant",
    });
  });

  test("VCTR-CP-031 — No payment-initiation controls present", { tag: '@regression' }, async ({ runCase }) => {
    await runCase({
      portal: PORTAL,
      suite: SUITE,
      tms: TMS,
      id: "VCTR-CP-031",
      title: "No payment-initiation controls present",
      sequence: 3,
      total: TOTAL,
      priority: "P1",
      regression: true,
      preconditions: "Invoices page",
      actionSteps: "1) Inspect available actions",
      expected: "Portal is view/download only — no \"Pay Now\" or payment-method entry point",
    });
  });
});
