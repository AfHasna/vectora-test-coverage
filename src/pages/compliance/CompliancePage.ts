import { expect, type Locator } from '@playwright/test';
import { complianceTabs } from '@config/catalog';
import { BasePage } from '@pages/shared/BasePage';

/**
 * Compliance Management, which serves all four entity tabs from one screen:
 * drivers, vehicles, monitors and service providers.
 *
 * Every row offers a Compliance Details action that opens a dialog. The
 * sections inside differ per entity (documents, insurance, registration,
 * inspections), so the shared assertion is that the dialog details the record.
 */
export class CompliancePage extends BasePage {
  readonly path = '/compliance/drivers';
  readonly pageId = 'compliance.driver';

  readonly dialog: Locator = this.page.getByRole('dialog');

  override async expectLoaded(): Promise<void> {
    await this.expectHeading('Compliance Management');
    await this.table.expectVisible();
  }

  async openTabPage(href: string): Promise<boolean> {
    return this.open(href);
  }

  async expectAllTabs(): Promise<void> {
    await this.expectTabs(complianceTabs.map((tab) => tab.name));
  }

  /** The record's name, read from the second column of a row. */
  async recordName(index = 0): Promise<string> {
    const row = this.table.row(index);
    await expect(row).toBeVisible();
    const name = (await row.locator('td').nth(1).innerText()).trim().split('\n')[0] ?? '';
    expect(name.length).toBeGreaterThan(0);
    return name;
  }

  async openComplianceDetails(index = 0): Promise<void> {
    await this.table.openRowAction(/compliance details/i, index);
    await expect(this.dialog).toBeVisible();
    await expect(this.dialog.getByRole('heading', { name: /Compliance Details/i })).toBeVisible();
  }

  async expectDriverDetails(driverName: string): Promise<void> {
    await expect(this.dialog.getByRole('heading', { name: 'Background Checks' })).toBeVisible();
    await expect(this.dialog.getByRole('heading', { name: 'Documents' })).toBeVisible();
    await expect(
      this.dialog.getByRole('heading', { name: new RegExp(driverName, 'i') }),
    ).toBeVisible();
  }

  /** Entity types list different sections, so this only requires that some exist. */
  async expectRequirementSections(): Promise<void> {
    expect(await this.dialog.getByRole('heading').count()).toBeGreaterThan(1);
  }

  /** The name in a row opens that record's own profile dialog. */
  async openRecordProfile(name: string, index = 0): Promise<void> {
    await this.table.row(index).getByRole('button', { name }).click();
  }
}
