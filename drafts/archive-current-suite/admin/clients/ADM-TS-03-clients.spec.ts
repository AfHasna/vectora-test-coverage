import { test } from '../../../../tests/fixtures/regression-test';

const PORTAL = "Admin Portal";
const SUITE = "ADM-TS-03 — Clients";
const TMS = "https://govectora.atlassian.net/wiki/x/cwDE";
const TOTAL = 8;

test.describe.configure({ mode: 'serial' });

test.describe(SUITE, () => {

  test("VCTR-ADM-018 — Clients list loads with filters", { tag: '@regression' }, async ({ runCase }) => {
    await runCase({
      portal: PORTAL,
      suite: SUITE,
      tms: TMS,
      id: "VCTR-ADM-018",
      title: "Clients list loads with filters",
      sequence: 1,
      total: TOTAL,
      priority: "P1",
      regression: true,
      preconditions: "`/stakeholders/clients`",
      actionSteps: "1) Open list 2) Filter by each status (Contracted/Vendor Listed/Backup Listed/Prospect/Draft)",
      expected: "List filters correctly; counts match Dashboard card",
    });
  });

  test("VCTR-ADM-019 — Client 2-tab Add form structure", { tag: '@regression' }, async ({ runCase }) => {
    await runCase({
      portal: PORTAL,
      suite: SUITE,
      tms: TMS,
      id: "VCTR-ADM-019",
      title: "Client 2-tab Add form structure",
      sequence: 2,
      total: TOTAL,
      priority: "P1",
      regression: true,
      preconditions: "`/stakeholders/clients/add` (observe only, do not save)",
      actionSteps: "1) Open Add Client 2) Inspect tabs",
      expected: "Tab 1 Basic Info & Contacts (name, email, type from Reference Data, contacts w/ extension, addresses); Tab 2 Contracts & Pricing (8 fee fields) present",
    });
  });

  test("VCTR-ADM-020 — Client View — Portal Access tab (Edit mode only)", async ({ runCase }) => {
    await runCase({
      portal: PORTAL,
      suite: SUITE,
      tms: TMS,
      id: "VCTR-ADM-020",
      title: "Client View — Portal Access tab (Edit mode only)",
      sequence: 3,
      total: TOTAL,
      priority: "P2",
      regression: false,
      preconditions: "Open an existing client in Edit",
      actionSteps: "1) Go to Portal Access tab",
      expected: "Lists existing client portal users (name/email/role badge/creation date, Active/Not Activated badge); Create/Reset/Revoke controls visible per permission",
    });
  });

  test("VCTR-ADM-021 — Admin email guard on portal accounts", async ({ runCase }) => {
    await runCase({
      portal: PORTAL,
      suite: SUITE,
      tms: TMS,
      id: "VCTR-ADM-021",
      title: "Admin email guard on portal accounts",
      sequence: 4,
      total: TOTAL,
      priority: "P2",
      regression: false,
      preconditions: "Portal Access tab",
      actionSteps: "1) Attempt to create a portal user with a known staff/admin email (do not submit)",
      expected: "Validation should block staff/admin emails — verify client-side validation message appears (cancel before submit)",
    });
  });

  test("VCTR-ADM-022 — Client Archive pre-flight (observe only)", { tag: '@regression' }, async ({ runCase }) => {
    await runCase({
      portal: PORTAL,
      suite: SUITE,
      tms: TMS,
      id: "VCTR-ADM-022",
      title: "Client Archive pre-flight (observe only)",
      sequence: 5,
      total: TOTAL,
      priority: "P1",
      regression: true,
      preconditions: "Existing client with linked places/passengers",
      actionSteps: "1) Open Archive action 2) Observe dialog — **do not confirm**",
      expected: "Linked Records dialog lists dependent Places/Passengers/etc.; primary button reads exactly \"Archive\" (amber); critical items require checkbox before button enables",
    });
  });

  test("VCTR-ADM-023 — Status History audit log visible", async ({ runCase }) => {
    await runCase({
      portal: PORTAL,
      suite: SUITE,
      tms: TMS,
      id: "VCTR-ADM-023",
      title: "Status History audit log visible",
      sequence: 6,
      total: TOTAL,
      priority: "P2",
      regression: false,
      preconditions: "Existing client View panel",
      actionSteps: "1) Scroll to Status History section",
      expected: "Old→new status entries with user + timestamp are listed; \"Show more/less\" toggle works",
    });
  });

  test("VCTR-ADM-024 — Table export controls", async ({ runCase }) => {
    await runCase({
      portal: PORTAL,
      suite: SUITE,
      tms: TMS,
      id: "VCTR-ADM-024",
      title: "Table export controls",
      sequence: 7,
      total: TOTAL,
      priority: "P3",
      regression: false,
      preconditions: "Clients list",
      actionSteps: "1) Trigger Excel export 2) Trigger PDF export (or verify buttons present/enabled)",
      expected: "Export controls present and enabled per permission; file-generation triggers without error",
    });
  });

  test("VCTR-ADM-025 — Pagination defaults", async ({ runCase }) => {
    await runCase({
      portal: PORTAL,
      suite: SUITE,
      tms: TMS,
      id: "VCTR-ADM-025",
      title: "Pagination defaults",
      sequence: 8,
      total: TOTAL,
      priority: "P2",
      regression: false,
      preconditions: "Clients list with \\>10 records",
      actionSteps: "1) Observe default page size 2) Change to 25/50/100",
      expected: "Default is 10; row numbering persists across pages; \"Showing X-Y of Z\" updates correctly",
    });
  });
});
