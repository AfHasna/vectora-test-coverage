# Vectora Test-Coverage — team status (20 Sep 2026)

**Repo:** GitHub `Vectora-Mobility/Test-Coverage`  
**Branch:** `cursor/vectora-readonly-e2e-suite` (not pushed as of this note)  
**Owner of this rebuild:** Ahmad / QE with Cursor  
**Environment:** **staging only.** Local apps from OneDrive **Vectora workspace**, pointed at staging Supabase. Never production (`*.govectora.com`).

This file is the short briefing. Case-by-case catalogs live under `docs/*-CASE-REPOSITORY.md`.

---

## What we set out to do

Replace the old **VCTR-*** Playwright suite with a **new `REG-*` suite** built from live staging practice, **one portal at a time**, all **connected** through one Loop seed graph.

Rules the team should keep:

- Mutations only on **`SEED_`** (keep) and **`TEST_`** (disposable) records.
- No OTP test cases. QE emails use bypass **`000000`**.
- **New Confluence drafts only.** Existing regression Confluence pages were not edited.
- Expo Driver/Parent: do not full-reload after login (web session expires).

---

## What is live vs archived

| | Path | How to run |
|---|---|---|
| **Live suite** | `tests/regression/` | `TEST_ENV=staging` + `npm run test:regression` |
| **Old VCTR suite** | `drafts/archive-current-suite/` | `npm run test:archive` (on demand, not default) |

Commits on this branch:

1. `6c81989` — removed VCTR catalogs/specs from `tests/` so they are not the default suite.
2. `cc09878` — added Loop-connected `REG-*` specs, fixtures, Allure/Playwright config, catalogs, and the archived VCTR tree under `drafts/`.

---

## Loop seed graph (the data to look for)

Created/linked on **staging Admin** (`http://localhost:5173`). Search these names:

| Record | Name |
|---|---|
| Client | `SEED_QE Loop School` |
| Place + calendar | `SEED_QE Loop Place` / `SEED_QE Loop Calendar` |
| Guardian | `SEED LoopParent` |
| Passenger | `SEED LoopChild` |
| Home address | 18 Lyman Street, Westborough, MA 01581 |
| Vehicle | plate `SEEDLOOP1` |
| Internal driver | `SEED LoopDriver` (Loop runs assigned here) |
| Route sheets | RSO/RSR-0904 |
| On Demand | LoopChild, pickup 08:30, dropoff 45 West Main Street |

Passwords for portal users are in `tests/regression/admin/_helpers/loop-data.ts` and local `.env` (not production). OTP for QE emails: `000000`.

| Portal | Local URL | Login (Loop / connected user) | What they should see |
|---|---|---|---|
| Admin | http://localhost:5173 | Admin `.env` | Full Loop graph |
| Client | http://localhost:5174 | `seed.qe.loop.client@vectora-portal-seed.test` | **LoopChild** (not Westborough Stage 0 client) |
| Parent | http://localhost:8081 | `seed.qe.loop.parent@vectora-portal-seed.test` | **LoopChild** (not Kelly / Aiden) |
| SP | http://localhost:5175 | `seed.qe.sp@vectora-portal-seed.test` (3B Trans) | **Not** LoopDriver / LoopChild |
| Driver | http://localhost:8082 | `seed.qe.driver@vectora-portal-seed.test` (Ahmad Abu Hasna) | **Not** LoopChild |

---

## What was accomplished (Stages 0–8)

| Stage | Portal | Specs | Last dedicated run |
|---|---|---|---|
| 0–2 | Archive + structure | VCTR moved to `drafts/` | — |
| 3 | Admin | `REG-ADM-001`–`037` (auth, seed, sheets, OD, Internal LoopDriver) | 20 Sep 2026 |
| 4 | Client | `REG-CP-001`–`014` | 14/14 passed |
| 5 | SP | `REG-SP-001`–`014` | 14/14 passed |
| 6 | Driver | `REG-DRV-001`–`012` | 12/12 passed |
| 7 | Parent | `REG-PAR-001`–`012` | 12/12 passed |
| 8 | Connected apps | `REG-CONN-001`–`004` | 4/4 passed |

