import * as allure from 'allure-js-commons';
import { environmentName } from '@config/env';
import { happyPathCases } from '@test-plans/happy-path';

/**
 * Puts the registered case on the report: module, official expected results,
 * the environment it ran against, and anything the automation had to do
 * differently from the manual script. Reading it from the plan keeps the report
 * and the written suite in step.
 */
export async function annotateCase(id: string, automationNote?: string): Promise<void> {
  const testCase = happyPathCases.find((entry) => entry.id === id);
  if (!testCase) {
    throw new Error(`No registered case with id ${id}.`);
  }

  await allure.epic('Vectora happy path');
  await allure.feature(testCase.module);
  await allure.story(`${testCase.id} ${testCase.title}`);
  await allure.severity('critical');
  await allure.tags('automated', environmentName());
  await allure.description(
    [
      `**${testCase.id} — ${testCase.title}**`,
      '',
      testCase.description,
      '',
      '**Expected result**',
      ...testCase.expected.map((item) => `- ${item}`),
      automationNote ? `\n**Automation note:** ${automationNote}` : '',
    ]
      .filter((line) => line !== '')
      .join('\n'),
  );
}
