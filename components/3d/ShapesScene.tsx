'use client';

import { Suspense, useEffect, useMemo, useRef, type MutableRefObject } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Preload } from '@react-three/drei';
import * as THREE from 'three';
import { sceneState } from '@/lib/store';
import { CANVAS_RESIZE, PALETTE, seededRandom, tuneRenderer } from '@/lib/three';
import type { Tier } from '@/lib/device';
import { useMouseParallax } from '@/hooks/useMouseParallax';

const SATELLITES = 5;

/**
 * Wireframe icosahedron around a faceted core, an orbit ring, satellites and a particle
 * shell. Scroll progress through the section drives the rotation, so the shapes turn as
 * the visitor reads; the pointer adds a little parallax on top.
 */
function Shapes({ progressRef, particles }: { progressRef: MutableRefObject<number>; particles: number }) {
  const group = useRef<THREE.Group>(null);
  const core = useRef<THREE.Mesh>(null);
  const orbit = useRef<THREE.Group>(null);
  const mouse = useMouseParallax(2);

  const pointsGeometry = useMemo(() => {
    const random = seededRandom(11);
    const positions = new Float32Array(particles * 3);
    for (let i = 0; i < particles; i++) {
      // Points on a thick spherical shell.
      const radius = 2.4 + random() * 1.6;
      const theta = random() * Math.PI * 2;
      const phi = Math.acos(2 * random() - 1);
      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return geometry;
  }, [particles]);

  const satellites = useMemo(() => {
    const random = seededRandom(5);
    return Array.from({ length: SATELLITES }, (_, i) => {
      const angle = (i / SATELLITES) * Math.PI * 2;
      return {
        position: [Math.cos(angle) * 2.15, (random() - 0.5) * 1.4, Math.sin(angle) * 2.15] as [number, number, number],
        scale: 0.12 + random() * 0.14,
      };
    });
  }, []);

  useEffect(() => () => pointsGeometry.dispose(), [pointsGeometry]);

  useFrame((state, delta) => {
    const g = group.current;
    if (!g) return;
    const motion = sceneState.motionScale;
    const t = state.clock.elapsedTime * motion;
    const p = progressRef.current;

    g.rotation.y = t * 0.12 + p * Math.PI * 1.6 + mouse.current.x * 0.35;
    g.rotation.x = -0.25 + p * 0.9 - mouse.current.y * 0.25;
    if (core.current) {
      core.current.rotation.x -= delta * 0.25 * motion;
      core.current.rotation.z += delta * 0.18 * motion;
    }
    if (orbit.current) orbit.current.rotation.y = -t * 0.35 - p * Math.PI * 2;
  });

  return (
    <group ref={group}>
      <mesh>
        <icosahedronGeometry args={[1.25, 0]} />
        <meshBasicMaterial color={PALETTE.sky} wireframe transparent opacity={0.55} toneMapped={false} />
      </mesh>
      <mesh ref={core}>
        <icosahedronGeometry args={[0.78, 1]} />
        <meshStandardMaterial color={PALETTE.blue} emissive={PALETTE.navy} emissiveIntensity={1.4} metalness={0.45} roughness={0.25} flatShading />
      </mesh>
      <mesh rotation={[Math.PI / 2.4, 0, 0]}>
        <torusGeometry args={[2.0, 0.012, 8, 160]} />
        <meshBasicMaterial color={PALETTE.ice} transparent opacity={0.6} toneMapped={false} />
      </mesh>
      <group ref={orbit}>
        {satellites.map((s, i) => (
          <mesh key={i} position={s.position} scale={s.scale}>
            <octahedronGeometry args={[1, 0]} />
            <meshStandardMaterial color={PALETTE.sky} emissive={PALETTE.blue} emissiveIntensity={0.8} metalness={0.3} roughness={0.2} flatShading />
          </mesh>
        ))}
      </group>
      <points geometry={pointsGeometry}>
        <pointsMaterial color="#6cc8ff" size={0.035} sizeAttenuation transparent opacity={0.85} depthWrite={false} blending={THREE.AdditiveBlending} />
      </points>
    </group>
  );
}

interface Props {
  active: boolean;
  tier: Tier;
  progressRef: MutableRefObject<number>;
}

export default function ShapesScene({ active, tier, progressRef }: Props) {
  return (
    <Canvas
      frameloop={active ? 'always' : 'never'}
      dpr={[1, tier === 'low' ? 1 : 1.5]}
      camera={{ position: [0, 0, 7.2], fov: 38 }}
      gl={{ alpha: true, antialias: tier !== 'low', powerPreference: 'high-performance' }}
      resize={CANVAS_RESIZE}
      onCreated={({ gl }) => tuneRenderer(gl)}
    >
      <Suspense fallback={null}>
        <ambientLight intensity={0.35} />
        <directionalLight position={[3, 4, 5]} intensity={1.4} color="#cfe8ff" />
        <pointLight position={[3, 3, 4]} color={PALETTE.sky} intensity={22} decay={1.5} />
        <pointLight position={[-3, -2, 2]} color={PALETTE.blue} intensity={20} decay={1.5} />
        <Shapes progressRef={progressRef} particles={tier === 'low' ? 140 : 320} />
        <Preload all />
      </Suspense>
    </Canvas>
  );
}
