import { test } from '../../fixtures/regression-test';

const PORTAL = "Admin Portal";
const SUITE = "ADM-TS-16 — Incidents";
const TMS = "https://govectora.atlassian.net/wiki/x/cwDE";
const TOTAL = 4;

test.describe.configure({ mode: 'serial' });

test.describe(SUITE, () => {

  test("VCTR-ADM-077 — Incident auto-generated from No Show/Cancel", { tag: '@regression' }, async ({ runCase }) => {
    await runCase({
      portal: PORTAL,
      suite: SUITE,
      tms: TMS,
      id: "VCTR-ADM-077",
      title: "Incident auto-generated from No Show/Cancel",
      sequence: 1,
      total: TOTAL,
      priority: "P1",
      regression: true,
      preconditions: "Existing No Show / Late Cancel / Early Cancellation event",
      actionSteps: "1) Open Incident Reports",
      expected: "Corresponding incident entry exists, linked to the source trip/passenger",
    });
  });

  test("VCTR-ADM-078 — Activity Logs tab is read-only", async ({ runCase }) => {
    await runCase({
      portal: PORTAL,
      suite: SUITE,
      tms: TMS,
      id: "VCTR-ADM-078",
      title: "Activity Logs tab is read-only",
      sequence: 2,
      total: TOTAL,
      priority: "P2",
      regression: false,
      preconditions: "Trip Activity dialog",
      actionSteps: "1) Open Activity Logs tab",
      expected: "Entries are system-generated, read-only; columns #, Action, Status old→new, Done By, Date/Time",
    });
  });

  // Confluence constraint: No — mutating, confirm with user before executing
  test("VCTR-ADM-079 — Notes tab supports add", async ({ runCase }) => {
    await runCase({
      portal: PORTAL,
      suite: SUITE,
      tms: TMS,
      id: "VCTR-ADM-079",
      title: "Notes tab supports add",
      sequence: 3,
      total: TOTAL,
      priority: "P3",
      regression: false,
      preconditions: "Trip Activity dialog",
      actionSteps: "1) Open Notes tab 2) Observe compose box (do not necessarily submit, or submit a clearly-marked test note only if permitted)",
      expected: "Compose area + Send button present; Ctrl/Cmd+Enter shortcut documented",
      fixmeReason: "Confluence constraint: No — mutating, confirm with user before executing",
    });
  });

  test("VCTR-ADM-080 — Activity Log filters", async ({ runCase }) => {
    await runCase({
      portal: PORTAL,
      suite: SUITE,
      tms: TMS,
      id: "VCTR-ADM-080",
      title: "Activity Log filters",
      sequence: 4,
      total: TOTAL,
      priority: "P2",
      regression: false,
      preconditions: "Trip Activity dialog",
      actionSteps: "1) Apply All/Status Changes/Assignments/Cancellations filters",
      expected: "List narrows correctly per filter",
    });
  });
});
