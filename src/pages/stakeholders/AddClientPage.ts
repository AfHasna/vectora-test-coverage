import { expect, type Locator } from '@playwright/test';
import { clientFormTabs } from '@config/catalog';
import { BasePage } from '@pages/shared/BasePage';

/**
 * The Add New Client form.
 *
 * On production this form is only ever read: it has no method that fills a
 * field or submits, so a spec cannot create a client through it. Saving a
 * client belongs to the staging suite.
 */
export class AddClientPage extends BasePage {
  readonly path = '/stakeholders/clients/add';
  readonly pageId = 'stakeholders.clients.add';

  readonly backToClients: Locator = this.page.getByRole('button', { name: 'Back to Clients' });

  override async expectLoaded(): Promise<void> {
    await expect(this.page).toHaveURL(/\/stakeholders\/clients\/add$/);
    await this.expectHeading('Add New Client');
  }

  /** The three documented sections, in tab-strip order. */
  async expectSections(): Promise<void> {
    await this.expectTabs(clientFormTabs);
    for (const name of clientFormTabs) {
      await expect(this.page.getByRole('tab', { name })).toBeVisible();
    }
  }

  async expectOpensOnBasicInfo(): Promise<void> {
    await this.expectTabActive(clientFormTabs[0]);
    await this.expectHeading('Basic Information');
  }

  /** Leaves the form the only safe way: without saving. */
  async leaveWithoutSaving(): Promise<void> {
    await this.backToClients.click();
  }
}
