# Vectora Playwright tests

Read-only end-to-end tests for Vectora transportation portals. Production data on `https://admin.govectora.com/` must never be created, edited, archived, or deleted.

## Setup

```bash
npm install
npx playwright install chromium
copy .env.example .env
```

Save an admin session without putting a password in git:

```bash
npm run auth:login
```

Sign in in the headed browser, then close it. Session is written to `.auth/admin.json`.

Alternatively set `ADMIN_EMAIL` and `ADMIN_PASSWORD` in `.env`.

## Run

```bash
npm test
npm run test:public
npm run test:admin
```

## Reports

Playwright HTML (wired to the Playwright MCP output folder for traces):

```bash
npm run report
```

Allure:

```bash
npm run allure:generate
npm run allure:open
```

## MCP

- Playwright MCP is configured in `.cursor/mcp.json` with testing, tracing, and storage tools. Reload Cursor MCP after opening this repo.
- Optional TestDino reporting MCP: copy `.cursor/mcp.testdino.example.json` into `.cursor/mcp.json` and set `TESTDINO_PAT`.

Knowledge base for scenarios: Settings → Knowledge Base.
