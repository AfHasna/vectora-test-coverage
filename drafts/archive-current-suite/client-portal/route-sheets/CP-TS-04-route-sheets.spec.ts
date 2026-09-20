import { test } from '../../../../tests/fixtures/regression-test';

const PORTAL = "Client Portal";
const SUITE = "CP-TS-04 — Route Sheets";
const TMS = "https://govectora.atlassian.net/wiki/x/1ADD";
const TOTAL = 6;

test.describe.configure({ mode: 'serial' });

test.describe(SUITE, () => {

  test("VCTR-CP-017 — Route Sheets list scoped & paired RSO/RSR", { tag: '@regression' }, async ({ runCase }) => {
    await runCase({
      portal: PORTAL,
      suite: SUITE,
      tms: TMS,
      id: "VCTR-CP-017",
      title: "Route Sheets list scoped & paired RSO/RSR",
      sequence: 1,
      total: TOTAL,
      priority: "P1",
      regression: true,
      preconditions: "`/trips/route-sheets`",
      actionSteps: "1) Open list",
      expected: "Shows only this client's route sheets; Outbound/Return pairs share numeric suffix (e.g. RSO-0003/RSR-0003)",
    });
  });

  test("VCTR-CP-018 — Active Trips tab", { tag: '@regression' }, async ({ runCase }) => {
    await runCase({
      portal: PORTAL,
      suite: SUITE,
      tms: TMS,
      id: "VCTR-CP-018",
      title: "Active Trips tab",
      sequence: 2,
      total: TOTAL,
      priority: "P1",
      regression: true,
      preconditions: "Route Sheets → Active Trips",
      actionSteps: "1) Open tab",
      expected: "Shows today's trips for this client only, if any",
    });
  });

  test("VCTR-CP-019 — Future Trips are read-only", { tag: '@regression' }, async ({ runCase }) => {
    await runCase({
      portal: PORTAL,
      suite: SUITE,
      tms: TMS,
      id: "VCTR-CP-019",
      title: "Future Trips are read-only",
      sequence: 3,
      total: TOTAL,
      priority: "P1",
      regression: true,
      preconditions: "Route Sheets → Future Trips",
      actionSteps: "1) Open tab 2) Inspect available row actions",
      expected: "No dispatch/status-change action available — consistent with today-only dispatch rule",
    });
  });

  test("VCTR-CP-020 — Trips History read-only", async ({ runCase }) => {
    await runCase({
      portal: PORTAL,
      suite: SUITE,
      tms: TMS,
      id: "VCTR-CP-020",
      title: "Trips History read-only",
      sequence: 4,
      total: TOTAL,
      priority: "P2",
      regression: false,
      preconditions: "Route Sheets → Trips History",
      actionSteps: "1) Open tab",
      expected: "Past trips listed; no mutating actions available",
    });
  });

  test("VCTR-CP-021 — On Demand Trips tab", async ({ runCase }) => {
    await runCase({
      portal: PORTAL,
      suite: SUITE,
      tms: TMS,
      id: "VCTR-CP-021",
      title: "On Demand Trips tab",
      sequence: 5,
      total: TOTAL,
      priority: "P2",
      regression: false,
      preconditions: "Route Sheets → On Demand Trips",
      actionSteps: "1) Open tab",
      expected: "Renders without error (empty or populated)",
    });
  });

  test("VCTR-CP-022 — Active Days chip display", async ({ runCase }) => {
    await runCase({
      portal: PORTAL,
      suite: SUITE,
      tms: TMS,
      id: "VCTR-CP-022",
      title: "Active Days chip display",
      sequence: 6,
      total: TOTAL,
      priority: "P2",
      regression: false,
      preconditions: "Route Sheets list",
      actionSteps: "1) Inspect Active Days column on a row",
      expected: "7-day chip strip (M–S) highlights the correct scheduled days",
    });
  });
});
