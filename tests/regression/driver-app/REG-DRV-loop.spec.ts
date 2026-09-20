import { expect, test } from '../../fixtures/driver-session';
import { driverCase } from '../../fixtures/annotate';
import { LOOP } from '../admin/_helpers/loop-data';
import { openDriverTab } from './_helpers/driver-ui';

const TOTAL = 12;

test.describe.configure({ mode: 'serial' });

test.describe('REG-DRV Loop-connected driver app', () => {
  test('REG-DRV-001 — Home greets Ahmad, not LoopDriver', { tag: ['@regression', '@basic'] }, async ({ page }) => {
    await driverCase(
      page,
      {
        portal: 'Driver',
        suite: 'Home',
        id: 'REG-DRV-001',
        sequence: 1,
        total: TOTAL,
        priority: 'P1',
        regression: true,
        basic: true,
        title: 'Home greets Ahmad, not LoopDriver',
        preconditions: 'Driver Expo web :8082; seed.qe.driver (Ahmad Abu Hasna)',
        data: LOOP.seedDriverEmail,
        actionSteps: '1) After login, read Hello on Home',
        expected: 'known: Hello uses Ahmad’s first name, not SEED LoopDriver.',
        expectedSource: 'known',
      },
      async () => {
        await expect(page.getByText(/Hello,/i).first()).toBeVisible({ timeout: 25_000 });
        await expect(page.getByText(/Hello, SEED/i)).toHaveCount(0);
      },
    );
  });

  test('REG-DRV-002 — Today’s board does not show LoopChild', { tag: ['@regression', '@basic'] }, async ({ page }) => {
    await driverCase(
      page,
      {
        portal: 'Driver',
        suite: 'Home',
        id: 'REG-DRV-002',
        sequence: 2,
        total: TOTAL,
        priority: 'P1',
        regression: true,
        basic: true,
        title: 'Today’s board does not show LoopChild',
        preconditions: 'LoopChild assigned to Internal LoopDriver',
        data: LOOP.passengerName,
        actionSteps: '1) Stay on Home 2) Confirm LoopChild is absent',
        expected: 'kb: This driver only sees his assignments. Internal Loop runs stay off Ahmad’s board.',
        expectedSource: 'kb',
      },
      async () => {
        await openDriverTab(page, 'Home');
        await expect(
          page.getByText(/Hello,/i).or(page.getByText(/No trips scheduled today/i)).first(),
        ).toBeVisible({ timeout: 20_000 });
        await expect(page.getByText(LOOP.passengerName)).toHaveCount(0);
        await expect(page.getByText(LOOP.clientName)).toHaveCount(0);
      },
    );
  });

  test('REG-DRV-003 — Home tab is available', { tag: '@regression' }, async ({ page }) => {
    await driverCase(
      page,
      {
        portal: 'Driver',
        suite: 'Home',
        id: 'REG-DRV-003',
        sequence: 3,
        total: TOTAL,
        priority: 'P2',
        regression: true,
        title: 'Home tab is available',
        preconditions: 'Logged in as Ahmad',
        data: 'Tab Home',
        actionSteps: '1) Assert Home in bottom nav',
        expected: 'common: Bottom nav includes Home.',
        expectedSource: 'common',
      },
      async () => {
        await expect(page.getByRole('tab', { name: 'Home' }).or(page.getByText('Home', { exact: true })).first()).toBeVisible();
      },
    );
  });

  test('REG-DRV-004 — My Trips is Ahmad-scoped', { tag: ['@regression', '@basic'] }, async ({ page }) => {
    await driverCase(
      page,
      {
        portal: 'Driver',
        suite: 'Trips & comms',
        id: 'REG-DRV-004',
        sequence: 4,
        total: TOTAL,
        priority: 'P1',
        regression: true,
        basic: true,
        title: 'My Trips is Ahmad-scoped',
        preconditions: 'Do not Accept or Start a trip',
        data: LOOP.passengerName,
        actionSteps: '1) Open My Trips 2) LoopChild is not listed',
        expected: 'kb: My Trips is this driver’s assignments only.',
        expectedSource: 'kb',
      },
      async () => {
        await openDriverTab(page, 'My Trips');
        await expect(page.getByText(LOOP.passengerName)).toHaveCount(0);
      },
    );
  });

  test('REG-DRV-005 — Trip history filter does not show LoopChild', { tag: '@regression' }, async ({ page }) => {
    await driverCase(
      page,
      {
        portal: 'Driver',
        suite: 'Trips & comms',
        id: 'REG-DRV-005',
        sequence: 5,
        total: TOTAL,
        priority: 'P2',
        regression: true,
        title: 'Trip history filter does not show LoopChild',
        preconditions: 'My Trips',
        data: 'History',
        actionSteps: '1) Tap History if shown 2) LoopChild absent',
        expected: 'common: History is this driver only. Empty is valid.',
        expectedSource: 'common',
      },
      async () => {
        const history = page.getByText('History', { exact: true });
        if (await history.first().isVisible({ timeout: 5_000 }).catch(() => false)) {
          await history.first().click();
        }
        await expect(page.getByText(LOOP.passengerName)).toHaveCount(0);
      },
    );
  });

  test('REG-DRV-006 — Messages tab loads', { tag: '@regression' }, async ({ page }) => {
    await driverCase(
      page,
      {
        portal: 'Driver',
        suite: 'Trips & comms',
        id: 'REG-DRV-006',
        sequence: 6,
        total: TOTAL,
        priority: 'P2',
        regression: true,
        title: 'Messages tab loads',
        preconditions: 'Ahmad session',
        data: 'Messages',
        actionSteps: '1) Open Messages',
        expected: 'common: Messages tab is available.',
        expectedSource: 'common',
      },
      async () => {
        await openDriverTab(page, 'Messages');
        await expect(page.getByText(/No messages yet|Messages/i).first()).toBeVisible({ timeout: 20_000 });
      },
    );
  });

  test('REG-DRV-007 — Notifications tab loads', { tag: '@regression' }, async ({ page }) => {
    await driverCase(
      page,
      {
        portal: 'Driver',
        suite: 'Trips & comms',
        id: 'REG-DRV-007',
        sequence: 7,
        total: TOTAL,
        priority: 'P2',
        regression: true,
        title: 'Notifications tab loads',
        preconditions: 'Ahmad session',
        data: 'Notifications',
        actionSteps: '1) Open Notifications',
        expected: 'common: Notifications tab is available.',
        expectedSource: 'common',
      },
      async () => {
        await openDriverTab(page, 'Notifications');
        await expect(page.getByText(/No notifications|You're all caught up|Notifications/i).first()).toBeVisible({
          timeout: 20_000,
        });
      },
    );
  });

  test('REG-DRV-008 — More shows Ahmad Abu Hasna, not LoopDriver', { tag: ['@regression', '@basic'] }, async ({ page }) => {
    await driverCase(
      page,
      {
        portal: 'Driver',
        suite: 'Profile',
        id: 'REG-DRV-008',
        sequence: 8,
        total: TOTAL,
        priority: 'P1',
        regression: true,
        basic: true,
        title: 'More shows Ahmad Abu Hasna, not LoopDriver',
        preconditions: 'Ahmad session',
        data: LOOP.seedDriverName,
        actionSteps: '1) Open More 2) Read hero name',
        expected: 'known: Name is Ahmad Abu Hasna, not SEED LoopDriver.',
        expectedSource: 'known',
      },
      async () => {
        await openDriverTab(page, 'More');
        await expect(page.getByText(LOOP.seedDriverName).or(page.getByText(LOOP.seedDriverFirst)).first()).toBeVisible({
          timeout: 20_000,
        });
        await expect(page.getByText(LOOP.driverName)).toHaveCount(0);
      },
    );
  });

  test('REG-DRV-009 — More lists account, compliance, vehicles, equipment', { tag: '@regression' }, async ({ page }) => {
    await driverCase(
      page,
      {
        portal: 'Driver',
        suite: 'Profile',
        id: 'REG-DRV-009',
        sequence: 9,
        total: TOTAL,
        priority: 'P2',
        regression: true,
        title: 'More lists account, compliance, vehicles, equipment',
        preconditions: 'More tab',
        data: 'more-row-*',
        actionSteps: '1) Assert the four detail rows',
        expected: 'common: More exposes Account Information, Compliance, Vehicles, Equipment.',
        expectedSource: 'common',
      },
      async () => {
        await expect(page.getByTestId('more-row-account-info')).toBeVisible();
        await expect(page.getByTestId('more-row-compliance')).toBeVisible();
        await expect(page.getByTestId('more-row-vehicles')).toBeVisible();
        await expect(page.getByTestId('more-row-equipment')).toBeVisible();
      },
    );
  });

  test('REG-DRV-010 — Log Out is present (do not tap)', { tag: '@regression' }, async ({ page }) => {
    await driverCase(
      page,
      {
        portal: 'Driver',
        suite: 'Profile',
        id: 'REG-DRV-010',
        sequence: 10,
        total: TOTAL,
        priority: 'P2',
        regression: true,
        title: 'Log Out is present (do not tap)',
        preconditions: 'More tab',
        data: 'Log Out',
        actionSteps: '1) Assert Log Out 2) Do not tap',
        expected: 'common: Driver can sign out from More. This case does not sign out.',
        expectedSource: 'common',
      },
      async () => {
        await expect(page.getByText('Log Out').first()).toBeVisible();
      },
    );
  });

  test('REG-DRV-011 — Account Information opens', { tag: '@regression' }, async ({ page }) => {
    await driverCase(
      page,
      {
        portal: 'Driver',
        suite: 'Profile',
        id: 'REG-DRV-011',
        sequence: 11,
        total: TOTAL,
        priority: 'P2',
        regression: true,
        title: 'Account Information opens',
        preconditions: 'Last navigation — Expo Back can expire web session',
        data: 'Account Information',
        actionSteps: '1) Open Account Information 2) Do not Back',
        expected: 'common: Account Information is readable.',
        expectedSource: 'common',
      },
      async () => {
        await page.getByTestId('more-row-account-info').click();
        await expect(page.getByText(/Account Information/i).first()).toBeVisible({ timeout: 20_000 });
      },
    );
  });

  test('REG-DRV-012 — LoopChild still not on this driver session', { tag: '@regression' }, async ({ page }) => {
    await driverCase(
      page,
      {
        portal: 'Driver',
        suite: 'Profile',
        id: 'REG-DRV-012',
        sequence: 12,
        total: TOTAL,
        priority: 'P1',
        regression: true,
        title: 'LoopChild still not on this driver session',
        preconditions: 'Current screen after 011',
        data: LOOP.passengerName,
        actionSteps: '1) Assert LoopChild is absent',
        expected: 'kb: Ahmad’s session never shows LoopChild.',
        expectedSource: 'kb',
      },
      async () => {
        await expect(page.getByText(LOOP.passengerName)).toHaveCount(0);
        await expect(page.getByText(LOOP.driverName)).toHaveCount(0);
      },
    );
  });
});
