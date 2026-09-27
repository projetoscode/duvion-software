'use client';

import { useEffect, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { sceneState, startTracking } from '@/lib/store';

/**
 * Smoothed pointer position for WebGL scenes (must be used inside a <Canvas>).
 * Values are in [-1, 1]; consumers multiply by their own depth factor so
 * near objects travel further than distant ones.
 */
export function useMouseParallax(damping = 3) {
  const value = useRef({ x: 0, y: 0 });

  useEffect(() => {
    startTracking();
  }, []);

  useFrame((_, delta) => {
    const k = 1 - Math.exp(-damping * Math.min(delta, 0.1));
    const scale = sceneState.motionScale < 1 ? 0.3 : 1;
    value.current.x += (sceneState.pointer.x * scale - value.current.x) * k;
    value.current.y += (sceneState.pointer.y * scale - value.current.y) * k;
  });

  return value;
}
