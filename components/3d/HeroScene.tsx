'use client';

import { lazy, Suspense, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { PerformanceMonitor } from '@react-three/drei';
import * as THREE from 'three';
import { PALETTE, type TierSettings } from '@/lib/three';
import { useMouseParallax } from '@/hooks/useMouseParallax';
import SceneEnvironment from './SceneEnvironment';
import Nebula from './Nebula';
import HeroRig from './HeroRig';
import FloatingObjects from './FloatingObjects';
import Particles from './Particles';

const Effects = lazy(() => import('./Effects'));

/** Cinematic lighting: a static key light, a violet rim and a cyan light that follows the cursor. */
function SceneLights() {
  const mouseLight = useRef<THREE.PointLight>(null);
  const mouse = useMouseParallax(3);

  useFrame(() => {
    mouseLight.current?.position.set(mouse.current.x * 6, mouse.current.y * 3.5, 3.5);
  });

  return (
    <>
      <ambientLight intensity={0.25} color="#8aa4ff" />
      <directionalLight position={[-4, 5, 5]} intensity={1.6} color="#cfe8ff" />
      <pointLight ref={mouseLight} intensity={14} distance={12} decay={1.6} color="#38d4ff" />
      <pointLight position={[6, -1, -2]} intensity={25} distance={14} decay={1.5} color="#a855f7" />
      <pointLight position={[-3, -3, 1]} intensity={10} distance={9} decay={1.6} color="#2f6bff" />
    </>
  );
}

interface Props {
  settings: TierSettings;
  onReady?: () => void;
}

/**
 * The fixed WebGL layer behind the whole site: nebula, particle field,
 * floating objects and — on the home page — the hero composition.
 */
export default function HeroScene({ settings, onReady }: Props) {
  const [dpr, setDpr] = useState<number | [number, number]>(settings.dpr);

  return (
    <Canvas
      dpr={dpr}
      camera={{ position: [0, 0, 9], fov: 35, near: 0.1, far: 60 }}
      gl={{ antialias: settings.antialias, powerPreference: 'high-performance', alpha: false, stencil: false }}
      onCreated={() => onReady?.()}
    >
      <color attach="background" args={[PALETTE.ink]} />
      <fog attach="fog" args={[PALETTE.ink, 12, 26]} />
      <PerformanceMonitor flipflops={3} onDecline={() => setDpr(1)} onFallback={() => setDpr(1)} />
      <Suspense fallback={null}>
        <SceneEnvironment />
        <SceneLights />
        <Nebula />
        <HeroRig settings={settings} />
        <FloatingObjects count={settings.floating} />
        <Particles count={settings.particles} />
        {settings.postprocessing && <Effects />}
      </Suspense>
    </Canvas>
  );
}
