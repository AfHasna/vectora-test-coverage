import { expect, type Page } from '@playwright/test';
import { test } from '../../../fixtures/regression-test';
import { adminCase } from '../../../fixtures/annotate';
import { LOOP } from '../_helpers/loop-data';
import { applyNameFilter } from '../_helpers/list-filter';
import { fillGeocodedStreet } from '../_helpers/geocode-address';

const TOTAL = 2;
const SUITE = 'Guardians';
const GUARDIAN_NAME = `${LOOP.guardianFirst} ${LOOP.guardianLast}`;

test.describe.configure({ mode: 'serial' });

async function openGuardians(page: Page): Promise<void> {
  await page.goto('/stakeholders/guardians');
  await expect(page.getByRole('heading', { name: 'Guardians' })).toBeVisible({ timeout: 30_000 });
}

async function findGuardian(page: Page): Promise<boolean> {
  const listed = page.getByRole('button', { name: GUARDIAN_NAME });
  if (await listed.first().isVisible().catch(() => false)) {
    return true;
  }
  await applyNameFilter(page, LOOP.guardianLast, /Search by name/i);
  try {
    await listed.first().waitFor({ state: 'visible', timeout: 15_000 });
    return true;
  } catch {
    return false;
  }
}

test.describe('REG-ADM Guardians', () => {
  test(
    'REG-ADM-017 — Create SEED LoopParent guardian',
    { tag: '@regression' },
    async ({ page }) => {
      await adminCase(
        page,
        {
          portal: 'Admin',
          suite: SUITE,
          id: 'REG-ADM-017',
          sequence: 1,
          total: TOTAL,
          priority: 'P1',
          regression: true,
          title: 'Create SEED LoopParent guardian',
          preconditions: 'Logged in; Guardians registry',
          data: `${GUARDIAN_NAME} | ${LOOP.guardianPhone} | ${LOOP.guardianEmail} | ${LOOP.street}`,
          actionSteps:
            '1) If guardian listed, skip 2) Add Guardian, name/phone/address geocode, Save Guardian',
          expected:
            'kb: Guardians are a central registry. Link later from passenger Contacts via Add New or Link Existing. Mobile access is on the guardian edit form.',
          expectedSource: 'kb',
        },
        async () => {
          await openGuardians(page);
          if (await findGuardian(page)) {
            await expect(page.getByRole('button', { name: GUARDIAN_NAME }).first()).toBeVisible();
            return;
          }
          await page.getByRole('button', { name: /Add Guardian/i }).click();
          const dialog = page.getByRole('dialog');
          await expect(dialog.getByRole('heading', { name: 'Add Guardian' })).toBeVisible();
          await dialog.getByPlaceholder('Enter first name').fill(LOOP.guardianFirst);
          await dialog.getByPlaceholder('Enter last name').fill(LOOP.guardianLast);
          await dialog.getByRole('textbox', { name: /Phone/i }).fill(LOOP.guardianPhone);
          const email = dialog.getByRole('textbox', { name: /Email/i });
          if (await email.isVisible().catch(() => false)) {
            await email.fill(LOOP.guardianEmail);
          }
          await fillGeocodedStreet(page, dialog);
          await dialog.getByRole('button', { name: 'Save Guardian' }).click();
          await expect(dialog.getByRole('heading', { name: 'Add Guardian' })).toBeHidden({ timeout: 20_000 });
          expect(await findGuardian(page)).toBeTruthy();
        },
      );
    },
  );

  test(
    'REG-ADM-023 — Activate LoopParent Guardian mobile access',
    { tag: '@regression' },
    async ({ page }) => {
      await adminCase(
        page,
        {
          portal: 'Admin',
          suite: SUITE,
          id: 'REG-ADM-023',
          sequence: 2,
          total: TOTAL,
          priority: 'P1',
          regression: true,
          title: 'Activate LoopParent Guardian mobile access',
          preconditions: `Guardian ${GUARDIAN_NAME} exists`,
          data: `${LOOP.guardianEmail} | password set on guardian edit Mobile App Access`,
          actionSteps:
            '1) Edit SEED LoopParent 2) If Active, skip 3) Else email+password, Activate Mobile Access',
          expected:
            'kb: Mobile access is on the guardian edit form. Parent app users are provisioned on the guardian record.',
          expectedSource: 'kb',
        },
        async () => {
          await openGuardians(page);
          expect(await findGuardian(page)).toBeTruthy();
          await page.getByRole('button', { name: GUARDIAN_NAME }).first().click();
          await page.getByRole('dialog').getByRole('button', { name: 'Edit Guardian' }).click();
          await expect(page.getByText('Mobile App Access').first()).toBeVisible({ timeout: 20_000 });
          if (await page.getByRole('button', { name: 'Activate Mobile Access' }).isVisible().catch(() => false)) {
            await page.locator('#guardian-mobile-email').fill(LOOP.guardianEmail);
            await page.locator('#guardian-mobile-password').fill(LOOP.guardianMobilePassword);
            await page.getByRole('button', { name: 'Activate Mobile Access' }).click();
            await expect(page.getByText('Mobile access activated').first()).toBeVisible({ timeout: 30_000 });
          }
          await expect(page.getByRole('button', { name: 'Reset Password' })).toBeVisible({ timeout: 15_000 });
        },
      );
    },
  );
});
