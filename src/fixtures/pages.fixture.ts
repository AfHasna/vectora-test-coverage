import { AssignmentHistoryPage } from '@pages/fleet/AssignmentHistoryPage';
import { AddClientPage } from '@pages/stakeholders/AddClientPage';
import { ClientsPage } from '@pages/stakeholders/ClientsPage';
import { CompliancePage } from '@pages/compliance/CompliancePage';
import { DriversAvailabilityPage } from '@pages/workforce/DriversAvailabilityPage';
import { GeneralSettingsPage } from '@pages/settings/GeneralSettingsPage';
import { HomePage } from '@pages/dashboard/HomePage';
import { NotificationsPage } from '@pages/notifications/NotificationsPage';
import { SignInPage } from '@pages/auth/SignInPage';
import { TripsPage } from '@pages/service-operations/TripsPage';
import { TripsReportPage } from '@pages/reports/TripsReportPage';
import { expect, test as authTest } from './auth.fixture';

/**
 * Page objects handed to specs ready-built, so a spec never constructs one and
 * never reaches for a raw locator.
 */
interface Pages {
  signIn: SignInPage;
  home: HomePage;
  clients: ClientsPage;
  addClient: AddClientPage;
  driversAvailability: DriversAvailabilityPage;
  assignmentHistory: AssignmentHistoryPage;
  compliance: CompliancePage;
  trips: TripsPage;
  tripsReport: TripsReportPage;
  notifications: NotificationsPage;
  generalSettings: GeneralSettingsPage;
}

export const test = authTest.extend<Pages>({
  signIn: async ({ page }, use) => use(new SignInPage(page)),
  home: async ({ page }, use) => use(new HomePage(page)),
  clients: async ({ page }, use) => use(new ClientsPage(page)),
  addClient: async ({ page }, use) => use(new AddClientPage(page)),
  driversAvailability: async ({ page }, use) => use(new DriversAvailabilityPage(page)),
  assignmentHistory: async ({ page }, use) => use(new AssignmentHistoryPage(page)),
  compliance: async ({ page }, use) => use(new CompliancePage(page)),
  trips: async ({ page }, use) => use(new TripsPage(page)),
  tripsReport: async ({ page }, use) => use(new TripsReportPage(page)),
  notifications: async ({ page }, use) => use(new NotificationsPage(page)),
  generalSettings: async ({ page }, use) => use(new GeneralSettingsPage(page)),
});

export { expect };

/** Every read-only spec starts this way: no session means no test. */
export function requireSession(opened: boolean): void {
  test.skip(!opened, 'Admin session missing. Run the setup project or npm run auth:login.');
}
