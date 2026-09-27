'use client';

import { useEffect, useMemo, useRef, type MutableRefObject } from 'react';
import { useFrame } from '@react-three/fiber';
import { Edges } from '@react-three/drei';
import * as THREE from 'three';
import { sceneState } from '@/lib/store';
import { getGlowTexture, seededRandom } from '@/lib/three';
import { useMouseParallax } from '@/hooks/useMouseParallax';

const CUBES: Array<[number, number, number]> = (() => {
  const random = seededRandom(7);
  const list: Array<[number, number, number]> = [];
  for (let x = -1; x <= 1; x++)
    for (let y = -1; y <= 1; y++)
      for (let z = -1; z <= 1; z++) {
        const distance = Math.abs(x) + Math.abs(y) + Math.abs(z);
        if (distance <= 1 || random() > 0.4) list.push([x, y, z]);
      }
  return list;
})();

/**
 * Glass cube cluster for the process section. Scroll progress assembles it:
 * cubes are scattered when the section enters, lock together in the middle
 * of the section and drift apart again as it leaves.
 */
export default function CubeCluster({ progressRef }: { progressRef: MutableRefObject<number> }) {
  const group = useRef<THREE.Group>(null);
  const cubes = useRef<Array<THREE.Mesh | null>>([]);
  const mouse = useMouseParallax(2.5);
  const texture = useMemo(() => getGlowTexture(), []);

  const geometry = useMemo(() => new THREE.BoxGeometry(0.6, 0.6, 0.6), []);
  const material = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: '#2f5bff',
        metalness: 0.2,
        roughness: 0.08,
        clearcoat: 1,
        iridescence: 0.6,
        transparent: true,
        opacity: 0.5,
        emissive: new THREE.Color('#2b3cff'),
        emissiveIntensity: 0.4,
        envMapIntensity: 2.2,
        depthWrite: false,
      }),
    [],
  );

  useEffect(
    () => () => {
      geometry.dispose();
      material.dispose();
    },
    [geometry, material],
  );

  useFrame((state, delta) => {
    const g = group.current;
    if (!g) return;
    const motion = sceneState.motionScale;
    const t = state.clock.elapsedTime * motion;
    const p = progressRef.current;
    const spread = 0.12 + Math.abs(p - 0.5) * 1.3;

    g.rotation.y += delta * 0.18 * motion;
    g.rotation.x = THREE.MathUtils.lerp(g.rotation.x, -0.4 + mouse.current.y * 0.35 + (p - 0.5) * 0.7, 0.08);
    g.rotation.z = THREE.MathUtils.lerp(g.rotation.z, mouse.current.x * 0.2, 0.08);

    cubes.current.forEach((cube, i) => {
      if (!cube) return;
      const [x, y, z] = CUBES[i];
      const k = 0.7 * (1 + spread * 0.7);
      cube.position.set(x * k, y * k + Math.sin(t * 1.2 + i) * 0.04 * spread * 3, z * k);
      cube.rotation.set(spread * ((i % 3) - 1) * 0.5, spread * ((i % 2) - 0.5) * 0.8, 0);
    });
  });

  return (
    <group ref={group}>
      {CUBES.map((_, i) => (
        <mesh
          key={i}
          ref={(el) => {
            cubes.current[i] = el;
          }}
          geometry={geometry}
          material={material}
        >
          <Edges threshold={15} color="#8fdcff" />
        </mesh>
      ))}
      <mesh>
        <icosahedronGeometry args={[0.28, 1]} />
        <meshBasicMaterial color="#9fe8ff" toneMapped={false} />
      </mesh>
      <sprite scale={[3.2, 3.2, 1]}>
        <spriteMaterial map={texture} color="#3b6cff" transparent opacity={0.8} depthWrite={false} blending={THREE.AdditiveBlending} toneMapped={false} />
      </sprite>
      <mesh rotation={[1.2, 0.3, 0]}>
        <torusGeometry args={[2.2, 0.008, 8, 160]} />
        <meshBasicMaterial color="#7aa8ff" transparent opacity={0.45} toneMapped={false} />
      </mesh>
    </group>
  );
}
