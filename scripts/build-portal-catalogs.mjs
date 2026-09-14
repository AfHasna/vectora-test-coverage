import fs from 'fs';
import path from 'path';

const outDir = path.resolve('tests/_catalog');
fs.mkdirSync(outDir, { recursive: true });

function parseMarkdown(md, headingPrefix, idPattern) {
  const start = md.search(/^## 6\./m);
  const end = md.search(/^## 7\./m);
  const section = md.slice(start, end === -1 ? undefined : end);
  const sets = [];
  let cur = null;

  for (const line of section.split('\n')) {
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

const clientMd = fs.readFileSync(
  new URL('./_client-plan.md', import.meta.url),
  'utf8',
);
const providerMd = fs.readFileSync(
  new URL('./_provider-plan.md', import.meta.url),
  'utf8',
);

const client = parseMarkdown(clientMd, 'CP', /^VCTR-CP-\d+$/);
const provider = parseMarkdown(providerMd, 'SP', /^VCTR-SP-\d+$/);

fs.writeFileSync(path.join(outDir, 'client.json'), JSON.stringify(client, null, 2));
fs.writeFileSync(path.join(outDir, 'provider.json'), JSON.stringify(provider, null, 2));

console.log(
  'client',
  client.reduce((a, s) => a + s.cases.length, 0),
  client.map((s) => `${s.id}:${s.cases.length}`).join(' '),
);
console.log(
  'provider',
  provider.reduce((a, s) => a + s.cases.length, 0),
  provider.map((s) => `${s.id}:${s.cases.length}`).join(' '),
);
