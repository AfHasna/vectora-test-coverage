import * as allure from 'allure-js-commons';
import { clientFormTabs } from '@config/catalog';
import { MODULE, READ_ONLY, SUITE } from '@config/test-tags';
import { expect, requireSession, test } from '@fixtures/pages.fixture';
import { expectRecordTotalUnchanged, readRecordTotal } from '@utils/assertions';
import { proofStep } from '@utils/steps';

/**
 * TC-VEC-003-RO — the read-only slice of TC-VEC-003 (Create Client).
 *
 * TC-VEC-003 itself saves a client and so belongs on staging. This covers the
 * part that is safe against production: the Add New Client form opens with its
 * three documented sections. No field is filled and nothing is submitted, the
 * client total is checked afterwards to prove no client was added, and the
 * read-only guard would block a write even if one were tried.
 */
test.describe('Happy path - Stakeholder Management', () => {
  test(
    'TC-VEC-003-RO Add Client form shows its three sections',
    { tag: [SUITE.regression, MODULE.stakeholders, READ_ONLY] },
    async ({ page, home, clients, addClient }, testInfo) => {
      await allure.epic('Vectora happy path');
      await allure.feature('Stakeholder Management');
      await allure.story('TC-VEC-003 Create Client Across All Tabs');
      await allure.severity('critical');
      await allure.tags('read-only', 'automated', 'clients');
      await allure.description(
        [
          '**Goal:** confirm the Add New Client form is organised into the three documented sections.',
          '',
          '**Covers:** the production-safe part of TC-VEC-003 (Create Client Across All Tabs).',
          '',
          '**Precondition:** signed in to the admin portal as an administrator.',
          '',
          '**Sections expected:** ' + clientFormTabs.join(' · '),
          '',
          '**Safety:** read-only. The form is opened and closed without filling or saving anything,',
          'and the client total is compared before and after to prove no record was created.',
        ].join('\n'),
      );

      let totalBefore = '';

      await proofStep(
        page,
        testInfo,
        {
          action: 'Open the admin portal with a signed-in session',
          expected: 'the Home dashboard is shown',
        },
        async () => {
          requireSession(await home.open());
        },
      );

      await proofStep(
        page,
        testInfo,
        {
          action: 'Click Stakeholder Management in the sidebar and wait for the page to load',
          expected: 'the Clients list opens and offers an Add Client button',
        },
        async () => {
          await home.sidebar.openModule('Stakeholder Management');
          await expect(page).toHaveURL(/\/stakeholders\/clients$/);
          await clients.expectLoaded();
          await expect(clients.addClientButton).toBeVisible();
          totalBefore = await readRecordTotal(clients.table.recordTotal);
        },
      );

      await proofStep(
        page,
        testInfo,
        {
          action: 'Click Add Client',
          expected: 'the Add New Client form opens at /stakeholders/clients/add',
        },
        async () => {
          await clients.openAddClientForm();
          await addClient.expectLoaded();
        },
      );

      await proofStep(
        page,
        testInfo,
        {
          action: 'Read the section tabs on the form',
          expected: `exactly three sections, in order: ${clientFormTabs.join(', ')}`,
        },
        async () => {
          await addClient.expectSections();
        },
      );

      await proofStep(
        page,
        testInfo,
        {
          action: 'Check which section is selected on open',
          expected: 'Basic Info & Contacts is active and shows the Basic Information panel',
        },
        async () => {
          await addClient.expectOpensOnBasicInfo();
        },
      );

      await proofStep(
        page,
        testInfo,
        {
          action: 'Leave the form with Back to Clients, without saving',
          expected: 'the Clients list returns with the same client total, so nothing was added',
        },
        async () => {
          await addClient.leaveWithoutSaving();
          await expect(page).toHaveURL(/\/stakeholders\/clients$/);
          await expect(clients.addClientButton).toBeVisible();
          await expectRecordTotalUnchanged(clients.table.recordTotal, totalBefore);
        },
      );
    },
  );
});
