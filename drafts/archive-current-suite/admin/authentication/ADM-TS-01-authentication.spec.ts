import { test } from '../../../../tests/fixtures/regression-test';

const PORTAL = "Admin Portal";
const SUITE = "ADM-TS-01 — Authentication";
const TMS = "https://govectora.atlassian.net/wiki/x/cwDE";
const TOTAL = 9;

test.describe.configure({ mode: 'serial' });
test.use({ storageState: { cookies: [], origins: [] } });

test.describe(SUITE, () => {

  test("VCTR-ADM-001 — Valid login + OTP succeeds", { tag: '@regression' }, async ({ runCase }) => {
    await runCase({
      portal: PORTAL,
      suite: SUITE,
      tms: TMS,
      id: "VCTR-ADM-001",
      title: "Valid login + OTP succeeds",
      sequence: 1,
      total: TOTAL,
      priority: "P1",
      regression: true,
      preconditions: "Logged out",
      actionSteps: "1) Go to admin.govectora.com 2) Enter valid email/password 3) Submit 4) Enter valid 6-digit OTP 5) Submit",
      expected: "User lands on Dashboard (`/`); sidebar with 9 sections visible",
    });
  });

  test("VCTR-ADM-002 — Invalid password rejected", { tag: '@regression' }, async ({ runCase }) => {
    await runCase({
      portal: PORTAL,
      suite: SUITE,
      tms: TMS,
      id: "VCTR-ADM-002",
      title: "Invalid password rejected",
      sequence: 2,
      total: TOTAL,
      priority: "P1",
      regression: true,
      preconditions: "Logged out",
      actionSteps: "1) Enter valid email + wrong password 2) Submit",
      expected: "Inline error shown; user remains on login screen; no OTP step reached",
    });
  });

  test("VCTR-ADM-003 — Invalid/expired OTP rejected", async ({ runCase }) => {
    await runCase({
      portal: PORTAL,
      suite: SUITE,
      tms: TMS,
      id: "VCTR-ADM-003",
      title: "Invalid/expired OTP rejected",
      sequence: 3,
      total: TOTAL,
      priority: "P2",
      regression: false,
      preconditions: "At OTP screen",
      actionSteps: "1) Enter incorrect 6-digit code 2) Submit",
      expected: "Error shown; user not granted access; \"Resend\" control available with cooldown",
    });
  });

  test("VCTR-ADM-004 — Session sign-out", { tag: '@regression' }, async ({ runCase }) => {
    await runCase({
      portal: PORTAL,
      suite: SUITE,
      tms: TMS,
      id: "VCTR-ADM-004",
      title: "Session sign-out",
      sequence: 4,
      total: TOTAL,
      priority: "P1",
      regression: true,
      preconditions: "Logged in",
      actionSteps: "1) Open account menu 2) Sign out",
      expected: "Redirected to login screen; protected routes no longer reachable without re-auth",
    });
  });

  test("VCTR-ADM-005 — Edit Profile — cannot change role/email", async ({ runCase }) => {
    await runCase({
      portal: PORTAL,
      suite: SUITE,
      tms: TMS,
      id: "VCTR-ADM-005",
      title: "Edit Profile — cannot change role/email",
      sequence: 5,
      total: TOTAL,
      priority: "P2",
      regression: false,
      preconditions: "Logged in",
      actionSteps: "1) Go to `/edit-profile` 2) Inspect form fields",
      expected: "Only first name, last name, phone, gender, avatar are editable; no role or email field present",
    });
  });

  test("VCTR-ADM-006 — RBAC — sidebar filters by permission", { tag: '@regression' }, async ({ runCase }) => {
    await runCase({
      portal: PORTAL,
      suite: SUITE,
      tms: TMS,
      id: "VCTR-ADM-006",
      title: "RBAC — sidebar filters by permission",
      sequence: 6,
      total: TOTAL,
      priority: "P1",
      regression: true,
      preconditions: "Logged in as a restricted role (if available) or Super Admin for baseline",
      actionSteps: "1) Compare visible sidebar sections against the role's PermissionsMatrix (Settings→User Roles)",
      expected: "Only modules with `view` permission for that role appear in the sidebar (AdminSidebar filtering)",
    });
  });

  test("VCTR-ADM-007 — RBAC — action buttons gated", { tag: '@regression' }, async ({ runCase }) => {
    await runCase({
      portal: PORTAL,
      suite: SUITE,
      tms: TMS,
      id: "VCTR-ADM-007",
      title: "RBAC — action buttons gated",
      sequence: 7,
      total: TOTAL,
      priority: "P1",
      regression: true,
      preconditions: "Any list module (e.g. Clients)",
      actionSteps: "1) As a role without `create`/`edit`/`archive` on that module, open the list",
      expected: "Add/Edit/Archive controls are hidden or disabled (PermissionGate); as Super Admin same controls are visible",
    });
  });

  test("VCTR-ADM-008 — Super Admin cannot be archived", async ({ runCase }) => {
    await runCase({
      portal: PORTAL,
      suite: SUITE,
      tms: TMS,
      id: "VCTR-ADM-008",
      title: "Super Admin cannot be archived",
      sequence: 8,
      total: TOTAL,
      priority: "P2",
      regression: false,
      preconditions: "Settings → User Roles",
      actionSteps: "1) Open Super Admin role",
      expected: "Archive/Delete controls are absent or disabled for the Super Admin system role",
    });
  });

  test("VCTR-ADM-009 — Custom role Add/Edit screen loads", async ({ runCase }) => {
    await runCase({
      portal: PORTAL,
      suite: SUITE,
      tms: TMS,
      id: "VCTR-ADM-009",
      title: "Custom role Add/Edit screen loads",
      sequence: 9,
      total: TOTAL,
      priority: "P2",
      regression: false,
      preconditions: "Settings → User Roles",
      actionSteps: "1) Go to `/user-roles/add` 2) Observe PermissionsMatrix",
      expected: "Matrix renders per-module View/Create/Edit/Archive checkboxes matching documented module groups",
    });
  });
});
