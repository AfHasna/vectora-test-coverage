import * as allure from 'allure-js-commons';
import { test, type Page } from '@playwright/test';

export type Priority = 'P1' | 'P2' | 'P3';
export type ExpectedSource = 'kb' | 'known' | 'common';

export interface CaseMeta {
  portal: string;
  suite: string;
  id: string;
  sequence: number;
  total: number;
  priority: Priority;
  regression: boolean;
  basic?: boolean;
  tms?: string;
  title: string;
  preconditions: string;
  data?: string;
  actionSteps: string;
  expected: string;
  expectedSource?: ExpectedSource;
  actual?: string;
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
  const source = meta.expectedSource ?? 'known';
  await allure.tag(source);
  if (meta.regression) {
    await allure.tag('regression');
  }
  if (meta.basic) {
    await allure.tag('basic');
  }
  if (meta.tms) {
    await allure.link(meta.tms, meta.portal, 'tms');
  }
  await allure.description(
    [
      `**${meta.id} — ${meta.title}**`,
      '',
      `**Preconditions:** ${meta.preconditions}`,
      '',
      `**Data:** ${meta.data ?? '—'}`,
      '',
      `**Action steps:** ${meta.actionSteps}`,
      '',
      `**Expected result (${source}):** ${meta.expected}`,
      meta.actual ? `\n**Actual result (practice):** ${meta.actual}` : '',
    ]
      .filter(Boolean)
      .join('\n'),
  );
}

/** Document + execute a real UI flow. Does not use the archived VCTR step interpreter. */
export async function adminCase(
  page: Page,
  meta: CaseMeta,
  run: (page: Page) => Promise<void>,
): Promise<void> {
  await annotateCase(meta);
  await test.step(`${meta.id} ${meta.title}`, async () => {
    await run(page);
  });
}

export const clientCase = adminCase;
export const providerCase = adminCase;
export const driverCase = adminCase;
export const parentCase = adminCase;
export const connCase = adminCase;
