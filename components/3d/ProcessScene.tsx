'use client';

import { Suspense, type MutableRefObject } from 'react';
import { Canvas } from '@react-three/fiber';
import { Sparkles } from '@react-three/drei';
import type { Tier } from '@/lib/three';
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
      dpr={[1, tier === 'high' ? 1.6 : 1.25]}
      camera={{ position: [0, 0, 7.5], fov: 35 }}
      gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
    >
      <Suspense fallback={null}>
        <SceneEnvironment />
        <ambientLight intensity={0.3} />
        <pointLight position={[3, 3, 4]} color="#38d4ff" intensity={20} decay={1.5} />
        <pointLight position={[-3, -2, 2]} color="#a855f7" intensity={20} decay={1.5} />
        <CubeCluster progressRef={progressRef} />
        <Sparkles count={tier === 'low' ? 18 : 45} scale={[5, 4, 3]} size={2.2} speed={0.3} color="#7dd3fc" opacity={0.7} />
      </Suspense>
    </Canvas>
  );
}
