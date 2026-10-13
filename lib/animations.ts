import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
  ScrollTrigger.config({ ignoreMobileResize: true });
}

export { gsap, ScrollTrigger, useGSAP };

export const EASE = {
  out: 'expo.out',
  inOut: 'expo.inOut',
  soft: 'power3.out',
} as const;

export function prefersReducedMotion() {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function canHover() {
  return typeof window !== 'undefined' && window.matchMedia('(hover: hover) and (pointer: fine)').matches;
}

export type SectionTransition = 'clip' | 'rise' | 'tilt' | 'circle';

/**
 * Scroll-scrubbed entrance used between sections so each one feels like it
 * grows out of the previous one instead of simply stacking below it.
 * Only transforms are animated: the GPU composites them without
 * repainting. clip-path or filter repaint the section, and partial opacity on a
 * section full of layers forces an extra render pass every frame.
 */
export function sectionTransition(el: HTMLElement, variant: SectionTransition) {
  const base = { ease: 'none' as const };

  switch (variant) {
    case 'clip':
      return gsap.fromTo(
        el,
        { scale: 0.95, y: 70, transformOrigin: '50% 0%' },
        {
          ...base,
          scale: 1,
          y: 0,
          scrollTrigger: { trigger: el, start: 'top bottom', end: 'top 20%', scrub: 0.6 },
        },
      );
    case 'rise':
      return gsap.fromTo(
        el,
        { scale: 0.93, y: 90 },
        {
          ...base,
          scale: 1,
          y: 0,
          scrollTrigger: { trigger: el, start: 'top bottom', end: 'top 35%', scrub: 0.6 },
        },
      );
    case 'tilt':
      return gsap.fromTo(
        el,
        { rotateX: 16, y: 120, transformPerspective: 1400, transformOrigin: '50% 0%' },
        {
          ...base,
          rotateX: 0,
          y: 0,
          scrollTrigger: { trigger: el, start: 'top bottom', end: 'top 30%', scrub: 0.6 },
        },
      );
    case 'circle':
      return gsap.fromTo(
        el,
        { scale: 0.82, y: 60 },
        {
          ...base,
          scale: 1,
          y: 0,
          scrollTrigger: { trigger: el, start: 'top bottom', end: 'top 40%', scrub: 0.6 },
        },
      );
  }
}
