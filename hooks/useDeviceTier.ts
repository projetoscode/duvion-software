'use client';

import { useEffect, useState } from 'react';
import { detectTier, type Tier } from '@/lib/three';

/** Returns null during SSR / first paint, then the device tier (updated on resize). */
export function useDeviceTier() {
  const [tier, setTier] = useState<Tier | null>(null);

  useEffect(() => {
    setTier(detectTier());
    let timeout: ReturnType<typeof setTimeout>;
    const onResize = () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => setTier(detectTier()), 300);
    };
    window.addEventListener('resize', onResize);
    return () => {
      clearTimeout(timeout);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return tier;
}
