/** Mirrors server/src/constants/contactStatus.js — keep the two in sync. */
export const CONTACT_STATUS_VALUES = ["new", "resolved"] as const;

export type ContactStatus = (typeof CONTACT_STATUS_VALUES)[number];
