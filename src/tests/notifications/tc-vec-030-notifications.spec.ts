import { MODULE, READ_ONLY, SUITE } from '@config/test-tags';
import { requireSession, test } from '@fixtures/pages.fixture';
import { annotateCase } from '@utils/reporting';
import { proofStep } from '@utils/steps';

/**
 * TC-VEC-030 — notification history and navigation.
 *
 * Two manual steps are deliberately left out on production: opening a
 * notification marks it read, and "Mark all as read" is a bulk write. Both are
 * verified as present and reachable instead of being clicked.
 */
test.describe('Happy path - Notifications', () => {
  test(
    'TC-VEC-030 Verify Notifications',
    { tag: [SUITE.regression, MODULE.notifications, READ_ONLY] },
    async ({ page, home, notifications }, testInfo) => {
      await annotateCase(
        'TC-VEC-030',
        'Opening a notification marks it read, so on production the list, filters and pagination are verified without clicking an item; "Mark all as read" is never clicked.',
      );

      await proofStep(
        page,
        testInfo,
        {
          action: 'Click the notification bell',
          expected: 'the notification popover opens for the signed-in user',
        },
        async () => {
          requireSession(await home.open());
          await home.openNotifications();
          await notifications.expectPopoverOpen();
        },
      );

      await proofStep(
        page,
        testInfo,
        {
          action: 'Click View All Notifications',
          expected: 'the full notification history page opens',
        },
        async () => {
          await notifications.openFullHistory();
        },
      );

      await proofStep(
        page,
        testInfo,
        {
          action: 'Review the notification list',
          expected: 'notifications are listed with their age and date',
        },
        async () => {
          await notifications.expectNotificationsListed();
        },
      );

      await proofStep(
        page,
        testInfo,
        {
          action: 'Open the filters',
          expected: 'category, priority, status and date filters are offered',
        },
        async () => {
          await notifications.openFilters();
        },
      );

      await proofStep(
        page,
        testInfo,
        {
          action: 'Check pagination and that no write action is used',
          expected: 'pagination is available and "Mark all as read" is left untouched',
        },
        async () => {
          await notifications.expectPaginationAndUntouchedBulkAction();
        },
      );
    },
  );
});
