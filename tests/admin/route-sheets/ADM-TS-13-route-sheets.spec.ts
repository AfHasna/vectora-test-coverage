import { test } from '../../fixtures/regression-test';

const PORTAL = "Admin Portal";
const SUITE = "ADM-TS-13 — Route Sheets";
const TMS = "https://govectora.atlassian.net/wiki/x/cwDE";
const TOTAL = 7;

test.describe.configure({ mode: 'serial' });

test.describe(SUITE, () => {

  test("VCTR-ADM-059 — 2-step wizard structure", { tag: '@regression' }, async ({ runCase }) => {
    await runCase({
      portal: PORTAL,
      suite: SUITE,
      tms: TMS,
      id: "VCTR-ADM-059",
      title: "2-step wizard structure",
      sequence: 1,
      total: TOTAL,
      priority: "P1",
      regression: true,
      preconditions: "`/service-operations/route-sheets` → Add (observe only, do not save)",
      actionSteps: "1) Open wizard 2) Inspect Step 1 and Step 2",
      expected: "Step 1: passengers/monitors, locations only, no manual time inputs. Step 2: shared config, Google Maps, stops table, per-stop ETA Adjustment as the only manual time lever",
    });
  });

  test("VCTR-ADM-060 — Paired RSO/RSR numbering", { tag: '@regression' }, async ({ runCase }) => {
    await runCase({
      portal: PORTAL,
      suite: SUITE,
      tms: TMS,
      id: "VCTR-ADM-060",
      title: "Paired RSO/RSR numbering",
      sequence: 2,
      total: TOTAL,
      priority: "P1",
      regression: true,
      preconditions: "Existing route sheet pair",
      actionSteps: "1) Open an Outbound and its paired Return sheet",
      expected: "Same numeric suffix, RSO- and RSR- prefixes respectively",
    });
  });

  test("VCTR-ADM-061 — Route Sheet status lifecycle & allowed transitions", { tag: '@regression' }, async ({ runCase }) => {
    await runCase({
      portal: PORTAL,
      suite: SUITE,
      tms: TMS,
      id: "VCTR-ADM-061",
      title: "Route Sheet status lifecycle & allowed transitions",
      sequence: 3,
      total: TOTAL,
      priority: "P1",
      regression: true,
      preconditions: "Existing route sheets in various statuses",
      actionSteps: "1) Inspect status control options at each state",
      expected: "Draft→Confirmed→Assigned→Expired, plus On Hold and Deactivated/Inactive per documented transition table; illegal transitions not offered",
    });
  });

  test("VCTR-ADM-062 — On Hold requires start+end date", async ({ runCase }) => {
    await runCase({
      portal: PORTAL,
      suite: SUITE,
      tms: TMS,
      id: "VCTR-ADM-062",
      title: "On Hold requires start+end date",
      sequence: 4,
      total: TOTAL,
      priority: "P2",
      regression: false,
      preconditions: "Route sheet Place On Hold action (observe only)",
      actionSteps: "1) Open \"Place On Hold\" dialog",
      expected: "Both hold\\_start\\_date and hold\\_end\\_date required before confirm enabled",
    });
  });

  test("VCTR-ADM-063 — Bulk Confirm workflow", async ({ runCase }) => {
    await runCase({
      portal: PORTAL,
      suite: SUITE,
      tms: TMS,
      id: "VCTR-ADM-063",
      title: "Bulk Confirm workflow",
      sequence: 5,
      total: TOTAL,
      priority: "P2",
      regression: false,
      preconditions: "Route Sheets list, multiple Draft rows",
      actionSteps: "1) Select multiple via checkbox 2) Observe \"Confirm Selected\" toolbar (do not execute)",
      expected: "Bulk toolbar shows selection count; button present and correctly labeled",
    });
  });

  test("VCTR-ADM-064 — Auto-sync from Passenger schedule (read-only in wizard)", async ({ runCase }) => {
    await runCase({
      portal: PORTAL,
      suite: SUITE,
      tms: TMS,
      id: "VCTR-ADM-064",
      title: "Auto-sync from Passenger schedule (read-only in wizard)",
      sequence: 6,
      total: TOTAL,
      priority: "P2",
      regression: false,
      preconditions: "Route Sheet referencing a passenger",
      actionSteps: "1) Compare Service Dates/Active Days shown in wizard vs. passenger's Transportation Details tab",
      expected: "Values match; wizard shows \"Edit in Passenger Profile\" link rather than inline edit",
    });
  });

  test("VCTR-ADM-065 — ETA/STA mismatch warning", async ({ runCase }) => {
    await runCase({
      portal: PORTAL,
      suite: SUITE,
      tms: TMS,
      id: "VCTR-ADM-065",
      title: "ETA/STA mismatch warning",
      sequence: 7,
      total: TOTAL,
      priority: "P3",
      regression: false,
      preconditions: "Route Sheet View, a stop missing STA or ETA far from STA",
      actionSteps: "1) Open Route Sheet View",
      expected: "Warning indicator appears on the affected stop row",
    });
  });
});
