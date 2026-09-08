import * as allure from 'allure-js-commons';
import { test, expect } from '../fixtures';
import { clientFormTabs } from '../helpers/catalog';
import { proofStep } from '../helpers/steps';

/**
 * TC-VEC-003-RO — the read-only slice of TC-VEC-003 (Create Client).
 *
 * TC-VEC-003 itself saves a client and so belongs on Stage/UAT. This covers the
 * part that is safe against production: the Add New Client form opens with its
 * three documented sections. No field is filled and nothing is submitted, the
 * client total is checked afterwards to prove no client was added, and the
 * read-only guard would block a write even if one were tried.
 */
test.describe('Happy path - Stakeholder Management', () => {
  test('TC-VEC-003-RO Add Client form shows its three sections', async ({ page }, testInfo) => {
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

    // The row count is unusable as a baseline: it is read while the table is
    // still rendering. The pagination summary carries the real total.
    const listTotal = page.getByText(/Showing \d+-\d+ of \d+ items/);
    let totalBefore = '';

    await proofStep(
      page,
      testInfo,
      {
        action: 'Open the admin portal with a signed-in session',
        expected: 'the Home dashboard is shown',
      },
      async () => {
        await page.goto('/');
        if (/sign-in/i.test(page.url())) {
          test.skip(true, 'Admin session missing. Run npm run auth:login.');
        }
        await expect(page.getByRole('heading', { name: 'Home', exact: true })).toBeVisible();
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
        await page
          .getByRole('list')
          .first()
          .getByRole('link', { name: 'Stakeholder Management' })
          .click();
        await expect(page).toHaveURL(/\/stakeholders\/clients$/);
        await expect(page.getByRole('heading', { name: 'Clients' }).first()).toBeVisible();
        await expect(page.getByRole('button', { name: 'Add Client' })).toBeVisible();
        await expect(listTotal).toBeVisible();
        totalBefore = (await listTotal.innerText()).trim();
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
        await page.getByRole('button', { name: 'Add Client' }).click();
        await expect(page).toHaveURL(/\/stakeholders\/clients\/add$/);
        await expect(page.getByRole('heading', { name: 'Add New Client' })).toBeVisible();
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
        await expect(page.getByRole('tab')).toHaveText([...clientFormTabs]);
        for (const name of clientFormTabs) {
          await expect(page.getByRole('tab', { name })).toBeVisible();
        }
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
        await expect(page.getByRole('tab', { name: clientFormTabs[0] })).toHaveAttribute(
          'data-state',
          'active',
        );
        await expect(page.getByRole('heading', { name: 'Basic Information' })).toBeVisible();
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
        await page.getByRole('button', { name: 'Back to Clients' }).click();
        await expect(page).toHaveURL(/\/stakeholders\/clients$/);
        await expect(page.getByRole('button', { name: 'Add Client' })).toBeVisible();
        await expect(listTotal, 'no client may be added').toHaveText(totalBefore);
      },
    );
  });
});
