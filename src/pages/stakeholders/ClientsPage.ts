import { expect, type Locator } from '@playwright/test';
import { BasePage } from '@pages/shared/BasePage';

/** Stakeholder Management → Clients. */
export class ClientsPage extends BasePage {
  readonly path = '/stakeholders/clients';
  readonly pageId = 'stakeholders.clients';

  readonly addClientButton: Locator = this.page.getByRole('button', { name: 'Add Client' });

  override async expectLoaded(): Promise<void> {
    await this.expectHeading('Clients');
  }

  async expectListReady(): Promise<void> {
    await this.table.expectVisible();
    await expect(this.table.recordTotal).toBeVisible();
  }

  /** Opens the list filtered by status, the way the dashboard cards link to it. */
  async openWithStatus(status: string): Promise<boolean> {
    return this.open(`${this.path}?status=${status}`);
  }

  async openAddClientForm(): Promise<void> {
    await this.addClientButton.click();
  }
}
