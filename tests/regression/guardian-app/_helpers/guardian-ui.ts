import { expect, type Page } from '@playwright/test';

export async function openGuardianTab(page: Page, label: string): Promise<void> {
  const tab = page.getByRole('tab', { name: label }).first();
  if (await tab.isVisible({ timeout: 4_000 }).catch(() => false)) {
    await tab.click();
    return;
  }
  await page.getByText(label, { exact: true }).first().click();
}

export async function expectNotKellySession(page: Page): Promise<void> {
  await expect(page.getByText(/Aiden/i)).toHaveCount(0);
  await expect(page.getByText(/seed\.qe\.parent@/i)).toHaveCount(0);
}
