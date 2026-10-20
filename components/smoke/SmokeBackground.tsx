'use client';

import { useEffect } from 'react';
import dynamic from 'next/dynamic';
import { usePathname } from 'next/navigation';
import { SMOKE_BASELINE, smokeIntensity } from '@/lib/store';

// WebGL only runs in the browser; SmokeCanvas shows a static gradient until it loads.
const SmokeCanvas = dynamic(() => import('./SmokeCanvas'), { ssr: false });

/**
 * One fixed smoke layer behind every page. A single canvas is cheaper than one per
 * section; sections only change how strong it is (see smokeIntensity in lib/store).
 */
export default function SmokeBackground() {
  const pathname = usePathname();

  // Inner pages get a calm, constant smoke; the home page drives it from its ScrollTriggers.
  useEffect(() => {
    if (pathname !== '/') smokeIntensity.current = SMOKE_BASELINE + 0.15;
  }, [pathname]);

  return <SmokeCanvas className="fixed inset-0 z-0" intensityRef={smokeIntensity} focus={[0.5, 0.48]} />;
}
