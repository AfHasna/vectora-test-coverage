import { expect, type Page } from '@playwright/test';
import { LOOP } from './loop-data';
import { fillGeocodedStreet } from './geocode-address';

export async function fillNewClient(
  page: Page,
  name: string,
  email: string,
  contactFirst: string = LOOP.contactFirst,
  contactLast: string = LOOP.contactLast,
  contactPhone: string = LOOP.contactPhone,
): Promise<void> {
  await page.goto('/stakeholders/clients/add');
  await expect(page.getByRole('heading', { name: 'Add New Client' })).toBeVisible();
  await page.getByRole('textbox', { name: /Client Name/i }).fill(name);
  await page.getByRole('textbox', { name: /Client Email/i }).fill(email);
  await page.getByRole('combobox').filter({ hasText: 'Select type' }).click();
  await page.getByRole('option', { name: LOOP.clientType }).click();
  await page.getByRole('button', { name: 'Add Contact' }).click();
  await page.getByRole('textbox', { name: /First Name/i }).fill(contactFirst);
  await page.getByRole('textbox', { name: /Last Name/i }).fill(contactLast);
  await page.getByRole('textbox', { name: /Phone Number/i }).fill(contactPhone);
  await page.getByRole('button', { name: 'Save Contact' }).click();
  await expect(page.getByRole('heading', { name: 'Add Contact' })).toBeHidden({ timeout: 15_000 });
  await page.getByRole('button', { name: 'Add Address' }).click();
  const dialog = page.getByRole('dialog');
  await expect(dialog.getByRole('heading', { name: 'Add Address' })).toBeVisible();
  await fillGeocodedStreet(page, dialog);
  const primary = dialog.getByRole('checkbox', { name: /Primary/i });
  if (await primary.isVisible().catch(() => false)) {
    await primary.check();
  }
  const saveAddress = dialog.getByRole('button', { name: 'Save Address' });
  await expect(saveAddress).toBeEnabled({ timeout: 20_000 });
  await saveAddress.click();
  await expect(page.getByRole('heading', { name: 'Add Address' })).toBeHidden({ timeout: 20_000 });
  const save = page.getByRole('button', { name: 'Save Client' });
  await expect(save).toBeEnabled({ timeout: 30_000 });
  await save.click();
  await expect(page.getByRole('heading', { name: 'Clients' })).toBeVisible({ timeout: 40_000 });
}
