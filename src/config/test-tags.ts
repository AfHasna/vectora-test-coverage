/**
 * Tags for selecting subsets of the suite, e.g.
 *   npx playwright test --grep @smoke
 *   npx playwright test --grep "@compliance"
 *
 * Every spec carries one suite tag (@smoke or @regression) plus its module tag.
 */
export const SUITE = {
  smoke: '@smoke',
  regression: '@regression',
} as const;

export const MODULE = {
  auth: '@auth',
  dashboard: '@dashboard',
  stakeholders: '@stakeholders',
  workforce: '@workforce',
  fleet: '@fleet',
  compliance: '@compliance',
  serviceOperations: '@service-operations',
  accounting: '@accounting',
  reports: '@reports',
  notifications: '@notifications',
  settings: '@settings',
  platform: '@platform',
} as const;

/** Marks a case that never writes, so it is safe against production. */
export const READ_ONLY = '@read-only';

/** Marks a case that creates or changes data, so it needs staging. */
export const WRITES_DATA = '@writes-data';
