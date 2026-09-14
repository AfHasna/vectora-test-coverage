import { test } from '../../fixtures/regression-test';

const PORTAL = "Client Portal";
const SUITE = "CP-TS-11 — Tenant Scoping";
const TMS = "https://govectora.atlassian.net/wiki/x/1ADD";
const TOTAL = 4;

test.describe.configure({ mode: 'serial' });

test.describe(SUITE, () => {

  test("VCTR-CP-039 — No cross-client data leakage", { tag: '@regression' }, async ({ runCase }) => {
    await runCase({
      portal: PORTAL,
      suite: SUITE,
      tms: TMS,
      id: "VCTR-CP-039",
      title: "No cross-client data leakage",
      sequence: 1,
      total: TOTAL,
      priority: "P1",
      regression: true,
      preconditions: "Any list module",
      actionSteps: "1) Inspect all rows across Passengers, Route Sheets, Incidents, Compliance, Invoices",
      expected: "Every row belongs to this portal user's own `client_id` — none from other clients",
    });
  });

  test("VCTR-CP-040 — Pagination defaults consistent with Admin", async ({ runCase }) => {
    await runCase({
      portal: PORTAL,
      suite: SUITE,
      tms: TMS,
      id: "VCTR-CP-040",
      title: "Pagination defaults consistent with Admin",
      sequence: 2,
      total: TOTAL,
      priority: "P3",
      regression: false,
      preconditions: "Any list with >10 rows (data-dependent)",
      actionSteps: "1) Observe default page size",
      expected: "10 per page, matching Admin convention",
    });
  });

  test("VCTR-CP-041 — Global Search scope (if present)", async ({ runCase }) => {
    await runCase({
      portal: PORTAL,
      suite: SUITE,
      tms: TMS,
      id: "VCTR-CP-041",
      title: "Global Search scope (if present)",
      sequence: 3,
      total: TOTAL,
      priority: "P2",
      regression: false,
      preconditions: "Header search icon",
      actionSteps: "1) Open search 2) Query a passenger name",
      expected: "Results limited to this client's own data",
    });
  });

  test("VCTR-CP-042 — Help link", async ({ runCase }) => {
    await runCase({
      portal: PORTAL,
      suite: SUITE,
      tms: TMS,
      id: "VCTR-CP-042",
      title: "Help link",
      sequence: 4,
      total: TOTAL,
      priority: "P3",
      regression: false,
      preconditions: "Sidebar",
      actionSteps: "1) Open Help",
      expected: "Contextual help content loads without error",
    });
  });
});
