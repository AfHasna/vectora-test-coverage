import { expect, type Locator } from '@playwright/test';
import { dashboardSummaries } from '@config/catalog';
import { BasePage } from '@pages/shared/BasePage';

/** Home — the operational and compliance summaries an admin lands on. */
export class HomePage extends BasePage {
  readonly path = '/';
  readonly pageId = 'dashboard';

  readonly accountMenu: Locator = this.page.getByRole('button', { name: 'Account menu' });
  readonly notificationBell: Locator = this.page.getByRole('button', { name: 'Notifications' });
  /** Cards show "Total" and the count in separate elements, so no space between them. */
  readonly cardTotals: Locator = this.page.getByText(/^Total\s*[\d,]+$/);
  readonly lastUpdated: Locator = this.page.getByText(/Updated .*ago|Updated less than/i);

  override async expectLoaded(): Promise<void> {
    await this.expectHeading('Home');
  }

  async expectWelcome(): Promise<void> {
    await this.expectHeading(/welcome back/i);
  }

  summaryCard(name: string): Locator {
    return this.page.getByRole('link', { name, exact: true });
  }

  statusLink(status: string): Locator {
    return this.page.getByRole('link', { name: new RegExp(`^${status}`) });
  }

  /** Every summary card links to the list it summarises. */
  async expectSummaryCardsLinkToTheirLists(): Promise<void> {
    for (const summary of dashboardSummaries) {
      await expect(this.summaryCard(summary.name), `${summary.name} card`).toHaveAttribute(
        'href',
        summary.href,
      );
    }
    expect(await this.cardTotals.count()).toBeGreaterThanOrEqual(dashboardSummaries.length);
  }

  async expectClientStatuses(statuses: readonly string[]): Promise<void> {
    for (const status of statuses) {
      await expect(this.statusLink(status)).toBeVisible();
    }
    await expect(this.cardTotals.first()).toBeVisible();
  }

  async expectTodaysOperations(tiles: readonly string[]): Promise<void> {
    await this.expectHeading("Today's Operations");
    for (const tile of tiles) {
      await expect(this.page.getByRole('button', { name: new RegExp(tile) })).toBeVisible();
    }
  }

  async expectTripCompletionTrend(): Promise<void> {
    await this.expectHeading('Trip Completion Trend');
    await expect(this.page.getByRole('application').first()).toBeVisible();
  }

  async expectComplianceSummary(): Promise<void> {
    await this.expectHeading('Compliance Summary');
    await expect(this.page.getByRole('button', { name: /Compliance Alerts/ })).toBeVisible();
    await expect(this.page.getByRole('button', { name: /Trips Needing Resolution/ })).toBeVisible();
  }

  async expectLastUpdated(): Promise<void> {
    await expect(this.lastUpdated.first()).toBeVisible();
  }

  async openNotifications(): Promise<void> {
    await this.notificationBell.click();
  }
}
