import { test } from '../../../../tests/fixtures/regression-test';

const PORTAL = "Service Provider Portal";
const SUITE = "SP-TS-10 — Tenant Scoping";
const TMS = "https://govectora.atlassian.net/wiki/x/6QDD";
const TOTAL = 3;

test.describe.configure({ mode: 'serial' });

test.describe(SUITE, () => {

  test("VCTR-SP-038 — No cross-provider data leakage", { tag: '@regression' }, async ({ runCase }) => {
    await runCase({
      portal: PORTAL,
      suite: SUITE,
      tms: TMS,
      id: "VCTR-SP-038",
      title: "No cross-provider data leakage",
      sequence: 1,
      total: TOTAL,
      priority: "P1",
      regression: true,
      preconditions: "Any list module",
      actionSteps: "1) Inspect all rows across Drivers, Monitors, Trips, Payouts, Compliance",
      expected: "Every row belongs to this portal user's own `service_provider_id` — none from other providers",
    });
  });

  test("VCTR-SP-039 — Read-only roster parity with Admin", async ({ runCase }) => {
    await runCase({
      portal: PORTAL,
      suite: SUITE,
      tms: TMS,
      id: "VCTR-SP-039",
      title: "Read-only roster parity with Admin",
      sequence: 2,
      total: TOTAL,
      priority: "P2",
      regression: false,
      preconditions: "Compare this portal's Drivers list to Admin's Settings → Service Provider Portal Users roster (Admin plan VCTR-ADM-110 range)",
      actionSteps: "1) Cross-check driver records",
      expected: "Data is consistent between the provider's own view and Admin's read-only roster",
    });
  });

  test("VCTR-SP-040 — Help link", async ({ runCase }) => {
    await runCase({
      portal: PORTAL,
      suite: SUITE,
      tms: TMS,
      id: "VCTR-SP-040",
      title: "Help link",
      sequence: 3,
      total: TOTAL,
      priority: "P3",
      regression: false,
      preconditions: "Sidebar",
      actionSteps: "1) Open Help",
      expected: "Contextual help content loads without error",
    });
  });
});
