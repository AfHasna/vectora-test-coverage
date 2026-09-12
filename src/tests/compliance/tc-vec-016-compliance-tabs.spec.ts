import { complianceTabs } from '@config/catalog';
import { MODULE, READ_ONLY, SUITE } from '@config/test-tags';
import { requireSession, test } from '@fixtures/pages.fixture';
import { annotateCase } from '@utils/reporting';
import { proofStep } from '@utils/steps';

/** TC-VEC-016 — the vehicle, monitor and provider compliance tabs. */
test.describe('Happy path - Compliance Management', () => {
  test(
    'TC-VEC-016 Verify Vehicle, Monitor and Provider Compliance',
    { tag: [SUITE.regression, MODULE.compliance, READ_ONLY] },
    async ({ page, compliance }, testInfo) => {
      await annotateCase('TC-VEC-016');

      // The driver tab is TC-VEC-015; this case covers the other three.
      for (const tab of complianceTabs.slice(1)) {
        await proofStep(
          page,
          testInfo,
          {
            action: `Open ${tab.name}`,
            expected: 'the tab loads its compliance list',
          },
          async () => {
            requireSession(await compliance.openTabPage(tab.href));
            await compliance.expectTabActive(tab.name);
            await compliance.table.expectVisible();
          },
        );

        await proofStep(
          page,
          testInfo,
          {
            action: `Open Compliance Details from a ${tab.name} row`,
            expected: 'every row offers the Compliance Details action and the dialog opens',
          },
          async () => {
            await compliance.openComplianceDetails();
          },
        );

        await proofStep(
          page,
          testInfo,
          {
            action: 'Review the requirements and expirations, then close the dialog',
            expected:
              'documents and their expiration information are listed, and the dialog closes',
          },
          async () => {
            await compliance.expectRequirementSections();
            await compliance.closeDialog();
          },
        );
      }
    },
  );
});
