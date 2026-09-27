'use client';

import { useEffect, useMemo, useRef, type MutableRefObject } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { sceneState } from '@/lib/store';
import { seededRandom, visibleSizeAt } from '@/lib/three';
import { useMouseParallax } from '@/hooks/useMouseParallax';

type Kind = 'crystal' | 'cube' | 'sphere' | 'shard' | 'icosa' | 'tetra' | 'octa' | 'torus';
type MaterialKind = 'glass' | 'violet' | 'chrome' | 'wire';
type Layer = 'background' | 'midground' | 'foreground';

export interface FloatingItem {
  id: string;
  kind: Kind;
  material: MaterialKind;
  /** x / y as fractions of the visible frustum (-0.5 … 0.5), z in world units. */
  position: [number, number, number];
  rotation: [number, number, number];
  scale: number;
  speed: number;
  depth: Layer;
  parallaxStrength: number;
}

const LAYER_FACTOR: Record<Layer, number> = { background: 0.35, midground: 0.7, foreground: 1.2 };

type Seed = Omit<FloatingItem, 'rotation'>;

// Kept mostly on the right half (around the mark) so the headline stays clean.
const SEEDS: Seed[] = [
  { id: 'crystal-a', kind: 'crystal', material: 'glass', position: [0.1, 0.28, 1.2], scale: 0.55, speed: 0.7, depth: 'foreground', parallaxStrength: 0.6 },
  { id: 'crystal-b', kind: 'crystal', material: 'violet', position: [0.44, -0.2, 1.6], scale: 0.55, speed: 0.55, depth: 'foreground', parallaxStrength: 0.7 },
  { id: 'cube-a', kind: 'cube', material: 'glass', position: [0.38, 0.33, -1.2], scale: 0.42, speed: 0.45, depth: 'midground', parallaxStrength: 0.4 },
  { id: 'sphere-a', kind: 'sphere', material: 'chrome', position: [0.1, -0.36, 0.4], scale: 0.3, speed: 0.8, depth: 'midground', parallaxStrength: 0.45 },
  { id: 'shard-a', kind: 'shard', material: 'violet', position: [0.2, -0.44, 2], scale: 0.42, speed: 0.6, depth: 'foreground', parallaxStrength: 0.8 },
  { id: 'octa-a', kind: 'octa', material: 'glass', position: [0.47, 0.25, -3.5], scale: 0.7, speed: 0.3, depth: 'background', parallaxStrength: 0.2 },
  { id: 'icosa-a', kind: 'icosa', material: 'wire', position: [-0.46, 0.2, -5], scale: 0.7, speed: 0.25, depth: 'background', parallaxStrength: 0.2 },
  { id: 'tetra-a', kind: 'tetra', material: 'glass', position: [0.24, 0.33, 0.8], scale: 0.3, speed: 0.9, depth: 'midground', parallaxStrength: 0.5 },
  { id: 'cube-b', kind: 'cube', material: 'violet', position: [-0.3, -0.44, -3], scale: 0.42, speed: 0.35, depth: 'background', parallaxStrength: 0.25 },
  { id: 'sphere-b', kind: 'sphere', material: 'glass', position: [0.33, 0.3, 2.4], scale: 0.2, speed: 1.1, depth: 'foreground', parallaxStrength: 0.9 },
  { id: 'torus-a', kind: 'torus', material: 'chrome', position: [-0.47, -0.02, -1.5], scale: 0.45, speed: 0.5, depth: 'midground', parallaxStrength: 0.4 },
  { id: 'shard-b', kind: 'shard', material: 'glass', position: [0.42, -0.42, 1.8], scale: 0.35, speed: 0.75, depth: 'foreground', parallaxStrength: 0.75 },
  { id: 'crystal-c', kind: 'crystal', material: 'glass', position: [0.14, 0.08, -4.5], scale: 0.7, speed: 0.3, depth: 'background', parallaxStrength: 0.2 },
  { id: 'sphere-c', kind: 'sphere', material: 'chrome', position: [0.3, 0.05, -6], scale: 0.4, speed: 0.3, depth: 'background', parallaxStrength: 0.15 },
  { id: 'icosa-b', kind: 'icosa', material: 'violet', position: [0.02, -0.46, -5], scale: 0.6, speed: 0.2, depth: 'background', parallaxStrength: 0.15 },
  { id: 'tetra-b', kind: 'tetra', material: 'wire', position: [-0.46, -0.44, 1.5], scale: 0.35, speed: 0.65, depth: 'foreground', parallaxStrength: 0.7 },
];

const random = seededRandom(2026);

export const FLOATING_ITEMS: FloatingItem[] = SEEDS.map((seed) => ({
  ...seed,
  rotation: [random() * Math.PI, random() * Math.PI, random() * Math.PI],
}));

