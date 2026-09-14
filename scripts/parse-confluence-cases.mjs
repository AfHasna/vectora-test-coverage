import fs from 'fs';
import path from 'path';

const adminPath =
  'C:/Users/EngAh/.cursor/projects/c-Users-EngAh-cursor-Vectora/agent-tools/a36d58c6-1313-4c16-975f-64c08d7f9dfd.txt';

function parseSection(md, headingPrefix, idPattern) {
  const start = md.search(/^## 6\./m);
  const end = md.search(/^## 7\./m);
  const section = md.slice(start, end === -1 ? undefined : end);
  const lines = section.split('\n');
  const sets = [];
  let cur = null;

  for (const line of lines) {
    const h = line.match(new RegExp(`^### (${headingPrefix}-TS-\\d+) — (.+)$`));
    if (h) {
      if (cur) sets.push(cur);
      cur = { id: h[1], title: h[2].trim(), cases: [] };
      continue;
    }
    if (!cur || !line.startsWith('|')) continue;
    if (/^\|\s*ID\s*\|/.test(line) || /^\|\s*---/.test(line)) continue;
    const cells = line.split('|').slice(1, -1).map((c) => c.trim());
    if (cells.length < 7 || !idPattern.test(cells[0])) continue;
    cur.cases.push({
      id: cells[0],
      title: cells[1],
      preconditions: cells[2],
      actionSteps: cells[3],
      expected: cells[4],
      pri: cells[5],
      regr: cells[6],
    });
  }
  if (cur) sets.push(cur);
  return sets;
}

function flagFixme(c) {
  const text = `${c.regr} ${c.expected} ${c.title} ${c.preconditions} ${c.actionSteps}`;
  return /requires sandbox|mutating|do not execute|data-dependent/i.test(text);
}

const adminMd = JSON.parse(fs.readFileSync(adminPath, 'utf8')).data.body.value;
const admin = parseSection(adminMd, 'ADM', /^VCTR-ADM-\d+$/);

const outDir = path.resolve('tests/_catalog');
fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, 'admin.json'), JSON.stringify(admin, null, 2));

const flagged = admin.flatMap((s) => s.cases.filter(flagFixme));
console.log(
  admin.map((s) => `${s.id} ${s.cases.length} ${s.cases[0]?.id}-${s.cases.at(-1)?.id}`).join('\n'),
);
console.log('TOTAL', admin.reduce((a, s) => a + s.cases.length, 0));
console.log('FIXME', flagged.length);
for (const c of flagged) {
  console.log(`${c.id} | regr=${c.regr} | exp=${c.expected.slice(0, 140)}`);
}
