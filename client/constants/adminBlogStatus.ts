/** Mirrors server/src/constants/blogStatus.js — keep the two in sync. */
export const BLOG_STATUS_VALUES = ["draft", "published"] as const;

export type BlogStatus = (typeof BLOG_STATUS_VALUES)[number];
