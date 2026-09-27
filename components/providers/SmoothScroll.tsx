'use client';

import { createContext, useContext, useEffect, useRef, type ReactNode, type RefObject } from 'react';
import Lenis from 'lenis';
import { gsap, prefersReducedMotion, ScrollTrigger } from '@/lib/animations';

const LenisContext = createContext<RefObject<Lenis | null>>({ current: null });

export function useLenis() {
  return useContext(LenisContext);
}

/**
 * Lenis drives the native window scroll, so ScrollTrigger keeps reading real
 * scroll positions. Both run on GSAP's single ticker to avoid double RAF loops.
 */
export default function SmoothScroll({ children }: { children: ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.4,
    });
    lenisRef.current = lenis;

    lenis.on('scroll', ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  return <LenisContext.Provider value={lenisRef}>{children}</LenisContext.Provider>;
}
