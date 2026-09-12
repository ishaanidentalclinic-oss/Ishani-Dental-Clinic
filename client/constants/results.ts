import type { ResultShowcase } from "@/types";

/**
 * Each case uses a single base photo edited into two states (same camera angle, crop,
 * lighting, and smile) so the only visible difference is the treatment result — real
 * matched clinic photography can be swapped in per case later without touching the UI.
 */
export const RESULT_SHOWCASES: ResultShowcase[] = [
  {
    id: "whitening",
    label: "Teeth Whitening",
    beforeImage: "/images/before-after/whitening-ai-before.webp",
    afterImage: "/images/before-after/whitening-ai-after.webp",
  },
  {
    id: "restorative",
    label: "Restorative Case",
    beforeImage: "/images/before-after/restorative-before.jpg",
    afterImage: "/images/before-after/restorative-after.jpg",
  },
];
