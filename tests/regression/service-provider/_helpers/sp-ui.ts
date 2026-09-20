import { expect, type Page } from '@playwright/test';

export async function waitPageHeading(page: Page, name: string | RegExp): Promise<void> {
  await expect(page.getByRole('heading', { name }).first()).toBeVisible({ timeout: 25_000 });
}

export async function applySpSearch(page: Page, placeholder: string, value: string): Promise<void> {
  const search = page.getByPlaceholder(placeholder);
  if (!(await search.isVisible().catch(() => false))) {
    await page.getByRole('button', { name: /Filters/i }).first().click();
  }
  await expect(search).toBeVisible({ timeout: 10_000 });
  await search.fill(value);
  await page.getByRole('button', { name: 'Filter', exact: true }).click();
}
