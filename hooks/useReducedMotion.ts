import { useEffect, useState } from 'react';

/**
 * Returns true when the user's OS/browser has `prefers-reduced-motion: reduce`
 * set.  Re-renders if the preference changes while the component is mounted.
 *
 * Usage:
 *   const reducedMotion = useReducedMotion();
 *   if (reducedMotion) { // skip expensive animation }
 */
export function useReducedMotion(): boolean {
  const [reducedMotion, setReducedMotion] = useState<boolean>(() => {
    // Safe SSR default: assume no preference (motion allowed)
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');

    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);

    // Modern browsers
    if (mq.addEventListener) {
      mq.addEventListener('change', handler);
      return () => mq.removeEventListener('change', handler);
    }

    // Legacy Safari
    mq.addListener(handler);
    return () => mq.removeListener(handler);
  }, []);

  return reducedMotion;
}
