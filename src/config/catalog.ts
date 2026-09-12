/**
 * UI constants used by the automated cases, verified against the live admin.
 * Sourced from Settings → Knowledge Base where the Knowledge Base documents them.
 */

/** Sidebar modules visible to an administrator, in order. */
export const sidebarModules = [
  'Home',
  'Stakeholder Management',
  'Workforce Management',
  'Fleet Management',
  'Compliance Management',
  'Service Operations',
  'Requests',
  'Accounting',
  'Reports',
  'Settings',
] as const;

export const stakeholderTabs = [
  { name: 'Clients', href: '/stakeholders/clients' },
  { name: 'Client Monitors', href: '/stakeholders/client-monitors' },
  { name: 'Places', href: '/stakeholders/places' },
  { name: 'Guardians', href: '/stakeholders/guardians' },
  { name: 'Passengers', href: '/stakeholders/passengers' },
] as const;

/** Home dashboard summary cards and the list each one links to. */
export const dashboardSummaries = [
  { name: 'Clients', href: '/stakeholders/clients' },
  { name: 'Drivers', href: '/workforce/drivers' },
  { name: 'Vehicles', href: '/vehicles' },
  { name: 'Passengers', href: '/stakeholders/passengers' },
  { name: 'Monitors', href: '/workforce/monitors' },
  { name: 'Service Providers', href: '/workforce/service-providers' },
] as const;

/** Compliance Management tabs and their paths. */
export const complianceTabs = [
  { name: 'Driver Compliance', href: '/compliance/drivers' },
  { name: 'Vehicle Compliance', href: '/compliance/vehicles' },
  { name: 'Monitor Compliance', href: '/compliance/monitors' },
  { name: 'Provider Compliance', href: '/compliance/service-providers' },
] as const;

/** Service Operations trip tabs. */
export const tripTabs = [
  { name: 'Active', href: '/service-operations/active-trips' },
  { name: 'Future', href: '/service-operations/future-trips' },
  { name: 'History', href: '/service-operations/trips-history' },
] as const;

/** Settings → General sections, as rendered on the live page. */
export const generalSettingsSections = [
  'Company Settings',
  'Billing & Invoices',
  'Compliance Settings',
  'Trip SLA Thresholds',
  'Request SLA Targets',
  'Route Timing Defaults',
  'Economics Cost Defaults',
  'Trip Generation',
  'Geo-Restriction',
] as const;

export const fleetTabs = [
  { name: 'Vehicles', href: '/vehicles' },
  { name: 'Maintenance', href: '/vehicles/maintenance' },
  { name: 'Assignment History', href: '/vehicles/assignment-history' },
] as const;

/** The three sections of the Add New Client form, in tab-strip order. */
export const clientFormTabs = [
  'Basic Info & Contacts',
  'Contracts & Pricing',
  'Client Portal Access',
] as const;

/** Knowledge Base: "Three statuses: Available, Maintenance, Out of Service". */
export const vehicleStatuses = ['Available', 'Maintenance', 'Out of Service'] as const;
