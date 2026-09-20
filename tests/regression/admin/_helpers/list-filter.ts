import { expect, type Page } from '@playwright/test';

export async function applyNameFilter(
  page: Page,
  name: string,
  placeholder = /Search by name/i,
): Promise<void> {
  const search = page.getByPlaceholder(placeholder);
  if (!(await search.isVisible().catch(() => false))) {
    await page.getByRole('button', { name: 'Filters' }).click();
  }
  await expect(search).toBeVisible();
  await search.fill(name);
  await page.getByRole('button', { name: 'Filter', exact: true }).click();
}

export async function findNamedButton(page: Page, name: string | RegExp): Promise<boolean> {
  const listed = page.getByRole('button', { name });
  try {
    await listed.first().waitFor({ state: 'visible', timeout: 12_000 });
    return true;
  } catch {
    return false;
  }
}
