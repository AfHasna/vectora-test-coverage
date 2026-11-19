# Staging E2E run — 15 Sep 2026

Local apps against staging Supabase (`byredwgrmgxorkivdkxl`). Playwright repo: `C:\Users\EngAh\.cursor\Vectora`.

| App | URL | Result |
|---|---|---|
| Admin | http://localhost:5173 | **Session works** as `alafandiosama@gmail.com` (OTP bypass `000000`) |
| Client | http://localhost:5174 | App loads; **prod test user is not a staging client-portal account** |
| Service Provider | http://localhost:5175 | App loads; **prod test user is not a staging SP-portal account** |
| Driver Expo | http://localhost:8082 | Login UI works; **prod `driver-test@` is not linked on staging** |
| Guardian Expo | http://localhost:8081 | Login UI works; **prod `guardian-test@` is not linked on staging** |

**Do not write production.** `TEST_ENV=staging` disables the mutating HTTP guard.

---

## What was added to Playwright

- Portal keys `driver` and `guardian` (`env.ts`, `.env`, `playwright.config.ts`)
- Setup: `driver.setup.ts`, `guardian.setup.ts`
- Specs: `tests/driver-app/**`, `tests/guardian-app/**`
- Journey: `tests/journey/wayland-seed.spec.ts`, `tests/journey/connected-apps.spec.ts`
- Login helper: Expo `Sign In` (`testID=sign-in-button`), longer OTP wait, `#mfa-code` typing, optional `stopAtOtp`
- Logged-in tests reuse storage state instead of forcing `/sign-in` again

---

## Reports

| Artifact | Path |
|---|---|
| **Allure (latest)** | `C:\Users\EngAh\.cursor\Vectora\allure-report\latest` |
| **Allure (this stamp)** | `C:\Users\EngAh\.cursor\Vectora\allure-report\runs\2026-09-15_02-33-29-179Z-d0da1c1` |
| Playwright HTML | `C:\Users\EngAh\.cursor\Vectora\reports\html` |
| Raw Allure results | `C:\Users\EngAh\.cursor\Vectora\allure-results` |

Open Allure:

```bash
cd C:\Users\EngAh\.cursor\Vectora
npx allure open --port 8083 allure-report/latest
```

(`8081` is already the Guardian Expo server.)

---

## Runs performed

### A — Full suite (all projects)

`npm test -- --workers=2`

| | Count |
|---|---|
| Passed | **117** |
| Failed | **10** |
| Skipped / did not run | **108** (serial auth + failed setups) |
| Duration | ~12.8 min |

Failed:

1. `client-setup` — `client-test@govectora.com` / `Govectora@343` does not authenticate on staging  
2. `provider-setup` — same for `sp-test@govectora.com`  
3. `driver-setup` — same for `driver-test@govectora.com` (Expo Sign In present; account not valid here)  
4. `guardian-setup` — same for `guardian-test@govectora.com`  
5. `VCTR-ADM-003` — wrong OTP `111111`; UI did not show text matching `/invalid|incorrect|denied|error|wrong/` (bypass/Twilio copy mismatch). Serial suite then skipped ADM-004–009  
6. `VCTR-CP-001` — client login never completed  
7. `VCTR-SP-001` — SP login never completed  
8. `VCTR-DRV-001` — driver login never completed (1 min timeout)  
9. `VCTR-GRD-001` — guardian login never completed  
10. `VCTR-ADM-010` — first admin dashboard case re-opened `/sign-in` while already logged in (**fixed after this run**)

Client / SP / Driver / Guardian **module suites did not run** because setup failed.

### B — Admin + journey after login-precondition fix

`--project=admin-setup,admin,admin-auth,journey`

| | Count |
|---|---|
| Passed | **125** |
| Failed | **1** (`VCTR-ADM-003`) |
| Skipped / did not run | **9** (ADM-004–009 serial + 3 other) |
| Duration | ~8.8 min |

Admin list/dashboard/operations cases in this pass **did run** (clients, places, passengers, drivers, vehicles, route sheets, assignment, trips, users, compliance, etc.).

Journey (all **passed** as inventory/smoke, not as a completed seed):

| ID | Title | Outcome |
|---|---|---|
| VCTR-SEED-001 | Admin Osama on local staging | Pass |
| VCTR-SEED-002 | Create/find SEED Wayland Public Schools | Pass (entity **not persisted** — create form blocked) |
| VCTR-SEED-003 | Places / guardians / passengers SEED names | Pass (inventory: **missing**) |
| VCTR-SEED-004 | SP / drivers / vehicles / AM-PM sheets | Pass (inventory: **missing**) |
| VCTR-SEED-005 | Provision portal users from Settings | Pass (controls present; **no user created** — needs linked records) |
| VCTR-SEED-006 | Assignment / trips / live tracking / accounting | Pass (pages load) |
| VCTR-SEED-007 | Record gaps | Pass |
| VCTR-CONN-001–004 | Client / SP / Driver / Guardian login attempts | Pass as **evaluation** (did not establish staging sessions) |

