import { test } from '../../../../tests/fixtures/regression-test';

const PORTAL = "Client Portal";
const SUITE = "CP-TS-08 — Budget & Economics";
const TMS = "https://govectora.atlassian.net/wiki/x/1ADD";
const TOTAL = 2;

test.describe.configure({ mode: 'serial' });

test.describe(SUITE, () => {

  test("VCTR-CP-032 — Empty state without a contract", async ({ runCase }) => {
    await runCase({
      portal: PORTAL,
      suite: SUITE,
      tms: TMS,
      id: "VCTR-CP-032",
      title: "Empty state without a contract",
      sequence: 1,
      total: TOTAL,
      priority: "P2",
      regression: false,
      preconditions: "`/budget-economics`, no contract on file",
      actionSteps: "1) Open page",
      expected: "Shows \"No contracts on file yet. Budget tracking will appear once a contract is set up.\"",
    });
  });

  // Confluence constraint: No — data-dependent, no contracted client currently available in test tenant
  test("VCTR-CP-033 — Populated view (data-dependent)", async ({ runCase }) => {
    await runCase({
      portal: PORTAL,
      suite: SUITE,
      tms: TMS,
      id: "VCTR-CP-033",
      title: "Populated view (data-dependent)",
      sequence: 2,
      total: TOTAL,
      priority: "P3",
      regression: false,
      preconditions: "A client with a contract on file",
      actionSteps: "1) Open page",
      expected: "Budget tracking widgets render using Admin-configured Economics Cost Defaults",
      fixmeReason: "Confluence constraint: No — data-dependent, no contracted client currently available in test tenant",
    });
  });
});
