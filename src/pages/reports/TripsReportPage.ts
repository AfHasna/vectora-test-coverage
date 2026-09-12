import { expect, type Locator } from '@playwright/test';
import { BasePage } from '@pages/shared/BasePage';

/**
 * Reports → Trips.
 *
 * The report is fetched with POST /functions/v1/reports__trips. That is a read
 * served over POST, which the read-only guard allows by name; blocking it makes
 * the page show "Couldn't load this report" and look like a product bug.
 */
export class TripsReportPage extends BasePage {
  readonly path = '/reports/trips';
  readonly pageId = 'reports.trips';

  readonly periodSelect: Locator = this.page.getByRole('combobox').first();
  readonly comparisonSwitch: Locator = this.page.getByRole('switch', {
    name: /show comparison/i,
  });
  readonly loadError: Locator = this.page.getByText(/Couldn't load this report/i);

  override async expectLoaded(): Promise<void> {
    await this.expectHeading('Trips Report');
    await this.expectNoLoadError();
    await expect(this.page.getByText('Total Runs')).toBeVisible();
  }

  async expectNoLoadError(): Promise<void> {
    await expect(this.loadError).toHaveCount(0);
  }

  async expectMetrics(metrics: readonly string[]): Promise<void> {
    for (const metric of metrics) {
      await expect(this.page.getByText(metric, { exact: true }).first()).toBeVisible();
    }
  }

  async expectCharts(): Promise<void> {
    await this.expectHeading('Runs by status');
    await this.expectHeading('Runs by day');
  }

  currentPeriod(): Promise<string> {
    return this.periodSelect.innerText().then((text) => text.trim());
  }

  async selectPeriod(period: string): Promise<void> {
    await this.periodSelect.click();
    await this.page.getByRole('option', { name: period, exact: true }).click();
    await expect(this.periodSelect).toHaveText(period);
    await this.expectNoLoadError();
  }

  async toggleComparison(): Promise<void> {
    await expect(this.comparisonSwitch).toBeVisible();
    await this.comparisonSwitch.click();
    await this.expectNoLoadError();
  }
}
