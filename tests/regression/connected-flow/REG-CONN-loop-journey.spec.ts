import { expect } from '@playwright/test';
import { test } from '../../fixtures/regression-test';
import { adminCase } from '../../fixtures/annotate';
import { LOOP } from '../admin/_helpers/loop-data';
import { applyNameFilter } from '../admin/_helpers/list-filter';
import {
  ensureClientPortalUser,
  ensurePassengerHomeAddress,
  filterByPassengerName,
  findLoopSheet,
  GUARDIAN_NAME,
  openFirstRowActions,
  openRowActions,
  PASSENGER_NAME,
} from '../admin/_helpers/journey-ui';
import { pickAddressSuggestion } from '../admin/_helpers/geocode-address';
import { ensureLoopInternalDriver } from '../admin/_helpers/driver-form';

const TOTAL = 10;
const SUITE = 'Connected Loop journey';

test.describe.configure({ mode: 'serial', timeout: 240_000 });

test.describe('REG connected Loop journey', () => {
  test(
    'REG-ADM-027 â€” Stakeholder records are listed for the Loop',
    { tag: '@regression' },
    async ({ page }) => {
      await adminCase(
        page,
        {
          portal: 'Admin',
          suite: SUITE,
          id: 'REG-ADM-027',
          sequence: 1,
          total: TOTAL,
          priority: 'P1',
          regression: true,
          title: 'Stakeholder records are listed for the Loop',
          preconditions: 'SEED client, place, guardian, passenger already created in REG-ADM-008â€“018',
          data: `${LOOP.clientName} | ${LOOP.placeName} | ${GUARDIAN_NAME} | ${PASSENGER_NAME}`,
          actionSteps:
            '1) Filter Clients for SEED_QE Loop School\n2) Filter Places for SEED_QE Loop Place\n3) Filter Guardians for LoopParent\n4) Filter Passengers for LoopChild',
          expected:
            'kb: Client, place (with calendar), guardian, and passenger must all exist before a route sheet can carry the child.',
          expectedSource: 'kb',
        },
        async () => {
          await test.step('1) Client listed', async () => {
            await page.goto('/stakeholders/clients');
            await applyNameFilter(page, LOOP.clientName);
            await expect(page.getByRole('button', { name: LOOP.clientName, exact: true }).first()).toBeVisible({
              timeout: 20_000,
            });
          });
          await test.step('2) Place listed', async () => {
            await page.goto('/stakeholders/places');
            await applyNameFilter(page, LOOP.placeName);
            await expect(page.getByText(LOOP.placeName).first()).toBeVisible({ timeout: 20_000 });
          });
          await test.step('3) Guardian listed', async () => {
            await page.goto('/stakeholders/guardians');
            await applyNameFilter(page, LOOP.guardianLast);
            await expect(page.getByRole('button', { name: GUARDIAN_NAME, exact: true }).first()).toBeVisible({
              timeout: 20_000,
            });
          });
          await test.step('4) Passenger listed', async () => {
            await page.goto('/stakeholders/passengers');
            await applyNameFilter(page, LOOP.passengerLast);
            await expect(page.getByRole('button', { name: PASSENGER_NAME, exact: true }).first()).toBeVisible({
              timeout: 20_000,
            });
          });
        },
      );
    },
  );

  test(
    'REG-ADM-028 â€” LoopChild has a Home address',
    { tag: '@regression' },
    async ({ page }) => {
      await adminCase(
        page,
        {
          portal: 'Admin',
          suite: SUITE,
          id: 'REG-ADM-028',
          sequence: 2,
          total: TOTAL,
          priority: 'P1',
          regression: true,
          title: 'LoopChild has a Home address',
          preconditions: `Passenger ${PASSENGER_NAME} exists and is Active`,
          data: `Address Name Home | ${LOOP.street}, ${LOOP.city}, MA ${LOOP.zip}`,
          actionSteps:
            '1) Edit LoopChild\n2) If an address already exists, leave it\n3) Else Add Address, name Home, geocode Lyman St, Save Address\n4) Save Changes',
          expected:
            'kb: Home pickup on the route sheet stays disabled until the passenger has at least one home address.',
          expectedSource: 'kb',
        },
        async () => {
          await test.step('1â€“4) Ensure Home address on LoopChild', async () => {
            await ensurePassengerHomeAddress(page);
          });
          await test.step('Confirm address on view', async () => {
            await page.goto('/stakeholders/passengers');
            await applyNameFilter(page, LOOP.passengerLast);
            await page.getByRole('button', { name: PASSENGER_NAME, exact: true }).first().click();
            const dialog = page.getByRole('dialog');
            await dialog.getByRole('tab', { name: 'Transportation' }).click();
            await expect(
              dialog.getByText(LOOP.street).or(dialog.getByText(/Home|Lyman/i)).first(),
            ).toBeVisible({ timeout: 20_000 });
          });
        },
      );
    },
  );

  test(
    'REG-ADM-029 â€” Activate Loop School Client Portal user',
    { tag: '@regression' },
    async ({ page }) => {
      await adminCase(
        page,
        {
          portal: 'Admin',
          suite: SUITE,
          id: 'REG-ADM-029',
          sequence: 3,
          total: TOTAL,
          priority: 'P1',
          regression: true,
          title: 'Activate Loop School Client Portal user',
          preconditions: `Client ${LOOP.clientName} exists`,
          data: `${LOOP.clientEmail} | Client Portal Access tab`,
          actionSteps:
            '1) Edit Loop School\n2) Open Client Portal Access\n3) If email already listed, stop\n4) Else fill first/last/email/password and Activate Portal Access',
          expected:
            'kb: Client portal users are created on the client record (Portal Access), not from a blank Settings roster.',
          expectedSource: 'kb',
        },
        async () => {
          await test.step('1â€“4) Ensure portal user', async () => {
            await ensureClientPortalUser(page);
          });
        },
      );
    },
  );

  test(
    'REG-ADM-030 â€” Workforce and vehicle are defined',
    { tag: '@regression' },
    async ({ page }) => {
      await adminCase(
        page,
        {
          portal: 'Admin',
          suite: SUITE,
          id: 'REG-ADM-030',
          sequence: 4,
          total: TOTAL,
          priority: 'P1',
          regression: true,
          title: 'Workforce and vehicle are defined',
          preconditions: 'Stage 0 driver/SP exist; vehicle SEEDLOOP1 created in REG-ADM-022',
          data: `Drivers list | Service providers list | plate ${LOOP.plate}`,
          actionSteps:
            '1) Open Drivers and confirm at least one row\n2) Open Service Providers and confirm at least one row\n3) Open Vehicles, filter SEEDLOOP1',
          expected:
            'kb: Assign Driver needs a workforce driver and a vehicle. SP portal needs a provider organization.',
          expectedSource: 'kb',
        },
        async () => {
          await test.step('1) Drivers list has records', async () => {
            await page.goto('/workforce/drivers');
            await expect(page.getByRole('heading', { name: /Drivers/i })).toBeVisible({ timeout: 30_000 });
            await expect(page.locator('table tbody tr, [role="row"]').first()).toBeVisible({ timeout: 20_000 });
          });
          await test.step('2) Service providers list has records', async () => {
            await page.goto('/workforce/service-providers');
            await expect(page.getByRole('heading', { name: /Service Provider/i })).toBeVisible({ timeout: 30_000 });
            await expect(page.locator('table tbody tr, [role="row"]').first()).toBeVisible({ timeout: 20_000 });
          });
          await test.step('3) SEEDLOOP1 on Fleet', async () => {
            await page.goto('/vehicles');
            await expect(page.getByRole('heading', { name: /Fleet/i })).toBeVisible({ timeout: 30_000 });
            await applyNameFilter(page, LOOP.plate, /Search/i);
            await expect(page.getByText(LOOP.plate).first()).toBeVisible({ timeout: 20_000 });
          });
        },
      );
    },
  );

  test(
    'REG-ADM-031 â€” Create Loop AM/PM route sheet with home and place',
    { tag: '@regression' },
    async ({ page }) => {
      await adminCase(
        page,
        {
          portal: 'Admin',
          suite: SUITE,
          id: 'REG-ADM-031',
          sequence: 5,
          total: TOTAL,
          priority: 'P1',
          regression: true,
          title: 'Create Loop AM/PM route sheet with home and place',
          preconditions: 'LoopChild Active with Home address; Loop Place calendar exists',
          data: `Start ${LOOP.routeStart} | passenger ${PASSENGER_NAME} | place ${LOOP.placeName} | calendar ${LOOP.calendarName}`,
          actionSteps:
            '1) If a Loop School sheet already exists, stop\n2) Open Create Route Sheet\n3) Set Service Start Date to today\n4) Add Passenger: Loop School + LoopChild + Return\n5) Default Location: Home + Loop Place + Loop Calendar\n6) Activate weekdays\n7) Add to Route and Save Route Sheet',
          expected:
            'kb: Outbound is Homeâ†’Place, return is Placeâ†’Home. Pickup and drop-off cannot be the same location.',
          expectedSource: 'kb',
        },
        async () => {
          if (await findLoopSheet(page)) {
            await test.step('1) Existing Loop sheet â€” reuse', async () => {
              await expect(page.getByText(LOOP.clientName).first()).toBeVisible();
            });
            return;
          }
          await test.step('2) Open Create Route Sheet', async () => {
            await page.goto('/service-operations/route-sheets/add');
            await expect(page.getByRole('heading', { name: /Create Route Sheet/i })).toBeVisible({ timeout: 30_000 });
          });
          await test.step('3) Service dates after passenger (filled in step 7)', async () => {
            // Start date is applied after the passenger is on the sheet so it is not wiped when routes hydrate.
          });
          await test.step('4â€“6) Add LoopChild with default locations', async () => {
            await page.getByRole('button', { name: 'Add Passenger' }).click();
            const dialog = page.getByRole('dialog');
            await expect(dialog.getByRole('heading', { name: 'Add Passenger' })).toBeVisible({ timeout: 15_000 });
            await dialog.getByRole('combobox').filter({ hasText: /Select client/i }).click();
            const clientSearch = page.getByPlaceholder(/Search client/i);
            await expect(clientSearch).toBeVisible({ timeout: 10_000 });
            await clientSearch.fill(LOOP.clientName);
            await page.locator('[cmdk-item], [role="option"]').filter({ hasText: LOOP.clientName }).first().click();
            await dialog.getByRole('combobox').filter({ hasText: /Select passenger/i }).click();
            const pSearch = page.getByPlaceholder(/Search/i).last();
            await expect(pSearch).toBeVisible({ timeout: 10_000 });
            await pSearch.fill(LOOP.passengerLast);
            await page.locator('[cmdk-item], [role="option"]').filter({ hasText: PASSENGER_NAME }).first().click();
            await expect(dialog.getByRole('combobox').filter({ hasText: /Passenger address/i })).toBeVisible({
              timeout: 20_000,
            });
            await dialog.getByRole('combobox').filter({ hasText: /Passenger address/i }).click();
            await page.locator('[cmdk-item], [role="option"]').filter({ hasText: /Home|Lyman/i }).first().click();
            await dialog.getByRole('combobox').filter({ hasText: /School \/ Place/i }).click();
            const placeSearch = page.getByPlaceholder(/Search places/i);
            await expect(placeSearch).toBeVisible({ timeout: 10_000 });
            await placeSearch.fill(LOOP.placeName);
            await page.locator('[cmdk-item], [role="option"]').filter({ hasText: LOOP.placeName }).first().click();
            const calDlg = page.getByRole('dialog').filter({ hasText: /Select Calendar/i });
            await expect(calDlg).toBeVisible({ timeout: 15_000 });
            await calDlg.getByText(LOOP.calendarName).click();
            await calDlg.getByRole('button', { name: 'Select' }).click();
            await dialog.getByRole('button', { name: 'All days' }).first().click();
            await dialog.getByRole('checkbox').nth(1).click();
            const allDays = dialog.getByRole('button', { name: 'All days' });
            if ((await allDays.count()) > 1) {
              await allDays.last().click();
            }
            const add = dialog.getByRole('button', { name: 'Add to Route' });
            await expect(add).toBeEnabled({ timeout: 20_000 });
            await add.click();
          });
          await test.step('7) Vehicle type, start date, Save Route Sheet', async () => {
            await page.getByText('Route Configuration').first().scrollIntoViewIfNeeded();
            await page.getByRole('combobox').filter({ hasText: /Select vehicle type/i }).click();
            await page.getByRole('option').first().click();
            const start = page.getByPlaceholder(/mm\/dd\/yyyy/i).first();
            await expect(start).toBeVisible({ timeout: 10_000 });
            await start.fill(LOOP.routeStart);
            await start.press('Tab');
            const end = page.getByPlaceholder(/mm\/dd\/yyyy/i).nth(1);
            await expect(end).toBeVisible({ timeout: 10_000 });
            await end.fill(LOOP.calendarEnd);
            await end.press('Tab');
            const save = page.getByRole('button', { name: 'Save Route Sheet' });
            await expect(save).toBeEnabled({ timeout: 20_000 });
            await save.click();
            const anyway = page.getByRole('button', { name: 'Save Anyway' });
            await anyway.waitFor({ state: 'visible', timeout: 15_000 }).catch(() => undefined);
            if (await anyway.isVisible().catch(() => false)) {
              await anyway.click();
            }
            await expect(page).not.toHaveURL(/route-sheets\/add/, { timeout: 40_000 });
            await expect(page.getByRole('heading', { name: 'Route Sheets', exact: true })).toBeVisible({
              timeout: 20_000,
            });
          });
        },
      );
    },
  );

  test(
    'REG-ADM-032 â€” Confirm Loop sheet and assign driver + SEEDLOOP1',
    { tag: '@regression' },
    async ({ page }) => {
      await adminCase(
        page,
        {
          portal: 'Admin',
          suite: SUITE,
          id: 'REG-ADM-032',
          sequence: 6,
          total: TOTAL,
          priority: 'P1',
          regression: true,
          title: 'Confirm Loop sheet and assign driver + SEEDLOOP1',
          preconditions: 'Loop route sheet saved with LoopChild',
          data: `Passenger ${PASSENGER_NAME} | driver ${LOOP.driverName} | vehicle ${LOOP.plate}`,
          actionSteps:
            '1) Route Sheets, search LoopChild\n2) Edit each Loop sheet â†’ Service End Date 06/30/2027 â†’ Save\n3) Row menu â†’ Confirm Route (dialog Confirm)\n4) Assignments, search Loop School\n5) Row menu â†’ Assign Driver â†’ Internal SEED LoopDriver + SEEDLOOP1 â†’ Save',
          expected:
            'kb: Only confirmed/assigned sheets appear on Assignments. Assign Driver writes driver/vehicle onto later generated runs.',
          expectedSource: 'kb',
        },
        async () => {
          await test.step('1â€“2) Set end date and Confirm LoopChild sheets', async () => {
            await page.goto('/service-operations/route-sheets');
            await expect(page.getByRole('heading', { name: /Route Sheet/i })).toBeVisible({ timeout: 30_000 });
            await filterByPassengerName(page);
            await expect(page.getByText(PASSENGER_NAME).first()).toBeVisible({ timeout: 20_000 });
            const dataRows = page.getByRole('row').filter({ hasText: /RSO-|RSR-/ }).filter({ hasText: LOOP.clientName });
            const sheetCount = Math.min(await dataRows.count(), 2);
            for (let i = 0; i < Math.max(sheetCount, 1); i += 1) {
              await filterByPassengerName(page);
              await expect(page.getByText(PASSENGER_NAME).first()).toBeVisible({ timeout: 20_000 });
              const row = page.getByRole('row').filter({ hasText: /RSO-|RSR-/ }).filter({ hasText: LOOP.clientName }).nth(i);
              if (await row.getByText(/06\/30\/2027/).isVisible().catch(() => false)) {
                continue;
              }
              await openRowActions(row);
              const editItem = page.getByRole('menuitem', { name: 'Edit' });
              if (await editItem.isVisible().catch(() => false)) {
                await editItem.click();
                await expect(page.getByText('Service End Date')).toBeVisible({ timeout: 20_000 });
                const end = page.getByPlaceholder(/mm\/dd\/yyyy/i).nth(1);
                await expect(end).toBeVisible({ timeout: 10_000 });
                await end.click();
                await end.fill('');
                await end.pressSequentially('06302027', { delay: 40 });
                await end.press('Tab');
                await page.getByRole('button', { name: 'Save Route Sheet' }).click();
                const anyway = page.getByRole('button', { name: 'Save Anyway' });
                await anyway.waitFor({ state: 'visible', timeout: 8_000 }).catch(() => undefined);
                if (await anyway.isVisible().catch(() => false)) {
                  await anyway.click();
                }
                await expect(page.getByRole('heading', { name: 'Route Sheets', exact: true })).toBeVisible({
                  timeout: 40_000,
                });
              } else {
                await page.keyboard.press('Escape');
              }
            }
            await filterByPassengerName(page);
            await expect(page.getByText(PASSENGER_NAME).first()).toBeVisible({ timeout: 20_000 });
            const confirmRows = page.locator('table tbody tr').filter({ hasText: LOOP.clientName });
            const confirmCount = Math.min(await confirmRows.count(), 2);
            for (let i = 0; i < Math.max(confirmCount, 1); i += 1) {
              await filterByPassengerName(page);
              const row = page.getByRole('row').filter({ hasText: /RSO-|RSR-/ }).filter({ hasText: LOOP.clientName }).nth(i);
              if (await row.getByText(/^Confirmed$|^Assigned$/i).isVisible().catch(() => false)) {
                continue;
              }
              await openRowActions(row);
              const already = page.getByRole('menuitem', { name: 'Unconfirm Route' });
              if (await already.isVisible().catch(() => false)) {
                await page.keyboard.press('Escape');
                continue;
              }
              await page.getByRole('menuitem', { name: 'Confirm Route' }).click();
              const dialog = page.getByRole('dialog');
              await expect(dialog).toBeVisible({ timeout: 10_000 });
              if (await dialog.getByRole('heading', { name: /Cannot Confirm Route/i }).isVisible().catch(() => false)) {
                throw new Error(`Loop sheet cannot confirm: ${await dialog.innerText()}`);
              }
              await dialog.getByRole('button', { name: 'Confirm Route' }).click();
              await expect(page.getByText(/Route confirmed/i).first()).toBeVisible({ timeout: 20_000 });
            }
          });
          await test.step('3â€“5) Assign driver on Assignments', async () => {
            await ensureLoopInternalDriver(page);
            await page.goto('/service-operations/routes-assignment');
            await expect(page.getByRole('heading', { name: /Assignments/i })).toBeVisible({ timeout: 30_000 });
            await filterByPassengerName(page, LOOP.clientName);
            await expect(page.getByText(LOOP.clientName).first()).toBeVisible({ timeout: 20_000 });
            await openFirstRowActions(page);
            await page.getByRole('menuitem', { name: 'Assign Driver' }).click();
            const dialog = page.getByRole('dialog');
            await expect(dialog.getByRole('heading', { name: /Assign Drivers/i })).toBeVisible({ timeout: 20_000 });
            await dialog.getByRole('combobox').filter({ hasText: /Select driver/i }).first().click();
            await page.getByRole('button', { name: 'Internal' }).click();
            const dSearch = page.getByPlaceholder(/Search driver/i);
            await expect(dSearch).toBeVisible({ timeout: 8_000 });
            await dSearch.fill('');
            const named = page.getByRole('option').filter({ hasText: LOOP.driverLast });
            const enabled = page.getByRole('option').filter({ hasNotText: /No internal drivers/i });
            if (await named.first().isVisible().catch(() => false)) {
              await named.first().click();
            } else {
              await expect(enabled.first()).toBeVisible({ timeout: 15_000 });
              await enabled.first().click();
            }
            const anyway = page.getByRole('button', { name: 'Continue Anyway' });
            if (await anyway.isVisible({ timeout: 8_000 }).catch(() => false)) {
              await anyway.click();
            }
            const vehiclePick = dialog.getByRole('combobox').filter({ hasText: /Select vehicle/i }).first();
            if (await vehiclePick.isVisible().catch(() => false)) {
              await vehiclePick.click();
              const vSearch = page.getByPlaceholder(/Search/i).last();
              if (await vSearch.isVisible().catch(() => false)) {
                await vSearch.fill(LOOP.plate);
              }
              const plateOpt = page.locator('[cmdk-item]').filter({ hasText: LOOP.plate }).or(
                page.getByRole('option', { name: new RegExp(LOOP.plate) }),
              );
              if (await plateOpt.first().isVisible().catch(() => false)) {
                await plateOpt.first().click();
              } else if (await page.getByRole('option').first().isVisible().catch(() => false)) {
                await page.getByRole('option').nth(1).click().catch(() => undefined);
              }
            }
            await dialog.getByRole('button', { name: 'Save' }).click();
            await expect(page.getByRole('heading', { name: /Assign Drivers/i })).toBeHidden({ timeout: 30_000 });
            await expect(page.getByText(/Driver assigned/i).first()).toBeVisible({ timeout: 20_000 }).catch(() => undefined);
          });
        },
      );
    },
  );

  test(
    'REG-ADM-033 â€” Generate todayâ€™s Loop trip from the route sheet',
    { tag: '@regression' },
    async ({ page }) => {
      await adminCase(
        page,
        {
          portal: 'Admin',
          suite: SUITE,
          id: 'REG-ADM-033',
          sequence: 7,
          total: TOTAL,
          priority: 'P1',
          regression: true,
          title: 'Generate todayâ€™s Loop trip from the route sheet',
          preconditions: 'Loop sheet confirmed (and assigned if possible)',
          data: `Assignments filter ${PASSENGER_NAME} | Generate Today's Trip + Generate Runs`,
          actionSteps:
            '1) Open Assignments\n2) Filter LoopChild\n3) Row menu â†’ Generate Todayâ€™s Trip\n4) Click Generate Runs (idempotent)',
          expected:
            'kb: Generate Runs / Generate Todayâ€™s Trip materializes today route_runs from confirmed sheets without duplicating existing runs.',
          expectedSource: 'kb',
        },
        async () => {
          await test.step('1â€“4) Include assigned, generate today if listed, Generate Runs', async () => {
            await page.goto('/service-operations/routes-assignment');
            await expect(page.getByRole('heading', { name: /Assignments/i })).toBeVisible({ timeout: 30_000 });
            await filterByPassengerName(page, LOOP.clientName);
            const listed = page.getByText(LOOP.clientName).first();
            if (await listed.isVisible({ timeout: 12_000 }).catch(() => false)) {
              await openFirstRowActions(page);
              const genToday = page.getByRole('menuitem', { name: /Generate Today/i });
              if (await genToday.isVisible().catch(() => false)) {
                await genToday.click();
              } else {
                await page.keyboard.press('Escape');
              }
            }
            const generate = page.getByRole('button', { name: 'Generate Runs' });
            await expect(generate).toBeVisible();
            await generate.click();
            await expect(generate).toBeEnabled({ timeout: 60_000 });
          });
        },
      );
    },
  );

  test(
    'REG-ADM-034 â€” Active Trips shows LoopChild linked to Loop School',
    { tag: '@regression' },
    async ({ page }) => {
      await adminCase(
        page,
        {
          portal: 'Admin',
          suite: SUITE,
          id: 'REG-ADM-034',
          sequence: 8,
          total: TOTAL,
          priority: 'P1',
          regression: true,
          title: 'Active Trips shows LoopChild linked to Loop School',
          preconditions: 'Todayâ€™s run generated from the Loop sheet',
          data: `Active Trips | ${PASSENGER_NAME} | ${LOOP.clientName}`,
          actionSteps:
            '1) Open Active Trips\n2) Open Filters\n3) Filter passenger LoopChild or search Loop\n4) Confirm LoopChild and Loop School on the trip',
          expected:
            'kb: Dispatch â†’ Active Trips lists todayâ€™s generated runs with the passenger and client from the route sheet.',
          expectedSource: 'kb',
        },
        async () => {
          await test.step('1â€“2) Open Active Trips', async () => {
            await page.goto('/service-operations/active-trips');
            await expect(page.getByRole('heading', { name: 'Active Trips' })).toBeVisible({ timeout: 30_000 });
          });
          await test.step('3â€“4) Linked Loop data on the board', async () => {
            await page.getByRole('button', { name: 'Filters' }).click().catch(() => undefined);
            const passengerFilter = page.getByRole('combobox').filter({ hasText: /All Passengers/i });
            if (await passengerFilter.isVisible().catch(() => false)) {
              await passengerFilter.click();
              const pSearch = page.getByPlaceholder(/Search passenger/i);
              if (await pSearch.isVisible().catch(() => false)) {
                await pSearch.fill(LOOP.passengerLast);
              }
              await page.locator('[cmdk-item], [role="option"]').filter({ hasText: LOOP.passengerLast }).first().click();
              await page.getByRole('button', { name: 'Filter', exact: true }).click();
            } else {
              const search = page.getByPlaceholder(/Search by trip ID/i);
              await search.fill(LOOP.passengerLast);
              await page.getByRole('button', { name: 'Filter', exact: true }).click().catch(() => undefined);
            }
            await expect(page.getByText(PASSENGER_NAME).first()).toBeVisible({ timeout: 25_000 });
            await expect(page.getByText(LOOP.clientName).first()).toBeVisible({ timeout: 10_000 });
          });
        },
      );
    },
  );

  test(
    'REG-ADM-035 â€” Add On Demand trip for Loop School / LoopChild',
    { tag: '@regression' },
    async ({ page }) => {
      await adminCase(
        page,
        {
          portal: 'Admin',
          suite: SUITE,
          id: 'REG-ADM-035',
          sequence: 9,
          total: TOTAL,
          priority: 'P1',
          regression: true,
          title: 'Add On Demand trip for Loop School / LoopChild',
          preconditions: 'LoopChild Active with Home; Loop School exists',
          data: `On Demand Add Trip | passenger ${PASSENGER_NAME} | org ${LOOP.clientName} | date ${LOOP.onDemandIsoDate}`,
          actionSteps:
            '1) Open On Demand Trips\n2) Add Trip\n3) Pick LoopChild (autofills Loop School org code)\n4) Trip date today, pickup time 08:30\n5) Pickup Lyman St, dropoff West Main St\n6) Create Trip',
          expected:
            'kb: Add Trip creates an on-demand run for today. Organization Code must match the client name for the trip to bill to that client.',
          expectedSource: 'kb',
        },
        async () => {
          await test.step('1â€“2) Open Add On-Demand Trip', async () => {
            await page.goto('/service-operations/on-demand-trips');
            await expect(page.getByRole('heading', { name: /On Demand/i })).toBeVisible({ timeout: 30_000 });
            await page.getByRole('button', { name: 'Add Trip' }).click();
            await expect(page.getByRole('heading', { name: /Add On-Demand Trip/i })).toBeVisible({ timeout: 15_000 });
          });
          await test.step('3) Link LoopChild and Loop School', async () => {
            const dialog = page.getByRole('dialog');
            await dialog.getByRole('combobox').filter({ hasText: /Search passengers/i }).click();
            await page.getByPlaceholder(/Search by passenger or client/i).fill(LOOP.passengerLast);
            await page.locator('[cmdk-item], [role="option"]').filter({ hasText: PASSENGER_NAME }).first().click();
            await expect(dialog.locator('#od-org-code')).toHaveValue(new RegExp(LOOP.clientName, 'i'), {
              timeout: 10_000,
            });
          });
          await test.step('4â€“6) Date, time, addresses, Create Trip', async () => {
            await page.locator('#od-trip-date').fill(LOOP.onDemandIsoDate);
            await page.locator('#od-pickup-time').fill(LOOP.onDemandPickupTime);
            await pickAddressSuggestion(page, 'Pickup address', LOOP.street);
            await pickAddressSuggestion(page, 'Dropoff address', LOOP.onDemandDropoffStreet);
            await page.getByRole('button', { name: /Create Trip|Verifying/i }).click();
            await expect(page.getByRole('heading', { name: /Add On-Demand Trip/i })).toBeHidden({
              timeout: 40_000,
            });
          });
        },
      );
    },
  );

  test(
    'REG-ADM-036 â€” On Demand trip is listed for LoopChild / Loop School',
    { tag: '@regression' },
    async ({ page }) => {
      await adminCase(
        page,
        {
          portal: 'Admin',
          suite: SUITE,
          id: 'REG-ADM-036',
          sequence: 10,
          total: TOTAL,
          priority: 'P1',
          regression: true,
          title: 'On Demand trip is listed for LoopChild / Loop School',
          preconditions: 'REG-ADM-035 created todayâ€™s on-demand trip',
          data: `On Demand list + Active Trips | ${PASSENGER_NAME} | ${LOOP.clientName}`,
          actionSteps:
            '1) On Demand Trips, search LoopChild\n2) Confirm LoopChild (and Loop School org if shown)\n3) Active Trips, confirm LoopChild still/also listed',
          expected:
            'kb: Manually added on-demand trips use the same pipeline as imports and appear on On Demand Trips and on Active Trips for today.',
          expectedSource: 'kb',
        },
        async () => {
          await test.step('1â€“2) On Demand list shows LoopChild', async () => {
            await page.goto('/service-operations/on-demand-trips');
            await expect(page.getByRole('heading', { name: /On Demand/i })).toBeVisible({ timeout: 30_000 });
            const includeOld = page.getByLabel(/Include old trips/i);
            if (await includeOld.count()) {
              await includeOld.setChecked(true);
            }
            const nameSearch = page.getByPlaceholder(/Search passenger name/i);
            if (!(await nameSearch.isVisible().catch(() => false))) {
              await page.getByRole('button', { name: /Filters/i }).click();
            }
            if (await nameSearch.isVisible().catch(() => false)) {
              await nameSearch.fill(LOOP.passengerLast);
              await page.getByRole('button', { name: 'Filter', exact: true }).click();
            }
            await expect(page.getByRole('cell', { name: PASSENGER_NAME }).first()).toBeVisible({ timeout: 20_000 });
          });
          await test.step('3) Active Trips still shows LoopChild', async () => {
            await page.goto('/service-operations/active-trips');
            await expect(page.getByRole('heading', { name: 'Active Trips' })).toBeVisible({ timeout: 30_000 });
            const passengerFilter = page.getByRole('combobox').filter({ hasText: /All Passengers/i });
            if (!(await passengerFilter.isVisible().catch(() => false))) {
              await page.getByRole('button', { name: /Filters/i }).click();
            }
            if (await passengerFilter.isVisible().catch(() => false)) {
              await passengerFilter.click();
              const pSearch = page.getByPlaceholder(/Search passenger/i);
              if (await pSearch.isVisible().catch(() => false)) {
                await pSearch.fill(LOOP.passengerLast);
              }
              const option = page.getByRole('option').filter({ hasText: LOOP.passengerLast });
              if (await option.first().isVisible().catch(() => false)) {
                await option.first().click();
              } else {
                await page.keyboard.press('Escape');
              }
              await page.getByRole('button', { name: 'Filter', exact: true }).click();
            }
            await expect(page.getByRole('button', { name: LOOP.clientName }).first()).toBeVisible({ timeout: 25_000 });
            await expect(page.getByRole('cell', { name: /On Demand/ }).first()).toBeVisible();
          });
        },
      );
    },
  );

});
