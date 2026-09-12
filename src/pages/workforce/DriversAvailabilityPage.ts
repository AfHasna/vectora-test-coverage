import { expect, type Locator } from '@playwright/test';
import { BasePage } from '@pages/shared/BasePage';

/**
 * Workforce Management → Drivers Availability.
 *
 * The page navigates by date rather than by week: a MM/DD/YYYY field with
 * 1 day and 7 days views. The summary tiles are filter buttons whose
 * accessible names describe the filter, with the counts as inner text. The
 * per-row "Change driver on ..." buttons are writes and are not exposed here.
 */
export class DriversAvailabilityPage extends BasePage {
  readonly path = '/workforce/drivers-availability';
  readonly pageId = 'workforce.drivers-availability';

  readonly dateField: Locator = this.page.getByRole('textbox', { name: 'MM/DD/YYYY' });
  readonly allDriversTile: Locator = this.page.getByRole('button', {
    name: 'Show all drivers (clear filters)',
  });
  readonly availableTile: Locator = this.page.getByRole('button', {
    name: 'Filter to available drivers only',
  });
  readonly timeOffTile: Locator = this.page.getByRole('button', {
    name: 'Filter to drivers with time off',
  });

  override async expectLoaded(): Promise<void> {
    await this.expectHeading('Drivers Availability');
    await this.expectTabActive('Drivers Availability');
    await expect(this.dateField).toBeVisible();
  }

  currentDate(): Promise<string> {
    return this.dateField.inputValue();
  }

  async showSevenDays(): Promise<void> {
    await this.page.getByRole('button', { name: '7 days' }).click();
  }

  async expectSummaryTotals(): Promise<void> {
    await expect(this.allDriversTile).toContainText(/Total Drivers\s*\d+/);
    await expect(this.availableTile).toContainText(/Available\s*\d+/);
    await expect(this.timeOffTile).toContainText(/Unavailable\s*\d+/);
  }

  async goToDate(date: string): Promise<void> {
    await this.dateField.fill(date);
    await this.dateField.press('Enter');
    await expect(this.dateField).toHaveValue(date);
  }

  /** MM/DD/YYYY, the format the date field expects. */
  static shiftDate(from: string, days: number): string {
    const date = new Date(from);
    date.setDate(date.getDate() + days);
    return [
      String(date.getMonth() + 1).padStart(2, '0'),
      String(date.getDate()).padStart(2, '0'),
      date.getFullYear(),
    ].join('/');
  }

  async filterToAvailable(): Promise<void> {
    await this.availableTile.click();
    await expect(this.availableTile).toContainText(/Available\s*\d+/);
  }

  async clearFilters(): Promise<void> {
    await this.allDriversTile.click();
    await expect(this.allDriversTile).toContainText(/Total Drivers\s*\d+/);
  }

  /** Assigned cells name their route sheet, e.g. RSO-1042. */
  async expectAssignedCellNamesRoute(): Promise<void> {
    await expect(this.page.getByRole('button', { name: /^RS[OR]-\d+$/ }).first()).toBeVisible();
  }
}
