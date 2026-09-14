import { test } from '../../fixtures/regression-test';

const PORTAL = "Admin Portal";
const SUITE = "ADM-TS-19 — General";
const TMS = "https://govectora.atlassian.net/wiki/x/cwDE";
const TOTAL = 8;

test.describe.configure({ mode: 'serial' });

test.describe(SUITE, () => {

  test("VCTR-ADM-086 — Company tab fields", { tag: '@regression' }, async ({ runCase }) => {
    await runCase({
      portal: PORTAL,
      suite: SUITE,
      tms: TMS,
      id: "VCTR-ADM-086",
      title: "Company tab fields",
      sequence: 1,
      total: TOTAL,
      priority: "P1",
      regression: true,
      preconditions: "`/settings/general`",
      actionSteps: "1) Inspect fields",
      expected: "Company Name, Full Legal Name, Support Email; no global Default Timezone field (removed)",
    });
  });

  test("VCTR-ADM-087 — Billing & Invoice tab fields", async ({ runCase }) => {
    await runCase({
      portal: PORTAL,
      suite: SUITE,
      tms: TMS,
      id: "VCTR-ADM-087",
      title: "Billing & Invoice tab fields",
      sequence: 2,
      total: TOTAL,
      priority: "P2",
      regression: false,
      preconditions: "`/settings/general/billing`",
      actionSteps: "1) Inspect fields",
      expected: "Tax ID (EIN), Company Phone, Billing Email, Company Address",
    });
  });

  test("VCTR-ADM-088 — Compliance Thresholds tab", { tag: '@regression' }, async ({ runCase }) => {
    await runCase({
      portal: PORTAL,
      suite: SUITE,
      tms: TMS,
      id: "VCTR-ADM-088",
      title: "Compliance Thresholds tab",
      sequence: 3,
      total: TOTAL,
      priority: "P1",
      regression: true,
      preconditions: "`/settings/general/compliance-thresholds`",
      actionSteps: "1) Inspect fields/defaults",
      expected: "Expiring default 30, Critical default 7",
    });
  });

  test("VCTR-ADM-089 — Trip SLA tab defaults", { tag: '@regression' }, async ({ runCase }) => {
    await runCase({
      portal: PORTAL,
      suite: SUITE,
      tms: TMS,
      id: "VCTR-ADM-089",
      title: "Trip SLA tab defaults",
      sequence: 4,
      total: TOTAL,
      priority: "P1",
      regression: true,
      preconditions: "`/settings/general/trip-sla`",
      actionSteps: "1) Inspect defaults",
      expected: "Accept Deadline 90 min, Start Grace 5, Pickup Grace 10, Dropoff Grace 10, GPS Stale-Offline 2 (range 1–30)",
    });
  });

  test("VCTR-ADM-090 — Request SLA tab defaults", async ({ runCase }) => {
    await runCase({
      portal: PORTAL,
      suite: SUITE,
      tms: TMS,
      id: "VCTR-ADM-090",
      title: "Request SLA tab defaults",
      sequence: 5,
      total: TOTAL,
      priority: "P2",
      regression: false,
      preconditions: "`/settings/general/request-sla`",
      actionSteps: "1) Inspect per-type defaults",
      expected: "Trip Cancellation 2d, On-Demand 2d, Account Deletion 7d, Passenger Request 14d, Driver Change 7d, Monitor Change 7d",
    });
  });

  test("VCTR-ADM-091 — Route Timing Defaults tab", async ({ runCase }) => {
    await runCase({
      portal: PORTAL,
      suite: SUITE,
      tms: TMS,
      id: "VCTR-ADM-091",
      title: "Route Timing Defaults tab",
      sequence: 6,
      total: TOTAL,
      priority: "P2",
      regression: false,
      preconditions: "`/settings/general/trip-timing`",
      actionSteps: "1) Inspect defaults",
      expected: "Dwell Home 3, Dwell School 5, Arrival Buffer 10, Departure Buffer 5, ETA/STA Warning 15",
    });
  });

  test("VCTR-ADM-092 — Trip Generation tab", async ({ runCase }) => {
    await runCase({
      portal: PORTAL,
      suite: SUITE,
      tms: TMS,
      id: "VCTR-ADM-092",
      title: "Trip Generation tab",
      sequence: 7,
      total: TOTAL,
      priority: "P3",
      regression: false,
      preconditions: "`/settings/general/trip-generation`",
      actionSteps: "1) Inspect defaults",
      expected: "Daily Generation Time 02:00 (reference), Same-Day Cutoff 06:00",
    });
  });

  test("VCTR-ADM-093 — settings:edit permission gates Save", { tag: '@regression' }, async ({ runCase }) => {
    await runCase({
      portal: PORTAL,
      suite: SUITE,
      tms: TMS,
      id: "VCTR-ADM-093",
      title: "`settings:edit` permission gates Save",
      sequence: 8,
      total: TOTAL,
      priority: "P1",
      regression: true,
      preconditions: "As a view-only role (if available)",
      actionSteps: "1) Attempt to edit a General field",
      expected: "Save is disabled/hidden without `settings.edit`",
    });
  });
});
