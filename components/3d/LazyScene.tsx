'use client';

import { useRef, type ReactNode } from 'react';
import type { Tier } from '@/lib/three';
import { useInView } from '@/hooks/useInView';
import { useDeviceTier } from '@/hooks/useDeviceTier';

interface Props {
  className?: string;
  /** Receives whether the scene is on screen (to pause its render loop) and the device tier. */
  render: (active: boolean, tier: Tier) => ReactNode;
}

/**
 * Mounts a WebGL scene only when its container approaches the viewport,
 * and pauses rendering whenever it scrolls out of view.
 */
export default function LazyScene({ className, render }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const near = useInView(ref, { rootMargin: '400px 0px', once: true });
  const visible = useInView(ref, { rootMargin: '80px 0px' });
  const tier = useDeviceTier();

  return (
    <div ref={ref} className={className} aria-hidden="true">
      {near && tier ? render(visible, tier) : null}
    </div>
  );
}
