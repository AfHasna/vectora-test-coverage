# Admin portal — sequential case repository (Stage 3)

Source: staging practice on local Admin (`http://localhost:5173`) + Knowledge Base System Overview / Stakeholders articles.  
IDs: `REG-ADM-*`. Tags: `@basic` smoke, `@regression` full.  
Data prefix: **SEED_** (keep for Client/SP/Driver/Parent) and **TEST_** (archive/delete only).

| # | ID | Area | Action | Data | Expected (source) |
|---|---|---|---|---|---|
| 1 | REG-ADM-001 | Auth | Login + OTP | Admin `.env` / `000000` | Home + sidebar (kb) |
| 2 | REG-ADM-002 | Auth | Wrong password | email + invalid password | Stay on sign-in (common) |
| 3 | REG-ADM-003 | Auth | Open sign-in | — | Email + password fields (common) |
| 4 | REG-ADM-004 | Home | Open `/` | session | Dashboard hub (kb) |
| 5 | REG-ADM-005 | KB | Open System Overview | `/settings/knowledge-base/system-overview` | What is Vectora + archive vs delete (kb) |
| 6 | REG-ADM-006 | Stakeholders | Open Clients | `/stakeholders/clients` | Add Client + tab strip (kb) |
| 7 | REG-ADM-007 | Clients | Inspect Add Client | 3 tabs | Required contact+address; Save disabled (kb) |
| 8 | REG-ADM-008 | Clients | **Create** SEED client | `SEED_QE Loop School` | Listed, not archived (kb) |
| 9 | REG-ADM-009 | Clients | **Edit** SEED client | same name | Portal Access tab in edit (kb) |
| 10 | REG-ADM-010 | Places | Open Places | `/stakeholders/places` | Add Place for calendars/ETAs (kb) |
| 11 | REG-ADM-011 | Guardians | Open Guardians | `/stakeholders/guardians` | Registry + mobile access (kb) |
| 12 | REG-ADM-012 | Passengers | Open Add Passenger | `/stakeholders/passengers/add` | Draft + client link; cancel (kb) |
| 13 | REG-ADM-013 | Archive | Open Archive dialog, **cancel** | SEED client | Archive verb + linked-records; SEED stays (kb) |
| 14 | REG-ADM-014 | Workforce/Fleet | Open Drivers, SPs, Vehicles | those paths | Lists for the rest of the loop (kb) |
| 15 | REG-ADM-015 | Places | **Create** SEED place | `SEED_QE Loop Place` + Lyman St geocode | Listed for route ETAs (kb) |
| 16 | REG-ADM-016 | Places | **Add calendar** Bell In/Out | `SEED_QE Loop Calendar` 09/01/2026–06/30/2027 | Place calendar for route ETAs (kb) |
| 17 | REG-ADM-017 | Guardians | **Create** SEED guardian | `SEED LoopParent` / `(508) 555-0101` | Central registry (kb) |
| 18 | REG-ADM-018 | Passengers | **Create** SEED passenger | `SEED LoopChild` + client/place/guardian | Draft + client link (kb) |
| 19 | REG-ADM-019 | Archive | TEST_ create → archive → restore | `TEST_QE Disposable Client` | Archive reversible; SEED untouched (kb) |
| 20 | REG-ADM-020 | Fleet | Inspect Add Vehicle | `/vehicles` | Required plate/type; cancel (kb) |
| 21 | REG-ADM-021 | Route sheets | Open Create Route Sheet | `/service-operations/route-sheets/add` | Wizard opens (kb) |
| 22 | REG-ADM-022 | Fleet | **Create** internal vehicle | plate `SEEDLOOP1` Ford Transit + insurance | Listed on Fleet (kb) |
| 23 | REG-ADM-023 | Guardians | **Activate** Parent-app access | LoopParent + `seed.qe.loop.parent@...` | Mobile App Access Active (kb) |
| 24 | REG-ADM-024 | Passengers | Set LoopChild **Active** | inline status | Required for run generation (kb) |
| 25 | REG-ADM-025 | Route sheets | **Create** AM/PM sheet for LoopChild | client + passenger + outbound/return | Pickup/dropoff on wizard (kb) |
| 26 | REG-ADM-026 | Assignment | **Generate Runs** | `/service-operations/routes-assignment` | Idempotent today trips (kb) |
| 27 | REG-ADM-027 | Journey | Confirm stakeholder graph | Loop School / Place / Parent / Child | All four listed (kb) |
| 28 | REG-ADM-028 | Passengers | **Add Home address** | Lyman St nickname Home | Home pickup enabled (kb) |
| 29 | REG-ADM-029 | Clients | **Activate Client Portal** | `seed.qe.loop.client@...` | Portal Access Active (kb) |
| 30 | REG-ADM-030 | Workforce | Drivers + SP + SEEDLOOP1 | existing Stage 0 + plate | Lists ready for assign (kb) |
| 31 | REG-ADM-031 | Route sheets | **Create AM/PM with locations** | Home + Loop Place calendar | Sheet saved (kb) |
| 32 | REG-ADM-032 | Assignment | **Assign driver + vehicle** | first driver + `SEEDLOOP1` | Dialog saves (kb) |
| 33 | REG-ADM-033 | Assignment | **Generate Runs** | today | Idempotent (kb) |
| 34 | REG-ADM-034 | Active Trips | Loop run on board | `/service-operations/active-trips` | Loop School + LoopChild (kb) |
| 35 | REG-ADM-035 | On Demand | **Add Trip** for LoopChild | org Loop School, today 08:30 | Created (kb) |
| 36 | REG-ADM-036 | On Demand / Active | OD trip listed | LoopChild on OD + Active Trips | Shown with linked names (kb) |
| 37 | REG-ADM-037 | Workforce | **Create** internal driver | `SEED LoopDriver` | Internal driver for Assign Driver (kb) |
| 35 | REG-CONN-001 | Client | Loop School sees LoopChild | client `:5174` | Passenger listed (kb) |
| 36 | REG-CONN-002 | SP | SP portal trips/drivers | provider `:5175` | Tenant pages load (kb) |
| 37 | REG-CONN-003 | Driver | Driver app home | driver `:8082` | Home/Trips (kb) |
| 38 | REG-CONN-004 | Parent | LoopParent sees LoopChild | guardian `:8081` | Child listed (kb) |

Full step text: `docs/CONNECTED-JOURNEY-CASES.md`. Run journey (needs Admin + Client + SP + apps):

```bash
npx playwright test tests/regression/connected-flow --project=journey
```

**Last Admin run:** 20 Sep 2026. Allure `allure-report/latest`. REG-ADM-001–003 not executed (OTP). CONN-001–004 not Stage 3. Confluence draft: https://govectora.atlassian.net/wiki/pages/resumedraft.action?draftId=18153473&draftShareId=dfc2705e-588a-4d77-b04f-50fe5b19530d

```bash
npx playwright test tests/regression/admin --project=admin-auth --project=admin
```
