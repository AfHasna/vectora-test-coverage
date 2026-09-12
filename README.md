# Vectora Playwright tests

End-to-end tests for the Vectora admin portal.

Production (`https://admin.govectora.com/`) is **read-only by rule**: no record
may be created, edited, archived, or deleted. A request guard enforces this at
runtime, so a mistake in a spec cannot write. Cases that do change data run on
staging only and are held in the backlog until a staging domain exists.

## Layout

```
src/
  config/        environment (base URL, credentials, timeouts), UI catalog, test tags
  fixtures/      the base test: read-only guard + ready-built page objects
  pages/         page objects, one per screen
    shared/      BasePage, SidebarComponent, TableComponent, GlobalSearchComponent
  tests/         specs, mirroring pages/ by module
    auth/        signs in for real, runs without a saved session
    backlog/     cases awaiting approval; they report but never execute
  test-plans/    TC-VEC-001..036 as data: steps, expected results, environment
  setup/         signs in once and saves the session
  utils/         read-only guard, proof steps, custom assertions, Allure metadata
reports/         html, allure-results, junit, traces (git-ignored)
scripts/         one-off exploration scripts used to discover locators
```

Specs never build a locator. They call page objects, which own the selectors,
so a UI change is fixed in one file rather than across the suite.

## Setup

```bash
npm install
npx playwright install chromium
copy .env.example .env
```

Fill in `ADMIN_EMAIL`, `ADMIN_PASSWORD` and `ADMIN_OTP` (sign-in asks for a
6-digit SMS code). The `setup` project signs in once and saves the session to
`.auth/admin.prod.json`; every other project reuses it.

Prefer not to put the password in `.env`? Sign in by hand instead:

```bash
npm run auth:login
```

## Run

```bash
npm test                # everything
npm run test:headed     # with the browser visible
npm run test:smoke      # only cases tagged @smoke
npm run test:admin      # the automated read-only cases
npm run test:backlog    # list the cases awaiting approval
npm run list            # what would run, without running it
npm run typecheck       # compile the framework
```

Select by tag: `npx playwright test --grep "@compliance"`. Tags are defined in
`src/config/test-tags.ts` — a suite tag (`@smoke` / `@regression`), a module
tag, and `@read-only` or `@writes-data`.

## Environments

`TEST_ENV` picks the target, defaulting to `prod`:

| TEST_ENV  | Base URL           | Writes               |
| --------- | ------------------ | -------------------- |
| `prod`    | `ADMIN_BASE_URL`   | blocked by the guard |
| `staging` | `STAGING_BASE_URL` | allowed              |

`staging` has no default URL on purpose: a wrong guess would point the
data-changing cases at production. The run fails with a clear message until
`STAGING_BASE_URL` is set.

## Reports

Every step attaches a screenshot and is titled with its action and expected
result, so the report reads like the written test case with evidence attached.

```bash
npm run report          # Playwright HTML
npm run allure:generate
npm run allure:open
```

## MCP

- Playwright MCP is configured in `.cursor/mcp.json`. Reload Cursor MCP after opening this repo.
- Optional TestDino reporting MCP: copy `.cursor/mcp.testdino.example.json` into `.cursor/mcp.json` and set `TESTDINO_PAT`.

Knowledge base for scenarios: Settings → Knowledge Base.
