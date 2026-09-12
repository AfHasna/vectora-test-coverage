import { expect } from '@playwright/test';
import { tripTabs } from '@config/catalog';
import { BasePage } from '@pages/shared/BasePage';

/**
 * Service Operations trips, across the Active, Future and History tabs.
 *
 * Trip volume follows the live service calendar, so the assertions check that
 * each view loads and identifies itself rather than requiring rows: on a
 * holiday, Active Trips legitimately shows none.
 */
export class TripsPage extends BasePage {
  readonly path = tripTabs[0].href;
  readonly pageId = 'service-operations.active-trips';

  override async expectLoaded(): Promise<void> {
    await this.expectHeading(/Active Trips List For/i);
    await this.expectTabActive('Active');
  }

  async expectTripsOrEmptyState(): Promise<void> {
    await this.table.expectRowsOrEmptyState(/no active trips|on holiday/i);
  }

  async openFutureTrips(): Promise<void> {
    await this.openTab('Future');
    await expect(this.page).toHaveURL(new RegExp(`${tripTabs[1].href}$`));
    await this.expectHeading(/Future Trips/i);
    await this.table.expectVisible();
  }

  /** Dispatch belongs to the Active view; Future must not offer it. */
  async expectNoDispatchActions(): Promise<void> {
    await expect(
      this.page.getByRole('button', { name: /^(dispatch|start trip|complete)/i }),
    ).toHaveCount(0);
  }

  async openTripsHistory(): Promise<void> {
    await this.openTab('History');
    await expect(this.page).toHaveURL(new RegExp(`${tripTabs[2].href}$`));
    await this.expectHeading('Trips History');
    await this.table.expectRowsOrEmptyState(/no .*trips/i);
  }
}
