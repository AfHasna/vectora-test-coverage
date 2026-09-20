import { expect, test, type Browser, type Page } from '@playwright/test';
import { connCase } from '../../fixtures/annotate';
import { optionalPortalConfig, type PortalConfig, type PortalKey } from '../../fixtures/env';
import { expectLoggedIn, login } from '../../fixtures/login';
import { installReadOnlyGuard } from '../../fixtures/read-only-guard';
import { LOOP } from '../admin/_helpers/loop-data';
import { applyClientSearch, waitPageHeading as waitClientHeading } from '../client/_helpers/client-ui';
import { applySpSearch, waitPageHeading as waitSpHeading } from '../service-provider/_helpers/sp-ui';
import { openDriverTab } from '../driver-app/_helpers/driver-ui';
import { expectNotKellySession, openGuardianTab } from '../guardian-app/_helpers/guardian-ui';

const TOTAL = 4;
const SUITE = 'Connected apps';

test.describe.configure({ mode: 'serial', timeout: 180_000 });

function withCreds(key: PortalKey, email: string, password: string): PortalConfig {
  const base = optionalPortalConfig(key);
  return {
    ...base,
    credentials: { ...base.credentials, email, password },
  };
}

async function openPortal(
  browser: Browser,
  portal: PortalConfig,
  viewport: { width: number; height: number },
  run: (page: Page) => Promise<void>,
): Promise<void> {
  const context = await browser.newContext({
    baseURL: portal.baseURL,
    viewport,
  });
  const page = await context.newPage();
  try {
    await installReadOnlyGuard(page);
    await login(page, portal);
    await expectLoggedIn(page, portal);
    await run(page);
  } finally {
    await context.close();
  }
}

const desktop = { width: 1280, height: 800 };
const mobile = { width: 390, height: 844 };

