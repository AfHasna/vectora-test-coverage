import { test } from '../../../../tests/fixtures/regression-test';

const PORTAL = "Admin Portal";
const SUITE = "ADM-TS-06 — Guardians";
const TMS = "https://govectora.atlassian.net/wiki/x/cwDE";
const TOTAL = 4;

test.describe.configure({ mode: 'serial' });

test.describe(SUITE, () => {

  test("VCTR-ADM-032 — Guardians Add/Edit is dialog-based (no /add route)", { tag: '@regression' }, async ({ runCase }) => {
    await runCase({
      portal: PORTAL,
      suite: SUITE,
      tms: TMS,
      id: "VCTR-ADM-032",
      title: "Guardians Add/Edit is dialog-based (no /add route)",
      sequence: 1,
      total: TOTAL,
      priority: "P1",
      regression: true,
      preconditions: "`/stakeholders/guardians`",
      actionSteps: "1) Click Add Guardian 2) Observe URL",
      expected: "Dialog opens in place; URL does not change to `/add` (matches \"Vehicles pattern\")",
    });
  });

  test("VCTR-ADM-033 — Passenger count column behavior", async ({ runCase }) => {
    await runCase({
      portal: PORTAL,
      suite: SUITE,
      tms: TMS,
      id: "VCTR-ADM-033",
      title: "Passenger count column behavior",
      sequence: 2,
      total: TOTAL,
      priority: "P2",
      regression: false,
      preconditions: "Guardians list",
      actionSteps: "1) Inspect a guardian with 0 linked passengers, 1, and \\>1",
      expected: "0 shows muted icon; 1 shows clickable passenger name → profile dialog; \\>1 shows count + icon → RoutePassengersDialog; archived passengers excluded from count",
    });
  });

  test("VCTR-ADM-034 — Guardian linked from Passenger Contacts", async ({ runCase }) => {
    await runCase({
      portal: PORTAL,
      suite: SUITE,
      tms: TMS,
      id: "VCTR-ADM-034",
      title: "Guardian linked from Passenger Contacts",
      sequence: 3,
      total: TOTAL,
      priority: "P2",
      regression: false,
      preconditions: "Passenger Contacts tab",
      actionSteps: "1) Open a passenger's Contacts tab 2) Add/observe a guardian entry",
      expected: "Guardian created/linked here also appears in the central Guardians registry",
    });
  });

  test("VCTR-ADM-035 — Guardian Mobile App Access entry point", async ({ runCase }) => {
    await runCase({
      portal: PORTAL,
      suite: SUITE,
      tms: TMS,
      id: "VCTR-ADM-035",
      title: "Guardian Mobile App Access entry point",
      sequence: 4,
      total: TOTAL,
      priority: "P3",
      regression: false,
      preconditions: "Guardian Edit dialog",
      actionSteps: "1) Open Edit on a guardian",
      expected: "\"Mobile App Access\" control is present (links to Guardian App user provisioning)",
    });
  });
});
