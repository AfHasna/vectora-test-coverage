import fs from 'fs';
import path from 'path';

const ROOT = path.resolve('tests');

const TMS = {
  admin: 'https://govectora.atlassian.net/wiki/x/cwDE',
  client: 'https://govectora.atlassian.net/wiki/x/1ADD',
  provider: 'https://govectora.atlassian.net/wiki/x/6QDD',
};

const FILES = {
  admin: {
    'ADM-TS-01': { folder: 'admin/authentication', slug: 'authentication', suite: 'ADM-TS-01 — Authentication', auth: true },
    'ADM-TS-02': { folder: 'admin/dashboard', slug: 'dashboard', suite: 'ADM-TS-02 — Dashboard' },
    'ADM-TS-03': { folder: 'admin/clients', slug: 'clients', suite: 'ADM-TS-03 — Clients' },
    'ADM-TS-04': { folder: 'admin/client-monitors', slug: 'client-monitors', suite: 'ADM-TS-04 — Client Monitors' },
    'ADM-TS-05': { folder: 'admin/places', slug: 'places', suite: 'ADM-TS-05 — Places' },
    'ADM-TS-06': { folder: 'admin/guardians', slug: 'guardians', suite: 'ADM-TS-06 — Guardians' },
    'ADM-TS-07': { folder: 'admin/passengers', slug: 'passengers', suite: 'ADM-TS-07 — Passengers' },
    'ADM-TS-08': { folder: 'admin/drivers', slug: 'drivers', suite: 'ADM-TS-08 — Drivers' },
    'ADM-TS-09': { folder: 'admin/drivers-availability', slug: 'drivers-availability', suite: 'ADM-TS-09 — Drivers Availability' },
    'ADM-TS-10': { folder: 'admin/vehicles', slug: 'vehicles', suite: 'ADM-TS-10 — Vehicles' },
    'ADM-TS-11': { folder: 'admin/maintenance', slug: 'maintenance', suite: 'ADM-TS-11 — Maintenance' },
    'ADM-TS-12': { folder: 'admin/assignment-history', slug: 'assignment-history', suite: 'ADM-TS-12 — Assignment History' },
    'ADM-TS-13': { folder: 'admin/route-sheets', slug: 'route-sheets', suite: 'ADM-TS-13 — Route Sheets' },
    'ADM-TS-14': { folder: 'admin/routes-assignment', slug: 'routes-assignment', suite: 'ADM-TS-14 — Routes Assignment' },
    'ADM-TS-15': { folder: 'admin/trips', slug: 'trips', suite: 'ADM-TS-15 — Trips' },
    'ADM-TS-16': { folder: 'admin/incidents', slug: 'incidents', suite: 'ADM-TS-16 — Incidents' },
    'ADM-TS-17': { folder: 'admin/live-tracking', slug: 'live-tracking', suite: 'ADM-TS-17 — Live Tracking' },
    'ADM-TS-18': { folder: 'admin/compliance', slug: 'compliance', suite: 'ADM-TS-18 — Compliance' },
    'ADM-TS-19': { folder: 'admin/general', slug: 'general', suite: 'ADM-TS-19 — General' },
    'ADM-TS-20': { folder: 'admin/reference-data', slug: 'reference-data', suite: 'ADM-TS-20 — Reference Data' },
    'ADM-TS-21': { folder: 'admin/knowledge-base', slug: 'knowledge-base', suite: 'ADM-TS-21 — Knowledge Base' },
    'ADM-TS-22': { folder: 'admin/users', slug: 'users', suite: 'ADM-TS-22 — Users' },
    'ADM-TS-23': { folder: 'admin/requests', slug: 'requests', suite: 'ADM-TS-23 — Requests' },
    'ADM-TS-24': { folder: 'admin/notifications', slug: 'notifications', suite: 'ADM-TS-24 — Notifications' },
    'ADM-TS-25': { folder: 'admin/archive-delete-safety', slug: 'archive-delete-safety', suite: 'ADM-TS-25 — Archive/Delete Safety' },
    'ADM-TS-26': { folder: 'admin/navigation-search', slug: 'navigation-search', suite: 'ADM-TS-26 — Navigation & Search' },
  },
  client: {
    'CP-TS-01': { folder: 'client-portal/authentication', slug: 'authentication', suite: 'CP-TS-01 — Authentication', auth: true },
    'CP-TS-02': { folder: 'client-portal/dashboard', slug: 'dashboard', suite: 'CP-TS-02 — Dashboard' },
    'CP-TS-03': { folder: 'client-portal/passengers', slug: 'passengers', suite: 'CP-TS-03 — Passengers' },
    'CP-TS-04': { folder: 'client-portal/route-sheets', slug: 'route-sheets', suite: 'CP-TS-04 — Route Sheets' },
    'CP-TS-05': { folder: 'client-portal/incidents', slug: 'incidents', suite: 'CP-TS-05 — Incidents' },
    'CP-TS-06': { folder: 'client-portal/compliance', slug: 'compliance', suite: 'CP-TS-06 — Compliance' },
    'CP-TS-07': { folder: 'client-portal/invoices', slug: 'invoices', suite: 'CP-TS-07 — Invoices' },
    'CP-TS-08': { folder: 'client-portal/budget-economics', slug: 'budget-economics', suite: 'CP-TS-08 — Budget & Economics' },
    'CP-TS-09': { folder: 'client-portal/reports', slug: 'reports', suite: 'CP-TS-09 — Reports' },
    'CP-TS-10': { folder: 'client-portal/messaging', slug: 'messaging', suite: 'CP-TS-10 — Messaging' },
    'CP-TS-11': { folder: 'client-portal/tenant-scoping', slug: 'tenant-scoping', suite: 'CP-TS-11 — Tenant Scoping' },
  },
  provider: {
    'SP-TS-01': { folder: 'service-provider/authentication', slug: 'authentication', suite: 'SP-TS-01 — Authentication', auth: true },
    'SP-TS-02': { folder: 'service-provider/dashboard', slug: 'dashboard', suite: 'SP-TS-02 — Dashboard' },
    'SP-TS-03': { folder: 'service-provider/drivers', slug: 'drivers', suite: 'SP-TS-03 — Drivers' },
    'SP-TS-04': { folder: 'service-provider/monitors', slug: 'monitors', suite: 'SP-TS-04 — Monitors' },
    'SP-TS-05': { folder: 'service-provider/compliance', slug: 'compliance', suite: 'SP-TS-05 — Compliance' },
    'SP-TS-06': { folder: 'service-provider/trips', slug: 'trips', suite: 'SP-TS-06 — Trips' },
    'SP-TS-07': { folder: 'service-provider/accounting', slug: 'accounting', suite: 'SP-TS-07 — Accounting' },
    'SP-TS-08': { folder: 'service-provider/reports', slug: 'reports', suite: 'SP-TS-08 — Reports' },
    'SP-TS-09': { folder: 'service-provider/messaging', slug: 'messaging', suite: 'SP-TS-09 — Messaging' },
    'SP-TS-10': { folder: 'service-provider/tenant-scoping', slug: 'tenant-scoping', suite: 'SP-TS-10 — Tenant Scoping' },
  },
};

