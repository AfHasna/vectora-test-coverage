# New stage regression suite — plan and prerequisites

**Repo:** `C:\Users\EngAh\.cursor\Vectora` → GitHub `Vectora-Mobility/Test-Coverage`  
**Apps:** OneDrive **Vectora workspace** (`admin`, `client`, `service-provider`, `driver-app`, `guardians`)  
**Environment:** **STAGE only.** Never production.  
**Status:** Stages 0–8 closed (Admin + Client + SP + Driver + Parent + CONN). **Stage 8 CONN: REG-CONN-001–004 passed + Allure + new Confluence drafts.**

---

## Goal

1. Archive the current Playwright suite so it is usable on demand (not the live regression set).
2. Build a **new** regression suite from **hands-on stage practice** in the workspace apps (what the UI actually does).
3. Work **one app after another**, while treating the product as **one connected journey** (Admin seeds and links → Client sees tenant data → SP sees provider data → Driver runs trips → Parent/Guardian sees children).
4. After each portal: executable specs **and** a **new Confluence draft** for that portal. Existing Confluence pages stay untouched.
5. Expected results come from **Admin Knowledge Base** on stage (when present), otherwise from **known product rules** or **common expected UI behavior** — never invented from old VCTR copy.

---

## Hard rules

| Rule | Meaning |
|---|---|
| Stage only | Local apps pointed at staging Supabase. No `*.govectora.com` production writes. |
| Mutations allowed on stage | Add / edit / archive / delete **SEED_** and **TEST_** data only. |
| One app at a time | Finish Admin (practice + specs + draft Confluence) before Client, and so on. |
| Connected journey | Do not design isolated “page smoke” that contradicts the chain. Seed in Admin so later apps have real data. |
| Cases from practice | Steps = what was actually done on stage. Old `VCTR-*` cases are archived, not copied, unless Ahmad asks to revive one. |
| Confluence | **New draft pages only.** Do not edit current regression plan pages. |
| Credentials | Ahmad provides users and passwords. Do not invent accounts; do not reuse production `*-test@govectora.com` unless he confirms they exist **on staging**. |

---

## Prerequisites (Ahmad)

Complete these before / during Stage 0. Execution of portals **stops** on a portal that cannot log in.

### 1. Confirm stage connection (apps)

All five apps run from **Vectora workspace** against **staging**, not production.

| App | Workspace folder | Expected local URL | Must use |
|---|---|---|---|
| Admin | `admin` | http://localhost:5173 | Staging Supabase (`VITE_APP_ENV` / `VITE_SUPABASE_URL` = stage project) |
| Client | `client` | http://localhost:5174 | Same stage backend |
| Service Provider | `service-provider` | http://localhost:5175 | Same stage backend |
| Driver (mobile / Expo web) | `driver-app` | http://localhost:8082 | Same stage backend |
| Parent / Guardian (mobile / Expo web) | `guardians` | http://localhost:8081 | Same stage backend |

Playwright `.env` in Test-Coverage must stay:

- `TEST_ENV=staging`
- `ADMIN_BASE_URL` / `CLIENT_BASE_URL` / `PROVIDER_BASE_URL` / `DRIVER_BASE_URL` / `GUARDIAN_BASE_URL` = the URLs above

**Do not leave Base URLs unset** — code fallbacks are still production hosts.

### 2. Users and logins (Ahmad will provide)

Need **one working session per app** on **this** staging project. Prefer a dedicated test user per portal, all tied to the same SEED tenant graph.

Provide (chat or a local secrets file that is **not** committed):

| Portal | Email | Password | OTP (if any) | Linked to |
|---|---|---|---|---|
| Admin | | | | Platform / ops user |
| Client portal | | | | SEED client (e.g. school district) |
| Service Provider portal | | | | SEED provider |
| Driver app | | | | SEED driver record + Driver App user |
| Parent / Guardian app | | | | SEED guardian + linked passenger(s) |

Optional but useful: a second Client / SP user to assert **no cross-tenant leakage**.

### 3. Permission to mutate stage

Confirmed: **free to add, edit, archive, and delete** on stage, limited to `SEED_` / `TEST_` prefixes (and records created by this suite). No production data. No deleting unrelated live tenants.

### 4. Knowledge Base as expected-result source

On **stage Admin**: Settings → **Knowledge Base**.

- If an article covers the screen/flow: expected result **must** match it.
- If KB is missing or silent: use **known Vectora behavior** (tenant scoping, read-only money controls, OTP, archive vs delete, etc.) or **common expected behavior** (list loads, validation on empty required fields, toast/error on bad login).
- Document in the case which source was used: `kb:` / `known:` / `common:`.

