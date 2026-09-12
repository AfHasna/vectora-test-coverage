import { expect, type Locator } from '@playwright/test';
import { fleetTabs } from '@config/catalog';
import { BasePage } from '@pages/shared/BasePage';

/**
 * Fleet Management → Assignment History, the driver-vehicle audit trail.
 * Filtering and grouping are queries, so everything here is a read.
 */
export class AssignmentHistoryPage extends BasePage {
  readonly path = '/vehicles/assignment-history';
  readonly pageId = 'vehicles.assignment-history';

  readonly vehicleFilter: Locator = this.page
    .getByRole('combobox')
    .filter({ hasText: 'All Vehicles' });
  readonly driverFilter: Locator = this.page
    .getByRole('combobox')
    .filter({ hasText: 'All Drivers' });
  readonly applyFilter: Locator = this.page.getByRole('button', { name: 'Filter', exact: true });
  readonly resetFilter: Locator = this.page.getByRole('button', { name: 'Reset Filter' });
  readonly groupBy: Locator = this.page
    .getByRole('combobox')
    .filter({ hasText: /^(Day|Week|Month)$/ })
    .first();

  override async expectLoaded(): Promise<void> {
    await this.expectHeading('Assignment History');
    await this.expectTabs(fleetTabs.map((tab) => tab.name));
    await this.table.expectVisible();
  }

  async expectFilterOptions(): Promise<void> {
    await expect(this.vehicleFilter).toBeVisible();
    await expect(this.driverFilter).toBeVisible();
    await expect(this.applyFilter).toBeVisible();
    await expect(this.resetFilter).toBeVisible();
  }

  async groupResultsBy(grouping: 'Day' | 'Week' | 'Month'): Promise<void> {
    await this.groupBy.click();
    await this.page.getByRole('option', { name: grouping, exact: true }).click();
    await expect(this.groupBy).toHaveText(grouping);
    await this.table.expectVisible();
  }

  /** Picks the first real vehicle in the list and applies it. Returns its label. */
  async filterToFirstVehicle(): Promise<string> {
    await this.vehicleFilter.click();
    const option = this.page.getByRole('option').filter({ hasNotText: 'All Vehicles' }).first();
    const label = (await option.innerText()).trim();
    await option.click();
    await this.applyFilter.click();
    await expect(this.page.getByRole('combobox').filter({ hasText: label }).first()).toBeVisible();
    return label;
  }

  async resetFilters(): Promise<void> {
    // Reset only becomes enabled once a filter is actually applied.
    await expect(this.resetFilter).toBeEnabled();
    await this.resetFilter.click();
    await expect(this.vehicleFilter).toBeVisible();
    await this.table.expectVisible();
  }
}
