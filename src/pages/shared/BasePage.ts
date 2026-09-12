import { expect, type Page } from '@playwright/test';
import { expectActivePage } from '@utils/assertions';
import { SidebarComponent } from './SidebarComponent';
import { GlobalSearchComponent } from './GlobalSearchComponent';
import { TableComponent } from './TableComponent';

/**
 * What every admin screen has in common: a path, an id the app reports on
 * <html>, a sidebar, global search and (usually) a table.
 *
 * Subclasses declare `path` and `pageId`; `open()` then navigates and waits for
 * the app to say it is on that screen.
 */
export abstract class BasePage {
  abstract readonly path: string;
  abstract readonly pageId: string;

  readonly sidebar: SidebarComponent;
  readonly search: GlobalSearchComponent;
  readonly table: TableComponent;

  constructor(readonly page: Page) {
    this.sidebar = new SidebarComponent(page);
    this.search = new GlobalSearchComponent(page);
    this.table = new TableComponent(page);
  }

  /** Navigates straight to the screen. Returns false when the session has expired. */
  async open(pathOverride?: string): Promise<boolean> {
    await this.page.goto(pathOverride ?? this.path);
    if (/sign-in/i.test(this.page.url())) {
      return false;
    }
    await this.expectLoaded();
    return true;
  }

  /** Overridden where a screen has a more telling signal than its page id. */
  async expectLoaded(): Promise<void> {
    await expectActivePage(this.page, this.pageId);
  }

  async expectHeading(name: string | RegExp): Promise<void> {
    await expect(this.page.getByRole('heading', { name }).first()).toBeVisible();
  }

  /** Asserts the tab strip lists exactly these tabs, in order. */
  async expectTabs(names: readonly string[]): Promise<void> {
    await expect(this.page.getByRole('tab')).toHaveText([...names]);
  }

  async openTab(name: string): Promise<void> {
    await this.page.getByRole('tab', { name }).click();
  }

  async expectTabActive(name: string): Promise<void> {
    await expect(this.page.getByRole('tab', { name })).toHaveAttribute('data-state', 'active');
  }

  async closeDialog(): Promise<void> {
    await this.page.keyboard.press('Escape');
    await expect(this.page.getByRole('dialog')).toHaveCount(0);
  }

  async reload(): Promise<void> {
    await this.page.reload();
    await this.expectLoaded();
  }
}
