'use client';

import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { PerformanceMonitor, Preload } from '@react-three/drei';
import * as THREE from 'three';
import { sceneState } from '@/lib/store';
import { CANVAS_RESIZE, PALETTE, tuneRenderer, type TierSettings } from '@/lib/three';
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

/**
 * Renders only while the hero is on screen. Below it, the last frame stays on the canvas
 * as a static backdrop, so scrolling through the rest of the page costs no GPU time.
 * A route change wakes the scene briefly so the next page's backdrop can settle.
 */
function RenderGate({ pathname }: { pathname: string }) {
  const setFrameloop = useThree((state) => state.setFrameloop);

  useEffect(() => {
    let active = true;
    let sleepTimer: ReturnType<typeof setTimeout> | undefined;
    let wakeUntil = performance.now() + 1800;

    const evaluate = () => {
      const heroVisible = sceneState.mode === 'home' && window.scrollY < window.innerHeight * 1.05;
      const awake = heroVisible || performance.now() < wakeUntil;
      if (awake) {
        clearTimeout(sleepTimer);
        sleepTimer = undefined;
        if (!active) {
          active = true;
          setFrameloop('always');
        }
      } else if (active && !sleepTimer) {
        // Small grace period lets fades (logo leaving, objects scrolling away) finish first.
        sleepTimer = setTimeout(() => {
          sleepTimer = undefined;
          active = false;
          setFrameloop('never');
        }, 700);
      }
    };

    // Resizing clears a sleeping canvas, so redraw for a moment before sleeping again.
    const onResize = () => {
      wakeUntil = performance.now() + 600;
      evaluate();
      setTimeout(evaluate, 650);
    };

    const wakeTimer = setTimeout(evaluate, 1900);
    window.addEventListener('scroll', evaluate, { passive: true });
    window.addEventListener('resize', onResize, { passive: true });
    setFrameloop('always');
    evaluate();
    wakeUntil = performance.now() + 1800;

    return () => {
      clearTimeout(sleepTimer);
      clearTimeout(wakeTimer);
      window.removeEventListener('scroll', evaluate);
      window.removeEventListener('resize', onResize);
    };
  }, [pathname, setFrameloop]);

  return null;
}

interface Props {
  settings: TierSettings;
  pathname: string;
  onReady?: () => void;
}

/**
 * The fixed WebGL layer behind the whole site: nebula, particle field,
 * floating objects and — on the home page — the hero composition.
 */
export default function HeroScene({ settings, pathname, onReady }: Props) {
  const [dpr, setDpr] = useState<number | [number, number]>(settings.dpr);

  return (
    <Canvas
      dpr={dpr}
      camera={{ position: [0, 0, 9], fov: 35, near: 0.1, far: 60 }}
      gl={{ antialias: settings.antialias, powerPreference: 'high-performance', alpha: false, stencil: false }}
      resize={CANVAS_RESIZE}
      onCreated={({ gl }) => {
        tuneRenderer(gl);
        onReady?.();
      }}
    >
      <color attach="background" args={[PALETTE.ink]} />
      <fog attach="fog" args={[PALETTE.ink, 12, 26]} />
      <PerformanceMonitor flipflops={3} onDecline={() => setDpr(1)} onFallback={() => setDpr(1)} />
      <RenderGate pathname={pathname} />
      <Suspense fallback={null}>
        <SceneEnvironment />
        <SceneLights />
        <Nebula />
        <HeroRig settings={settings} />
        <FloatingObjects count={settings.floating} />
        <Particles count={settings.particles} />
        {/* Compiles every material up front, including objects that start outside the frame. */}
        <Preload all />
        {settings.postprocessing && <Effects />}
      </Suspense>
    </Canvas>
  );
}
