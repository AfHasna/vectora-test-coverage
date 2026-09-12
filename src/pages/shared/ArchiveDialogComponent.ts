/**
 * The confirm dialog behind Archive and Restore.
 *
 * Empty on purpose: both actions change data, so they are staging-only. Even
 * the dialog is left alone on production, where opening it is harmless but
 * confirming it is not.
 *
 * TODO once staging exists: open, read the warning, confirm, cancel.
 */

export {};
