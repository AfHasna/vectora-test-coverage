## 6. Test Suites & Cases

### SP-TS-01 — Authentication & Session

| ID | Title | Preconditions | Action Steps | Expected Result | Pri | Regr |
| --- | --- | --- | --- | --- | --- | --- |
| VCTR-SP-001 | Valid login + OTP succeeds | Logged out | 1) Go to provider.govectora.com/login 2) Enter valid email/password 3) Submit 4) Enter 6-digit OTP 5) Submit | Dashboard loads with 4 status cards and charts | P1 | Yes |
| VCTR-SP-002 | Invalid password rejected | Logged out | 1) Enter valid email + wrong password 2) Submit | Inline error; no OTP step reached | P1 | Yes |
| VCTR-SP-003 | Invalid OTP rejected | At OTP screen | 1) Enter wrong 6-digit code 2) Submit | Error shown; access denied; "Didn't receive it?" resend control present | P2 | No |
| VCTR-SP-004 | Session sign-out | Logged in | 1) Open profile menu 2) Sign out | Returns to login; protected routes unreachable | P1 | Yes |
| VCTR-SP-005 | Provider credentials blocked from Admin panel | Logged in as sp-test | 1) Attempt admin.govectora.com with same credentials | Access denied — separate auth realm/tenant claim | P1 | Yes |
| VCTR-SP-006 | Collapsible sidebar | Any page | 1) Toggle "Open/Close sidebar" | Sidebar collapses/expands; nav links accessible in both states | P3 | No |

### SP-TS-02 — Dashboard

| ID | Title | Preconditions | Action Steps | Expected Result | Pri | Regr |
| --- | --- | --- | --- | --- | --- | --- |
| VCTR-SP-007 | Status cards render | Dashboard | 1) Observe Total Active Drivers, Compliant Personnel, Compliance Expiring Soon, Non-Compliant Personnel | All 4 cards render with correct labels/period (Today / Next 30 days) | P1 | Yes |
| VCTR-SP-008 | Trips Overview chart (last 7 days) | Dashboard | 1) Observe chart | Mon–Sun bars with Completed/In Progress/No Show/Cancelled legend render without error | P2 | No |
| VCTR-SP-009 | Today's Trip Statistics empty/populated state | Dashboard | 1) Observe panel | Shows "No trips today" or live breakdown; "Updated just now" / "Every minute" refresh label present | P2 | No |
| VCTR-SP-010 | Payout Disputes panel | Dashboard | 1) Observe panel | Shows "No disputes yet" or disputes grouped by status | P2 | No |
| VCTR-SP-011 | Payout Overview chart (last 30 days) | Dashboard | 1) Observe chart | Date axis (Aug 15 – Sep 9 style rolling window) and $ axis render without error | P3 | No |

### SP-TS-03 — Workforce: Drivers

| ID | Title | Preconditions | Action Steps | Expected Result | Pri | Regr |
| --- | --- | --- | --- | --- | --- | --- |
| VCTR-SP-012 | Drivers list scoped to this provider | `/workforce/drivers` | 1) Open list | Only drivers linked to this provider shown; 8 columns: Name, Status, Phone, License #, License Expiry, Compliance Status, Documents, Assigned Trips | P1 | Yes |
| VCTR-SP-013 | Add Driver form (observe only, do not submit) | Drivers list → Add Driver | 1) Open Add Driver 2) Inspect required fields | Form opens; do not save | P1 | Yes |
| VCTR-SP-014 | "My Requests" sub-tab | Workforce → My Requests | 1) Open sub-tab | Shows this provider's submitted request history (Driver Change Request type per Admin Request SLA config) | P2 | No |
| VCTR-SP-015 | Export controls | Drivers list | 1) Trigger Excel/PDF | Completes without error | P3 | No |
| VCTR-SP-016 | Column visibility (8/8 indicator) | Drivers list | 1) Open Columns control | Toggle available per column; count indicator updates (e.g. 7/8) | P3 | No |

### SP-TS-04 — Workforce: Monitors

| ID | Title | Preconditions | Action Steps | Expected Result | Pri | Regr |
| --- | --- | --- | --- | --- | --- | --- |
| VCTR-SP-017 | Monitors list scoped to this provider | Workforce → Monitors | 1) Open sub-tab | Only monitors linked to this provider shown | P1 | Yes |
| VCTR-SP-018 | Add Monitor form (observe only) | Monitors → Add | 1) Open Add Monitor 2) Inspect fields | Form opens; do not save | P2 | No |

### SP-TS-05 — Workforce: Compliance

