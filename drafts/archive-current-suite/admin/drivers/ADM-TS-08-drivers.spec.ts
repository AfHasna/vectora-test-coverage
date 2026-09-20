import { test } from '../../../../tests/fixtures/regression-test';

const PORTAL = "Admin Portal";
const SUITE = "ADM-TS-08 — Drivers";
const TMS = "https://govectora.atlassian.net/wiki/x/cwDE";
const TOTAL = 4;

test.describe.configure({ mode: 'serial' });

test.describe(SUITE, () => {

  test("VCTR-ADM-041 — 4-tab Add form structure", { tag: '@regression' }, async ({ runCase }) => {
    await runCase({
      portal: PORTAL,
      suite: SUITE,
      tms: TMS,
      id: "VCTR-ADM-041",
      title: "4-tab Add form structure",
      sequence: 1,
      total: TOTAL,
      priority: "P1",
      regression: true,
      preconditions: "Add Driver (observe only)",
      actionSteps: "1) Open Add Driver 2) Inspect tabs",
      expected: "Basic Info; Service & Assignment; License & Documents; Payment Info tabs all present",
    });
  });

  test("VCTR-ADM-042 — Driver status options", { tag: '@regression' }, async ({ runCase }) => {
    await runCase({
      portal: PORTAL,
      suite: SUITE,
      tms: TMS,
      id: "VCTR-ADM-042",
      title: "Driver status options",
      sequence: 2,
      total: TOTAL,
      priority: "P1",
      regression: true,
      preconditions: "Existing driver",
      actionSteps: "1) Open inline status control",
      expected: "Options: Active / Suspended / Terminated / Inactive",
    });
  });

  test("VCTR-ADM-043 — Driver compliance badge reflects thresholds", { tag: '@regression' }, async ({ runCase }) => {
    await runCase({
      portal: PORTAL,
      suite: SUITE,
      tms: TMS,
      id: "VCTR-ADM-043",
      title: "Driver compliance badge reflects thresholds",
      sequence: 3,
      total: TOTAL,
      priority: "P1",
      regression: true,
      preconditions: "Driver with license nearing expiry",
      actionSteps: "1) Compare badge color to Settings → Compliance Thresholds (default 30d amber / 7d red)",
      expected: "Badge color matches configured thresholds",
    });
  });

  test("VCTR-ADM-044 — Driver App account section", async ({ runCase }) => {
    await runCase({
      portal: PORTAL,
      suite: SUITE,
      tms: TMS,
      id: "VCTR-ADM-044",
      title: "Driver App account section",
      sequence: 4,
      total: TOTAL,
      priority: "P2",
      regression: false,
      preconditions: "Settings → Driver App Users, or Driver record",
      actionSteps: "1) Locate mobile-account create/reset/revoke controls",
      expected: "Controls present and permission-gated (Super Admin / documented roles only)",
    });
  });
});
