## 6. Test Suites & Cases

### CP-TS-01 — Authentication & Session

| ID | Title | Preconditions | Action Steps | Expected Result | Pri | Regr |
| --- | --- | --- | --- | --- | --- | --- |
| VCTR-CP-001 | Valid login + OTP succeeds | Logged out | 1) Go to portal.govectora.com 2) Enter valid email/password 3) Submit 4) Enter 6-digit OTP 5) Submit | Dashboard loads; sidebar shows the full nav list | P1 | Yes |
| VCTR-CP-002 | Invalid password rejected | Logged out | 1) Enter valid email + wrong password 2) Submit | Inline error; no OTP step reached | P1 | Yes |
| VCTR-CP-003 | Invalid OTP rejected | At OTP screen | 1) Enter wrong 6-digit code 2) Submit | Error shown; access denied | P2 | No |
| VCTR-CP-004 | Session sign-out | Logged in | 1) Open user menu 2) Sign out | Returns to login screen; protected routes unreachable | P1 | Yes |
| VCTR-CP-005 | Portal user blocked from Admin panel | Logged in as client-test | 1) Attempt to open admin.govectora.com in the same session/browser profile | Portal credentials do not grant Admin access (separate auth realm) | P1 | Yes |
| VCTR-CP-006 | First-run onboarding tour | Fresh login | 1) Observe "Skip"/"Next" tour prompt | Tour dismissible via Skip; does not block navigation | P3 | No |

### CP-TS-02 — Dashboard

| ID | Title | Preconditions | Action Steps | Expected Result | Pri | Regr |
| --- | --- | --- | --- | --- | --- | --- |
| VCTR-CP-007 | Today-at-a-glance cards render | Dashboard | 1) Observe Active Passengers, Today's Trips, In Progress, Completed Today, Open Incidents cards | Counts render and match underlying data (e.g. Active Passengers = 2 in test tenant) | P1 | Yes |
| VCTR-CP-008 | Trip Status Mix chart (last 30 days) | Dashboard | 1) Observe chart | Bars/legend for Scheduled/Dispatched/Accepted/In Progress/Completed/Cancelled/Not Completed render without error | P2 | No |
| VCTR-CP-009 | No-shows counter excluded from trip counts | Dashboard | 1) Compare "No-shows (passengers)" tile to Trip Status Mix totals | No-shows tracked separately, footnoted as "not counted as trips" | P2 | No |
| VCTR-CP-010 | Drivers Compliance summary tile | Dashboard | 1) Observe Compliant/Expiring/Non-Compliant counts | Matches Driver Compliance page totals | P1 | Yes |
| VCTR-CP-011 | Today's Trip Feed empty/populated state | Dashboard | 1) Observe feed | Shows "No trips scheduled for today" when empty, or a list when populated | P2 | No |

### CP-TS-03 — Passengers

| ID | Title | Preconditions | Action Steps | Expected Result | Pri | Regr |
| --- | --- | --- | --- | --- | --- | --- |
| VCTR-CP-012 | Passengers list scoped to tenant | `/passengers` | 1) Open list | Only this client's passengers appear (2 in test tenant); Name/Status columns present | P1 | Yes |
| VCTR-CP-013 | Add Passenger form (observe only, do not submit) | `/passengers` → Add Passenger | 1) Open Add Passenger 2) Inspect required fields | Form opens with the same field groupings as Admin's passenger form scoped to this client; do not save | P1 | Yes |
| VCTR-CP-014 | "My Requests" tab | Passengers page | 1) Open "My Requests" sub-tab | Shows client-submitted request history/status (Passenger Request type from Admin's Request SLA config) | P2 | No |
| VCTR-CP-015 | Export controls | Passengers list | 1) Trigger Excel/PDF/Print | Export completes without error | P3 | No |
| VCTR-CP-016 | Column visibility toggle | Passengers list | 1) Open Columns control 2) Toggle a column | Column show/hide persists during session | P3 | No |

### CP-TS-04 — Route Sheets & Trips

| ID | Title | Preconditions | Action Steps | Expected Result | Pri | Regr |
| --- | --- | --- | --- | --- | --- | --- |
| VCTR-CP-017 | Route Sheets list scoped & paired RSO/RSR | `/trips/route-sheets` | 1) Open list | Shows only this client's route sheets; Outbound/Return pairs share numeric suffix (e.g. RSO-0003/RSR-0003) | P1 | Yes |
| VCTR-CP-018 | Active Trips tab | Route Sheets → Active Trips | 1) Open tab | Shows today's trips for this client only, if any | P1 | Yes |
| VCTR-CP-019 | Future Trips are read-only | Route Sheets → Future Trips | 1) Open tab 2) Inspect available row actions | No dispatch/status-change action available — consistent with today-only dispatch rule | P1 | Yes |
| VCTR-CP-020 | Trips History read-only | Route Sheets → Trips History | 1) Open tab | Past trips listed; no mutating actions available | P2 | No |
| VCTR-CP-021 | On Demand Trips tab | Route Sheets → On Demand Trips | 1) Open tab | Renders without error (empty or populated) | P2 | No |
| VCTR-CP-022 | Active Days chip display | Route Sheets list | 1) Inspect Active Days column on a row | 7-day chip strip (M–S) highlights the correct scheduled days | P2 | No |

