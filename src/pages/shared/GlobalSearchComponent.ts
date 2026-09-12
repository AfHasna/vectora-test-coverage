import { expect, type Locator, type Page } from '@playwright/test';

/**
 * The global search dialog in the top bar.
 *
 * It also lists Quick Actions such as "Add New Client". Those create records,
 * so this component exposes no way to select one.
 */
export class GlobalSearchComponent {
  readonly dialog: Locator;
  readonly input: Locator;

  constructor(private readonly page: Page) {
    this.dialog = page.getByRole('dialog');
    this.input = this.dialog.getByRole('combobox');
  }

  async open(): Promise<void> {
    await this.page
      .getByRole('button', { name: /Search/ })
      .first()
      .click();
    await expect(this.dialog).toBeVisible();
    await expect(this.input).toBeVisible();
  }

  async expectSuggestions(): Promise<void> {
    await expect(this.dialog.getByRole('listbox')).toBeVisible();
  }

  async search(term: string): Promise<void> {
    await this.input.fill(term);
  }

  /** Results are grouped by entity type: Clients, Passengers, Vehicles, ... */
  group(entity: string): Locator {
    return this.dialog.getByRole('group', { name: entity });
  }

  async expectGroup(entity: string): Promise<void> {
    await expect(this.group(entity)).toBeVisible();
  }

  async expectResult(name: RegExp): Promise<void> {
    await expect(this.dialog.getByRole('option', { name }).first()).toBeVisible();
  }

  async selectResult(entity: string, name: RegExp): Promise<void> {
    await this.group(entity).getByRole('option', { name }).first().click();
  }

  async close(): Promise<void> {
    await this.page.keyboard.press('Escape');
    await expect(this.dialog).toHaveCount(0);
  }
}
