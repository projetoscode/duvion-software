'use client';

import { Suspense, type MutableRefObject } from 'react';
import { Canvas } from '@react-three/fiber';
import { Preload, Sparkles } from '@react-three/drei';
import { CANVAS_RESIZE, tuneRenderer } from '@/lib/three';
import type { Tier } from '@/lib/device';
import SceneEnvironment from './SceneEnvironment';
import CubeCluster from './CubeCluster';

interface Props {
  active: boolean;
  tier: Tier;
  progressRef: MutableRefObject<number>;
}

export default function ProcessScene({ active, tier, progressRef }: Props) {
  return (
    <Canvas
      frameloop={active ? 'always' : 'never'}
      dpr={[1, tier === 'low' ? 1 : 1.25]}
      camera={{ position: [0, 0, 7.5], fov: 35 }}
      gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
      resize={CANVAS_RESIZE}
      onCreated={({ gl }) => tuneRenderer(gl)}
    >
      <Suspense fallback={null}>
        <SceneEnvironment />
        <ambientLight intensity={0.3} />
        <pointLight position={[3, 3, 4]} color="#00b4ff" intensity={20} decay={1.5} />
        <pointLight position={[-3, -2, 2]} color="#1e6bff" intensity={22} decay={1.5} />
        <CubeCluster progressRef={progressRef} />
        <Preload all />
        <Sparkles count={tier === 'low' ? 18 : 45} scale={[5, 4, 3]} size={2.2} speed={0.3} color="#5cc8ff" opacity={0.7} />
      </Suspense>
    </Canvas>
  );
}
