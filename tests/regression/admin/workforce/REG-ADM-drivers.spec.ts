import { expect } from '@playwright/test';
import { test } from '../../../fixtures/regression-test';
import { adminCase } from '../../../fixtures/annotate';
import { LOOP } from '../_helpers/loop-data';
import { ensureLoopInternalDriver, findLoopDriver } from '../_helpers/driver-form';

const TOTAL = 1;
const SUITE = 'Workforce';

test.describe.configure({ mode: 'serial', timeout: 180_000 });

test.describe('REG-ADM Loop internal driver', () => {
  test(
    'REG-ADM-037 — Create SEED LoopDriver (internal)',
    { tag: '@regression' },
    async ({ page }) => {
      await adminCase(
        page,
        {
          portal: 'Admin',
          suite: SUITE,
          id: 'REG-ADM-037',
          sequence: 1,
          total: TOTAL,
          priority: 'P1',
          regression: true,
          title: 'Create SEED LoopDriver internal',
          preconditions: 'Logged in; Workforce → Drivers',
          data: `${LOOP.driverName} | ${LOOP.driverPhone} | license ${LOOP.driverLicense}`,
          actionSteps:
            '1) If LoopDriver listed, stop\n2) Add Driver, Internal, basic + address + emergency contact\n3) Service area Westborough\n4) Class D license exp 12/31/2027\n5) Bank + pay rate → Save Driver',
          expected:
            'kb: Assign Driver on a Vectora (internal) vehicle needs an internal workforce driver. Drivers are required before route assignment.',
          expectedSource: 'kb',
        },
        async () => {
          await ensureLoopInternalDriver(page);
          expect(await findLoopDriver(page)).toBeTruthy();
        },
      );
    },
  );
});
