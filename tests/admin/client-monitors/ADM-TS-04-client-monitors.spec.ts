import { test } from '../../fixtures/regression-test';

const PORTAL = "Admin Portal";
const SUITE = "ADM-TS-04 — Client Monitors";
const TMS = "https://govectora.atlassian.net/wiki/x/cwDE";
const TOTAL = 3;

test.describe.configure({ mode: 'serial' });

test.describe(SUITE, () => {

  test("VCTR-ADM-026 — List + Add form fields", { tag: '@regression' }, async ({ runCase }) => {
    await runCase({
      portal: PORTAL,
      suite: SUITE,
      tms: TMS,
      id: "VCTR-ADM-026",
      title: "List + Add form fields",
      sequence: 1,
      total: TOTAL,
      priority: "P1",
      regression: true,
      preconditions: "`/stakeholders/client-monitors`",
      actionSteps: "1) Open Add Monitor (observe only)",
      expected: "Fields: first/last name, gender, phone, email, client (searchable dropdown), address via Google Places popup",
    });
  });

  test("VCTR-ADM-027 — Client Monitor linkage to Passengers", async ({ runCase }) => {
    await runCase({
      portal: PORTAL,
      suite: SUITE,
      tms: TMS,
      id: "VCTR-ADM-027",
      title: "Client Monitor linkage to Passengers",
      sequence: 2,
      total: TOTAL,
      priority: "P2",
      regression: false,
      preconditions: "Existing monitor linked to a client",
      actionSteps: "1) Open a Passenger using this monitor as \"Client Monitor\" type",
      expected: "Monitor appears correctly as a selectable/linked \"Client Monitor\" on the passenger's Needs & Assignments tab",
    });
  });

  test("VCTR-ADM-028 — Archive/Restore toggle", async ({ runCase }) => {
    await runCase({
      portal: PORTAL,
      suite: SUITE,
      tms: TMS,
      id: "VCTR-ADM-028",
      title: "Archive/Restore toggle",
      sequence: 3,
      total: TOTAL,
      priority: "P2",
      regression: false,
      preconditions: "Client Monitors list",
      actionSteps: "1) Toggle Active/Archived view",
      expected: "Toolbar remains visible when list is empty; archived items reappear under Archived filter",
    });
  });
});
