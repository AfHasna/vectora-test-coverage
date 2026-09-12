import { expect, type Locator, type Page } from '@playwright/test';
import { sidebarModules } from '@config/catalog';

/** The module navigation on the left of every admin screen. */
export class SidebarComponent {
  readonly root: Locator;

  constructor(page: Page) {
    this.root = page.getByRole('list').first();
  }

  link(module: string): Locator {
    return this.root.getByRole('link', { name: module });
  }

  async openModule(module: string): Promise<void> {
    await this.link(module).click();
  }

  /** Role permissions decide the modules, so the list is asserted exactly. */
  async expectModules(modules: readonly string[] = sidebarModules): Promise<void> {
    for (const module of modules) {
      await expect(this.link(module)).toBeVisible();
    }
    await expect(this.root.getByRole('link')).toHaveCount(modules.length);
  }
}
