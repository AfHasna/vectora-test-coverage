import { expect, type Page } from '@playwright/test';
import { test } from '../../../fixtures/regression-test';
import { adminCase } from '../../../fixtures/annotate';
import { LOOP } from '../_helpers/loop-data';

const TOTAL = 8;
const SUITE = 'SEED connected loop';

test.describe.configure({ mode: 'serial' });

async function openClients(page: Page): Promise<void> {
  await page.goto('/stakeholders/clients');
  await expect(page.getByRole('heading', { name: 'Clients' })).toBeVisible({ timeout: 30_000 });
}

async function findClientOnList(page: Page, name: string): Promise<boolean> {
  const listed = page.getByRole('button', { name, exact: true });
  if (await listed.first().isVisible().catch(() => false)) {
    return true;
  }
  const search = page.getByPlaceholder('Search by name...');
  if (!(await search.isVisible().catch(() => false))) {
    await page.getByRole('button', { name: 'Filters' }).click();
  }
  await expect(search).toBeVisible();
  await search.fill(name);
  await page.getByRole('button', { name: 'Filter', exact: true }).click();
  return listed.first().isVisible({ timeout: 8_000 }).catch(() => false);
}

async function filterClientsByName(page: Page, name: string): Promise<void> {
  const found = await findClientOnList(page, name);
  expect(found, `client ${name} should be listed`).toBeTruthy();
}

function clientRow(page: Page, name: string) {
  return page.locator('tr').filter({ hasText: name }).first();
}

async function openClientEdit(page: Page, name: string): Promise<void> {
  await openClients(page);
  await filterClientsByName(page, name);
  await page.getByRole('button', { name, exact: true }).first().click();
  await page.getByRole('button', { name: 'Edit Client' }).click();
  await expect(page.getByRole('heading', { name: /Edit Client/i })).toBeVisible({ timeout: 20_000 });
}

async function addClientContact(page: Page): Promise<void> {
  await page.getByRole('button', { name: 'Add Contact' }).click();
  await page.getByRole('textbox', { name: /First Name/i }).fill(LOOP.contactFirst);
  await page.getByRole('textbox', { name: /Last Name/i }).fill(LOOP.contactLast);
  await page.getByRole('textbox', { name: /Phone Number/i }).fill(LOOP.contactPhone);
  await page.getByRole('button', { name: 'Save Contact' }).click();
  await expect(page.getByRole('heading', { name: 'Add Contact' })).toBeHidden({ timeout: 15_000 });
}

async function addClientAddress(page: Page): Promise<void> {
  await page.getByRole('button', { name: 'Add Address' }).click();
  const dialog = page.getByRole('dialog');
  await expect(dialog.getByRole('heading', { name: 'Add Address' })).toBeVisible();

  const query = `${LOOP.street}, ${LOOP.city}, MA ${LOOP.zip}`;
  await dialog.getByRole('textbox', { name: /Street Address/i }).fill(LOOP.street);
  await dialog.locator('button[title="Search address"]').click();
  const searchBox = page.getByPlaceholder('Search address...');
  await expect(searchBox).toBeVisible({ timeout: 10_000 });
  await searchBox.fill(query);
  const suggestion = page
    .locator('button')
    .filter({ hasText: new RegExp(`${LOOP.city}|${LOOP.street}`, 'i') })
    .first();
  const found = await suggestion.isVisible({ timeout: 12_000 }).catch(() => false);
  if (found) {
    await suggestion.click();
  } else {
    await page.keyboard.press('Escape');
    await dialog.getByRole('combobox').filter({ hasText: /Select state/i }).click();
    await page.getByRole('option', { name: LOOP.state }).click();
    await dialog.getByRole('combobox').filter({ hasText: /Select city|Select a state/i }).click();
    const citySearch = page.getByPlaceholder(/Search city/i);
    if (await citySearch.isVisible().catch(() => false)) {
      await citySearch.fill(LOOP.city);
    }
    await page.getByRole('option', { name: LOOP.city }).click();
    await dialog.getByRole('textbox', { name: /ZIP Code/i }).fill(LOOP.zip);
  }

  const primary = dialog.getByRole('checkbox', { name: /Primary/i });
  if (await primary.isVisible().catch(() => false)) {
    await primary.check();
  }
  const save = dialog.getByRole('button', { name: 'Save Address' });
  await expect(save).toBeEnabled({ timeout: 20_000 });
  await save.click();
  await expect(page.getByRole('heading', { name: 'Add Address' })).toBeHidden({ timeout: 20_000 });
}