| ID | Title | Preconditions | Action Steps | Expected Result | Pri | Regr |
| --- | --- | --- | --- | --- | --- | --- |
| VCTR-SP-019 | Compliance summary tiles | `/workforce/compliance` | 1) Observe Required/Verified/Expiring Soon/Missing-Expired tiles | Tiles render (0/0/0/0 in test tenant — "no drivers or monitors linked yet") | P1 | Yes |
| VCTR-SP-020 | Document upload entry point (observe only, do not upload) | Compliance page, a linked driver/monitor exists (data-dependent) | 1) Locate per-row upload control | Upload control present for each required document type | P2 | No — data-dependent, no linked personnel in test tenant |
| VCTR-SP-021 | Recent reminders table | Compliance page | 1) Observe "Recent reminders" section | Table columns Date/Subject/Recipient/Docs/Status render (empty state acceptable) | P3 | No |
| VCTR-SP-022 | Compliance thresholds match Admin config | Compliance tiles | 1) Compare "Expiring Soon" window to Admin Settings Compliance Thresholds | Same 30-day/7-day windows apply as Admin/Client Portal | P1 | Yes |

### SP-TS-06 — Trips

| ID | Title | Preconditions | Action Steps | Expected Result | Pri | Regr |
| --- | --- | --- | --- | --- | --- | --- |
| VCTR-SP-023 | Active Trips scoped to this provider's drivers | `/trips/active-trips` | 1) Open tab | 8 columns: Trip ID, Passenger, Driver, Monitor, Route, Start Time, Duration, Status; only this provider's trips shown | P1 | Yes |
| VCTR-SP-024 | Future Trips read-only | Trips → Future Trips | 1) Open tab 2) Inspect row actions | No dispatch/status-change action available (today-only dispatch rule) | P1 | Yes |
| VCTR-SP-025 | Trips History | Trips → Trips History | 1) Open tab | Past trips listed, read-only | P2 | No |
| VCTR-SP-026 | Export controls | Any trips tab | 1) Trigger Excel/PDF | Completes without error | P3 | No |

### SP-TS-07 — Accounting

| ID | Title | Preconditions | Action Steps | Expected Result | Pri | Regr |
| --- | --- | --- | --- | --- | --- | --- |
| VCTR-SP-027 | Payouts list scoped, empty state | `/accounting/payouts` | 1) Open list | 5 columns: Payout Date, Period, Amount, Status, Reference #, Download; empty rows acceptable in test tenant | P1 | Yes |
| VCTR-SP-028 | No money-movement controls present | Payouts page | 1) Inspect "Payout methods" section copy | Explicitly states "Saved for your records only — Vectora does not move money through these details" | P1 | Yes |
| VCTR-SP-029 | Add payout method (observe only, do not submit) | Payouts → Add method | 1) Open Add method 2) Inspect fields | Form opens; do not save | P2 | No |
| VCTR-SP-030 | Driver Payouts sub-tab | Accounting → Driver Payouts | 1) Open sub-tab | Per-driver payout breakdown renders, scoped to this provider | P2 | No |
| VCTR-SP-031 | Statements sub-tab | Accounting → Statements | 1) Open sub-tab | Renders without error | P3 | No |
| VCTR-SP-032 | Disputes sub-tab | Accounting → Disputes | 1) Open sub-tab | Renders without error; matches Dashboard "Payout Disputes" panel data | P2 | No |

### SP-TS-08 — Reports

| ID | Title | Preconditions | Action Steps | Expected Result | Pri | Regr |
| --- | --- | --- | --- | --- | --- | --- |
| VCTR-SP-033 | All 8 report sub-tabs render | `/reports` | 1) Open Performance, Trips, Earnings, Drivers, Monitors, Vehicles, Compliance, Incidents in turn | Each renders without error, scoped to this provider | P1 | Yes |
| VCTR-SP-034 | Period selector | Reports page | 1) Change Period (e.g. This week → custom range) 2) Reset | Data reflows to selected period; Reset restores default | P2 | No |

### SP-TS-09 — Messaging & Notifications

| ID | Title | Preconditions | Action Steps | Expected Result | Pri | Regr |
| --- | --- | --- | --- | --- | --- | --- |
| VCTR-SP-035 | Messaging entry point | Header | 1) Open Messaging | Message center opens, scoped to this provider's conversations | P2 | No |
| VCTR-SP-036 | Notifications scoped | Header | 1) Open Notifications | Only this provider's/user's notifications shown | P2 | No |
| VCTR-SP-037 | Dark/light mode toggle | Any page | 1) Toggle theme | Switches instantly; persists | P3 | No |

### SP-TS-10 — Cross-cutting: Tenant Scoping & Safety

| ID | Title | Preconditions | Action Steps | Expected Result | Pri | Regr |
| --- | --- | --- | --- | --- | --- | --- |
| VCTR-SP-038 | No cross-provider data leakage | Any list module | 1) Inspect all rows across Drivers, Monitors, Trips, Payouts, Compliance | Every row belongs to this portal user's own `service_provider_id` — none from other providers | P1 | Yes |
| VCTR-SP-039 | Read-only roster parity with Admin | Compare this portal's Drivers list to Admin's Settings → Service Provider Portal Users roster (Admin plan VCTR-ADM-110 range) | 1) Cross-check driver records | Data is consistent between the provider's own view and Admin's read-only roster | P2 | No |
| VCTR-SP-040 | Help link | Sidebar | 1) Open Help | Contextual help content loads without error | P3 | No |

## 7. Regression Suite
