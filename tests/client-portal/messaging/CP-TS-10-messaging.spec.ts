import { test } from '../../fixtures/regression-test';

const PORTAL = "Client Portal";
const SUITE = "CP-TS-10 — Messaging";
const TMS = "https://govectora.atlassian.net/wiki/x/1ADD";
const TOTAL = 3;

test.describe.configure({ mode: 'serial' });

test.describe(SUITE, () => {

  test("VCTR-CP-036 — Messaging entry point", async ({ runCase }) => {
    await runCase({
      portal: PORTAL,
      suite: SUITE,
      tms: TMS,
      id: "VCTR-CP-036",
      title: "Messaging entry point",
      sequence: 1,
      total: TOTAL,
      priority: "P2",
      regression: false,
      preconditions: "Header",
      actionSteps: "1) Open Messages icon",
      expected: "Message center opens (scoped to this client's conversations)",
    });
  });

  test("VCTR-CP-037 — Notifications scoped & unread state", async ({ runCase }) => {
    await runCase({
      portal: PORTAL,
      suite: SUITE,
      tms: TMS,
      id: "VCTR-CP-037",
      title: "Notifications scoped & unread state",
      sequence: 2,
      total: TOTAL,
      priority: "P2",
      regression: false,
      preconditions: "Header",
      actionSteps: "1) Open Notifications",
      expected: "Only this client's/user's notifications shown",
    });
  });

  test("VCTR-CP-038 — Dark/light mode toggle", async ({ runCase }) => {
    await runCase({
      portal: PORTAL,
      suite: SUITE,
      tms: TMS,
      id: "VCTR-CP-038",
      title: "Dark/light mode toggle",
      sequence: 3,
      total: TOTAL,
      priority: "P3",
      regression: false,
      preconditions: "Any page",
      actionSteps: "1) Toggle theme",
      expected: "Switches instantly; persists",
    });
  });
});
