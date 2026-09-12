import { expect, type Locator } from '@playwright/test';
import { BasePage } from '@pages/shared/BasePage';

/**
 * Settings → General.
 *
 * Sections are collapsible; opening one is a read. There is no method that
 * edits a value or saves, because that belongs to the staging suite.
 */
export class GeneralSettingsPage extends BasePage {
  readonly path = '/settings/general';
  readonly pageId = 'settings.general';

  readonly saveChanges: Locator = this.page.getByRole('button', { name: 'Save Changes' });

  override async expectLoaded(): Promise<void> {
    await this.expectHeading('General Settings');
    await this.expectTabActive('General');
  }

  section(name: string): Locator {
    return this.page.getByRole('button', { name, exact: true });
  }

  async openSection(name: string): Promise<void> {
    const heading = this.section(name);
    await expect(heading).toBeVisible();
    await heading.click();
  }

  /** Save Changes is reachable but must never be clicked on production. */
  async expectSaveAvailableButUnused(): Promise<void> {
    await expect(this.saveChanges).toBeVisible();
  }
}