---

## Test cases performed (by suite)

### Admin (executed)

Authentication: VCTR-ADM-001, 002 (003 failed; 004–009 skipped serial).  
Dashboard: VCTR-ADM-010–017 (run B).  
Clients, monitors, places, passengers, guardians, drivers, availability, vehicles, assignment history, route sheets, routes assignment, trips, compliance, general settings, reference data, requests, users (including Driver/Guardian app user tabs), archive/delete safety, plus other ADM specs that passed in run A/B.

### Client / SP / Driver / Guardian Confluence suites

**Not executed beyond auth/setup** — no staging credentials.

New cases **authored**:

- Driver: VCTR-DRV-001–004, 010–012  
- Guardian: VCTR-GRD-001–004, 010–012  

### Seed Wayland (Confluence [AQDg](https://govectora.atlassian.net/wiki/x/AQDg))

Attempted via Admin UI. Staging was empty of `SEED *` rows. Full 21-step create (geocode, SP documents, vehicle wheelchair position, RSO/RSR, assign, generate runs, dispatch) **did not complete**.

---

## Connected-app evaluation

| App | Reachable | Auth on staging | Data / cross-app |
|---|---|---|---|
| Admin | Yes | Yes (Osama) | Empty operational graph: no Wayland client, school, passengers, drivers, van, route sheets |
| Client | Yes | No (`client-test@` is production-shaped) | Cannot see SEED passengers |
| SP | Yes | No | Cannot see SEED FTS / drivers |
| Driver | Expo web login renders | No linked driver-app user | No runs to execute |
| Guardian | Expo web sign-in renders | No linked guardian-app user | No children / tracking |

Cross-app chain **Admin → Client / SP / Driver / Guardian** is wired at the product level (Settings tabs exist: Client Portal Users, Driver App Users, Guardian App Users, SP roster). It is **not exercisable** until staging users are provisioned **on the entity records** (client portal tab, driver mobile access, guardian mobile access) — not only on empty Settings lists.

---

## Missing data to finish SEED Wayland

Create in Admin (prefix `SEED`), then provision portal users:

1. **Reference data** — client type (e.g. School District), vehicle type with **1 wheelchair position**, equipment for Nora  
2. **Client** — `SEED Wayland Public Schools`  
   - Required today: name, email, **contact (first/last/valid phone)**, **geocoded primary address** (timezone). Add form also needs a **Type**. Playwright hit **Save Contact** (not Save) and still could not persist the client without geocode/type.  
   - Suggested address: 41 Cochituate Road, Wayland, MA 01778  
3. **Place** — `SEED Williams Elementary School` (bell: Wed **12:35**, other days **14:50**)  
4. **Calendar / school year** on that place  
5. **Guardians** — Priya Patel, Raj Patel, Mei Chen + **Guardian App** emails/passwords  
6. **Passengers** — Nora Patel (wheelchair), Liam Chen (ambulatory), linked to client/place/guardians  
7. **SP** — `SEED FTS Demo Transport` (phone, contact, address, **compliance document**, vehicle types) + **SP portal user**  
8. **Drivers** — Ana Ruiz (primary), Omar Said (backup) + **Driver App** accounts  
9. **Vehicle** — `SEED Van 114` (wheelchair capacity 1) linked to SP  
10. **Link** client ↔ SP  
11. **RSO / RSR** — `SEED Williams AM` / `PM` (Nora + Liam)  
12. **Confirm sheets → assign Ana → generate runs → dispatch**  
13. **Staging portal users** (do not reuse production `*-test@govectora.com` unless those Auth users exist **on this project**):

| Portal | Suggested email | Notes |
|---|---|---|
| Client | `seed.wayland.client@govectora.test` | Create on the client **Portal Access** tab after the client exists |
| SP | `seed.fts.sp@govectora.test` | Create on the SP record, not only the read-only Settings roster |
| Driver Ana | `seed.ana.ruiz@govectora.test` | Must be linked to the driver row |
| Guardian Priya | `seed.priya.patel@govectora.test` | Must be linked to the guardian row |

Add those emails to **2FA test bypass** (same vault list as Osama) so OTP stays `000000`.

Also missing for a fair connected-app score:

- Billing/contract on the client if Client portal invoices are in scope  
- Wednesday early-bell exception on the place  
- At least one **generated run for today** so Driver/Guardian have a live trip  

---

## Suggested next actions

1. In Admin, complete SEED entities in the order above (or a SQL seed that still goes through geocoding).  
2. Create portal users on those records; put emails in `.env` (`CLIENT_EMAIL`, `SP_EMAIL`, `DRIVER_EMAIL`, `GUARDIAN_EMAIL`).  
3. Add those emails to `test_bypass_emails`.  
4. Re-run `npm test` then `npm run report:generate`.  
5. Soften `VCTR-ADM-003` for bypass accounts (wrong code copy is not `invalid/incorrect`) **or** drop serial mode so ADM-004–009 still run.
