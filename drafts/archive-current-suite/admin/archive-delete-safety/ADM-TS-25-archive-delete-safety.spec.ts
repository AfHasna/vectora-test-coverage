import { test } from '../../../../tests/fixtures/regression-test';

const PORTAL = "Admin Portal";
const SUITE = "ADM-TS-25 — Archive/Delete Safety";
const TMS = "https://govectora.atlassian.net/wiki/x/cwDE";
const TOTAL = 5;

test.describe.configure({ mode: 'serial' });

test.describe(SUITE, () => {

  test("VCTR-ADM-115 — Verb rule — Archive vs Delete only", { tag: '@regression' }, async ({ runCase }) => {
    await runCase({
      portal: PORTAL,
      suite: SUITE,
      tms: TMS,
      id: "VCTR-ADM-115",
      title: "Verb rule — Archive vs Delete only",
      sequence: 1,
      total: TOTAL,
      priority: "P1",
      regression: true,
      preconditions: "Any Archive/Delete confirmation across modules",
      actionSteps: "1) Trigger the dialog (cancel before confirming) on Clients, Drivers, Vehicles, Route Sheets",
      expected: "Primary button always reads exactly \"Archive\" or \"Delete\" — never Remove/Continue Anyway/OK/Confirm/Proceed/Yes",
    });
  });

  test("VCTR-ADM-116 — Critical-tier checkbox gate", { tag: '@regression' }, async ({ runCase }) => {
    await runCase({
      portal: PORTAL,
      suite: SUITE,
      tms: TMS,
      id: "VCTR-ADM-116",
      title: "Critical-tier checkbox gate",
      sequence: 2,
      total: TOTAL,
      priority: "P1",
      regression: true,
      preconditions: "An entity with critical dependencies",
      actionSteps: "1) Open Archive dialog 2) Observe checkbox requirement",
      expected: "Primary button stays disabled until \"I understand this will affect the records above\" is ticked",
    });
  });

  test("VCTR-ADM-117 — Restore from Archived view", async ({ runCase }) => {
    await runCase({
      portal: PORTAL,
      suite: SUITE,
      tms: TMS,
      id: "VCTR-ADM-117",
      title: "Restore from Archived view",
      sequence: 3,
      total: TOTAL,
      priority: "P2",
      regression: false,
      preconditions: "Archived-view toggle on any supported module",
      actionSteps: "1) Toggle to Archived 2) Locate a record's Restore action",
      expected: "Restore option present in row ⋯ menu",
    });
  });

  test("VCTR-ADM-118 — Hard-delete prevention trigger", { tag: '@regression' }, async ({ runCase }) => {
    await runCase({
      portal: PORTAL,
      suite: SUITE,
      tms: TMS,
      id: "VCTR-ADM-118",
      title: "Hard-delete prevention trigger",
      sequence: 4,
      total: TOTAL,
      priority: "P1",
      regression: true,
      preconditions: "Attempt (observe only) to find a hard-delete path on a critical entity",
      actionSteps: "1) Search for any UI path that would hard-delete a Client/Driver/Vehicle/Passenger/Place/Route Sheet",
      expected: "No such path exists in the UI — only Archive is offered, consistent with the documented DB trigger blocking DELETE on 8 critical tables",
    });
  });

  test("VCTR-ADM-119 — Status History present on all documented entities", async ({ runCase }) => {
    await runCase({
      portal: PORTAL,
      suite: SUITE,
      tms: TMS,
      id: "VCTR-ADM-119",
      title: "Status History present on all documented entities",
      sequence: 5,
      total: TOTAL,
      priority: "P2",
      regression: false,
      preconditions: "Clients, Client Monitors, Passengers, Route Sheets, Places, Vehicles, Drivers, Users",
      actionSteps: "1) Open View panel for one record of each type",
      expected: "Status History section present, expanded by default, \"Show more/less\" available",
    });
  });
});
