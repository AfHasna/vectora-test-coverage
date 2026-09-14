import { test } from '../../fixtures/regression-test';

const PORTAL = "Admin Portal";
const SUITE = "ADM-TS-20 — Reference Data";
const TMS = "https://govectora.atlassian.net/wiki/x/cwDE";
const TOTAL = 3;

test.describe.configure({ mode: 'serial' });

test.describe(SUITE, () => {

  test("VCTR-ADM-094 — 7 sub-tabs present", { tag: '@regression' }, async ({ runCase }) => {
    await runCase({
      portal: PORTAL,
      suite: SUITE,
      tms: TMS,
      id: "VCTR-ADM-094",
      title: "7 sub-tabs present",
      sequence: 1,
      total: TOTAL,
      priority: "P1",
      regression: true,
      preconditions: "`/settings/reference-data`",
      actionSteps: "1) Inspect tabs",
      expected: "Client Types, Place Types, Service Types, Special Ed, Vehicle Type, Vehicle Equipment, Passenger Equipment",
    });
  });

  // Confluence constraint: No — mutating, needs sandbox or explicit go-ahead
  test("VCTR-ADM-095 — Delete-with-undo (5s toast)", async ({ runCase }) => {
    await runCase({
      portal: PORTAL,
      suite: SUITE,
      tms: TMS,
      id: "VCTR-ADM-095",
      title: "Delete-with-undo (5s toast)",
      sequence: 2,
      total: TOTAL,
      priority: "P2",
      regression: false,
      preconditions: "A reference item, non-critical (observe only — confirm with user before actually deleting any real item)",
      actionSteps: "1) Locate delete action 2) Observe confirmation dialog copy",
      expected: "Dialog and toast pattern match documented 5-second undo window",
      fixmeReason: "Confluence constraint: No — mutating, needs sandbox or explicit go-ahead",
    });
  });

  test("VCTR-ADM-096 — Reference data populates dependent dropdowns", async ({ runCase }) => {
    await runCase({
      portal: PORTAL,
      suite: SUITE,
      tms: TMS,
      id: "VCTR-ADM-096",
      title: "Reference data populates dependent dropdowns",
      sequence: 3,
      total: TOTAL,
      priority: "P2",
      regression: false,
      preconditions: "Clients/Places/Vehicles Add forms",
      actionSteps: "1) Open each form's relevant dropdown",
      expected: "Values match current Reference Data entries",
    });
  });
});
