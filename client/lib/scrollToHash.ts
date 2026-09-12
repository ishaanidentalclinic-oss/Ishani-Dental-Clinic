/**
 * Repeatedly attempts to find and smoothly scroll to an element by id, retrying
 * on every animation frame until it appears (or `timeout` elapses). This makes
 * hash navigation reliable across route changes, where the target section may
 * not exist in the DOM yet at the moment navigation is triggered.
 *
 * Before scrolling, it also waits for the element's position to stop moving
 * for a few consecutive frames. Sections below dynamically-sized content
 * (e.g. the before/after slider, which measures and sets its own height via
 * ResizeObserver after mount) can still be shifting down the page slightly
 * after they first appear — scrolling to a still-moving target is what causes
 * landing short of the intended section.
 */
export function waitAndScrollToId(id: string, { timeout = 4000 } = {}) {
  const start = performance.now();
  const REQUIRED_STABLE_FRAMES = 6;
  let lastTop: number | null = null;
  let stableFrames = 0;

  function attempt() {
    const el = document.getElementById(id);

    if (el) {
      const top = el.getBoundingClientRect().top;
      stableFrames = lastTop !== null && Math.abs(top - lastTop) < 0.5 ? stableFrames + 1 : 0;
      lastTop = top;

      if (stableFrames >= REQUIRED_STABLE_FRAMES) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
        return;
      }
    }

    if (performance.now() - start < timeout) {
      requestAnimationFrame(attempt);
    } else {
      el?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  requestAnimationFrame(attempt);
}
