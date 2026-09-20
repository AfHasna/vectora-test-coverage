import { test } from '../../../../tests/fixtures/regression-test';

const PORTAL = "Admin Portal";
const SUITE = "ADM-TS-07 — Passengers";
const TMS = "https://govectora.atlassian.net/wiki/x/cwDE";
const TOTAL = 5;

test.describe.configure({ mode: 'serial' });

test.describe(SUITE, () => {

  test("VCTR-ADM-036 — 4-tab Add form structure", { tag: '@regression' }, async ({ runCase }) => {
    await runCase({
      portal: PORTAL,
      suite: SUITE,
      tms: TMS,
      id: "VCTR-ADM-036",
      title: "4-tab Add form structure",
      sequence: 1,
      total: TOTAL,
      priority: "P1",
      regression: true,
      preconditions: "Add Passenger (observe only)",
      actionSteps: "1) Open Add Passenger 2) Inspect all 4 tabs",
      expected: "Tab 1 Basic Info; Tab 2 Contacts (guardians/emergency, \"Copy from Guardian\"); Tab 3 Needs & Assignments (clients, equipment, special ed, vehicle type, monitors); Tab 4 Transportation Details (addresses/places/schedules)",
    });
  });

  test("VCTR-ADM-037 — Monitor type selection dialog", { tag: '@regression' }, async ({ runCase }) => {
    await runCase({
      portal: PORTAL,
      suite: SUITE,
      tms: TMS,
      id: "VCTR-ADM-037",
      title: "Monitor type selection dialog",
      sequence: 2,
      total: TOTAL,
      priority: "P1",
      regression: true,
      preconditions: "Tab 3, Add Monitor",
      actionSteps: "1) Click Add Monitor",
      expected: "Dialog offers \"Monitor\" (manual entry) vs \"Client Monitor\" (from linked clients)",
    });
  });

  test("VCTR-ADM-038 — Passenger status lifecycle control", async ({ runCase }) => {
    await runCase({
      portal: PORTAL,
      suite: SUITE,
      tms: TMS,
      id: "VCTR-ADM-038",
      title: "Passenger status lifecycle control",
      sequence: 3,
      total: TOTAL,
      priority: "P2",
      regression: false,
      preconditions: "Existing passenger",
      actionSteps: "1) Open inline status control",
      expected: "Options reflect Draft → Active → Inactive only",
    });
  });

  // Confluence constraint: No — requires sandbox to fully execute
  test("VCTR-ADM-039 — Deactivation removes future runs (verify notice only)", async ({ runCase }) => {
    await runCase({
      portal: PORTAL,
      suite: SUITE,
      tms: TMS,
      id: "VCTR-ADM-039",
      title: "Deactivation removes future runs (verify notice only)",
      sequence: 4,
      total: TOTAL,
      priority: "P2",
      regression: false,
      preconditions: "Passenger with upcoming scheduled runs",
      actionSteps: "1) Locate documentation/tooltip describing this behavior; **do not actually deactivate** in production",
      expected: "Confirm the deactivation warning / notification behavior described in Workflows KB is reflected in the UI copy when the status-change dialog is opened (cancel before confirming)",
      fixmeReason: "Confluence constraint: No — requires sandbox to fully execute",
    });
  });

  test("VCTR-ADM-040 — Passenger↔Route Sheet vehicle type sync", async ({ runCase }) => {
    await runCase({
      portal: PORTAL,
      suite: SUITE,
      tms: TMS,
      id: "VCTR-ADM-040",
      title: "Passenger↔Route Sheet vehicle type sync",
      sequence: 5,
      total: TOTAL,
      priority: "P2",
      regression: false,
      preconditions: "Passenger with Vehicle Type set; linked Route Sheet",
      actionSteps: "1) Compare passenger's Vehicle Type field to the Route Sheet's Vehicle Type",
      expected: "Values are consistent (bidirectional sync per Module Interconnections map)",
    });
  });
});
