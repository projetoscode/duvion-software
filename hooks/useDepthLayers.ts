'use client';

import { useEffect, type RefObject } from 'react';
import { canHover, gsap, prefersReducedMotion } from '@/lib/animations';

/**
 * DOM mouse parallax: every descendant with `data-depth="0..1"` drifts
 * opposite to the cursor, proportionally to its depth.
 */
export function useDepthLayers(scope: RefObject<HTMLElement | null>, intensity = 24) {
  useEffect(() => {
    const root = scope.current;
    if (!root || !canHover() || prefersReducedMotion()) return;

    const layers = Array.from(root.querySelectorAll<HTMLElement>('[data-depth]')).map((el) => ({
      el,
      depth: parseFloat(el.dataset.depth ?? '0.5'),
      x: gsap.quickTo(el, 'x', { duration: 1.2, ease: 'power3.out' }),
      y: gsap.quickTo(el, 'y', { duration: 1.2, ease: 'power3.out' }),
    }));

    const onMove = (event: PointerEvent) => {
      const nx = event.clientX / window.innerWidth - 0.5;
      const ny = event.clientY / window.innerHeight - 0.5;
      layers.forEach((layer) => {
        layer.x(-nx * intensity * layer.depth);
        layer.y(-ny * intensity * layer.depth);
      });
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    return () => {
      window.removeEventListener('pointermove', onMove);
      gsap.set(
        layers.map((layer) => layer.el),
        { x: 0, y: 0 },
      );
    };
  }, [scope, intensity]);
}
