import { existsSync, rmSync } from 'fs';
import path from 'path';

const dir = path.join(process.cwd(), 'allure-results');
if (existsSync(dir)) {
  rmSync(dir, { recursive: true, force: true });
}
console.log('Cleared allure-results');
