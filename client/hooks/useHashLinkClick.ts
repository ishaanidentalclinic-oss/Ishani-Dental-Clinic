"use client";

import type { MouseEvent } from "react";
import { useRouter, usePathname } from "next/navigation";
import { waitAndScrollToId } from "@/lib/scrollToHash";

/**
 * Returns a click-handler factory for links pointing at an in-page section
 * (e.g. "/#testimonials" or "/contact#appointment"). Same-page hash links
 * scroll immediately; cross-page ones navigate first and then poll for the
 * target section, since it may not exist in the DOM yet when navigation
 * starts. Plain links (no "#") get `undefined`, so Link/Button falls back to
 * default navigation untouched.
 */
export function useHashLinkClick() {
  const router = useRouter();
  const pathname = usePathname();

  return (href: string) => {
    const hashIndex = href.indexOf("#");
    if (hashIndex === -1) return undefined;

    const targetPath = href.slice(0, hashIndex) || "/";
    const id = href.slice(hashIndex + 1);

    return (event: MouseEvent) => {
      event.preventDefault();
      if (pathname === targetPath) {
        waitAndScrollToId(id);
      } else {
        router.push(href, { scroll: false });
        waitAndScrollToId(id);
      }
    };
  };
}
