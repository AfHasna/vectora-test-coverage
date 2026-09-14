import { test } from '../../fixtures/regression-test';

const PORTAL = "Admin Portal";
const SUITE = "ADM-TS-05 — Places";
const TMS = "https://govectora.atlassian.net/wiki/x/cwDE";
const TOTAL = 3;

test.describe.configure({ mode: 'serial' });

test.describe(SUITE, () => {

  test("VCTR-ADM-029 — Place default status is Draft", { tag: '@regression' }, async ({ runCase }) => {
    await runCase({
      portal: PORTAL,
      suite: SUITE,
      tms: TMS,
      id: "VCTR-ADM-029",
      title: "Place default status is Draft",
      sequence: 1,
      total: TOTAL,
      priority: "P1",
      regression: true,
      preconditions: "Add Place form (observe only)",
      actionSteps: "1) Open Add Place",
      expected: "New place defaults to Draft status; lifecycle Draft→Active→Inactive documented in status control",
    });
  });

  test("VCTR-ADM-030 — Embedded calendar tab present", { tag: '@regression' }, async ({ runCase }) => {
    await runCase({
      portal: PORTAL,
      suite: SUITE,
      tms: TMS,
      id: "VCTR-ADM-030",
      title: "Embedded calendar tab present",
      sequence: 2,
      total: TOTAL,
      priority: "P1",
      regression: true,
      preconditions: "Existing Place, View/Edit",
      actionSteps: "1) Open Calendars tab",
      expected: "Calendar/holiday configuration UI is present and embedded within the Place record",
    });
  });

  test("VCTR-ADM-031 — Place feeds Route Sheet schedule exceptions", async ({ runCase }) => {
    await runCase({
      portal: PORTAL,
      suite: SUITE,
      tms: TMS,
      id: "VCTR-ADM-031",
      title: "Place feeds Route Sheet schedule exceptions",
      sequence: 3,
      total: TOTAL,
      priority: "P2",
      regression: false,
      preconditions: "Place with a holiday configured; Route Sheet referencing that place",
      actionSteps: "1) Open a Route Sheet using this place 2) Check for holiday/early-release indicator",
      expected: "Route Sheet wizard surfaces holiday/early-release info sourced from the place's calendar",
    });
  });
});
