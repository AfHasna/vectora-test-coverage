import { test } from '../../fixtures/regression-test';

const PORTAL = "Admin Portal";
const SUITE = "ADM-TS-14 — Routes Assignment";
const TMS = "https://govectora.atlassian.net/wiki/x/cwDE";
const TOTAL = 5;

test.describe.configure({ mode: 'serial' });

test.describe(SUITE, () => {

  test("VCTR-ADM-066 — Default filter hides fully-assigned routes", { tag: '@regression' }, async ({ runCase }) => {
    await runCase({
      portal: PORTAL,
      suite: SUITE,
      tms: TMS,
      id: "VCTR-ADM-066",
      title: "Default filter hides fully-assigned routes",
      sequence: 1,
      total: TOTAL,
      priority: "P1",
      regression: true,
      preconditions: "`/service-operations/routes-assignment`",
      actionSteps: "1) Load page default 2) Toggle \"Include assigned trips\"",
      expected: "Default view hides fully-assigned; toggle reveals all",
    });
  });

  test("VCTR-ADM-067 — Status dot color coding", async ({ runCase }) => {
    await runCase({
      portal: PORTAL,
      suite: SUITE,
      tms: TMS,
      id: "VCTR-ADM-067",
      title: "Status dot color coding",
      sequence: 2,
      total: TOTAL,
      priority: "P2",
      regression: false,
      preconditions: "Routes Assignment list",
      actionSteps: "1) Inspect dots across statuses",
      expected: "Gray=Draft, Blue=Confirmed, Green=Assigned, Red=Expired",
    });
  });

  test("VCTR-ADM-068 — Generate Runs button present & gated", { tag: '@regression' }, async ({ runCase }) => {
    await runCase({
      portal: PORTAL,
      suite: SUITE,
      tms: TMS,
      id: "VCTR-ADM-068",
      title: "Generate Runs button present & gated",
      sequence: 3,
      total: TOTAL,
      priority: "P1",
      regression: true,
      preconditions: "Toolbar",
      actionSteps: "1) Locate \"Generate Runs\" button",
      expected: "Present, correctly permission-gated to `routes_assignment:edit`; **do not click** in production",
    });
  });

  test("VCTR-ADM-069 — Drivers Availability overlay from assignment dialog", async ({ runCase }) => {
    await runCase({
      portal: PORTAL,
      suite: SUITE,
      tms: TMS,
      id: "VCTR-ADM-069",
      title: "Drivers Availability overlay from assignment dialog",
      sequence: 4,
      total: TOTAL,
      priority: "P2",
      regression: false,
      preconditions: "Open an assignment row",
      actionSteps: "1) Open \"Drivers Availability\" from within the dialog",
      expected: "Availability overlay opens without leaving the assignment flow",
    });
  });

  test("VCTR-ADM-070 — Future trips are read-only / no dispatch", { tag: '@regression' }, async ({ runCase }) => {
    await runCase({
      portal: PORTAL,
      suite: SUITE,
      tms: TMS,
      id: "VCTR-ADM-070",
      title: "Future trips are read-only / no dispatch",
      sequence: 5,
      total: TOTAL,
      priority: "P1",
      regression: true,
      preconditions: "Future Trips tab",
      actionSteps: "1) Attempt to find a \"Send Trip Offer\" or dispatch action on a future-dated trip",
      expected: "No dispatch action available; trip remains `scheduled`",
    });
  });
});
