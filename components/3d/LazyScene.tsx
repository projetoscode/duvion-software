'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import type { Tier } from '@/lib/three';
import { useInView } from '@/hooks/useInView';
import { useDeviceTier } from '@/hooks/useDeviceTier';

interface Props {
  className?: string;
  /** Receives whether the scene is on screen (to pause its render loop) and the device tier. */
  render: (active: boolean, tier: Tier) => ReactNode;
}

/**
 * Mounts a WebGL scene once the browser is idle (or its container approaches the viewport,
 * whichever comes first), and pauses rendering whenever it is out of view.
 */
export default function LazyScene({ className, render }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const near = useInView(ref, { rootMargin: '600px 0px', once: true });
  const visible = useInView(ref, { rootMargin: '80px 0px' });
  const tier = useDeviceTier();
  const [idle, setIdle] = useState(false);

  // Creating a WebGL context and compiling shaders blocks the main thread. Doing it while
  // the browser is idle (paused until visible) keeps that hitch out of the user's scroll.
  useEffect(() => {
    if (!tier || tier === 'low') return;
    const ric = window.requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 2500));
    const cancel = window.cancelIdleCallback ?? window.clearTimeout;
    const id = ric(() => setIdle(true), { timeout: 5000 });
    return () => cancel(id);
  }, [tier]);

  // The first rendered frames are the expensive ones (environment map + shader programs).
  // Render briefly right after mounting, even off screen, so that cost never lands mid-scroll.
  const mounted = (near || idle) && Boolean(tier);
  const [warming, setWarming] = useState(false);
  useEffect(() => {
    if (!mounted) return;
    setWarming(true);
    const timer = window.setTimeout(() => setWarming(false), 1200);
    return () => window.clearTimeout(timer);
  }, [mounted]);

  return (
    <div ref={ref} className={className} aria-hidden="true">
      {mounted && tier ? render(visible || warming, tier) : null}
    </div>
  );
}
