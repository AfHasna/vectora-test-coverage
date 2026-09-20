import { test } from '../../../../tests/fixtures/regression-test';

const PORTAL = 'Driver App';
const SUITE = 'DRV-TS-02 — Home & runs';
const TMS = 'https://govectora.atlassian.net/wiki/x/AQDg';
const TOTAL = 3;

test.describe.configure({ mode: 'serial' });

test.describe(SUITE, () => {
  test('VCTR-DRV-010 — Home / duty shell loads', { tag: '@regression' }, async ({ runCase }) => {
    await runCase({
      portal: PORTAL,
      suite: SUITE,
      tms: TMS,
      id: 'VCTR-DRV-010',
      title: 'Home / duty shell loads',
      sequence: 1,
      total: TOTAL,
      priority: 'P1',
      regression: true,
      preconditions: '`/`',
      actionSteps: '1) Open Home 2) Inspect duty / trip chrome',
      expected: 'Home, trips, or duty controls are visible after a stored session',
    });
  });

  test('VCTR-DRV-011 — Assigned runs or empty state', { tag: '@regression' }, async ({ runCase }) => {
    await runCase({
      portal: PORTAL,
      suite: SUITE,
      tms: TMS,
      id: 'VCTR-DRV-011',
      title: 'Assigned runs or empty state',
      sequence: 2,
      total: TOTAL,
      priority: 'P1',
      regression: true,
      preconditions: 'Dashboard',
      actionSteps: '1) Look for SEED Williams AM/PM or an empty-run message',
      expected: 'Either SEED runs are listed or a clear empty state is shown',
    });
  });

  test('VCTR-DRV-012 — Navigation tabs present', async ({ runCase }) => {
    await runCase({
      portal: PORTAL,
      suite: SUITE,
      tms: TMS,
      id: 'VCTR-DRV-012',
      title: 'Navigation tabs present',
      sequence: 3,
      total: TOTAL,
      priority: 'P2',
      regression: false,
      preconditions: 'Any page',
      actionSteps: '1) Inspect bottom or header navigation',
      expected: 'Home / trips / profile (or equivalent) navigation is available',
    });
  });
});
