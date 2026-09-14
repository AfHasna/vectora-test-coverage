import * as allure from 'allure-js-commons';

export type Priority = 'P1' | 'P2' | 'P3';

export interface CaseMeta {
  portal: string;
  suite: string;
  id: string;
  sequence: number;
  total: number;
  priority: Priority;
  regression: boolean;
  tms: string;
  title: string;
  preconditions: string;
  actionSteps: string;
  expected: string;
}

const SEVERITY: Record<Priority, allure.Severity> = {
  P1: allure.Severity.CRITICAL,
  P2: allure.Severity.NORMAL,
  P3: allure.Severity.MINOR,
};

export async function annotateCase(meta: CaseMeta): Promise<void> {
  await allure.parentSuite(meta.portal);
  await allure.suite(meta.suite);
  await allure.label('AS_ID', meta.id);
  await allure.label('sequence', `${meta.sequence}/${meta.total}`);
  await allure.severity(SEVERITY[meta.priority]);
  if (meta.regression) {
    await allure.tag('regression');
  }
  await allure.link(meta.tms, meta.portal, 'tms');
  await allure.description(
    [
      `**${meta.id} — ${meta.title}**`,
      '',
      `**Preconditions:** ${meta.preconditions}`,
      '',
      `**Action steps:** ${meta.actionSteps}`,
      '',
      `**Expected result:** ${meta.expected}`,
    ].join('\n'),
  );
}
