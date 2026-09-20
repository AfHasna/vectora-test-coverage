import { expect, type Page } from '@playwright/test';
import { test } from '../../../fixtures/regression-test';
import { adminCase } from '../../../fixtures/annotate';
import { LOOP } from '../_helpers/loop-data';
import { applyNameFilter } from '../_helpers/list-filter';
import { fillNewClient } from '../_helpers/client-form';

const TOTAL = 1;
const SUITE = 'Archive safety';

test.describe.configure({ mode: 'serial' });

async function openClients(page: Page): Promise<void> {
  await page.goto('/stakeholders/clients');
  await expect(page.getByRole('heading', { name: 'Clients' })).toBeVisible({ timeout: 30_000 });
}

async function findDisposable(page: Page): Promise<boolean> {
  const listed = page.getByRole('button', { name: LOOP.disposableClient, exact: true });
  if (await listed.first().isVisible().catch(() => false)) {
    return true;
  }
  await applyNameFilter(page, LOOP.disposableClient);
  try {
    await listed.first().waitFor({ state: 'visible', timeout: 15_000 });
    return true;
  } catch {
    return false;
  }
}

function disposableRow(page: Page) {
  return page.locator('tr').filter({ hasText: LOOP.disposableClient }).first();
}

test.describe('REG-ADM TEST_ archive restore', () => {
  test(
    'REG-ADM-019 — TEST_ client create, archive, restore',
    { tag: '@regression' },
    async ({ page }) => {
      await adminCase(
        page,
        {
          portal: 'Admin',
          suite: SUITE,
          id: 'REG-ADM-019',
          sequence: 1,
          total: TOTAL,
          priority: 'P1',
          regression: true,
          title: 'TEST_ client create, archive, restore',
          preconditions: 'Logged in; never archive SEED loop records in this case',
          data: `${LOOP.disposableClient} | ${LOOP.disposableEmail}`,
          actionSteps:
            '1) Create TEST_ client if missing 2) Archive with confirmation 3) Show archived 4) Restore',
          expected:
            'kb: Confirmation uses Archive (amber, reversible). Soft-delete via archived_at. Restore returns the record. SEED loop stays live.',
          expectedSource: 'kb',
        },
        async () => {
          await openClients(page);
          if (!(await findDisposable(page))) {
            await fillNewClient(page, LOOP.disposableClient, LOOP.disposableEmail, 'TEST', 'Disp', '(508) 555-0199');
            await openClients(page);
            expect(await findDisposable(page)).toBeTruthy();
          }
          await disposableRow(page).getByRole('button').last().click();
          await page.getByRole('menuitem', { name: 'Archive' }).click();
          await expect(page.getByRole('heading', { name: /Archive/i })).toBeVisible({ timeout: 15_000 });
          await page.getByRole('button', { name: /^Archive$/ }).click();
          await expect(page.getByRole('heading', { name: /Archive/i })).toBeHidden({ timeout: 20_000 });
          await page.getByRole('switch', { name: 'Archived' }).check();
          await applyNameFilter(page, LOOP.disposableClient);
          await expect(page.getByRole('button', { name: LOOP.disposableClient }).first()).toBeVisible({
            timeout: 20_000,
          });
          await disposableRow(page).getByRole('button').last().click();
          await page.getByRole('menuitem', { name: 'Restore' }).click();
          await page.getByRole('switch', { name: 'Archived' }).uncheck();
          await applyNameFilter(page, LOOP.disposableClient);
          await expect(page.getByRole('button', { name: LOOP.disposableClient }).first()).toBeVisible({
            timeout: 20_000,
          });
        },
      );
    },
  );
});
