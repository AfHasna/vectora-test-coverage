# Connected Loop journey — cases and steps

Staging only. Records: `SEED_*` keep; `TEST_*` disposable.  
Apps: Admin `:5173`, Client `:5174`, SP `:5175`, Parent `:8081`, Driver `:8082`.

## Data used

| Role | Record | Login |
|---|---|---|
| Client | `SEED_QE Loop School` | `seed.qe.loop.client@vectora-portal-seed.test` |
| Place | `SEED_QE Loop Place` + calendar `SEED_QE Loop Calendar` | — |
| Guardian / Parent | `SEED LoopParent` | `seed.qe.loop.parent@vectora-portal-seed.test` |
| Passenger | `SEED LoopChild` (Active + home address) | — |
| Vehicle | plate `SEEDLOOP1` | — |
| Driver / SP | Stage 0 workforce already on staging | `.env` `DRIVER_*` / `SP_*` |

## Case list

| # | ID | Portal | What this case proves |
|---|---|---|---|
| 1 | REG-ADM-027 | Admin | Stakeholder graph is listed (client, place, guardian, passenger) |
| 2 | REG-ADM-028 | Admin | LoopChild has a **Home** address |
| 3 | REG-ADM-029 | Admin | Loop School **Client Portal** user is activated |
| 4 | REG-ADM-030 | Admin | Workforce lists have at least one driver and one SP |
| 5 | REG-ADM-031 | Admin | AM/PM route sheet with home + place locations is saved |
| 6 | REG-ADM-032 | Admin | Driver + vehicle assigned on Routes Assignment |
| 7 | REG-ADM-033 | Admin | Generate Runs for today |
| 8 | REG-ADM-034 | Admin | Active Trips shows the Loop route / passenger |
| 10 | REG-CONN-001 | Client | Loop School portal shows LoopChild |
| 11 | REG-CONN-002 | SP | 3B Trans does **not** see Internal LoopDriver / LoopChild |
| 12 | REG-CONN-003 | Driver | Ahmad’s app does **not** show LoopChild |
| 13 | REG-CONN-004 | Parent | LoopParent app shows LoopChild |

## Action steps (practice)

### REG-ADM-027 — Stakeholder data defined

1. Open `/stakeholders/clients`, filter `SEED_QE Loop School`, confirm the row.
2. Open `/stakeholders/places`, filter `SEED_QE Loop Place`, confirm the row.
3. Open `/stakeholders/guardians`, filter `LoopParent`, confirm the row.
4. Open `/stakeholders/passengers`, filter `LoopChild`, confirm the row.

**Expected (kb):** Client → Place/calendar → Guardian → Passenger must exist before a route sheet.

### REG-ADM-028 — Passenger home address

1. Open LoopChild → **Edit Passenger**.
2. If Home Addresses already lists an address, stop.
3. Else **Add Address** → Address Name `Home` → geocode `18 Lyman Street, Westborough, MA 01581` → **Save Address**.
4. **Save Changes**.

**Expected (kb):** Add-to-route Home pickup stays disabled until the passenger has a home address.

### REG-ADM-029 — Client portal user

1. Open Loop School → **Edit Client** → tab **Client Portal Access**.
2. If badge **Active** and the email is listed, stop.
3. Else First `SEED`, Last `Loop`, email `seed.qe.loop.client@...`, password from loop data → **Activate Portal Access**.

**Expected (kb):** Portal users are provisioned on the client record, not a global roster.

### REG-ADM-030 — Workforce defined

1. Open `/workforce/drivers`, confirm at least one driver row.
2. Open `/workforce/service-providers`, confirm at least one SP row.
3. Open `/vehicles`, filter `SEEDLOOP1`, confirm the plate.

**Expected (kb):** Routes Assignment needs a driver and a vehicle; SP portal needs a provider org.

### REG-ADM-031 — Route sheet created

1. If a Loop School sheet already lists LoopChild, stop.
2. Else `/service-operations/route-sheets/add`.
3. Set **Service Start Date** to today (`09/19/2026`).
4. **Add Passenger** → client Loop School → passenger LoopChild → check **Return**.
5. Default Location: passenger address **Home**, place **SEED_QE Loop Place**, calendar **SEED_QE Loop Calendar**.
6. Tick weekday **Active** checkboxes so pickup/drop-off fill.
7. **Add to Route** → **Save Route Sheet**.

**Expected (kb):** Outbound Home→Place, return Place→Home. Same-location pickup/drop-off is blocked.

### REG-ADM-032 — Confirm + Assign Driver

1. Route Sheets → filter passenger `SEED LoopChild`.
2. Row ⋮ → **Confirm Route** if Draft.
3. Assignments → filter LoopChild.
4. Row ⋮ → **Assign Driver** (not a toolbar button).
5. Pick a driver + vehicle `SEEDLOOP1` → Save.

**Expected (kb):** Only confirmed sheets appear on Assignments.

### REG-ADM-033 — Generate today’s trip from the sheet

1. Assignments → filter LoopChild.
2. Row ⋮ → **Generate Today's Trip**.
3. Toolbar **Generate Runs** (idempotent).

**Expected (kb):** Today’s `route_runs` appear without duplicates.

### REG-ADM-034 — Active Trips shows linked Loop data

1. Open `/service-operations/active-trips`.
2. Filter passenger LoopChild.
3. Confirm **SEED LoopChild** and **SEED_QE Loop School** on the trip.

**Expected (kb):** Generated run carries passenger + client from the route sheet.

### REG-ADM-035 — On Demand trip for the same client

1. Open `/service-operations/on-demand-trips` → **Add Trip**.
2. Search passengers → pick **SEED LoopChild** (org code autofills Loop School).
3. Trip date `2026-09-19`, pickup `08:30`.
4. Pickup `18 Lyman Street`, dropoff `45 West Main Street`, Westborough.
5. **Create Trip**.

**Expected (kb):** Organization Code must match the client name for that client’s billing/visibility.

### REG-ADM-036 — On Demand trip shown

1. On Demand Trips → search passenger LoopChild → row visible.
2. Active Trips → LoopChild still/also listed.

**Expected (kb):** Manual Add Trip uses the same pipeline as import and shows on today’s boards.

### REG-CONN-001 — Client portal

1. Open Client `:5174`, sign in as Loop School portal user + OTP `000000`.
2. Open Passengers (or dashboard).
3. Confirm `SEED LoopChild` is visible.

**Expected (kb):** Client sees only its own passengers.

### REG-CONN-002 — SP portal

1. Open SP `:5175`, sign in as `seed.qe.sp` (3B Trans) + OTP `000000`.
2. Open Drivers — confirm **SEED LoopDriver** is absent.
3. Open Active Trips — confirm **SEED LoopChild** is absent.

**Expected (kb):** Provider sees this organization’s assignments. Internal LoopDriver/LoopChild stay off 3B Trans.

### REG-CONN-003 — Driver app

1. Open Driver `:8082`, sign in as `seed.qe.driver` (Ahmad Abu Hasna) + OTP.
2. Dismiss safety if shown.
3. Confirm Home. LoopChild is **not** listed (assigned to Internal LoopDriver).

**Expected (kb):** Driver sees only his assignments.

### REG-CONN-004 — Parent app

1. Open Parent `:8081`, sign in as `SEED LoopParent`.
2. Confirm children/home.
3. Confirm `SEED LoopChild` is listed.

**Expected (kb):** Parent app users are the guardian mobile account, not the client portal user.
