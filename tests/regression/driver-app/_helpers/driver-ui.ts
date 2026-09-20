import { expect, type Page } from '@playwright/test';

export async function dismissDriverOverlays(page: Page): Promise<void> {
  const safety = page.getByRole('button', { name: /acknowledge|i understand|continue|accept/i });
  if (await safety.first().isVisible({ timeout: 3_000 }).catch(() => false)) {
    await safety.first().click();
  }
}

export async function expectDriverSession(page: Page): Promise<void> {
  await expect(page.getByRole('button', { name: 'Sign In' })).toHaveCount(0);
}

export async function openDriverTab(page: Page, label: string): Promise<void> {
  const tab = page.getByRole('tab', { name: label }).first();
  if (await tab.isVisible({ timeout: 4_000 }).catch(() => false)) {
    await tab.click();
    return;
  }
  await page.getByText(label, { exact: false }).first().click();
}

export async function openMoreRow(page: Page, testId: string): Promise<void> {
  const row = page.getByTestId(testId);
  if (await row.isVisible({ timeout: 3_000 }).catch(() => false)) {
    await row.click();
    return;
  }
  const back = page.locator('[data-testid$="-back"]').first();
  if (await back.isVisible({ timeout: 2_000 }).catch(() => false)) {
    await back.click();
  }
  await openDriverTab(page, 'More');
  await expect(row).toBeVisible({ timeout: 10_000 });
  await row.click();
}

