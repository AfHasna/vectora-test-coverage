import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import playwright from 'eslint-plugin-playwright';
import prettier from 'eslint-config-prettier';

export default tseslint.config(
  { ignores: ['node_modules/', 'reports/', 'allure-results/', 'allure-report/', '.auth/', 'scripts/'] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['tests/**/*.ts', 'playwright.config.ts'],
    languageOptions: {
      parserOptions: { project: './tsconfig.json', tsconfigRootDir: import.meta.dirname },
    },
    rules: {
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    },
  },
  {
    files: ['tests/**/*.spec.ts'],
    ...playwright.configs['flat/recommended'],
    rules: {
      ...playwright.configs['flat/recommended'].rules,
      'playwright/no-wait-for-timeout': 'error',
      'playwright/no-force-option': 'error',
      'playwright/expect-expect': 'off',
      'playwright/no-skipped-test': 'off',
    },
  },
  prettier,
);
