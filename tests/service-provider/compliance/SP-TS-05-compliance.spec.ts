import { test } from '../../fixtures/regression-test';

const PORTAL = "Service Provider Portal";
const SUITE = "SP-TS-05 — Compliance";
const TMS = "https://govectora.atlassian.net/wiki/x/6QDD";
const TOTAL = 4;

test.describe.configure({ mode: 'serial' });

test.describe(SUITE, () => {

  test("VCTR-SP-019 — Compliance summary tiles", { tag: '@regression' }, async ({ runCase }) => {
    await runCase({
      portal: PORTAL,
      suite: SUITE,
      tms: TMS,
      id: "VCTR-SP-019",
      title: "Compliance summary tiles",
      sequence: 1,
      total: TOTAL,
      priority: "P1",
      regression: true,
      preconditions: "`/workforce/compliance`",
      actionSteps: "1) Observe Required/Verified/Expiring Soon/Missing-Expired tiles",
      expected: "Tiles render (0/0/0/0 in test tenant — \"no drivers or monitors linked yet\")",
    });
  });

  // Confluence constraint: No — data-dependent, no linked personnel in test tenant
  test("VCTR-SP-020 — Document upload entry point (observe only, do not upload)", async ({ runCase }) => {
    await runCase({
      portal: PORTAL,
      suite: SUITE,
      tms: TMS,
      id: "VCTR-SP-020",
      title: "Document upload entry point (observe only, do not upload)",
      sequence: 2,
      total: TOTAL,
      priority: "P2",
      regression: false,
      preconditions: "Compliance page, a linked driver/monitor exists (data-dependent)",
      actionSteps: "1) Locate per-row upload control",
      expected: "Upload control present for each required document type",
      fixmeReason: "Confluence constraint: No — data-dependent, no linked personnel in test tenant",
    });
  });

  test("VCTR-SP-021 — Recent reminders table", async ({ runCase }) => {
    await runCase({
      portal: PORTAL,
      suite: SUITE,
      tms: TMS,
      id: "VCTR-SP-021",
      title: "Recent reminders table",
      sequence: 3,
      total: TOTAL,
      priority: "P3",
      regression: false,
      preconditions: "Compliance page",
      actionSteps: "1) Observe \"Recent reminders\" section",
      expected: "Table columns Date/Subject/Recipient/Docs/Status render (empty state acceptable)",
    });
  });

  test("VCTR-SP-022 — Compliance thresholds match Admin config", { tag: '@regression' }, async ({ runCase }) => {
    await runCase({
      portal: PORTAL,
      suite: SUITE,
      tms: TMS,
      id: "VCTR-SP-022",
      title: "Compliance thresholds match Admin config",
      sequence: 4,
      total: TOTAL,
      priority: "P1",
      regression: true,
      preconditions: "Compliance tiles",
      actionSteps: "1) Compare \"Expiring Soon\" window to Admin Settings Compliance Thresholds",
      expected: "Same 30-day/7-day windows apply as Admin/Client Portal",
    });
  });
});
