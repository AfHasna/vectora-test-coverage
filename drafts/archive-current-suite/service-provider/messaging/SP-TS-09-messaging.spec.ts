import { test } from '../../../../tests/fixtures/regression-test';

const PORTAL = "Service Provider Portal";
const SUITE = "SP-TS-09 — Messaging";
const TMS = "https://govectora.atlassian.net/wiki/x/6QDD";
const TOTAL = 3;

test.describe.configure({ mode: 'serial' });

test.describe(SUITE, () => {

  test("VCTR-SP-035 — Messaging entry point", async ({ runCase }) => {
    await runCase({
      portal: PORTAL,
      suite: SUITE,
      tms: TMS,
      id: "VCTR-SP-035",
      title: "Messaging entry point",
      sequence: 1,
      total: TOTAL,
      priority: "P2",
      regression: false,
      preconditions: "Header",
      actionSteps: "1) Open Messaging",
      expected: "Message center opens, scoped to this provider's conversations",
    });
  });

  test("VCTR-SP-036 — Notifications scoped", async ({ runCase }) => {
    await runCase({
      portal: PORTAL,
      suite: SUITE,
      tms: TMS,
      id: "VCTR-SP-036",
      title: "Notifications scoped",
      sequence: 2,
      total: TOTAL,
      priority: "P2",
      regression: false,
      preconditions: "Header",
      actionSteps: "1) Open Notifications",
      expected: "Only this provider's/user's notifications shown",
    });
  });

  test("VCTR-SP-037 — Dark/light mode toggle", async ({ runCase }) => {
    await runCase({
      portal: PORTAL,
      suite: SUITE,
      tms: TMS,
      id: "VCTR-SP-037",
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
