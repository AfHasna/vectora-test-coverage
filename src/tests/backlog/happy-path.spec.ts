import * as allure from 'allure-js-commons';
import { test } from '@playwright/test';
import { WRITES_DATA } from '@config/test-tags';
import { pendingCases, type HappyPathCase } from '@test-plans/happy-path';

/**
 * The not-yet-automated part of the happy-path suite, registered but not executed.
 *
 * Every case is reported as skipped with its steps and expected results
 * attached, so the suite can be reviewed and approved case by case. No browser
 * is opened and no request is sent from this file. Once a case is automated it
 * gets a real spec of its own and its entry here disappears, because the plan
 * marks it as automated.
 */

function renderCase(testCase: HappyPathCase): string {
  const target =
    testCase.environment === 'prod-readonly'
      ? 'Production admin, read-only (verification only)'
      : 'Staging only — creates or changes records, must never run on production';

  return [
    `**${testCase.id} — ${testCase.title}**`,
    '',
    testCase.description,
    '',
    `**Module:** ${testCase.module}`,
    `**Target environment:** ${target}`,
    '**Automation status:** pending approval',
    testCase.notes ? `**Note:** ${testCase.notes}` : '',
    '',
    '**Steps**',
    ...testCase.steps.map((step, index) => `${index + 1}. ${step}`),
    '',
    '**Expected result**',
    ...testCase.expected.map((item) => `- ${item}`),
  ]
    .filter((line) => line !== '')
    .join('\n');
}

const casesByModule = new Map<string, HappyPathCase[]>();
for (const testCase of pendingCases) {
  const group = casesByModule.get(testCase.module) ?? [];
  group.push(testCase);
  casesByModule.set(testCase.module, group);
}

for (const [module, cases] of casesByModule) {
  test.describe(`Happy path - ${module}`, () => {
    for (const testCase of cases) {
      test(`${testCase.id} ${testCase.title}`, { tag: [WRITES_DATA] }, async () => {
        await allure.epic('Vectora happy path');
        await allure.feature(testCase.module);
        await allure.story(`${testCase.id} ${testCase.title}`);
        await allure.tags('pending-approval', testCase.environment);
        await allure.description(renderCase(testCase));

        for (const [index, step] of testCase.steps.entries()) {
          await allure.step(`Step ${index + 1}: ${step}`, async () => {});
        }

        test.skip(
          true,
          testCase.environment === 'stage-uat'
            ? 'Pending approval, and needs a staging target because it writes data'
            : 'Pending approval',
        );
      });
    }
  });
}
