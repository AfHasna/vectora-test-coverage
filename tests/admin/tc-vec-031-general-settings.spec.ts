import { test, expect } from '../fixtures';
import { generalSettingsSections } from '../helpers/catalog';
import { annotateCase } from '../helpers/reporting';
import { proofStep } from '../helpers/steps';

/**
 * TC-VEC-031 — General Settings, review only.
 * The manual case ends by editing and saving a value, which is UAT-only work.
 * Here every section is opened and read, and Save Changes is never clicked.
 */
test.describe('Happy path - Settings', () => {
  test('TC-VEC-031 Verify General Settings', async ({ page }, testInfo) => {
    await annotateCase(
      'TC-VEC-031',
      'Steps 1-9 only. The "update an approved test value" and "Save" steps are UAT-only and are not run here. The live page labels the compliance section "Compliance Settings" (the suite calls it Compliance Thresholds) and adds a Geo-Restriction section.',
    );

    await proofStep(
      page,
      testInfo,
      {
        action: 'Open Settings → General',
        expected: 'General Settings loads with its tab selected',
      },
      async () => {
        await page.goto('/settings/general');
        if (/sign-in/i.test(page.url())) {
          test.skip(true, 'Admin session missing.');
        }
        await expect(page.getByRole('heading', { name: 'General Settings' })).toBeVisible();
        await expect(page.getByRole('tab', { name: 'General' })).toHaveAttribute(
          'data-state',
          'active',
        );
      },
    );

    for (const section of generalSettingsSections) {
      await proofStep(
        page,
        testInfo,
        {
          action: `Review ${section}`,
          expected: `the ${section} section is present and can be opened`,
        },
        async () => {
          const heading = page.getByRole('button', { name: section, exact: true });
          await expect(heading).toBeVisible();
          await heading.click();
        },
      );
    }

    await proofStep(
      page,
      testInfo,
      {
        action: 'Confirm nothing was changed',
        expected: 'Save Changes is available but was never used',
      },
      async () => {
        await expect(page.getByRole('button', { name: 'Save Changes' })).toBeVisible();
      },
    );
  });
});
