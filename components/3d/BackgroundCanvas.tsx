'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { usePathname } from 'next/navigation';
import { sceneState, startTracking } from '@/lib/store';
import { hasWebGL, TIER_SETTINGS } from '@/lib/three';
import { useDeviceTier } from '@/hooks/useDeviceTier';
import { useReducedMotion } from '@/hooks/useMediaQuery';
import { cn } from '@/lib/utils';

// Three.js is only downloaded on the client, after the page is interactive.
const HeroScene = dynamic(() => import('./HeroScene'), { ssr: false });

export default function BackgroundCanvas() {
  const pathname = usePathname();
  const tier = useDeviceTier();
  const reduced = useReducedMotion();
  const [webgl, setWebgl] = useState<boolean | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    startTracking();
    setWebgl(hasWebGL());
  }, []);

  useEffect(() => {
    sceneState.mode = pathname === '/' ? 'home' : 'page';
  }, [pathname]);

  useEffect(() => {
    sceneState.motionScale = reduced ? 0.15 : 1;
  }, [reduced]);

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0">
      <div className="bg-fallback absolute inset-0" />
      {webgl && tier && (
        <div className={cn('absolute inset-0 transition-opacity duration-[1600ms] ease-out', ready ? 'opacity-100' : 'opacity-0')}>
          <HeroScene key={tier} settings={TIER_SETTINGS[tier]} onReady={() => setReady(true)} />
        </div>
      )}
      {webgl === false && pathname === '/' && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src="/logo.png"
          alt=""
          className="absolute right-[2%] top-[14%] w-[80vw] opacity-90 mix-blend-screen md:top-1/2 md:w-[46vw] md:-translate-y-1/2"
        />
      )}
    </div>
  );
}
