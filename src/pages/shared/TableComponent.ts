import { expect, type Locator, type Page } from '@playwright/test';

/**
 * The list table used by every module: sortable headers, a row action menu, a
 * column chooser, a page-size select and a "Showing 1-10 of 42 items" summary.
 *
 * Only reads live here. Row actions that write (archive, restore, delete) are
 * deliberately absent so a spec cannot reach them by accident.
 */
export class TableComponent {
  readonly root: Locator;
  readonly rows: Locator;
  readonly recordTotal: Locator;
  readonly nextPage: Locator;
  readonly previousPage: Locator;
  readonly filtersButton: Locator;
  readonly columnsButton: Locator;

  constructor(private readonly page: Page) {
    // Some screens render one table per group, so the component works on the first.
    this.root = page.getByRole('table').first();
    this.rows = page.locator('tbody tr');
    this.recordTotal = page.getByText(/Showing \d+-\d+ of \d+ items/);
    this.nextPage = page.getByRole('button', { name: 'Go to next page' });
    this.previousPage = page.getByRole('button', { name: /previous/i }).first();
    this.filtersButton = page.getByRole('button', { name: 'Filters' }).first();
    this.columnsButton = page.getByRole('button', { name: 'Columns' });
  }

  async expectVisible(): Promise<void> {
    await expect(this.root).toBeVisible();
  }

  /** Passes when rows are listed or the screen explains why there are none. */
  async expectRowsOrEmptyState(emptyState: RegExp): Promise<void> {
    await expect(this.root.or(this.page.getByText(emptyState).first()).first()).toBeVisible();
  }

  async expectHasRows(): Promise<void> {
    await expect(this.rows.first()).toBeVisible();
    expect(await this.rows.count()).toBeGreaterThan(0);
  }

  row(index = 0): Locator {
    return this.rows.nth(index);
  }

  /** Text of a row, used to detect that sorting reordered the list. */
  async rowText(index = 0): Promise<string> {
    return (await this.row(index).innerText()).trim();
  }

  /**
   * Reverses the sort on a column and waits for the first row to change.
   *
   * Lists arrive already sorted ascending by their main column, so the first
   * click is a no-op there; two clicks guarantee a visible change.
   */
  async reverseSortBy(column: string): Promise<void> {
    const header = this.page.getByRole('columnheader', { name: column });
    const before = await this.rowText();

    await header.click();
    await header.click();

    await expect
      .poll(() => this.rowText(), {
        message: `reversing the sort on ${column} should reorder the rows`,
        timeout: 10_000,
      })
      .not.toBe(before);
  }

  async openFilters(): Promise<void> {
    await this.filtersButton.click();
  }

  async setPageSize(size: '10' | '25' | '50'): Promise<void> {
    await this.page
      .getByRole('combobox')
      .filter({ hasText: /^(10|25|50)$/ })
      .first()
      .click();
    await this.page.getByRole('option', { name: size, exact: true }).click();
    // Changing the page size sends the reader back to the first page.
    await expect(this.recordTotal).toHaveText(/Showing 1-\d+ of \d+ items/);
  }

  async expectRowsNumberedFromOne(): Promise<void> {
    await expect(this.row().locator('td').first()).toHaveText('1');
  }

  async openColumnChooser(): Promise<void> {
    await this.columnsButton.click();
    await expect(
      this.page.getByRole('menuitem').or(this.page.getByRole('menuitemcheckbox')).first(),
    ).toBeVisible();
  }

  /** Opens a row's action menu and picks an item, e.g. "Compliance Details". */
  async openRowAction(item: string | RegExp, index = 0): Promise<void> {
    await expect(this.row(index)).toBeVisible();
    await this.row(index).locator('td').last().getByRole('button').first().click();
    const menuItem = this.page.getByRole('menuitem', { name: item });
    await expect(menuItem).toBeVisible();
    await menuItem.click();
  }
}