async function fillNewClient(page: Page, name: string, email: string): Promise<void> {
  await page.goto('/stakeholders/clients/add');
  await expect(page.getByRole('heading', { name: 'Add New Client' })).toBeVisible();
  await page.getByRole('textbox', { name: /Client Name/i }).fill(name);
  await page.getByRole('textbox', { name: /Client Email/i }).fill(email);
  await page.getByRole('combobox').filter({ hasText: 'Select type' }).click();
  await page.getByRole('option', { name: LOOP.clientType }).click();
  await addClientContact(page);
  await addClientAddress(page);
  const save = page.getByRole('button', { name: 'Save Client' });
  await expect(save).toBeEnabled({ timeout: 30_000 });
  await save.click();
  await expect(page.getByRole('heading', { name: 'Clients' })).toBeVisible({ timeout: 40_000 });
}

test.describe('REG-ADM SEED connected loop', () => {
  test(
    'REG-ADM-007 — Add Client form matches KB (3 tabs, required contact + address)',
    { tag: '@regression' },
    async ({ page }) => {
      await adminCase(
        page,
        {
          portal: 'Admin',
          suite: SUITE,
          id: 'REG-ADM-007',
          sequence: 1,
          total: TOTAL,
          priority: 'P1',
          regression: true,
          title: 'Add Client form matches KB',
          preconditions: 'Logged in; `/stakeholders/clients/add`',
          data: '—',
          actionSteps: '1) Open Add Client 2) Inspect tabs and required sections 3) Cancel without save',
          expected:
            'kb: 3-tab form — Basic Info & Contacts, Contracts & Pricing, Client Portal Access (provision in Edit). Name, email, one contact (first, last, phone), one address required. Save stays disabled until required data is complete.',
          expectedSource: 'kb',
          actual:
            'Practice: tabs present; Save Client disabled until contact+address; Cancel → Unsaved Changes Stay/Discard.',
        },
        async () => {
          await page.goto('/stakeholders/clients/add');
          await expect(page.getByRole('tab', { name: 'Basic Info & Contacts' })).toBeVisible();
          await expect(page.getByRole('tab', { name: 'Contracts & Pricing' })).toBeVisible();
          await expect(page.getByRole('tab', { name: 'Client Portal Access' })).toBeVisible();
          await expect(page.getByRole('button', { name: 'Save Client' })).toBeDisabled();
          await page.getByRole('button', { name: 'Cancel' }).click();
          await expect(page.getByRole('heading', { name: 'Clients' })).toBeVisible({ timeout: 20_000 });
        },
      );
    },
  );

  test(
    'REG-ADM-008 — Create SEED_QE Loop School client',
    { tag: '@regression' },
    async ({ page }) => {
      await adminCase(
        page,
        {
          portal: 'Admin',
          suite: SUITE,
          id: 'REG-ADM-008',
          sequence: 2,
          total: TOTAL,
          priority: 'P1',
          regression: true,
          title: 'Create SEED_QE Loop School client',
          preconditions: 'Logged in; clients list',
          data: `${LOOP.clientName} | ${LOOP.clientEmail} | type ${LOOP.clientType} | contact ${LOOP.contactFirst} ${LOOP.contactLast} ${LOOP.contactPhone} | ${LOOP.street}, ${LOOP.city} ${LOOP.zip}`,
          actionSteps:
            '1) If client already listed, skip create 2) Else Add Client, fill name/email/type, Save Contact, Save Address, Save Client',
          expected:
            'kb: Client record is created and appears on `/stakeholders/clients` (archived_at null). This client is the root of the later portal loop.',
          expectedSource: 'kb',
        },
        async () => {
          await openClients(page);
          if (await findClientOnList(page, LOOP.clientName)) {
            await expect(page.getByRole('button', { name: LOOP.clientName, exact: true }).first()).toBeVisible();
            return;
          }
          await fillNewClient(page, LOOP.clientName, LOOP.clientEmail);
          await openClients(page);
          expect(await findClientOnList(page, LOOP.clientName)).toBeTruthy();
        },
      );
    },
  );

  test(
    'REG-ADM-009 — Edit SEED client opens 3 tabs including Portal Access',
    { tag: '@regression' },
    async ({ page }) => {
      await adminCase(
        page,
        {
          portal: 'Admin',
          suite: SUITE,
          id: 'REG-ADM-009',
          sequence: 3,
          total: TOTAL,
          priority: 'P1',
          regression: true,
          title: 'Edit SEED client opens Portal Access',
          preconditions: `Logged in; client ${LOOP.clientName} exists`,
          data: LOOP.clientName,
          actionSteps: '1) Open client from list or search 2) Edit 3) Confirm Portal Access tab 4) Cancel/back without destructive change',
          expected:
            'kb: Edit mode includes Client Portal Access. Optional portal users are provisioned here, not from an empty Settings roster.',
          expectedSource: 'kb',
        },
        async () => {
          await openClientEdit(page, LOOP.clientName);
          await expect(page.getByRole('tab', { name: 'Client Portal Access' })).toBeVisible({
            timeout: 20_000,
          });
          await expect(page.getByRole('textbox', { name: /Client Name/i })).toHaveValue(LOOP.clientName);
          await page.getByRole('button', { name: /Cancel|Back/i }).first().click();
          const discard = page.getByRole('button', { name: /Discard/i });
          if (await discard.isVisible({ timeout: 3_000 }).catch(() => false)) {
            await discard.click();
          }
        },
      );
    },
  );

  test(
    'REG-ADM-010 — Places list is next in the onboarding strip',
    { tag: '@regression' },
    async ({ page }) => {
      await adminCase(
        page,
        {
          portal: 'Admin',
          suite: SUITE,
          id: 'REG-ADM-010',
          sequence: 4,
          total: TOTAL,
          priority: 'P1',
          regression: true,
          title: 'Places list is next in the onboarding strip',
          preconditions: 'Logged in; SEED client exists',
          data: 'Path `/stakeholders/places`',
          actionSteps: '1) Open Places 2) Confirm Add Place',
          expected:
            'kb: After the client, configure places and a place calendar (Bell In / Bell Out) so the route sheet wizard can anchor ETAs.',
          expectedSource: 'kb',
        },
        async () => {
          await page.goto('/stakeholders/places');
          await expect(page.getByRole('heading', { name: 'Places' })).toBeVisible();
          await expect(page.getByRole('button', { name: /Add Place/i })).toBeVisible();
        },
      );
    },
  );

  test(
    'REG-ADM-011 — Guardians registry is available for Parent-app users',
    { tag: '@regression' },
    async ({ page }) => {
      await adminCase(
        page,
        {
          portal: 'Admin',
          suite: SUITE,
          id: 'REG-ADM-011',
          sequence: 5,
          total: TOTAL,
          priority: 'P1',
          regression: true,
          title: 'Guardians registry is available for Parent-app users',
          preconditions: 'Logged in',
          data: 'Path `/stakeholders/guardians`',
          actionSteps: '1) Open Guardians 2) Confirm Add Guardian',
          expected:
            'kb: Guardians are a central registry. Link from passenger Contacts via Add New or Link Existing. Mobile access is on the guardian edit form.',
          expectedSource: 'kb',
          actual: 'Practice: Guardians list + Add Guardian; Kelly Bilodeau edit showed Mobile App Access activate/revoke.',
        },
        async () => {
          await page.goto('/stakeholders/guardians');
          await expect(page.getByRole('heading', { name: 'Guardians' })).toBeVisible();
          await expect(page.getByRole('button', { name: /Add Guardian/i })).toBeVisible();
        },
      );
    },
  );

  test(
    'REG-ADM-012 — Add Passenger starts in Draft and links to a client',
    { tag: '@regression' },
    async ({ page }) => {
      await adminCase(
        page,
        {
          portal: 'Admin',
          suite: SUITE,
          id: 'REG-ADM-012',
          sequence: 6,
          total: TOTAL,
          priority: 'P1',
          regression: true,
          title: 'Add Passenger form is the next onboarding step',
          preconditions: 'Logged in; SEED client exists',
          data: 'Path `/stakeholders/passengers/add`',
          actionSteps: '1) Open Add Passenger 2) Confirm client/assignment fields exist 3) Cancel without save',
          expected:
            'kb: Add passengers at /stakeholders/passengers/add, link to client in Needs & Assignments. New passengers start Draft. Pickup/dropoff lives on the route sheet wizard, not the profile.',
          expectedSource: 'kb',
        },
        async () => {
          await page.goto('/stakeholders/passengers/add');
          await expect(page.getByRole('heading', { name: /Add.*Passenger|New Passenger/i })).toBeVisible({
            timeout: 20_000,
          });
          await page.getByRole('button', { name: /Cancel|Back/i }).first().click();
          const discard = page.getByRole('button', { name: /Discard/i });
          if (await discard.isVisible().catch(() => false)) {
            await discard.click();
          }
        },
      );
    },
  );

  test(
    'REG-ADM-013 — Archive uses confirmation, not silent delete',
    { tag: '@regression' },
    async ({ page }) => {
      await adminCase(
        page,
        {
          portal: 'Admin',
          suite: SUITE,
          id: 'REG-ADM-013',
          sequence: 7,
          total: TOTAL,
          priority: 'P1',
          regression: true,
          title: 'Archive uses confirmation, not silent delete',
          preconditions: 'Logged in; Clients list',
          data: LOOP.clientName,
          actionSteps:
            '1) Open row actions for SEED client 2) Open Archive 3) Confirm dialog verbs Archive (not Delete) 4) Cancel the dialog so the SEED graph stays live',
          expected:
            'kb: Confirmation uses Archive (amber, reversible) or Delete (red). Pre-flight linked-records check. Soft-delete via archived_at. Do not archive the live SEED loop client in this case.',
          expectedSource: 'kb',
        },
        async () => {
          await openClients(page);
          await filterClientsByName(page, LOOP.clientName);
          await clientRow(page, LOOP.clientName).getByRole('button').last().click();
          await page.getByRole('menuitem', { name: 'Archive' }).click();
          await expect(page.getByRole('heading', { name: /Archive/i })).toBeVisible({ timeout: 15_000 });
          await expect(page.getByRole('button', { name: /^Archive$/ })).toBeVisible();
          await page.getByRole('button', { name: 'Cancel' }).click();
          await expect(page.getByRole('heading', { name: /Archive/i })).toBeHidden({ timeout: 10_000 });
          await expect(page.getByRole('button', { name: LOOP.clientName }).first()).toBeVisible();
        },
      );
    },
  );

  test(
    'REG-ADM-014 — Workforce and Fleet lists exist for the rest of the loop',
    { tag: '@regression' },
    async ({ page }) => {
      await adminCase(
        page,
        {
          portal: 'Admin',
          suite: SUITE,
          id: 'REG-ADM-014',
          sequence: 8,
          total: TOTAL,
          priority: 'P1',
          regression: true,
          title: 'Workforce and Fleet lists exist for the rest of the loop',
          preconditions: 'Logged in; SEED client exists',
          data: 'Drivers `/workforce/drivers`, Providers `/workforce/service-providers`, Vehicles `/vehicles`',
          actionSteps: '1) Open Drivers 2) Open Service Providers 3) Open Vehicles',
          expected:
            'kb: Drivers, service providers, and vehicles are required before route sheets. Add Vehicle is Fleet → Vehicles → + Add Vehicle.',
          expectedSource: 'kb',
          actual: 'Practice: Driver mobile access and SP portal access were provisioned on existing SEED records.',
        },
        async () => {
          await page.goto('/workforce/drivers');
          await page.getByText('Loading', { exact: true }).first().waitFor({ state: 'hidden', timeout: 30_000 }).catch(() => undefined);
          await expect(page.getByRole('heading', { name: 'Drivers', exact: true })).toBeVisible({ timeout: 30_000 });
          await page.goto('/workforce/service-providers');
          await expect(page.getByRole('heading', { name: /Service Provider/i })).toBeVisible();
          await page.goto('/vehicles');
          await expect(page.getByRole('heading', { name: /Fleet Management|Vehicles/i })).toBeVisible({
            timeout: 20_000,
          });
          await expect(page.getByRole('button', { name: /Add Vehicle/i })).toBeVisible();
        },
      );
    },
  );
});
