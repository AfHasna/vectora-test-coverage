import { execSync } from 'child_process';
import { cpSync, existsSync, mkdirSync, rmSync, writeFileSync } from 'fs';
import path from 'path';

const root = process.cwd();
const resultsDir = path.join(root, 'allure-results');
const latestDir = path.join(root, 'allure-report', 'latest');
const historySrc = path.join(latestDir, 'history');
const historyDest = path.join(resultsDir, 'history');

if (existsSync(historySrc)) {
  mkdirSync(resultsDir, { recursive: true });
  cpSync(historySrc, historyDest, { recursive: true });
}

const sha = execSync('git rev-parse --short HEAD', { encoding: 'utf8' }).trim();
const stamp = new Date().toISOString().replace(/[:.]/g, '-').replace('T', '_').replace(/Z$/, 'Z');
const runDir = path.join(root, 'allure-report', 'runs', `${stamp}-${sha}`);

mkdirSync(path.dirname(runDir), { recursive: true });
if (existsSync(runDir)) {
  rmSync(runDir, { recursive: true, force: true });
}
execSync(`npx allure generate "${resultsDir}" --output "${runDir}" --name "Vectora regression"`, {
  stdio: 'inherit',
  cwd: root,
});

if (existsSync(latestDir)) {
  rmSync(latestDir, { recursive: true, force: true });
}
cpSync(runDir, latestDir, { recursive: true });
writeFileSync(path.join(root, 'allure-report', 'LATEST_RUN.txt'), `${path.relative(root, runDir)}\n`);

console.log(`Report written to ${path.relative(root, runDir)}`);
console.log('Latest copy: allure-report/latest');
