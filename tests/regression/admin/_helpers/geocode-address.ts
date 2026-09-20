import { expect, type Locator, type Page } from '@playwright/test';
import { LOOP } from './loop-data';

/** Fill StreetAutocomplete + state/city fallback so Save can resolve coordinates. */
export async function fillGeocodedStreet(
  page: Page,
  root: Locator | Page,
  street = LOOP.street,
  city = LOOP.city,
  state = LOOP.state,
  zip = LOOP.zip,
): Promise<void> {
  const query = `${street}, ${city}, MA ${zip}`;
  await root.getByRole('textbox', { name: /Street/i }).fill(street);
  await root.locator('button[title="Search address"]').click();
  const searchBox = page.getByPlaceholder('Search address...');
  await expect(searchBox).toBeVisible({ timeout: 10_000 });
  await searchBox.fill(query);
  const suggestion = page
    .locator('button')
    .filter({ hasText: new RegExp(`${city}|${street}`, 'i') })
    .first();
  const found = await suggestion.isVisible({ timeout: 12_000 }).catch(() => false);
  if (found) {
    await suggestion.click();
    return;
  }
  await page.keyboard.press('Escape');
  await root.getByRole('combobox').filter({ hasText: /Select state/i }).click();
  await page.getByRole('option', { name: state }).click();
  await root.getByRole('combobox').filter({ hasText: /Select city|Select a state/i }).click();
  const citySearch = page.getByPlaceholder(/Search city/i);
  if (await citySearch.isVisible().catch(() => false)) {
    await citySearch.fill(city);
  }
  await page.getByRole('option', { name: city }).click();
  await root.getByRole('textbox', { name: /ZIP Code|Zip Code/i }).fill(zip);
}

export async function pickAddressSuggestion(
  page: Page,
  placeholder: string,
  street: string,
  city = LOOP.city,
  zip = LOOP.zip,
): Promise<void> {
  const query = `${street}, ${city}, MA ${zip}`;
  const field = page.getByPlaceholder(placeholder);
  await field.click();
  const searchIcon = page.locator('button[title="Search address"]');
  const index = /drop/i.test(placeholder) ? Math.min(Math.max((await searchIcon.count()) - 1, 0), 1) : 0;
  if ((await searchIcon.count()) > index) {
    await searchIcon.nth(index).click();
  }
  const searchBox = page.getByPlaceholder('Search address...');
  await expect(searchBox).toBeVisible({ timeout: 10_000 });
  await searchBox.fill(query);
  const suggestion = page
    .locator('button')
    .filter({ hasText: new RegExp(`${city}|${street}`, 'i') })
    .first();
  await expect(suggestion).toBeVisible({ timeout: 15_000 });
  await suggestion.click();
  await page.keyboard.press('Escape');
}