function createGeometries(): Record<Kind, THREE.BufferGeometry> {
  return {
    crystal: new THREE.OctahedronGeometry(0.5, 0).scale(0.6, 1.4, 0.6),
    cube: new THREE.BoxGeometry(0.7, 0.7, 0.7),
    sphere: new THREE.SphereGeometry(0.4, 32, 24),
    shard: new THREE.TetrahedronGeometry(0.5, 0).scale(0.5, 1.3, 0.35),
    icosa: new THREE.IcosahedronGeometry(0.5, 0),
    tetra: new THREE.TetrahedronGeometry(0.5, 0),
    octa: new THREE.OctahedronGeometry(0.5, 0),
    torus: new THREE.TorusGeometry(0.35, 0.08, 12, 48),
  };
}

function createMaterials(): Record<MaterialKind, THREE.Material> {
  return {
    glass: new THREE.MeshPhysicalMaterial({
      color: '#3aa8ff',
      metalness: 0.1,
      roughness: 0.06,
      clearcoat: 1,
      iridescence: 0.5,
      emissive: new THREE.Color('#0d5bff'),
      emissiveIntensity: 0.35,
      envMapIntensity: 2.2,
      flatShading: true,
    }),
    violet: new THREE.MeshPhysicalMaterial({
      color: '#8b5cf6',
      metalness: 0.15,
      roughness: 0.08,
      clearcoat: 1,
      iridescence: 0.6,
      emissive: new THREE.Color('#6d28d9'),
      emissiveIntensity: 0.4,
      envMapIntensity: 2,
      flatShading: true,
    }),
    chrome: new THREE.MeshStandardMaterial({ color: '#c9d6ff', metalness: 1, roughness: 0.15, envMapIntensity: 1.5 }),
    wire: new THREE.MeshBasicMaterial({ color: '#5ec8ff', wireframe: true, transparent: true, opacity: 0.45, toneMapped: false }),
  };
}

interface ObjectProps {
  item: FloatingItem;
  geometry: THREE.BufferGeometry;
  material: THREE.Material;
  mouse: MutableRefObject<{ x: number; y: number }>;
  index: number;
}

function FloatingObject({ item, geometry, material, mouse, index }: ObjectProps) {
  const ref = useRef<THREE.Mesh>(null);
  const camera = useThree((state) => state.camera) as THREE.PerspectiveCamera;
  const layer = LAYER_FACTOR[item.depth];
  const spin = useMemo(() => {
    const r = seededRandom(index + 7);
    return new THREE.Vector3(r() - 0.5, r() - 0.5, r() - 0.5).multiplyScalar(item.speed * 1.4);
  }, [index, item.speed]);
  const phase = index * 1.37;

  useFrame((state, delta) => {
    const mesh = ref.current;
    if (!mesh) return;
    const motion = sceneState.motionScale;
    const t = state.clock.elapsedTime * motion;
    const { width, height } = visibleSizeAt(camera, item.position[2]);

    // Near layers scroll faster than far ones → real depth when the page moves.
    const scrollShift = (sceneState.scrollY / Math.max(1, state.size.height)) * height * (0.55 + layer * 0.45);
    const responsive = THREE.MathUtils.clamp(state.viewport.width / 9, 0.55, 1.1);

    // On phones the copy sits in the lower half, so objects gather around the mark up top.
    const ny = state.size.width < 768 ? 0.08 + (item.position[1] + 0.5) * 0.38 : item.position[1];

    const x = item.position[0] * width + mouse.current.x * item.parallaxStrength * layer;
    const y =
      ny * height +
      Math.sin(t * item.speed + phase) * 0.18 * layer +
      mouse.current.y * item.parallaxStrength * layer * 0.6 +
      scrollShift;

    mesh.position.set(x, y, item.position[2] + Math.cos(t * item.speed * 0.7 + phase) * 0.15);
    mesh.rotation.x += spin.x * delta * motion;
    mesh.rotation.y += spin.y * delta * motion;
    mesh.rotation.z = item.rotation[2] + sceneState.scrollY * 0.0008 * (spin.z > 0 ? 1 : -1);
    mesh.scale.setScalar(item.scale * responsive);
    // Inner pages keep only the distant layer as ambience so it never competes with the copy.
    const allowed = sceneState.mode === 'home' || item.depth === 'background';
    mesh.visible = allowed && y - item.scale < height * 0.5 + 1;
  });

  return <mesh ref={ref} geometry={geometry} material={material} rotation={item.rotation} />;
}

/** Background, midground and foreground objects, each floating at its own pace. */
export default function FloatingObjects({ count }: { count: number }) {
  const mouse = useMouseParallax(2.5);
  const geometries = useMemo(createGeometries, []);
  const materials = useMemo(createMaterials, []);

  useEffect(
    () => () => {
      Object.values(geometries).forEach((g) => g.dispose());
      Object.values(materials).forEach((m) => m.dispose());
    },
    [geometries, materials],
  );

  return (
    <group>
      {FLOATING_ITEMS.slice(0, count).map((item, index) => (
        <FloatingObject
          key={item.id}
          item={item}
          index={index}
          geometry={geometries[item.kind]}
          material={materials[item.material]}
          mouse={mouse}
        />
      ))}
    </group>
  );
}
