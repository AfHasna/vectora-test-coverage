import { test } from '../../fixtures/regression-test';

const PORTAL = "Admin Portal";
const SUITE = "ADM-TS-23 — Requests";
const TMS = "https://govectora.atlassian.net/wiki/x/cwDE";
const TOTAL = 2;

test.describe.configure({ mode: 'serial' });

test.describe(SUITE, () => {

  test("VCTR-ADM-109 — Requests page loads", async ({ runCase }) => {
    await runCase({
      portal: PORTAL,
      suite: SUITE,
      tms: TMS,
      id: "VCTR-ADM-109",
      title: "Requests page loads",
      sequence: 1,
      total: TOTAL,
      priority: "P2",
      regression: false,
      preconditions: "`/requests`",
      actionSteps: "1) Open page",
      expected: "List of external requests (Trip Cancellation, On-Demand, Account Deletion, Passenger Request, Driver Change, Monitor Change)",
    });
  });

  test("VCTR-ADM-110 — Overdue flagging by per-type SLA", { tag: '@regression' }, async ({ runCase }) => {
    await runCase({
      portal: PORTAL,
      suite: SUITE,
      tms: TMS,
      id: "VCTR-ADM-110",
      title: "Overdue flagging by per-type SLA",
      sequence: 2,
      total: TOTAL,
      priority: "P1",
      regression: true,
      preconditions: "A pending request older than its type's SLA days",
      actionSteps: "1) Locate the request",
      expected: "Flagged \"Overdue\" per Settings → Request SLA type default",
    });
  });
});
