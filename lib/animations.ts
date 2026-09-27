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
 */
export function sectionTransition(el: HTMLElement, variant: SectionTransition) {
  const base = { ease: 'none' as const };

  switch (variant) {
    case 'clip':
      return gsap.fromTo(
        el,
        { clipPath: 'inset(7% 5% 0% 5% round 48px)' },
        {
          ...base,
          clipPath: 'inset(0% 0% 0% 0% round 0px)',
          scrollTrigger: { trigger: el, start: 'top bottom', end: 'top 20%', scrub: 0.6 },
        },
      );
    case 'rise':
      return gsap.fromTo(
        el,
        { scale: 0.93, y: 90, opacity: 0.35 },
        {
          ...base,
          scale: 1,
          y: 0,
          opacity: 1,
          scrollTrigger: { trigger: el, start: 'top bottom', end: 'top 35%', scrub: 0.6 },
        },
      );
    case 'tilt':
      return gsap.fromTo(
        el,
        { rotateX: 16, y: 120, opacity: 0.3, transformPerspective: 1400, transformOrigin: '50% 0%' },
        {
          ...base,
          rotateX: 0,
          y: 0,
          opacity: 1,
          scrollTrigger: { trigger: el, start: 'top bottom', end: 'top 30%', scrub: 0.6 },
        },
      );
    case 'circle':
      return gsap.fromTo(
        el,
        { clipPath: 'circle(14% at 50% 60%)', filter: 'blur(6px)' },
        {
          ...base,
          clipPath: 'circle(100% at 50% 50%)',
          filter: 'blur(0px)',
          scrollTrigger: { trigger: el, start: 'top bottom', end: 'top 40%', scrub: 0.6 },
        },
      );
  }
}
