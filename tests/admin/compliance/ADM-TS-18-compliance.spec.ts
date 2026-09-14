import { test } from '../../fixtures/regression-test';

const PORTAL = "Admin Portal";
const SUITE = "ADM-TS-18 — Compliance";
const TMS = "https://govectora.atlassian.net/wiki/x/cwDE";
const TOTAL = 3;

test.describe.configure({ mode: 'serial' });

test.describe(SUITE, () => {

  test("VCTR-ADM-083 — Standalone Compliance Management section", { tag: '@regression' }, async ({ runCase }) => {
    await runCase({
      portal: PORTAL,
      suite: SUITE,
      tms: TMS,
      id: "VCTR-ADM-083",
      title: "Standalone Compliance Management section",
      sequence: 1,
      total: TOTAL,
      priority: "P1",
      regression: true,
      preconditions: "Sidebar",
      actionSteps: "1) Open Compliance Management",
      expected: "Driver/Vehicle/Monitor compliance tabs present (Provider per Dashboard widget)",
    });
  });

  test("VCTR-ADM-084 — Compliance Details dialog", async ({ runCase }) => {
    await runCase({
      portal: PORTAL,
      suite: SUITE,
      tms: TMS,
      id: "VCTR-ADM-084",
      title: "Compliance Details dialog",
      sequence: 2,
      total: TOTAL,
      priority: "P2",
      regression: false,
      preconditions: "Vehicle/Driver compliance list",
      actionSteps: "1) Open a record's Compliance Details",
      expected: "Single dialog with status banner, expirations, documents, outstanding issues",
    });
  });

  test("VCTR-ADM-085 — Threshold change propagates", { tag: '@regression' }, async ({ runCase }) => {
    await runCase({
      portal: PORTAL,
      suite: SUITE,
      tms: TMS,
      id: "VCTR-ADM-085",
      title: "Threshold change propagates",
      sequence: 3,
      total: TOTAL,
      priority: "P1",
      regression: true,
      preconditions: "Settings → Compliance Thresholds (observe values, do not change in production)",
      actionSteps: "1) Note current Expiring(30)/Critical(7) values 2) Cross-check a driver near that boundary",
      expected: "Badge coloring on Drivers/Vehicles/Monitors/Dashboard consistent with configured thresholds",
    });
  });
});