### CP-TS-05 — Incidents

| ID | Title | Preconditions | Action Steps | Expected Result | Pri | Regr |
| --- | --- | --- | --- | --- | --- | --- |
| VCTR-CP-023 | Incidents list scoped & read-only | `/incidents` | 1) Open list | Only this client's incidents shown (0 in test tenant → "No incidents have been reported"); no create/edit actions | P1 | Yes |
| VCTR-CP-024 | Incident detail linkage (data-dependent) | An incident exists | 1) Open an incident row | Links back to the source trip/passenger event (No Show / Early Cancel / Late Cancel) | P2 | No — data-dependent, currently empty in test tenant |

### CP-TS-06 — Compliance

| ID | Title | Preconditions | Action Steps | Expected Result | Pri | Regr |
| --- | --- | --- | --- | --- | --- | --- |
| VCTR-CP-025 | Driver Compliance tab scoped | `/compliance/driver-compliance` | 1) Open tab | Only drivers assigned to this client's routes shown; Expiring/Expired summary tiles at top | P1 | Yes |
| VCTR-CP-026 | Compliance thresholds match Admin config | Driver Compliance list | 1) Compare "Expiring within 30 days" tile logic to Admin Settings Compliance Thresholds | Same 30-day/7-day windows apply | P1 | Yes |
| VCTR-CP-027 | Monitor Compliance sub-tab | Compliance → Monitor Compliance | 1) Open sub-tab | Renders monitor compliance rows scoped to this client | P2 | No |
| VCTR-CP-028 | Export controls | Compliance list | 1) Trigger Excel/PDF/Print | Completes without error | P3 | No |

### CP-TS-07 — Invoices

| ID | Title | Preconditions | Action Steps | Expected Result | Pri | Regr |
| --- | --- | --- | --- | --- | --- | --- |
| VCTR-CP-029 | Invoices list scoped, empty state | `/invoices` | 1) Open list | Only this client's invoices shown (0 in test tenant → "No invoices found for your organization") | P1 | Yes |
| VCTR-CP-030 | Invoice status values (data-dependent) | An invoice exists | 1) Open an invoice | Status is one of Draft/Sent/Paid/Overdue | P2 | No — data-dependent, currently empty in test tenant |
| VCTR-CP-031 | No payment-initiation controls present | Invoices page | 1) Inspect available actions | Portal is view/download only — no "Pay Now" or payment-method entry point | P1 | Yes |

### CP-TS-08 — Budget & Economics

| ID | Title | Preconditions | Action Steps | Expected Result | Pri | Regr |
| --- | --- | --- | --- | --- | --- | --- |
| VCTR-CP-032 | Empty state without a contract | `/budget-economics`, no contract on file | 1) Open page | Shows "No contracts on file yet. Budget tracking will appear once a contract is set up." | P2 | No |
| VCTR-CP-033 | Populated view (data-dependent) | A client with a contract on file | 1) Open page | Budget tracking widgets render using Admin-configured Economics Cost Defaults | P3 | No — data-dependent, no contracted client currently available in test tenant |

### CP-TS-09 — Reports

| ID | Title | Preconditions | Action Steps | Expected Result | Pri | Regr |
| --- | --- | --- | --- | --- | --- | --- |
| VCTR-CP-034 | Spend Report sub-tabs render | `/reports/spend` | 1) Open Spend, Trips, Passengers, Incidents, Compliance sub-tabs in turn | Each renders without error, scoped to this client | P2 | No |
| VCTR-CP-035 | Report Filters control | Any report sub-tab | 1) Open Filters | Filter panel opens; applying/resetting works | P3 | No |

### CP-TS-10 — Messaging & Notifications

| ID | Title | Preconditions | Action Steps | Expected Result | Pri | Regr |
| --- | --- | --- | --- | --- | --- | --- |
| VCTR-CP-036 | Messaging entry point | Header | 1) Open Messages icon | Message center opens (scoped to this client's conversations) | P2 | No |
| VCTR-CP-037 | Notifications scoped & unread state | Header | 1) Open Notifications | Only this client's/user's notifications shown | P2 | No |
| VCTR-CP-038 | Dark/light mode toggle | Any page | 1) Toggle theme | Switches instantly; persists | P3 | No |

### CP-TS-11 — Cross-cutting: Tenant Scoping & Safety

| ID | Title | Preconditions | Action Steps | Expected Result | Pri | Regr |
| --- | --- | --- | --- | --- | --- | --- |
| VCTR-CP-039 | No cross-client data leakage | Any list module | 1) Inspect all rows across Passengers, Route Sheets, Incidents, Compliance, Invoices | Every row belongs to this portal user's own `client_id` — none from other clients | P1 | Yes |
| VCTR-CP-040 | Pagination defaults consistent with Admin | Any list with >10 rows (data-dependent) | 1) Observe default page size | 10 per page, matching Admin convention | P3 | No |
| VCTR-CP-041 | Global Search scope (if present) | Header search icon | 1) Open search 2) Query a passenger name | Results limited to this client's own data | P2 | No |
| VCTR-CP-042 | Help link | Sidebar | 1) Open Help | Contextual help content loads without error | P3 | No |

## 7. Regression Suite
