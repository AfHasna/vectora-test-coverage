# New regression suite structure

Live specs live under `tests/regression/`. The old VCTR suite is in `drafts/archive-current-suite/` (see `drafts/regression-inventory.md`).

## Layout

```
tests/fixtures/                   shared login, env, Allure, stage guard
tests/regression/
  admin/<area>/
  client/<area>/
  service-provider/<area>/
  driver-app/
  guardian-app/                   Parent / Guardian app
  connected-flow/
```

Playwright `testDir` is `./tests`. Projects match `regression/<portal>/…`.

## Case IDs

| Portal | ID | Folder |
|---|---|---|
| Admin | `REG-ADM-001` … | `tests/regression/admin/` |
| Client | `REG-CP-001` … | `tests/regression/client/` |
| Service Provider | `REG-SP-001` … | `tests/regression/service-provider/` |
| Driver | `REG-DRV-001` … | `tests/regression/driver-app/` |
| Parent / Guardian | `REG-PAR-001` … | `tests/regression/guardian-app/` |
| Connected journey | `REG-CONN-001` … | `tests/regression/connected-flow/` |

Assign IDs in file order. Do not reuse archived `VCTR-*` numbers.

## Tags

| Tag | Meaning |
|---|---|
| `@basic` | Login + shell/dashboard + one critical list per portal (post-deploy smoke). |
| `@regression` | Full area coverage, including create/edit/archive on `SEED_` / `TEST_` data. |

A case may have both tags when it is part of smoke and the full suite.

## Allure

Each case must set:

- `parentSuite` = portal (`Admin`, `Client`, `Service Provider`, `Driver`, `Parent`)
- `suite` = area / page
- `AS_ID` = `REG-…`
- severity from P1 / P2 / P3
- description with preconditions, steps, expected result
- expected-result source prefix: `kb:` / `known:` / `common:`

Use `tests/fixtures/annotate.ts` (extend `CaseMeta` with `expectedSource` when Admin cases are written).

## SEED_ assumptions

- Environment: `TEST_ENV=staging`. Local apps against staging Supabase `byredwgrmgxorkivdkxl`.
- Mutate only records prefixed `SEED_` / `TEST_` or created by this suite.
- Stage 0 SEED users (OTP bypass `000000`):

| Portal | Bound to | Email |
|---|---|---|
| Admin | Osama (ops) | `alafandiosama@gmail.com` |
| Client | Westborough Public Schools | `seed.qe.client@vectora-portal-seed.test` |
| SP | 3B Trans LLC | `seed.qe.sp@vectora-portal-seed.test` |
| Driver | Ahmad Abu Hasna | `seed.qe.driver@vectora-portal-seed.test` |
| Parent | Kelly Bilodeau (Aiden) | `seed.qe.parent@vectora-portal-seed.test` |

Admin Stage 3 still seeds the operational graph (places, sheets, runs) as the UI allows so later portals are not empty.

## File naming

`tests/regression/<portal>/<area>/REG-<prefix>-<area>.spec.ts`  
One area per file. Serial inside a file when steps share data; files may run in parallel across areas.

Auth specs stay under `<portal>/authentication/` and run in `*-auth` projects (empty storage state).

## Commands

```bash
npm test                          # tests/regression + setups
npm run test:regression           # @regression only, under tests/regression
npm run test:archive              # archived VCTR suite (on demand)
npx playwright test tests/regression/admin --project=admin
```

`test:basic` (`@basic` only) is added in Stage 9.

## Confluence

New **draft** pages only, one per portal after that portal’s cases exist. Do not edit current regression plan pages.
