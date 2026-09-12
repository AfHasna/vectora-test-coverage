import { MODULE, READ_ONLY, SUITE } from '@config/test-tags';
import { requireSession, test } from '@fixtures/pages.fixture';
import { expectActiveDialog } from '@utils/assertions';
import { annotateCase } from '@utils/reporting';
import { proofStep } from '@utils/steps';

/** TC-VEC-015 — driver compliance details open from the row action menu. */
test.describe('Happy path - Compliance Management', () => {
  test(
    'TC-VEC-015 Verify Driver Compliance Details',
    { tag: [SUITE.regression, MODULE.compliance, READ_ONLY] },
    async ({ page, compliance }, testInfo) => {
      await annotateCase('TC-VEC-015');

      let driverName = '';

      await proofStep(
        page,
        testInfo,
        {
          action: 'Open Compliance Management → Driver Compliance',
          expected: 'the driver compliance list loads with the compliance tabs',
        },
        async () => {
          requireSession(await compliance.open());
          await compliance.expectAllTabs();
        },
      );

      await proofStep(
        page,
        testInfo,
        {
          action: 'Locate a driver with compliance information',
          expected: 'the first row names a driver and its checks and documents',
        },
        async () => {
          driverName = await compliance.recordName();
        },
      );

      await proofStep(
        page,
        testInfo,
        {
          action: 'Open the row action menu and select Compliance Details',
          expected: 'the menu offers Compliance Details and the dialog opens for that driver',
        },
        async () => {
          await compliance.openComplianceDetails();
        },
      );

      await proofStep(
        page,
        testInfo,
        {
          action: 'Review the status banner, expirations and outstanding issues',
          expected: 'background checks and documents are listed for the driver',
        },
        async () => {
          await compliance.expectDriverDetails(driverName);
        },
      );

      await proofStep(
        page,
        testInfo,
        {
          action: 'Close the dialog',
          expected: 'the list returns with no dialog open',
        },
        async () => {
          await compliance.closeDialog();
        },
      );

      await proofStep(
        page,
        testInfo,
        {
          action: 'Click the driver name',
          expected: 'the related driver profile opens',
        },
        async () => {
          // The profile opens as a record dialog rather than a route change.
          await compliance.openRecordProfile(driverName);
          await expectActiveDialog(page, /record-view/);
        },
      );
    },
  );
});
