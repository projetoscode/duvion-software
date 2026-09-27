'use client';

import type { RefObject } from 'react';
import { prefersReducedMotion, useGSAP } from '@/lib/animations';

interface Context {
  root: HTMLElement;
  reduced: boolean;
}

/**
 * Scoped GSAP/ScrollTrigger setup. Everything created inside `setup`
 * is automatically reverted when the component unmounts (route changes).
 */
export function useScrollAnimation(scope: RefObject<HTMLElement | null>, setup: (ctx: Context) => void, dependencies: unknown[] = []) {
  useGSAP(
    () => {
      const root = scope.current;
      if (!root) return;
      setup({ root, reduced: prefersReducedMotion() });
    },
    { scope, dependencies },
  );
}
