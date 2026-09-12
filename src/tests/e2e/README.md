# Cross-module flows

The Core Operational Flow lives here: one test that walks a record through
several modules, e.g. client → place → passenger → route sheet → assignment →
trip lifecycle → invoice.

Empty on purpose. Every step of that chain creates or changes data, so it needs
a staging target. TODO once `STAGING_BASE_URL` is set.
