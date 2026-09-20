import { test } from '../../../../tests/fixtures/regression-test';

const PORTAL = 'Guardian App';
const SUITE = 'GRD-TS-02 — Children & trips';
const TMS = 'https://govectora.atlassian.net/wiki/x/AQDg';
const TOTAL = 3;

test.describe.configure({ mode: 'serial' });

test.describe(SUITE, () => {
  test('VCTR-GRD-010 — Signed-in shell loads', { tag: '@regression' }, async ({ runCase }) => {
    await runCase({
      portal: PORTAL,
      suite: SUITE,
      tms: TMS,
      id: 'VCTR-GRD-010',
      title: 'Signed-in shell loads',
      sequence: 1,
      total: TOTAL,
      priority: 'P1',
      regression: true,
      preconditions: '`/`',
      actionSteps: '1) Open the app home 2) Inspect navigation',
      expected: 'Children, trips, or home chrome is visible after a stored session',
    });
  });

  test('VCTR-GRD-011 — Linked passengers or empty state', { tag: '@regression' }, async ({ runCase }) => {
    await runCase({
      portal: PORTAL,
      suite: SUITE,
      tms: TMS,
      id: 'VCTR-GRD-011',
      title: 'Linked passengers or empty state',
      sequence: 2,
      total: TOTAL,
      priority: 'P1',
      regression: true,
      preconditions: 'Dashboard',
      actionSteps: '1) Look for SEED Nora Patel / SEED Liam Chen or an empty-child message',
      expected: 'Either SEED passengers are listed or a clear empty state is shown',
    });
  });

  test('VCTR-GRD-012 — Trip tracking surface exists', async ({ runCase }) => {
    await runCase({
      portal: PORTAL,
      suite: SUITE,
      tms: TMS,
      id: 'VCTR-GRD-012',
      title: 'Trip tracking surface exists',
      sequence: 3,
      total: TOTAL,
      priority: 'P2',
      regression: false,
      preconditions: 'Any page',
      actionSteps: '1) Open trips or tracking if available',
      expected: 'A trips/tracking view or empty state is reachable',
    });
  });
});
