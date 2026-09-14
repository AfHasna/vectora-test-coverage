import { test } from '../../fixtures/regression-test';

const PORTAL = "Client Portal";
const SUITE = "CP-TS-05 — Incidents";
const TMS = "https://govectora.atlassian.net/wiki/x/1ADD";
const TOTAL = 2;

test.describe.configure({ mode: 'serial' });

test.describe(SUITE, () => {

  test("VCTR-CP-023 — Incidents list scoped & read-only", { tag: '@regression' }, async ({ runCase }) => {
    await runCase({
      portal: PORTAL,
      suite: SUITE,
      tms: TMS,
      id: "VCTR-CP-023",
      title: "Incidents list scoped & read-only",
      sequence: 1,
      total: TOTAL,
      priority: "P1",
      regression: true,
      preconditions: "`/incidents`",
      actionSteps: "1) Open list",
      expected: "Only this client's incidents shown (0 in test tenant → \"No incidents have been reported\"); no create/edit actions",
    });
  });

  // Confluence constraint: No — data-dependent, currently empty in test tenant
  test("VCTR-CP-024 — Incident detail linkage (data-dependent)", async ({ runCase }) => {
    await runCase({
      portal: PORTAL,
      suite: SUITE,
      tms: TMS,
      id: "VCTR-CP-024",
      title: "Incident detail linkage (data-dependent)",
      sequence: 2,
      total: TOTAL,
      priority: "P2",
      regression: false,
      preconditions: "An incident exists",
      actionSteps: "1) Open an incident row",
      expected: "Links back to the source trip/passenger event (No Show / Early Cancel / Late Cancel)",
      fixmeReason: "Confluence constraint: No — data-dependent, currently empty in test tenant",
    });
  });
});
