import { test } from '../../../../tests/fixtures/regression-test';

const PORTAL = "Service Provider Portal";
const SUITE = "SP-TS-04 — Monitors";
const TMS = "https://govectora.atlassian.net/wiki/x/6QDD";
const TOTAL = 2;

test.describe.configure({ mode: 'serial' });

test.describe(SUITE, () => {

  test("VCTR-SP-017 — Monitors list scoped to this provider", { tag: '@regression' }, async ({ runCase }) => {
    await runCase({
      portal: PORTAL,
      suite: SUITE,
      tms: TMS,
      id: "VCTR-SP-017",
      title: "Monitors list scoped to this provider",
      sequence: 1,
      total: TOTAL,
      priority: "P1",
      regression: true,
      preconditions: "Workforce → Monitors",
      actionSteps: "1) Open sub-tab",
      expected: "Only monitors linked to this provider shown",
    });
  });

  test("VCTR-SP-018 — Add Monitor form (observe only)", async ({ runCase }) => {
    await runCase({
      portal: PORTAL,
      suite: SUITE,
      tms: TMS,
      id: "VCTR-SP-018",
      title: "Add Monitor form (observe only)",
      sequence: 2,
      total: TOTAL,
      priority: "P2",
      regression: false,
      preconditions: "Monitors → Add",
      actionSteps: "1) Open Add Monitor 2) Inspect fields",
      expected: "Form opens; do not save",
    });
  });
});
