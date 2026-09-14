import { test } from '../../fixtures/regression-test';

const PORTAL = "Admin Portal";
const SUITE = "ADM-TS-24 — Notifications";
const TMS = "https://govectora.atlassian.net/wiki/x/cwDE";
const TOTAL = 4;

test.describe.configure({ mode: 'serial' });

test.describe(SUITE, () => {

  test("VCTR-ADM-111 — Notification bell + full history page", async ({ runCase }) => {
    await runCase({
      portal: PORTAL,
      suite: SUITE,
      tms: TMS,
      id: "VCTR-ADM-111",
      title: "Notification bell + full history page",
      sequence: 1,
      total: TOTAL,
      priority: "P2",
      regression: false,
      preconditions: "Header bell icon",
      actionSteps: "1) Open bell popover 2) Click \"View all notifications\"",
      expected: "`/notifications` loads full history with FilterCard (Category/Priority/Status/Date Range)",
    });
  });

  test("VCTR-ADM-112 — Personal scoping (RLS)", async ({ runCase }) => {
    await runCase({
      portal: PORTAL,
      suite: SUITE,
      tms: TMS,
      id: "VCTR-ADM-112",
      title: "Personal scoping (RLS)",
      sequence: 2,
      total: TOTAL,
      priority: "P2",
      regression: false,
      preconditions: "Any user",
      actionSteps: "1) Compare visible notifications to the logged-in user",
      expected: "Only this user's notifications are shown; no permission gating beyond identity",
    });
  });

  test("VCTR-ADM-113 — Mark all as read", async ({ runCase }) => {
    await runCase({
      portal: PORTAL,
      suite: SUITE,
      tms: TMS,
      id: "VCTR-ADM-113",
      title: "Mark all as read",
      sequence: 3,
      total: TOTAL,
      priority: "P3",
      regression: false,
      preconditions: "Notifications page with unread items",
      actionSteps: "1) Click bulk \"Mark all as read\"",
      expected: "Unread highlighting clears for all listed items",
    });
  });

  test("VCTR-ADM-114 — Click-through to related entity", async ({ runCase }) => {
    await runCase({
      portal: PORTAL,
      suite: SUITE,
      tms: TMS,
      id: "VCTR-ADM-114",
      title: "Click-through to related entity",
      sequence: 4,
      total: TOTAL,
      priority: "P2",
      regression: false,
      preconditions: "An unread notification (e.g. compliance alert)",
      actionSteps: "1) Click the notification",
      expected: "Navigates to the related entity (driver/vehicle/route)",
    });
  });
});
