import { test } from '../../../../tests/fixtures/regression-test';

const PORTAL = "Admin Portal";
const SUITE = "ADM-TS-10 — Vehicles";
const TMS = "https://govectora.atlassian.net/wiki/x/cwDE";
const TOTAL = 5;

test.describe.configure({ mode: 'serial' });

test.describe(SUITE, () => {

  test("VCTR-ADM-048 — Add Vehicle form tabs", { tag: '@regression' }, async ({ runCase }) => {
    await runCase({
      portal: PORTAL,
      suite: SUITE,
      tms: TMS,
      id: "VCTR-ADM-048",
      title: "Add Vehicle form tabs",
      sequence: 1,
      total: TOTAL,
      priority: "P1",
      regression: true,
      preconditions: "Add Vehicle (observe only)",
      actionSteps: "1) Open Add Vehicle 2) Inspect tabs",
      expected: "Basic (plate, year, make, model, color, VIN, capacity, type, status), Registration, Insurance, Equipment, Photos tabs present",
    });
  });

  test("VCTR-ADM-049 — Inline status change (3 states)", { tag: '@regression' }, async ({ runCase }) => {
    await runCase({
      portal: PORTAL,
      suite: SUITE,
      tms: TMS,
      id: "VCTR-ADM-049",
      title: "Inline status change (3 states)",
      sequence: 2,
      total: TOTAL,
      priority: "P1",
      regression: true,
      preconditions: "Vehicles list",
      actionSteps: "1) Open inline status selector on a vehicle",
      expected: "Options: Available, Maintenance, Out of Service; control only enabled with `fleet.edit` permission",
    });
  });

  test("VCTR-ADM-050 — Archived vehicles excluded from pickers", async ({ runCase }) => {
    await runCase({
      portal: PORTAL,
      suite: SUITE,
      tms: TMS,
      id: "VCTR-ADM-050",
      title: "Archived vehicles excluded from pickers",
      sequence: 3,
      total: TOTAL,
      priority: "P2",
      regression: false,
      preconditions: "Vehicles list w/ an archived vehicle",
      actionSteps: "1) Open a driver/route assignment vehicle picker",
      expected: "Archived vehicle does not appear as selectable",
    });
  });

  test("VCTR-ADM-051 — 7D vs State Inspection due-date logic", async ({ runCase }) => {
    await runCase({
      portal: PORTAL,
      suite: SUITE,
      tms: TMS,
      id: "VCTR-ADM-051",
      title: "7D vs State Inspection due-date logic",
      sequence: 4,
      total: TOTAL,
      priority: "P2",
      regression: false,
      preconditions: "Vehicle with inspection dates set",
      actionSteps: "1) Compare entered inspection date to displayed next-due date",
      expected: "State: +12 months. 7D (MA): Feb–Mar→Nov 30 same year; Oct–Nov→Mar 31 next year, per documented windows",
    });
  });

  test("VCTR-ADM-052 — Vehicle View — Recent Assignment History card", async ({ runCase }) => {
    await runCase({
      portal: PORTAL,
      suite: SUITE,
      tms: TMS,
      id: "VCTR-ADM-052",
      title: "Vehicle View — Recent Assignment History card",
      sequence: 5,
      total: TOTAL,
      priority: "P2",
      regression: false,
      preconditions: "Vehicle with assignment history",
      actionSteps: "1) Open Vehicle View",
      expected: "Card shows last 5 assignments",
    });
  });
});