**Connected proof (Stage 8):**

- Client Loop School **sees** LoopChild.
- SP 3B Trans **does not** see Internal LoopDriver / LoopChild.
- Driver Ahmad **does not** see LoopChild.
- Parent LoopParent **does** see LoopChild.

---

## Combined Allure (all projects, one pass)

20 Sep 2026, `TEST_ENV=staging`, `tests/regression` `@regression`:

- **91 passed**
- **1 failed:** `REG-ADM-032` (journey-admin Assignments filter did not show `SEED_QE Loop School`)
- **4 did not run** after that serial fail: `REG-ADM-033`–`036`

Report: `allure-report/runs/2026-09-20_02-51-15-468Z-d0da1c1`  
Latest copy: `allure-report/latest`  
Open: `npm run report:generate` then `npm run report:open` (port **8083**).

---

## Confluence (new drafts only)

Existing published regression pages were **not** edited.

| Portal | Parent draft | Cases child |
|---|---|---|
| Admin | [18153473](https://govectora.atlassian.net/wiki/pages/resumedraft.action?draftId=18153473) | [18153483](https://govectora.atlassian.net/wiki/pages/resumedraft.action?draftId=18153483) |
| Client | [18153493](https://govectora.atlassian.net/wiki/pages/resumedraft.action?draftId=18153493) | [18219014](https://govectora.atlassian.net/wiki/pages/resumedraft.action?draftId=18219014) |
| SP | [18219026](https://govectora.atlassian.net/wiki/pages/resumedraft.action?draftId=18219026) | [18219037](https://govectora.atlassian.net/wiki/pages/resumedraft.action?draftId=18219037) |
| Driver | [18153507](https://govectora.atlassian.net/wiki/pages/resumedraft.action?draftId=18153507) | [18186244](https://govectora.atlassian.net/wiki/pages/resumedraft.action?draftId=18186244) |
| Parent | [18219048](https://govectora.atlassian.net/wiki/pages/resumedraft.action?draftId=18219048) | [18153519](https://govectora.atlassian.net/wiki/pages/resumedraft.action?draftId=18153519) |
| CONN | [18120713](https://govectora.atlassian.net/wiki/pages/resumedraft.action?draftId=18120713) | [18186255](https://govectora.atlassian.net/wiki/pages/resumedraft.action?draftId=18186255) |

---

## How to run

Apps from Vectora workspace:

| App | Port |
|---|---|
| Admin | 5173 |
| Client | 5174 |
| SP | 5175 |
| Parent Expo web | 8081 |
| Driver Expo web | 8082 |

```bash
# .env: TEST_ENV=staging and localhost Base URLs
npx playwright test --project=admin
npx playwright test --project=client
npx playwright test --project=provider
npx playwright test --project=driver
npx playwright test --project=guardian
npx playwright test --project=journey          # CONN-001–004
npx playwright test --project=journey-admin    # Admin REG-ADM-027–036
```

**Driver Expo web:** do not open two `8082` tabs or run Playwright against Ahmad while a human is logged in as the same user — refresh tokens are single-use and the app shows “Your session expired” within about a second.

---

## Known gaps / next

- Fix **REG-ADM-032** Assignments filter (combined run) and re-run `REG-ADM-033`–`036`.
- Push branch / PR when the team is ready.
- Sunday Active Trips on Client may show **No trips today** if Generate Runs did not create a Sunday run; On Demand is a separate list (use Include old trips if needed).
- Do not use Stage 0 `.env` `CLIENT_EMAIL` (Westborough) or `GUARDIAN_EMAIL` (Kelly) to inspect Loop data.

## Catalogs

- `docs/ADMIN-CASE-REPOSITORY.md`
- `docs/CLIENT-CASE-REPOSITORY.md`
- `docs/PROVIDER-CASE-REPOSITORY.md`
- `docs/DRIVER-CASE-REPOSITORY.md`
- `docs/PARENT-CASE-REPOSITORY.md`
- `docs/CONN-CASE-REPOSITORY.md`
- `docs/CONNECTED-JOURNEY-CASES.md`
- `docs/NEW-REGRESSION-PLAN.md`
