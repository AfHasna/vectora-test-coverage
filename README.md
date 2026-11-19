# Vectora regression tests

Playwright + Allure for Vectora **Admin**, **Client**, **Service Provider**, **Driver**, and **Parent / Guardian** on **staging** local apps.

The live suite is `tests/regression/` (`REG-*` IDs). The previous VCTR suite is archived under `drafts/archive-current-suite/` — see `drafts/regression-inventory.md` and `docs/NEW-REGRESSION-SUITE-STRUCTURE.md`.

**Team briefing (what was accomplished):** [`docs/TEAM-STATUS.md`](docs/TEAM-STATUS.md).

## Layout

```
tests/fixtures/          login, env, Allure, stage guard
tests/regression/
  admin/
  client/
  service-provider/
  driver-app/
  guardian-app/          Parent app
  connected-flow/
drafts/archive-current-suite/   on-demand VCTR suite
```

## Setup

Copy `.env.example` to `.env`. Keep `TEST_ENV=staging` and localhost Base URLs. Credentials stay in `.env` only.

## Run

```bash
npm test                 # live tree (tests/regression)
npm run test:regression  # @regression under tests/regression
npm run test:archive     # archived VCTR suite
npx playwright test tests/regression/admin --project=admin
```

Allure: `npm run report:generate` then `npm run report:open` (port **8083** so it does not collide with the Parent app on 8081).
