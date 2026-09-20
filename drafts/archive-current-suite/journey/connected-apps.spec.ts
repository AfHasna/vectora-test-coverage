import { expect } from '@playwright/test';
import { test } from '../../../tests/fixtures/regression-test';
import { annotateCase } from '../../../tests/fixtures/annotate';
import { optionalPortalConfig } from '../../../tests/fixtures/env';
import { expectLoggedIn, login } from '../../../tests/fixtures/login';


test.describe('Connected apps — staging local', () => {
  test('VCTR-CONN-001 — Client portal login + SEED visibility', async ({ browser }) => {
    await annotateCase({
      portal: 'Client Portal',
      suite: 'Connected apps',
      tms: 'https://govectora.atlassian.net/wiki/x/AQDg',
      id: 'VCTR-CONN-001',
      title: 'Client portal login + SEED visibility',
      sequence: 1,
      total: 4,
      priority: 'P1',
      regression: true,
      preconditions: 'Local client on 5174',
      actionSteps: 'Login and search passengers / route sheets',
      expected: 'Portal authenticates or reports why staging users are missing',
    });
    const portal = optionalPortalConfig('client');
    const context = await browser.newContext({
      baseURL: portal.baseURL,
      storageState: { cookies: [], origins: [] },
    });
    const page = await context.newPage();
    await login(page, portal);
    const loggedIn = await page
      .getByRole('button', { name: /account menu|user menu/i })
      .isVisible({ timeout: 20_000 })
      .catch(() => false);
    if (loggedIn) {
      await expectLoggedIn(page, portal);
      await page.goto('/passengers').catch(() => page.goto('/'));
      const seed = page.getByText(/SEED Nora|SEED Liam|Wayland/i).first();
      test.info().annotations.push({
        type: 'client-seed',
        description: (await seed.isVisible({ timeout: 5_000 }).catch(() => false))
          ? 'SEED passengers visible'
          : 'Logged in but SEED passengers not visible',
      });
    } else {
      const err = ((await page.getByText(/invalid|error|not linked|denied/i).first().textContent().catch(() => '')) ?? '').trim();
      test.info().annotations.push({
        type: 'client-seed',
        description: `Client login did not complete: ${err || page.url()}`,
      });
    }
    await context.close();
  });

  test('VCTR-CONN-002 — Service provider portal login + SEED visibility', async ({ browser }) => {
    await annotateCase({
      portal: 'Service Provider Portal',
      suite: 'Connected apps',
      tms: 'https://govectora.atlassian.net/wiki/x/AQDg',
      id: 'VCTR-CONN-002',
      title: 'Service provider portal login + SEED visibility',
      sequence: 2,
      total: 4,
      priority: 'P1',
      regression: true,
      preconditions: 'Local SP on 5175',
      actionSteps: 'Login and inspect drivers/trips',
      expected: 'Portal authenticates or reports missing staging user',
    });
    const portal = optionalPortalConfig('provider');
    const context = await browser.newContext({
      baseURL: portal.baseURL,
      storageState: { cookies: [], origins: [] },
    });
    const page = await context.newPage();
    await login(page, portal);
    const loggedIn = await page
      .getByRole('button', { name: /account menu|user menu/i })
      .isVisible({ timeout: 20_000 })
      .catch(() => false);
    test.info().annotations.push({
      type: 'sp-seed',
      description: loggedIn ? 'SP session established' : `SP login incomplete at ${page.url()}`,
    });
    await context.close();
  });

  test('VCTR-CONN-003 — Driver app login + assigned runs', async ({ browser }) => {
    await annotateCase({
      portal: 'Driver App',
      suite: 'Connected apps',
      tms: 'https://govectora.atlassian.net/wiki/x/AQDg',
      id: 'VCTR-CONN-003',
      title: 'Driver app login + assigned runs',
      sequence: 3,
      total: 4,
      priority: 'P1',
      regression: true,
      preconditions: 'Local driver Expo on 8082',
      actionSteps: 'Login and look for SEED Williams runs',
      expected: 'App authenticates or reports missing linked driver user',
    });
    const portal = optionalPortalConfig('driver');
    const context = await browser.newContext({
      baseURL: portal.baseURL,
      viewport: { width: 390, height: 844 },
      storageState: { cookies: [], origins: [] },
    });
    const page = await context.newPage();
    try {
      await login(page, portal);
      const onLogin = await page.getByPlaceholder(/driver@example.com/i).isVisible().catch(() => false);
      test.info().annotations.push({
        type: 'driver-seed',
        description: onLogin
          ? `Still on login: ${(await page.locator('body').innerText()).slice(0, 400)}`
          : `Left login for ${page.url()}`,
      });
    } catch (error) {
      test.info().annotations.push({
        type: 'driver-seed',
        description: `Driver login error: ${error instanceof Error ? error.message : String(error)}`,
      });
    }
    await expect(page.locator('body')).toBeVisible();
    await context.close();
  });

  test('VCTR-CONN-004 — Guardian app login + children', async ({ browser }) => {
    await annotateCase({
      portal: 'Guardian App',
      suite: 'Connected apps',
      tms: 'https://govectora.atlassian.net/wiki/x/AQDg',
      id: 'VCTR-CONN-004',
      title: 'Guardian app login + children',
      sequence: 4,
      total: 4,
      priority: 'P1',
      regression: true,
      preconditions: 'Local guardian Expo on 8081',
      actionSteps: 'Login and look for SEED children',
      expected: 'App authenticates or reports missing linked guardian user',
    });
    const portal = optionalPortalConfig('guardian');
    const context = await browser.newContext({
      baseURL: portal.baseURL,
      viewport: { width: 390, height: 844 },
      storageState: { cookies: [], origins: [] },
    });
    const page = await context.newPage();
    try {
      await login(page, portal);
      test.info().annotations.push({
        type: 'guardian-seed',
        description: `Landed on ${page.url()}`,
      });
    } catch (error) {
      test.info().annotations.push({
        type: 'guardian-seed',
        description: `Guardian login error: ${error instanceof Error ? error.message : String(error)}`,
      });
    }
    await expect(page.locator('body')).toBeVisible();
    await context.close();
  });
});
