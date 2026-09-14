import { test } from '../../fixtures/regression-test';

const PORTAL = "Admin Portal";
const SUITE = "ADM-TS-17 — Live Tracking";
const TMS = "https://govectora.atlassian.net/wiki/x/cwDE";
const TOTAL = 2;

test.describe.configure({ mode: 'serial' });

test.describe(SUITE, () => {

  test("VCTR-ADM-081 — Live Tracking opens as full-screen overlay", async ({ runCase }) => {
    await runCase({
      portal: PORTAL,
      suite: SUITE,
      tms: TMS,
      id: "VCTR-ADM-081",
      title: "Live Tracking opens as full-screen overlay",
      sequence: 1,
      total: TOTAL,
      priority: "P2",
      regression: false,
      preconditions: "Routes page header",
      actionSteps: "1) Click \"Live Tracking\"",
      expected: "Full-screen dialog with Status Summary Bar, map panel, compact trip cards",
    });
  });

  test("VCTR-ADM-082 — Permission gate live_tracking.view", async ({ runCase }) => {
    await runCase({
      portal: PORTAL,
      suite: SUITE,
      tms: TMS,
      id: "VCTR-ADM-082",
      title: "Permission gate `live_tracking.view`",
      sequence: 2,
      total: TOTAL,
      priority: "P2",
      regression: false,
      preconditions: "As a role without this permission (if available)",
      actionSteps: "1) Attempt to access Live Tracking",
      expected: "Action/button hidden or blocked",
    });
  });
});
