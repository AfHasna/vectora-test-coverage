import { expect, test } from '../../fixtures/guardian-session';
import { parentCase } from '../../fixtures/annotate';
import { LOOP } from '../admin/_helpers/loop-data';
import { expectNotKellySession, openGuardianTab } from './_helpers/guardian-ui';

const TOTAL = 12;

test.describe.configure({ mode: 'serial', timeout: 120_000 });

test.describe('REG-PAR Loop-connected parent app', () => {
  test('REG-PAR-001 — Home greets the Loop parent', { tag: ['@regression', '@basic'] }, async ({ page }) => {
    await parentCase(
      page,
      {
        portal: 'Parent',
        suite: 'Home',
        id: 'REG-PAR-001',
        sequence: 1,
        total: TOTAL,
        priority: 'P1',
        regression: true,
        basic: true,
        title: 'Home greets the Loop parent',
        preconditions: 'Parent Expo web :8081; seed.qe.loop.parent (SEED LoopParent)',
        data: LOOP.guardianEmail,
        actionSteps: '1) After login, read Hello on Home',
        expected: 'known: Greeting is Hello plus SEED/Seed. This is LoopParent, not the Stage 0 Kelly parent.',
        expectedSource: 'known',
      },
      async () => {
        await expect(page.getByText(/Hello,/i).first()).toBeVisible({ timeout: 25_000 });
        await expectNotKellySession(page);
      },
    );
  });

  test('REG-PAR-002 — Home is LoopChild-scoped, not Kelly/Aiden', { tag: ['@regression', '@basic'] }, async ({ page }) => {
    await parentCase(
      page,
      {
        portal: 'Parent',
        suite: 'Home',
        id: 'REG-PAR-002',
        sequence: 2,
        total: TOTAL,
        priority: 'P1',
        regression: true,
        basic: true,
        title: 'Home is LoopChild-scoped, not Kelly/Aiden',
        preconditions: 'LoopChild linked to LoopParent',
        data: LOOP.passengerName,
        actionSteps: '1) Stay on Home 2) Confirm LoopChild may appear on today’s cards; Kelly/Aiden do not',
        expected: 'kb: Parent only sees their linked children. LoopChild is this user; Aiden is not.',
        expectedSource: 'kb',
      },
      async () => {
        await openGuardianTab(page, 'Home');
        await expect(
          page.getByText(/Hello,/i).or(page.getByText(/No trips scheduled today/i)).first(),
        ).toBeVisible({ timeout: 20_000 });
        await expectNotKellySession(page);
      },
    );
  });

  test('REG-PAR-003 — Home tab is available', { tag: '@regression' }, async ({ page }) => {
    await parentCase(
      page,
      {
        portal: 'Parent',
        suite: 'Home',
        id: 'REG-PAR-003',
        sequence: 3,
        total: TOTAL,
        priority: 'P2',
        regression: true,
        title: 'Home tab is available',
        preconditions: 'Logged in as LoopParent',
        data: 'Tab Home',
        actionSteps: '1) Open Home tab',
        expected: 'common: Home tab stays available.',
        expectedSource: 'common',
      },
      async () => {
        await openGuardianTab(page, 'Home');
        await expect(page.getByRole('tab', { name: 'Home' }).first()).toBeVisible();
      },
    );
  });

  test('REG-PAR-004 — Trips scheduled list is LoopParent-scoped', { tag: ['@regression', '@basic'] }, async ({ page }) => {
    await parentCase(
      page,
      {
        portal: 'Parent',
        suite: 'Trips',
        id: 'REG-PAR-004',
        sequence: 4,
        total: TOTAL,
        priority: 'P1',
        regression: true,
        basic: true,
        title: 'Trips scheduled list is LoopParent-scoped',
        preconditions: 'Loop sheets / OD for LoopChild',
        data: LOOP.passengerName,
        actionSteps: '1) Open Trips 2) Stay on Scheduled 3) Confirm LoopChild if a trip exists, never Aiden',
        expected: 'kb: Scheduled trips belong to this parent’s children. Empty list is allowed when no Sunday run.',
        expectedSource: 'kb',
      },
      async () => {
        await openGuardianTab(page, 'Trips');
        await expect(page.getByText(/^Trips$/).or(page.getByText('Scheduled')).first()).toBeVisible({
          timeout: 20_000,
        });
        await expectNotKellySession(page);
      },
    );
  });

  test('REG-PAR-005 — Trip history tab loads', { tag: '@regression' }, async ({ page }) => {
    await parentCase(
      page,
      {
        portal: 'Parent',
        suite: 'Trips',
        id: 'REG-PAR-005',
        sequence: 5,
        total: TOTAL,
        priority: 'P2',
        regression: true,
        title: 'Trip history tab loads',
        preconditions: 'Trips screen',
        data: 'History',
        actionSteps: '1) Open History 2) Do not mutate',
        expected: 'common: History tab loads. Empty is allowed.',
        expectedSource: 'common',
      },
      async () => {
        await page.getByText('History', { exact: true }).first().click();
        await expect(
          page.getByText('History').or(page.getByText(/No past trips yet/i)).first(),
        ).toBeVisible({ timeout: 15_000 });
        await expectNotKellySession(page);
      },
    );
  });

  test('REG-PAR-006 — Messages tab loads', { tag: '@regression' }, async ({ page }) => {
    await parentCase(
      page,
      {
        portal: 'Parent',
        suite: 'Messages',
        id: 'REG-PAR-006',
        sequence: 6,
        total: TOTAL,
        priority: 'P2',
        regression: true,
        title: 'Messages tab loads',
        preconditions: 'LoopParent session',
        data: 'Tab Messages',
        actionSteps: '1) Open Messages',
        expected: 'common: Messages shell loads.',
        expectedSource: 'common',
      },
      async () => {
        await openGuardianTab(page, 'Messages');
        await expect(page.getByRole('tab', { name: 'Messages' }).first()).toBeVisible();
      },
    );
  });

  test('REG-PAR-007 — Notifications tab loads', { tag: '@regression' }, async ({ page }) => {
    await parentCase(
      page,
      {
        portal: 'Parent',
        suite: 'Notifications',
        id: 'REG-PAR-007',
        sequence: 7,
        total: TOTAL,
        priority: 'P2',
        regression: true,
        title: 'Notifications tab loads',
        preconditions: 'LoopParent session',
        data: 'Tab Notifications',
        actionSteps: '1) Open Notifications',
        expected: 'common: Notifications shell loads.',
        expectedSource: 'common',
      },
      async () => {
        await openGuardianTab(page, 'Notifications');
        await expect(page.getByRole('tab', { name: 'Notifications' }).first()).toBeVisible();
      },
    );
  });

  test('REG-PAR-008 — More shows SEED LoopParent, not Kelly', { tag: ['@regression', '@basic'] }, async ({ page }) => {
    await parentCase(
      page,
      {
        portal: 'Parent',
        suite: 'More',
        id: 'REG-PAR-008',
        sequence: 8,
        total: TOTAL,
        priority: 'P1',
        regression: true,
        basic: true,
        title: 'More shows SEED LoopParent, not Kelly',
        preconditions: 'LoopParent session',
        data: LOOP.guardianName,
        actionSteps: '1) Open More 2) Read hero name',
        expected: 'known: Profile name is SEED LoopParent (or LoopParent). Not the Stage 0 Kelly parent.',
        expectedSource: 'known',
      },
      async () => {
        await openGuardianTab(page, 'More');
        await expect(
          page.getByText(LOOP.guardianName).or(page.getByText(LOOP.guardianLast)).first(),
        ).toBeVisible({ timeout: 20_000 });
        await expectNotKellySession(page);
      },
    );
  });

  test('REG-PAR-009 — Passengers list includes LoopChild', { tag: ['@regression', '@basic'] }, async ({ page }) => {
    await parentCase(
      page,
      {
        portal: 'Parent',
        suite: 'More',
        id: 'REG-PAR-009',
        sequence: 9,
        total: TOTAL,
        priority: 'P1',
        regression: true,
        basic: true,
        title: 'Passengers list includes LoopChild',
        preconditions: 'More tab; LoopChild linked in Admin',
        data: LOOP.passengerName,
        actionSteps: '1) Read Passengers 2) Confirm LoopChild 3) Do not open the child (Back can expire Expo web)',
        expected: 'kb: This parent sees LoopChild. Aiden stays off this session.',
        expectedSource: 'kb',
      },
      async () => {
        await expect(page.getByText(LOOP.passengerName).first()).toBeVisible({ timeout: 20_000 });
        await expectNotKellySession(page);
      },
    );
  });

  test('REG-PAR-010 — Log Out is present (do not tap)', { tag: '@regression' }, async ({ page }) => {
    await parentCase(
      page,
      {
        portal: 'Parent',
        suite: 'More',
        id: 'REG-PAR-010',
        sequence: 10,
        total: TOTAL,
        priority: 'P2',
        regression: true,
        title: 'Log Out is present (do not tap)',
        preconditions: 'More tab',
        data: 'Log Out',
        actionSteps: '1) Assert Log Out 2) Do not tap',
        expected: 'common: Parent can sign out from More. This case does not sign out.',
        expectedSource: 'common',
      },
      async () => {
        await expect(page.getByText('Log Out').first()).toBeVisible();
      },
    );
  });

  test('REG-PAR-011 — Account Information opens', { tag: '@regression' }, async ({ page }) => {
    await parentCase(
      page,
      {
        portal: 'Parent',
        suite: 'More',
        id: 'REG-PAR-011',
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
        await page.getByText('Account Information', { exact: true }).first().click();
        await expect(page.getByText(LOOP.guardianPhone).first()).toBeVisible({ timeout: 20_000 });
        await expect(page.getByText(/18 Lyman Street/i).first()).toBeVisible();
      },
    );
  });

  test('REG-PAR-012 — Account is LoopParent, still not Kelly', { tag: '@regression' }, async ({ page }) => {
    await parentCase(
      page,
      {
        portal: 'Parent',
        suite: 'More',
        id: 'REG-PAR-012',
        sequence: 12,
        total: TOTAL,
        priority: 'P1',
        regression: true,
        title: 'Account is LoopParent, still not Kelly',
        preconditions: 'Current screen after 011',
        data: LOOP.guardianEmail,
        actionSteps: '1) Read email on Account Information',
        expected: 'known: Email is seed.qe.loop.parent. Stage 0 Kelly email is absent.',
        expectedSource: 'known',
      },
      async () => {
        await expect(page.getByText(/seed\.qe\.loop\.parent/i).first()).toBeVisible({ timeout: 20_000 });
        await expect(page.getByText(LOOP.guardianPhone).first()).toBeVisible();
        await expectNotKellySession(page);
      },
    );
  });
});
