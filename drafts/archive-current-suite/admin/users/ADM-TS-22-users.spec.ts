import { test } from '../../../../tests/fixtures/regression-test';

const PORTAL = "Admin Portal";
const SUITE = "ADM-TS-22 — Users";
const TMS = "https://govectora.atlassian.net/wiki/x/cwDE";
const TOTAL = 7;

test.describe.configure({ mode: 'serial' });

test.describe(SUITE, () => {

  test("VCTR-ADM-102 — Admin Users list & create form", { tag: '@regression' }, async ({ runCase }) => {
    await runCase({
      portal: PORTAL,
      suite: SUITE,
      tms: TMS,
      id: "VCTR-ADM-102",
      title: "Admin Users list & create form",
      sequence: 1,
      total: TOTAL,
      priority: "P1",
      regression: true,
      preconditions: "`/settings/users`",
      actionSteps: "1) Inspect list 2) Open Add (observe only)",
      expected: "Create fields: name, email, password, role; existing users editable, resettable, deletable",
    });
  });

  test("VCTR-ADM-103 — Admin user delete = permanent", async ({ runCase }) => {
    await runCase({
      portal: PORTAL,
      suite: SUITE,
      tms: TMS,
      id: "VCTR-ADM-103",
      title: "Admin user delete = permanent",
      sequence: 2,
      total: TOTAL,
      priority: "P2",
      regression: false,
      preconditions: "Add user form / docs",
      actionSteps: "1) Confirm delete copy language (do not delete a real account)",
      expected: "Delete is documented as permanently removing the Auth account (irreversible) — verify warning copy reflects this",
    });
  });

  test("VCTR-ADM-104 — Client Portal Users tab", async ({ runCase }) => {
    await runCase({
      portal: PORTAL,
      suite: SUITE,
      tms: TMS,
      id: "VCTR-ADM-104",
      title: "Client Portal Users tab",
      sequence: 3,
      total: TOTAL,
      priority: "P2",
      regression: false,
      preconditions: "`/settings/client-portal-users`",
      actionSteps: "1) Inspect list scoped per client",
      expected: "JWT app\\_metadata client\\_id scoping; create/revoke/reset controls present",
    });
  });

  test("VCTR-ADM-105 — Driver App Users tab", async ({ runCase }) => {
    await runCase({
      portal: PORTAL,
      suite: SUITE,
      tms: TMS,
      id: "VCTR-ADM-105",
      title: "Driver App Users tab",
      sequence: 4,
      total: TOTAL,
      priority: "P2",
      regression: false,
      preconditions: "`/settings/driver-app-users`",
      actionSteps: "1) Inspect list",
      expected: "Create/reset/revoke mobile access controls present, linked to driver record",
    });
  });

  test("VCTR-ADM-106 — Service Provider Portal Users — read-only roster here", async ({ runCase }) => {
    await runCase({
      portal: PORTAL,
      suite: SUITE,
      tms: TMS,
      id: "VCTR-ADM-106",
      title: "Service Provider Portal Users — read-only roster here",
      sequence: 5,
      total: TOTAL,
      priority: "P2",
      regression: false,
      preconditions: "`/settings/service-provider-portal-users`",
      actionSteps: "1) Inspect page",
      expected: "Roster is read-only; actual create/revoke/reset happens via Workforce → Service Providers → Edit → Portal Access",
    });
  });

  test("VCTR-ADM-107 — Guardian App Users — read-only roster here", async ({ runCase }) => {
    await runCase({
      portal: PORTAL,
      suite: SUITE,
      tms: TMS,
      id: "VCTR-ADM-107",
      title: "Guardian App Users — read-only roster here",
      sequence: 6,
      total: TOTAL,
      priority: "P2",
      regression: false,
      preconditions: "`/settings/guardian-app-users`",
      actionSteps: "1) Inspect page",
      expected: "Lists only guardians with `user_id` set; create/reset/revoke via Stakeholders → Guardians → Edit → Mobile App Access",
    });
  });

  test("VCTR-ADM-108 — User-management actions require super\\_admin", { tag: '@regression' }, async ({ runCase }) => {
    await runCase({
      portal: PORTAL,
      suite: SUITE,
      tms: TMS,
      id: "VCTR-ADM-108",
      title: "User-management actions require super\\_admin",
      sequence: 7,
      total: TOTAL,
      priority: "P1",
      regression: true,
      preconditions: "As non-super-admin (if available)",
      actionSteps: "1) Attempt to reach Users create/edit/delete actions",
      expected: "Blocked or hidden; edge functions documented as requiring `super_admin`",
    });
  });
});