### 5. Tools already in place (QE)

- Playwright + Allure in Test-Coverage.
- `test:regression` exists. **`test:basic` (@basic smoke) will be added** in the suites stage.
- Allure: `npm run report:generate` then `npm run report:open` (or port that does not collide with Expo 8081).

### 6. Out of scope until Ahmad says otherwise

- Editing existing Confluence regression plans.
- Copying archived `VCTR-*` cases into the new suite.
- Production runs.
- Accounting money-movement / payout generation unless KB + Ahmad explicitly include it.

---

## Connected journey (how work stays one chain)

The product is one operational graph. Order of **data** (even while we finish **tests** portal-by-portal):

```
Admin (seed + link)
  → Client (same tenant: passengers, sheets, invoices, compliance)
  → SP (same provider: drivers, monitors, trips, accounting views)
  → Driver app (assigned runs / duty)
  → Parent / Guardian app (linked children / tracking)
```

**While on Admin**, create the SEED graph so later apps are not empty:

1. Reference data needed by forms (types, vehicle wheelchair capacity, equipment).
2. `SEED` client (geocoded address, contact, type).
3. `SEED` place + calendar/bell times if required.
4. Guardians + Parent-app users.
5. Passengers linked to client / place / guardians.
6. `SEED` service provider + documents + SP portal user.
7. Drivers + Driver-app users; `SEED` vehicle; client ↔ SP link.
8. Route sheets (AM/PM) → assign → generate runs → dispatch as the UI allows.
9. Client portal users on the client record (not only empty Settings lists).

If a later portal has no data, that is a **finding** (seed/link gap), not a reason to invent a passing assertion.

---

## Execution order

**Stage 0 first** (apps on stage and running). Then archive. Then **one portal at a time**. After each portal: specs + Allure for that portal + **Confluence draft for that portal**. Connected-flow specs last (or a thin smoke after Admin seed, expanded after all apps).

| # | Stage | What happens | Pause? | Estimate |
|---|---|---|---|---|
| **0** | **Stage apps up** | Start all 5 workspace apps. Confirm they hit **staging** (not prod). Confirm each URL loads. Login **Admin** with provided creds; try Client / SP / Driver / Parent as soon as creds exist. Record blockers. | Yes | 2–4 h |
| **1** | Archive current suite | Move `tests/admin`, `client-portal`, `service-provider`, `driver-app`, `guardian-app`, `journey` → `drafts/archive-current-suite/` (same folders). Inventory in `drafts/regression-inventory.md`. Keep `tests/fixtures/` (+ catalog if needed). Point Playwright at the new tree. | Yes | 2–3 h |
| **2** | New structure | `docs/NEW-REGRESSION-SUITE-STRUCTURE.md` + empty `tests/regression/...`. ID scheme `REG-ADM-###`, `REG-CP-###`, `REG-SP-###`, `REG-DRV-###`, `REG-PAR-###` (Parent), `REG-CONN-###`. Tag `@basic` vs `@regression`. SEED_ assumptions. | Yes | 3–4 h |
| **3** | **Admin** | Practice on stage → write `tests/regression/admin/...` → run Admin → Allure → **Confluence draft: Admin**. Seed graph for the chain. | Yes | 1.5–3 d |
| **4** | **Client** | Practice with Admin-seeded tenant → `tests/regression/client/...` → run → Allure → **Confluence draft: Client**. | Yes | 1–1.5 d |
| **5** | **Service Provider** | Practice with same graph → `tests/regression/service-provider/...` → run → Allure → **Confluence draft: SP**. | Yes | 1–1.5 d |
| **6** | **Driver app (mobile)** | Practice Expo/web on stage → `tests/regression/driver-app/...` → run → Allure → **Confluence draft: Driver**. Skip/block if app not on stage or user not linked. | Yes | 0.5–1 d |
| **7** | **Parent app (Guardian)** | Same for `guardians` → `tests/regression/guardian-app/` (folder name in repo; cases titled Parent/Guardian) → Allure → **Confluence draft: Parent**. | Yes | 0.5–1 d |
| **8** | **Connected journey** | End-to-end happy path across modules (`tests/regression/connected-flow/`). | Yes | 0.5–1 d |
| **9** | Suite scripts | `npm run test:basic` (`@basic` only) and `npm run test:regression` (`tests/regression`). | With 9/10 | 1–2 h |
| **10** | Full run + Allure | Basic then full regression. Report: pass/fail counts, failed REG-IDs, product defect vs test issue, path to Allure. | Yes | 0.5 d |
| **11** | Confluence wrap | Hub **draft** page linking per-portal drafts (created in 3–7). Still **no edits** to existing plans. | End | 2–4 h |

