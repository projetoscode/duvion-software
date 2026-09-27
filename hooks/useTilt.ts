'use client';

import { useEffect, type RefObject } from 'react';
import { canHover, gsap, prefersReducedMotion } from '@/lib/animations';

interface Options {
  max?: number;
  scale?: number;
  z?: number;
}

/**
 * 3D tilt driven by the cursor position over the element.
 * Also exposes --mx / --my CSS variables so a glow can follow the cursor.
 */
export function useTilt<T extends HTMLElement>(ref: RefObject<T | null>, { max = 10, scale = 1.02, z = 24 }: Options = {}) {
  useEffect(() => {
    const el = ref.current;
    if (!el || !canHover() || prefersReducedMotion()) return;

    gsap.set(el, { transformPerspective: 1200, transformStyle: 'preserve-3d' });
    const config = { duration: 0.7, ease: 'power3.out' };
    const rotateX = gsap.quickTo(el, 'rotationX', config);
    const rotateY = gsap.quickTo(el, 'rotationY', config);
    const scaleTo = gsap.quickTo(el, 'scale', config);
    const zTo = gsap.quickTo(el, 'z', config);

    const onMove = (event: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      const px = (event.clientX - rect.left) / rect.width;
      const py = (event.clientY - rect.top) / rect.height;
      rotateY((px - 0.5) * max * 2);
      rotateX(-(py - 0.5) * max * 2);
      el.style.setProperty('--mx', `${(px * 100).toFixed(2)}%`);
      el.style.setProperty('--my', `${(py * 100).toFixed(2)}%`);
    };

    const onEnter = () => {
      el.dataset.tiltActive = 'true';
      scaleTo(scale);
      zTo(z);
    };

    const onLeave = () => {
      delete el.dataset.tiltActive;
      rotateX(0);
      rotateY(0);
      scaleTo(1);
      zTo(0);
    };

    el.addEventListener('pointerenter', onEnter);
    el.addEventListener('pointermove', onMove);
    el.addEventListener('pointerleave', onLeave);
    return () => {
      el.removeEventListener('pointerenter', onEnter);
      el.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerleave', onLeave);
      gsap.set(el, { rotationX: 0, rotationY: 0, scale: 1, z: 0 });
    };
  }, [ref, max, scale, z]);
}
