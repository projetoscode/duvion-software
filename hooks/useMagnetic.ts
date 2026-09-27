'use client';

import { useEffect, type RefObject } from 'react';
import { canHover, gsap, prefersReducedMotion } from '@/lib/animations';

interface Options {
  strength?: number;
  radius?: number;
  innerRef?: RefObject<HTMLElement | null>;
}

/**
 * Pulls an element toward the cursor when it gets close.
 * The optional inner element travels further, creating a layered feel.
 */
export function useMagnetic<T extends HTMLElement>(ref: RefObject<T | null>, { strength = 0.35, radius = 70, innerRef }: Options = {}) {
  useEffect(() => {
    const el = ref.current;
    if (!el || !canHover() || prefersReducedMotion()) return;

    const inner = innerRef?.current ?? null;
    const xTo = gsap.quickTo(el, 'x', { duration: 0.8, ease: 'elastic.out(1, 0.45)' });
    const yTo = gsap.quickTo(el, 'y', { duration: 0.8, ease: 'elastic.out(1, 0.45)' });
    const innerX = inner ? gsap.quickTo(inner, 'x', { duration: 0.6, ease: 'power3.out' }) : null;
    const innerY = inner ? gsap.quickTo(inner, 'y', { duration: 0.6, ease: 'power3.out' }) : null;
    let active = false;

    const onMove = (event: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      const offsetX = Number(gsap.getProperty(el, 'x')) || 0;
      const offsetY = Number(gsap.getProperty(el, 'y')) || 0;
      const cx = rect.left - offsetX + rect.width / 2;
      const cy = rect.top - offsetY + rect.height / 2;
      const dx = event.clientX - cx;
      const dy = event.clientY - cy;
      const within = Math.abs(dx) < rect.width / 2 + radius && Math.abs(dy) < rect.height / 2 + radius;

      if (within) {
        active = true;
        xTo(dx * strength);
        yTo(dy * strength);
        innerX?.(dx * strength * 0.45);
        innerY?.(dy * strength * 0.45);
      } else if (active) {
        active = false;
        xTo(0);
        yTo(0);
        innerX?.(0);
        innerY?.(0);
      }
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    return () => {
      window.removeEventListener('pointermove', onMove);
      gsap.set(inner ? [el, inner] : el, { x: 0, y: 0 });
    };
  }, [ref, strength, radius, innerRef]);
}
