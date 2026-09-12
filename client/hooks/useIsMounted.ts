import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

/**
 * SSR-safe "are we on the client yet" check, for components that need to defer
 * client-only APIs (e.g. createPortal) until after hydration — without the
 * setState-in-effect pattern that trips the react-hooks/set-state-in-effect rule.
 */
export function useIsMounted() {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
}
