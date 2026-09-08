import { test, expect } from '../fixtures';
import { annotateCase } from '../helpers/reporting';
import { proofStep } from '../helpers/steps';

/**
 * TC-VEC-030 — notification history and navigation.
 *
 * Two manual steps are deliberately left out on production: opening a
 * notification marks it read, and "Mark all as read" is a bulk write. Both are
 * verified as present and reachable instead of being clicked.
 */
test.describe('Happy path - Notifications', () => {
  test('TC-VEC-030 Verify Notifications', async ({ page }, testInfo) => {
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
        await page.goto('/');
        if (/sign-in/i.test(page.url())) {
          test.skip(true, 'Admin session missing.');
        }
        await page.getByRole('button', { name: 'Notifications' }).click();
        await expect(
          page.getByRole('button', { name: /view all/i }).or(page.getByRole('link', { name: /view all/i })).first(),
        ).toBeVisible();
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
        await page
          .getByRole('button', { name: /view all/i })
          .or(page.getByRole('link', { name: /view all/i }))
          .first()
          .click();
        await expect(page).toHaveURL(/\/notifications$/);
        await expect(page.getByRole('heading', { name: 'Notifications' }).first()).toBeVisible();
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
        const items = page.getByText(/ago$|Sep \d+, \d{4}/).first();
        await expect(items).toBeVisible();
        await expect(page.getByRole('heading', { name: /push delivery health/i })).toBeVisible();
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
        await page.getByRole('button', { name: 'Filters' }).first().click();
        await expect(page.getByRole('combobox').first()).toBeVisible();
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
        await expect(page.getByRole('button', { name: /previous/i }).first()).toBeVisible();
        await expect(page.getByRole('button', { name: /mark all as read/i })).toBeVisible();
      },
    );
  });
});