test.describe('REG-CONN cross-app Loop chain', () => {
  test('REG-CONN-001 — Client portal shows LoopChild', { tag: ['@regression', '@basic'] }, async ({ browser }) => {
    const portal = withCreds('client', LOOP.clientEmail, LOOP.clientPortalPassword);
    await openPortal(browser, portal, desktop, async (page) => {
      await connCase(
        page,
        {
          portal: 'Client',
          suite: SUITE,
          id: 'REG-CONN-001',
          sequence: 1,
          total: TOTAL,
          priority: 'P1',
          regression: true,
          basic: true,
          title: 'Client portal shows LoopChild',
          preconditions: 'Loop School portal user; Admin Loop graph; Client :5174',
          data: LOOP.clientEmail,
          actionSteps: '1) Sign in as Loop School 2) Open Passengers 3) Confirm SEED LoopChild',
          expected: 'kb: Client sees only its passengers. LoopChild belongs to Loop School.',
          expectedSource: 'kb',
        },
        async () => {
          await page.goto('/passengers');
          await waitClientHeading(page, 'Passengers');
          await applyClientSearch(page, 'Search passengers...', LOOP.passengerLast);
          await expect(page.getByRole('button', { name: LOOP.passengerName, exact: true }).first()).toBeVisible({
            timeout: 20_000,
          });
        },
      );
    });
  });

  test(
    'REG-CONN-002 — SP portal does not show Internal LoopDriver or LoopChild',
    { tag: ['@regression', '@basic'] },
    async ({ browser }) => {
      const portal = withCreds('provider', LOOP.spEmail, LOOP.spPortalPassword);
      await openPortal(browser, portal, desktop, async (page) => {
        await connCase(
          page,
          {
            portal: 'Service Provider',
            suite: SUITE,
            id: 'REG-CONN-002',
            sequence: 2,
            total: TOTAL,
            priority: 'P1',
            regression: true,
            basic: true,
            title: 'SP portal does not show Internal LoopDriver or LoopChild',
            preconditions: '3B Trans seed.qe.sp; Loop sheets assigned Internal',
            data: `${LOOP.spEmail} | ${LOOP.spCompany}`,
            actionSteps:
              '1) Sign in as 3B Trans 2) Drivers — LoopDriver absent 3) Active Trips — LoopChild absent',
            expected:
              'kb: Provider sees this org only. Internal LoopDriver/LoopChild stay off 3B Trans.',
            expectedSource: 'kb',
          },
          async () => {
            await expect(page.getByRole('heading', { name: 'Dashboard' }).first()).toBeVisible({ timeout: 25_000 });
            await page.getByRole('button', { name: /profile menu/i }).click();
            await expect(page.getByText(LOOP.spCompany).first()).toBeVisible();
            await expect(page.getByText(LOOP.clientName)).toHaveCount(0);
            await page.keyboard.press('Escape');
            await page.goto('/workforce/drivers');
            await waitSpHeading(page, 'Drivers');
            await applySpSearch(page, 'Search by driver name…', LOOP.driverLast);
            await expect(page.getByText(LOOP.driverName)).toHaveCount(0);
            await page.goto('/trips/active-trips');
            await waitSpHeading(page, 'Active Trips');
            await applySpSearch(page, 'Search by trip, driver, monitor…', LOOP.passengerLast);
            await expect(page.getByText(LOOP.passengerName)).toHaveCount(0);
          },
        );
      });
    },
  );

  test(
    'REG-CONN-003 — Driver app is Ahmad-scoped, not LoopChild',
    { tag: ['@regression', '@basic'] },
    async ({ browser }) => {
      const portal = withCreds('driver', LOOP.seedDriverEmail, LOOP.seedDriverPassword);
      await openPortal(browser, portal, mobile, async (page) => {
        await connCase(
          page,
          {
            portal: 'Driver',
            suite: SUITE,
            id: 'REG-CONN-003',
            sequence: 3,
            total: TOTAL,
            priority: 'P1',
            regression: true,
            basic: true,
            title: 'Driver app is Ahmad-scoped, not LoopChild',
            preconditions: 'Driver Expo :8082; seed.qe.driver; Loop run assigned to Internal LoopDriver',
            data: LOOP.seedDriverEmail,
            actionSteps: '1) Sign in as Ahmad 2) Home 3) Confirm LoopChild is absent',
            expected:
              'kb: Driver sees only his assignments. Internal LoopChild stays off Ahmad’s board.',
            expectedSource: 'kb',
          },
          async () => {
            await expect(page.getByText(/Hello,/i).first()).toBeVisible({ timeout: 25_000 });
            await expect(page.getByText(/Hello, SEED/i)).toHaveCount(0);
            await openDriverTab(page, 'Home');
            await expect(page.getByText(LOOP.passengerName)).toHaveCount(0);
            await expect(page.getByText(LOOP.driverName)).toHaveCount(0);
          },
        );
      });
    },
  );

  test('REG-CONN-004 — Parent app shows LoopChild', { tag: ['@regression', '@basic'] }, async ({ browser }) => {
    const portal = withCreds('guardian', LOOP.guardianEmail, LOOP.guardianMobilePassword);
    await openPortal(browser, portal, mobile, async (page) => {
      await connCase(
        page,
        {
          portal: 'Parent',
          suite: SUITE,
          id: 'REG-CONN-004',
          sequence: 4,
          total: TOTAL,
          priority: 'P1',
          regression: true,
          basic: true,
          title: 'Parent app shows LoopChild',
          preconditions: 'Parent Expo :8081; LoopParent mobile access Active',
          data: LOOP.guardianEmail,
          actionSteps: '1) Sign in as LoopParent 2) Open More 3) Confirm LoopChild on Passengers',
          expected:
            'kb: Parent-app login is the guardian mobile account. LoopParent sees LoopChild, not Kelly/Aiden.',
          expectedSource: 'kb',
        },
        async () => {
          await expect(page.getByText(/Hello,/i).first()).toBeVisible({ timeout: 25_000 });
          await expectNotKellySession(page);
          await openGuardianTab(page, 'More');
          await expect(page.getByText(LOOP.passengerName).first()).toBeVisible({ timeout: 20_000 });
          await expectNotKellySession(page);
        },
      );
    });
  });
});
