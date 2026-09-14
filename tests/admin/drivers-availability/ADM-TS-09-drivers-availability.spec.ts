import { test } from '../../fixtures/regression-test';

const PORTAL = "Admin Portal";
const SUITE = "ADM-TS-09 — Drivers Availability";
const TMS = "https://govectora.atlassian.net/wiki/x/cwDE";
const TOTAL = 3;

test.describe.configure({ mode: 'serial' });

test.describe(SUITE, () => {

  test("VCTR-ADM-045 — Weekly AM/PM matrix renders", { tag: '@regression' }, async ({ runCase }) => {
    await runCase({
      portal: PORTAL,
      suite: SUITE,
      tms: TMS,
      id: "VCTR-ADM-045",
      title: "Weekly AM/PM matrix renders",
      sequence: 1,
      total: TOTAL,
      priority: "P1",
      regression: true,
      preconditions: "`/workforce/drivers-availability`",
      actionSteps: "1) Open page",
      expected: "Grid shows drivers × week with AM/PM cells; Green=Available, Amber=Assigned with route-ID tooltip",
    });
  });

  test("VCTR-ADM-046 — 5 filters function", async ({ runCase }) => {
    await runCase({
      portal: PORTAL,
      suite: SUITE,
      tms: TMS,
      id: "VCTR-ADM-046",
      title: "5 filters function",
      sequence: 2,
      total: TOTAL,
      priority: "P2",
      regression: false,
      preconditions: "Availability page",
      actionSteps: "1) Apply Driver Name, Status, Compliance, Availability, Vehicle filters individually",
      expected: "Each filter narrows the grid correctly; combinable",
    });
  });

  test("VCTR-ADM-047 — Week navigation", async ({ runCase }) => {
    await runCase({
      portal: PORTAL,
      suite: SUITE,
      tms: TMS,
      id: "VCTR-ADM-047",
      title: "Week navigation",
      sequence: 3,
      total: TOTAL,
      priority: "P2",
      regression: false,
      preconditions: "Availability page",
      actionSteps: "1) Click next/prev week arrows 2) Click \"This Week\"",
      expected: "Grid updates to selected week; \"This Week\" returns to current week",
    });
  });
});
