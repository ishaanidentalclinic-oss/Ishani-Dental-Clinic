/** Mirrors server/src/constants/treatmentStatus.js — keep the two in sync. */
export const TREATMENT_STATUS_VALUES = ["draft", "published"] as const;

export type TreatmentStatus = (typeof TREATMENT_STATUS_VALUES)[number];
