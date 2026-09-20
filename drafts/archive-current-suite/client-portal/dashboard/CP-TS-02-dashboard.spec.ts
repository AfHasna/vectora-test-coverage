import { test } from '../../../../tests/fixtures/regression-test';

const PORTAL = "Client Portal";
const SUITE = "CP-TS-02 — Dashboard";
const TMS = "https://govectora.atlassian.net/wiki/x/1ADD";
const TOTAL = 5;

test.describe.configure({ mode: 'serial' });

test.describe(SUITE, () => {

  test("VCTR-CP-007 — Today-at-a-glance cards render", { tag: '@regression' }, async ({ runCase }) => {
    await runCase({
      portal: PORTAL,
      suite: SUITE,
      tms: TMS,
      id: "VCTR-CP-007",
      title: "Today-at-a-glance cards render",
      sequence: 1,
      total: TOTAL,
      priority: "P1",
      regression: true,
      preconditions: "Dashboard",
      actionSteps: "1) Observe Active Passengers, Today's Trips, In Progress, Completed Today, Open Incidents cards",
      expected: "Counts render and match underlying data (e.g. Active Passengers = 2 in test tenant)",
    });
  });

  test("VCTR-CP-008 — Trip Status Mix chart (last 30 days)", async ({ runCase }) => {
    await runCase({
      portal: PORTAL,
      suite: SUITE,
      tms: TMS,
      id: "VCTR-CP-008",
      title: "Trip Status Mix chart (last 30 days)",
      sequence: 2,
      total: TOTAL,
      priority: "P2",
      regression: false,
      preconditions: "Dashboard",
      actionSteps: "1) Observe chart",
      expected: "Bars/legend for Scheduled/Dispatched/Accepted/In Progress/Completed/Cancelled/Not Completed render without error",
    });
  });

  test("VCTR-CP-009 — No-shows counter excluded from trip counts", async ({ runCase }) => {
    await runCase({
      portal: PORTAL,
      suite: SUITE,
      tms: TMS,
      id: "VCTR-CP-009",
      title: "No-shows counter excluded from trip counts",
      sequence: 3,
      total: TOTAL,
      priority: "P2",
      regression: false,
      preconditions: "Dashboard",
      actionSteps: "1) Compare \"No-shows (passengers)\" tile to Trip Status Mix totals",
      expected: "No-shows tracked separately, footnoted as \"not counted as trips\"",
    });
  });

  test("VCTR-CP-010 — Drivers Compliance summary tile", { tag: '@regression' }, async ({ runCase }) => {
    await runCase({
      portal: PORTAL,
      suite: SUITE,
      tms: TMS,
      id: "VCTR-CP-010",
      title: "Drivers Compliance summary tile",
      sequence: 4,
      total: TOTAL,
      priority: "P1",
      regression: true,
      preconditions: "Dashboard",
      actionSteps: "1) Observe Compliant/Expiring/Non-Compliant counts",
      expected: "Matches Driver Compliance page totals",
    });
  });

  test("VCTR-CP-011 — Today's Trip Feed empty/populated state", async ({ runCase }) => {
    await runCase({
      portal: PORTAL,
      suite: SUITE,
      tms: TMS,
      id: "VCTR-CP-011",
      title: "Today's Trip Feed empty/populated state",
      sequence: 5,
      total: TOTAL,
      priority: "P2",
      regression: false,
      preconditions: "Dashboard",
      actionSteps: "1) Observe feed",
      expected: "Shows \"No trips scheduled for today\" when empty, or a list when populated",
    });
  });
});
