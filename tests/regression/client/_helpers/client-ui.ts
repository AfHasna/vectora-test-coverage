import { expect, type Page } from '@playwright/test';

export async function waitPageHeading(page: Page, name: string | RegExp): Promise<void> {
  await expect(page.getByRole('heading', { name }).first()).toBeVisible({ timeout: 25_000 });
}

export async function applyClientSearch(page: Page, placeholder: string, value: string): Promise<void> {
  const filters = page.getByRole('button', { name: /Filters/i }).first();
  await expect(filters).toBeVisible({ timeout: 20_000 });
  const search = page.getByPlaceholder(placeholder);
  if (!(await search.isVisible().catch(() => false))) {
    await filters.click();
  }
  await expect(search).toBeVisible({ timeout: 10_000 });
  await search.fill(value);
  await page.getByRole('button', { name: 'Filter', exact: true }).click();
}
