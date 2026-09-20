import { test } from '../../../../tests/fixtures/regression-test';

const PORTAL = "Admin Portal";
const SUITE = "ADM-TS-15 — Trips";
const TMS = "https://govectora.atlassian.net/wiki/x/cwDE";
const TOTAL = 6;

test.describe.configure({ mode: 'serial' });

test.describe(SUITE, () => {

  test("VCTR-ADM-071 — Active Trips SLA overdue banner", { tag: '@regression' }, async ({ runCase }) => {
    await runCase({
      portal: PORTAL,
      suite: SUITE,
      tms: TMS,
      id: "VCTR-ADM-071",
      title: "Active Trips SLA overdue banner",
      sequence: 1,
      total: TOTAL,
      priority: "P1",
      regression: true,
      preconditions: "Active Trips with an overdue trip (if present)",
      actionSteps: "1) Observe summary banner",
      expected: "Banner shows \"X overdue trips · Y overdue passengers\"; click toggles overdue-only filter with clearable badge",
    });
  });

  test("VCTR-ADM-072 — Completed trips auto-sort to bottom", async ({ runCase }) => {
    await runCase({
      portal: PORTAL,
      suite: SUITE,
      tms: TMS,
      id: "VCTR-ADM-072",
      title: "Completed trips auto-sort to bottom",
      sequence: 2,
      total: TOTAL,
      priority: "P2",
      regression: false,
      preconditions: "Active Trips with mixed statuses",
      actionSteps: "1) Observe ordering",
      expected: "Completed trips appear after in-progress/pending ones",
    });
  });

  test("VCTR-ADM-073 — PassengerStatusList expand/collapse", async ({ runCase }) => {
    await runCase({
      portal: PORTAL,
      suite: SUITE,
      tms: TMS,
      id: "VCTR-ADM-073",
      title: "PassengerStatusList expand/collapse",
      sequence: 3,
      total: TOTAL,
      priority: "P2",
      regression: false,
      preconditions: "Active Trips row",
      actionSteps: "1) Expand a trip's passenger summary (e.g. \"2/4 Picked Up\")",
      expected: "Individual passenger statuses shown on expand",
    });
  });

  test("VCTR-ADM-074 — Trip & passenger status values match spec", { tag: '@regression' }, async ({ runCase }) => {
    await runCase({
      portal: PORTAL,
      suite: SUITE,
      tms: TMS,
      id: "VCTR-ADM-074",
      title: "Trip & passenger status values match spec",
      sequence: 4,
      total: TOTAL,
      priority: "P1",
      regression: true,
      preconditions: "Any trip",
      actionSteps: "1) Inspect all reachable status values",
      expected: "Trip: Scheduled/Dispatched/Accepted/In Progress/Completed/Cancelled. Passenger: Pending/Arrived/Picked Up/Dropped Off/Early Cancel/Late Cancel/No Show",
    });
  });

  test("VCTR-ADM-075 — Trips History read-only", async ({ runCase }) => {
    await runCase({
      portal: PORTAL,
      suite: SUITE,
      tms: TMS,
      id: "VCTR-ADM-075",
      title: "Trips History read-only",
      sequence: 5,
      total: TOTAL,
      priority: "P2",
      regression: false,
      preconditions: "`/service-operations/trips-history`",
      actionSteps: "1) Inspect available actions on a historical trip",
      expected: "No status-changing actions available beyond viewing/activity log",
    });
  });

  test("VCTR-ADM-076 — Inactive-passenger indicator icon", async ({ runCase }) => {
    await runCase({
      portal: PORTAL,
      suite: SUITE,
      tms: TMS,
      id: "VCTR-ADM-076",
      title: "Inactive-passenger indicator icon",
      sequence: 6,
      total: TOTAL,
      priority: "P3",
      regression: false,
      preconditions: "A route with ≥1 inactive passenger",
      actionSteps: "1) Locate red person-with-X icon next to route number",
      expected: "Icon present on Route Sheets/Assignment/Live Tracking/Future rows; click opens inactive-passenger popup only (no other action)",
    });
  });
});
