# Vectora regression tests

Playwright scripts for the Vectora **Admin Portal**, **Client Portal**, and **Service Provider Portal**. The folder layout is **Page → Test Set → Test Sequence**, matching the Confluence test plans 1:1: one product page folder, one spec file per Test Set, one `test()` per VCTR row in table order.

## Why this layout

Each Confluence Test Set is already one module/page. The spec file is that set; cases inside it run in **serial VCTR order** so the report sequence matches the source table. Files (and portals) can run in parallel.

| Portal | IDs | Plan |
| --- | --- | --- |
| Admin Portal | `VCTR-ADM-001` … `123` | [Admin Portal — Regression Test Plan](https://govectora.atlassian.net/wiki/x/cwDE) |
| Client Portal | `VCTR-CP-001` … `042` | [Client Portal — Regression Test Plan](https://govectora.atlassian.net/wiki/x/1ADD) |
| Service Provider Portal | `VCTR-SP-001` … `040` | [Service Provider Portal — Regression Test Plan](https://govectora.atlassian.net/wiki/x/6QDD) |

Hub: [Vectora QA — Regression Test Plans](https://govectora.atlassian.net/wiki/x/vwDD). Cross-app context only (no specs): [Connected Flow](https://govectora.atlassian.net/wiki/x/iADE).

```
tests/
  admin/<page-slug>/<TS-ID>-<page-slug>.spec.ts
  client-portal/<page-slug>/<TS-ID>-<page-slug>.spec.ts
  service-provider/<page-slug>/<TS-ID>-<page-slug>.spec.ts
  fixtures/          login per portal, Allure metadata, read-only guard
```

Example: `tests/admin/clients/ADM-TS-03-clients.spec.ts` holds `VCTR-ADM-018` … `025` in that order.

## Setup

Playwright is already installed in this repo. Copy `.env.example` to `.env` and set portal emails/passwords. OTP is `000000` for the test accounts (read from `.env`, never committed).

## Run

```bash
npm test                 # full suite (all three portals)
npm run test:regression  # only cases tagged @regression (Regr = Yes)
npx playwright test tests/admin/clients
```

## Reports

Allure is layered on the existing Playwright reporters (`list`, HTML, JUnit, JSON). Raw Allure results go to `allure-results/`.

```bash
npm run report:generate
npm run report:open
```

`report:generate` copies `allure-report/latest/history` into `allure-results/history` when it exists (trend graphs), writes a permanent report to `allure-report/runs/<UTC-timestamp>-<git-sha>`, and refreshes `allure-report/latest`. Open a specific run with `npx allure open allure-report/runs/<folder>`.

Each test sets `parentSuite` = portal, `suite` = Test Set, `AS_ID` = VCTR ID, `sequence` = position in the set, severity from P1/P2/P3, `@regression` when Regr is Yes, and a TMS link back to that portal’s Confluence plan.

## Data-safety rule

Cases whose **Regr** or **Expected Result** says *requires sandbox*, *mutating*, *do not execute*, or *data-dependent* are `test.fixme()` with the Confluence wording in the skip comment. They are not implemented as a mutating click or submit. Production stays observe/navigate/assert only: no Save, Confirm, Archive, Delete, Restore, Generate, or form submit (login excepted). A request guard blocks mutating HTTP except auth and read-over-POST RPCs.

Admin **Accounting** (payout/invoice generation) is out of this pass per the hub page.