**Total ETA:** ~7–12 working days if Stage 0 logins + SEED graph work. **Admin-only** if other creds are late: ~4–6 days, then resume 4–8 when logins arrive.

After every numbered stage: **time spent vs estimate**, findings, and wait if Ahmad pauses.

---

## Per-portal definition of done

For Admin, then Client, then SP, then Driver, then Parent:

1. App was **running and on stage** (Stage 0 + re-check that day).
2. Logged in with **Ahmad-provided** user.
3. Flows practiced (navigate + mutate SEED_/TEST_ as needed).
4. New Playwright cases under `tests/regression/<portal>/...` with Allure: `parentSuite` = portal, `suite` = area/page, `AS_ID` = REG-…, `@basic` and/or `@regression`, severity.
5. Expected result line cites **kb / known / common**.
6. Portal run executed; Allure generated.
7. **New Confluence draft** for that portal: structure, case list, SEED_ notes, how to run, Allure path. Existing pages not modified.

---

## New suite layout (target)

```
drafts/archive-current-suite/     ← current VCTR suite (on demand only)
drafts/regression-inventory.md

docs/NEW-REGRESSION-PLAN.md       ← this file
docs/NEW-REGRESSION-SUITE-STRUCTURE.md

tests/fixtures/                   ← shared login, env, Allure, stage guard
tests/regression/
  admin/<area>/
  client/<area>/
  service-provider/<area>/
  driver-app/
  guardian-app/                   ← Parent app
  connected-flow/
```

**@basic:** login + shell/dashboard + one critical list per portal (post-deploy smoke).  
**@regression:** full area coverage including create/edit/archive on SEED_ data.

---

## What stays vs what moves (archive)

| Stay in live `tests/` | Move to `drafts/archive-current-suite/` |
|---|---|
| `fixtures/` (login, env, setups, annotate, read-only guard, run-case) | All current `*.spec.ts` under admin / client-portal / service-provider / driver-app / guardian-app / journey |
| Playwright config (updated for new paths) | `tests/_catalog/*.json` if they only describe old VCTR rows |

Archived cases are **not** the new regression suite. Revive only if Ahmad asks.

---

## Reports Ahmad gets

After each portal run and after Stage 10:

- Pass / fail / skipped counts
- Failed **REG-IDs** (and whether it looks like a **product defect** or a **test/env** issue)
- Path to Allure: `allure-report/latest` and stamped `allure-report/runs/<utc>-<sha>`
- SEED_ records created (names) so they can be reused or cleaned up

---

## Risks and blockers

| Risk | Impact | Mitigation |
|---|---|---|
| App pointed at production | Accidental prod writes | Stage 0 check of `VITE_SUPABASE_URL` / env; `TEST_ENV=staging` required |
| Missing portal user or not linked on the entity | Client / SP / Driver / Parent blocked | Wait for Ahmad’s creds; provision SEED users in Admin if he asks |
| Empty stage (no client/place/trips) | Later apps have nothing to assert | Seed during Admin (Stage 3) |
| KB empty for a screen | Weaker expected results | Fall back to known/common; note it on the case |
| Expo ports vs Allure | `report:open` default 8081 clashes with Parent app | Use another port (e.g. 8083) |
| Uncommitted work on current branch | Archive must include it as “current suite” | Stage 1 moves those specs too |

---

## First action after “go”

**Stage 0 — not coding cases:**

1. Start Admin, Client, SP, Driver, Parent from Vectora workspace.
2. Verify each is on **staging** and the five local URLs respond.
3. Log in with the users Ahmad provides (Admin first).
4. Report: which apps are up, which logins work, which are blocked.
5. Only then Stage 1 (archive) → Stage 2 (structure) → Stage 3 (Admin suite + Confluence draft).

---

## Need from Ahmad to start

1. **Go** on this plan (or mark stages to skip/reorder).
2. **Logins** for all five apps (table in Prerequisites §2).
3. Confirm **Stage 0 URLs** (localhost as above vs different host).
4. Confirm **SEED_/TEST_ mutations on stage are allowed** (already stated: yes).
5. Later: Confluence **parent** for drafts (e.g. QA / Meetings or new “Regression Suite Drafts”).

Paste creds when ready; they go to local `.env` only, never to git or Confluence.
