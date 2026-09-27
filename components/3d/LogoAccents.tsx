'use client';

import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { sceneState } from '@/lib/store';
import { getGlowTexture, seededRandom } from '@/lib/three';

/** Two thin orbital rings with small satellites circling the logo. */
export function OrbitRings() {
  const inner = useRef<THREE.Group>(null);
  const outer = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    const speed = delta * sceneState.motionScale;
    if (inner.current) inner.current.rotation.z += speed * 0.25;
    if (outer.current) outer.current.rotation.z -= speed * 0.15;
  });

  return (
    <>
      <group rotation={[1.28, 0.12, -0.3]}>
        <group ref={inner}>
          <mesh>
            <torusGeometry args={[2.3, 0.009, 8, 220]} />
            <meshBasicMaterial color="#5fb8ff" transparent opacity={0.75} toneMapped={false} />
          </mesh>
          <mesh position={[2.3, 0, 0]}>
            <sphereGeometry args={[0.055, 16, 16]} />
            <meshBasicMaterial color="#c2f5ff" transparent toneMapped={false} />
          </mesh>
        </group>
      </group>
      <group rotation={[1.05, -0.45, 0.5]}>
        <group ref={outer}>
          <mesh>
            <torusGeometry args={[2.75, 0.006, 8, 220]} />
            <meshBasicMaterial color="#9b6bff" transparent opacity={0.45} toneMapped={false} />
          </mesh>
          <mesh position={[0, 2.75, 0]}>
            <sphereGeometry args={[0.04, 16, 16]} />
            <meshBasicMaterial color="#ecc8ff" transparent toneMapped={false} />
          </mesh>
        </group>
      </group>
    </>
  );
}

/** Small glass shards orbiting close to the mark. */
export function Fragments({ count = 7 }: { count?: number }) {
  const group = useRef<THREE.Group>(null);
  const shards = useMemo(() => {
    const random = seededRandom(42);
    return Array.from({ length: count }, (_, i) => {
      const angle = (i / count) * Math.PI * 2 + random() * 0.5;
      const radius = 1.9 + random() * 0.9;
      return {
        position: [Math.cos(angle) * radius, (random() - 0.5) * 2.2, Math.sin(angle) * radius * 0.6] as [number, number, number],
        rotation: [random() * Math.PI, random() * Math.PI, 0] as [number, number, number],
        scale: 0.06 + random() * 0.09,
        spin: 0.4 + random() * 1.2,
      };
    });
  }, [count]);

  const material = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: '#6fb6ff',
        metalness: 0.2,
        roughness: 0.05,
        clearcoat: 1,
        emissive: new THREE.Color('#2a4dff'),
        emissiveIntensity: 0.5,
        flatShading: true,
        transparent: true,
      }),
    [],
  );
  useEffect(() => () => material.dispose(), [material]);

  useFrame((state, delta) => {
    const g = group.current;
    if (!g) return;
    const speed = delta * sceneState.motionScale;
    g.rotation.y += speed * 0.12;
    g.children.forEach((child, i) => {
      child.rotation.x += speed * shards[i].spin;
      child.rotation.y += speed * shards[i].spin * 0.7;
      child.position.y = shards[i].position[1] + Math.sin(state.clock.elapsedTime * shards[i].spin + i) * 0.08;
    });
  });

  return (
    <group ref={group}>
      {shards.map((shard, i) => (
        <mesh key={i} position={shard.position} rotation={shard.rotation} scale={[shard.scale, shard.scale * 2.2, shard.scale]} material={material}>
          <octahedronGeometry args={[1, 0]} />
        </mesh>
      ))}
    </group>
  );
}

/** Low-poly dark rock pedestal, lit only by colored rim lights. */
export function Rock({ detail }: { detail: number }) {
  const geometry = useMemo(() => {
    const geo = new THREE.IcosahedronGeometry(1, detail);
    const position = geo.attributes.position;
    const v = new THREE.Vector3();
    for (let i = 0; i < position.count; i++) {
      v.fromBufferAttribute(position, i);
      // Displacement depends only on position, so duplicated vertices stay welded.
      const n =
        Math.sin(v.x * 4.1 + v.z * 2.3) * 0.12 + Math.sin(v.y * 5.7 - v.x * 3.3) * 0.08 + Math.sin(v.z * 7.9 + v.y * 2.1) * 0.05;
      v.multiplyScalar(1 + n);
      if (v.y > 0.25) v.y = 0.25 + (v.y - 0.25) * 0.35;
      position.setXYZ(i, v.x, v.y, v.z);
    }
    geo.computeVertexNormals();
    return geo;
  }, [detail]);

  const material = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#0b0d1d',
        roughness: 0.82,
        metalness: 0.35,
        flatShading: true,
        envMapIntensity: 0.6,
        transparent: true,
      }),
    [],
  );

  useEffect(() => () => geometry.dispose(), [geometry]);
  useEffect(() => () => material.dispose(), [material]);

  return (
    <group position={[0.1, -2.05, -0.2]}>
      <mesh geometry={geometry} material={material} scale={[2.7, 0.9, 1.6]} />
      <mesh geometry={geometry} material={material} scale={[1.1, 0.55, 0.9]} position={[-2.25, -0.3, 0.4]} rotation={[0, 1, 0]} />
      <mesh geometry={geometry} material={material} scale={[0.9, 0.5, 0.8]} position={[2.45, -0.35, 0.2]} rotation={[0, 2, 0.2]} />
    </group>
  );
}

/** Additive halo sprites: a wide aura behind the mark and a pool of light on the rock. */
export function Glows() {
  const texture = useMemo(() => getGlowTexture(), []);
  return (
    <>
      <sprite position={[0, 0.1, -1.4]} scale={[7.5, 7.5, 1]}>
        <spriteMaterial map={texture} color="#2447ff" transparent opacity={0.5} depthWrite={false} blending={THREE.AdditiveBlending} toneMapped={false} />
      </sprite>
      <sprite position={[0.9, -0.2, -1]} scale={[4.5, 4.5, 1]}>
        <spriteMaterial map={texture} color="#9b3bff" transparent opacity={0.35} depthWrite={false} blending={THREE.AdditiveBlending} toneMapped={false} />
      </sprite>
      <sprite position={[0, -1.75, 0.3]} scale={[5.5, 1.3, 1]}>
        <spriteMaterial map={texture} color="#7c3aed" transparent opacity={0.55} depthWrite={false} blending={THREE.AdditiveBlending} toneMapped={false} />
      </sprite>
    </>
  );
}
