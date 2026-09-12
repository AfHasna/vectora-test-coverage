// Prints the issue tracker workbook as text, so the investigation works from
// the exact wording the reporters used. Read-only: nothing is written back.
// Run: node scripts/read-tracker.mjs
import fs from 'fs';

const DIR = 'mcp-output/xlsx/x/xl';
const shared = fs.readFileSync(`${DIR}/sharedStrings.xml`, 'utf8');
const sheet = fs.readFileSync(`${DIR}/worksheets/sheet1.xml`, 'utf8');

function decode(text) {
  return text
    .replace(/<[^>]+>/g, '')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&#10;/g, '\n')
    .replace(/&amp;/g, '&');
}

const strings = [...shared.matchAll(/<si>([\s\S]*?)<\/si>/g)].map((match) => decode(match[1]));

for (const rowMatch of sheet.matchAll(/<row[^>]*r="(\d+)"[^>]*>([\s\S]*?)<\/row>/g)) {
  const cells = [];
  for (const cellMatch of rowMatch[2].matchAll(/<c[^>]*r="([A-Z]+)\d+"([^>]*)>([\s\S]*?)<\/c>/g)) {
    const [, column, attributes, body] = cellMatch;
    const value = /t="s"/.test(attributes)
      ? (strings[Number(decode(body))] ?? '')
      : decode(body);
    if (value.trim()) cells.push(`${column}: ${value.trim()}`);
  }
  if (cells.length) {
    console.log(`\n----- row ${rowMatch[1]}`);
    for (const cell of cells) console.log(cell);
  }
}
