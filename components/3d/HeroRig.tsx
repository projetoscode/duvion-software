'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { sceneState } from '@/lib/store';
import { heroLayout, type TierSettings } from '@/lib/three';
import { useMouseParallax } from '@/hooks/useMouseParallax';
import DuvionLogo3D from './DuvionLogo3D';
import { Fragments, Glows, OrbitRings, Rock } from './LogoAccents';

/**
 * Positions the hero composition for each breakpoint and drives it from
 * scroll + pointer: as the hero leaves, the mark grows, spins, slides to
 * the side and fades out.
 */
export default function HeroRig({ settings }: { settings: TierSettings }) {
  const root = useRef<THREE.Group>(null);
  const logo = useRef<THREE.Group>(null);
  const materials = useRef<THREE.Material[] | null>(null);
  const visibility = useRef(0);
  const mouse = useMouseParallax(2.2);

  useFrame((state, delta) => {
    const group = root.current;
    const mark = logo.current;
    if (!group || !mark) return;

    if (!materials.current) {
      const found = new Set<THREE.Material>();
      group.traverse((object) => {
        const material = (object as THREE.Mesh).material;
        if (!material) return;
        (Array.isArray(material) ? material : [material]).forEach((m) => found.add(m));
      });
      found.forEach((m) => {
        m.transparent = true;
        if (m.userData.baseOpacity === undefined) m.userData.baseOpacity = m.opacity;
      });
      materials.current = Array.from(found);
    }

    const dt = Math.min(delta, 0.1);
    const t = state.clock.elapsedTime * sceneState.motionScale;
    const { width, height } = state.viewport;
    const layout = heroLayout(state.size.width, width, height);
    const p = sceneState.heroProgress;

    // Fades in on the home page; leaving it happens under the transition curtain, so hide at once.
    visibility.current = sceneState.mode === 'home' ? THREE.MathUtils.damp(visibility.current, 1, 2.2, dt) : 0;
    const alpha = visibility.current * (1 - THREE.MathUtils.smoothstep(p, 0.3, 1));

    group.visible = alpha > 0.01;
    if (!group.visible) return;

    materials.current.forEach((m) => {
      m.opacity = m.userData.baseOpacity * alpha;
    });

    const scale = layout.s * (1 + p * 0.6) * (0.8 + 0.2 * visibility.current);
    group.scale.setScalar(scale);
    group.position.set(
      layout.x + p * width * 0.14 + mouse.current.x * 0.2,
      layout.y + p * height * 0.3 + mouse.current.y * 0.12,
      p * 1.2,
    );

    mark.position.y = Math.sin(t * 0.9) * 0.1;
    mark.rotation.set(
      0.1 - mouse.current.y * 0.22 + p * 0.35,
      -0.42 + mouse.current.x * 0.38 + Math.sin(t * 0.35) * 0.1 + p * Math.PI * 0.85,
      Math.sin(t * 0.5) * 0.03,
    );
  });

  return (
    <group ref={root}>
      <Glows />
      <group ref={logo}>
        <DuvionLogo3D settings={settings} />
        <pointLight position={[0.3, 0, -1.2]} color="#7c3aed" intensity={8} distance={6} decay={1.5} />
        <OrbitRings />
        <Fragments count={settings.floating > 8 ? 8 : 5} />
      </group>
      <Rock detail={settings.rockDetail} />
    </group>
  );
}