const PORTAL_NAME = {
  admin: 'Admin Portal',
  client: 'Client Portal',
  provider: 'Service Provider Portal',
};

function q(value) {
  return JSON.stringify(value);
}

function isConstrained(text) {
  return (
    /requires sandbox|do not execute|data-dependent/i.test(text) ||
    /(?<!no )\bmutating\b/i.test(text)
  );
}

function fixmeReason(c) {
  if (!isConstrained(`${c.regr} ${c.expected}`)) {
    return null;
  }
  const quoted = [c.regr, c.expected].filter((part) => isConstrained(part));
  return `Confluence constraint: ${quoted.join(' — ')}`;
}

function isRegression(regr) {
  return /^\s*yes\b/i.test(regr);
}

function emitSpec(portalKey, set, file) {
  const total = set.cases.length;
  const lines = [];
  lines.push(`import { test } from '../../fixtures/regression-test';`);
  lines.push('');
  lines.push(`const PORTAL = ${q(PORTAL_NAME[portalKey])};`);
  lines.push(`const SUITE = ${q(file.suite)};`);
  lines.push(`const TMS = ${q(TMS[portalKey])};`);
  lines.push(`const TOTAL = ${total};`);
  lines.push('');
  lines.push(`test.describe.configure({ mode: 'serial' });`);
  if (file.auth) {
    lines.push(`test.use({ storageState: { cookies: [], origins: [] } });`);
  }
  lines.push('');
  lines.push(`test.describe(SUITE, () => {`);

  set.cases.forEach((c, index) => {
    const reason = fixmeReason(c);
    const tags = isRegression(c.regr) ? `{ tag: '@regression' }` : '';
    const title = `${c.id} — ${c.title}`.replace(/`/g, '');
    const pri = /P[123]/.test(c.pri) ? c.pri.match(/P[123]/)[0] : 'P2';

    lines.push('');
    if (reason) {
      lines.push(`  // ${reason}`);
    }
    lines.push(
      tags
        ? `  test(${q(title)}, ${tags}, async ({ runCase }) => {`
        : `  test(${q(title)}, async ({ runCase }) => {`,
    );
    lines.push(`    await runCase({`);
    lines.push(`      portal: PORTAL,`);
    lines.push(`      suite: SUITE,`);
    lines.push(`      tms: TMS,`);
    lines.push(`      id: ${q(c.id)},`);
    lines.push(`      title: ${q(c.title)},`);
    lines.push(`      sequence: ${index + 1},`);
    lines.push(`      total: TOTAL,`);
    lines.push(`      priority: ${q(pri)},`);
    lines.push(`      regression: ${isRegression(c.regr)},`);
    lines.push(`      preconditions: ${q(c.preconditions)},`);
    lines.push(`      actionSteps: ${q(c.actionSteps)},`);
    lines.push(`      expected: ${q(c.expected)},`);
    if (reason) {
      lines.push(`      fixmeReason: ${q(reason)},`);
    }
    lines.push(`    });`);
    lines.push(`  });`);
  });

  lines.push(`});`);
  lines.push('');
  return lines.join('\n');
}

let files = 0;
let cases = 0;
let fixmes = 0;

for (const [portalKey, map] of Object.entries(FILES)) {
  const catalog = JSON.parse(fs.readFileSync(path.join(ROOT, '_catalog', `${portalKey}.json`), 'utf8'));
  for (const set of catalog) {
    const file = map[set.id];
    if (!file) {
      throw new Error(`No file mapping for ${set.id}`);
    }
    const dir = path.join(ROOT, file.folder);
    fs.mkdirSync(dir, { recursive: true });
    const specPath = path.join(dir, `${set.id}-${file.slug}.spec.ts`);
    fs.writeFileSync(specPath, emitSpec(portalKey, set, file));
    files += 1;
    cases += set.cases.length;
    fixmes += set.cases.filter((c) => fixmeReason(c)).length;
    console.log(path.relative(process.cwd(), specPath), set.cases.length);
  }
}

console.log(`Wrote ${files} specs, ${cases} cases, ${fixmes} fixme`);
