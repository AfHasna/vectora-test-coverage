import { expect, type Locator } from '@playwright/test';
import { BasePage } from '@pages/shared/BasePage';

/**
 * The notification history page and the bell popover that leads to it.
 *
 * Two actions are writes and so are only checked for being present: opening a
 * notification marks it read, and "Mark all as read" is a bulk update.
 */
export class NotificationsPage extends BasePage {
  readonly path = '/notifications';
  readonly pageId = 'notifications';

  readonly viewAll: Locator = this.page
    .getByRole('button', { name: /view all/i })
    .or(this.page.getByRole('link', { name: /view all/i }))
    .first();
  readonly markAllAsRead: Locator = this.page.getByRole('button', {
    name: /mark all as read/i,
  });

  override async expectLoaded(): Promise<void> {
    await expect(this.page).toHaveURL(/\/notifications$/);
    await this.expectHeading('Notifications');
  }

  async expectPopoverOpen(): Promise<void> {
    await expect(this.viewAll).toBeVisible();
  }

  async openFullHistory(): Promise<void> {
    await this.viewAll.click();
    await this.expectLoaded();
  }

  async expectNotificationsListed(): Promise<void> {
    await expect(this.page.getByText(/ago$|\w+ \d+, \d{4}/).first()).toBeVisible();
    await this.expectHeading(/push delivery health/i);
  }

  async openFilters(): Promise<void> {
    await this.table.openFilters();
    await expect(this.page.getByRole('combobox').first()).toBeVisible();
  }

  /** Pagination is available and the bulk write is left alone. */
  async expectPaginationAndUntouchedBulkAction(): Promise<void> {
    await expect(this.table.previousPage).toBeVisible();
    await expect(this.markAllAsRead).toBeVisible();
  }
}
