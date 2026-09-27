'use client';

import { Suspense, useEffect, useMemo, type MutableRefObject } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sparkles, Stars } from '@react-three/drei';
import * as THREE from 'three';
import { sceneState } from '@/lib/store';
import { SIMPLEX_NOISE_GLSL, type Tier } from '@/lib/three';
import { useMouseParallax } from '@/hooks/useMouseParallax';

const terrainVertex = /* glsl */ `
uniform float uTime;
varying vec3 vWorld;
varying float vHeight;
varying float vDistance;

${SIMPLEX_NOISE_GLSL}

float ridged(vec2 p) {
  float value = 0.0;
  float amplitude = 0.55;
  for (int i = 0; i < 5; i++) {
    float n = 1.0 - abs(snoise(p));
    value += n * n * amplitude;
    p *= 2.03;
    amplitude *= 0.5;
  }
  return value;
}

void main() {
  vec3 p = position;
  // Local +y points away from the camera; moving the noise makes us glide over the range.
  vec2 q = vec2(p.x * 0.16, (p.y + uTime * 0.6) * 0.16);
  float sides = smoothstep(1.5, 9.0, abs(p.x));
  float h = ridged(q) * (0.35 + sides * 1.6) - 0.3;
  p.z += h;
  vHeight = h;

  vec4 world = modelMatrix * vec4(p, 1.0);
  vWorld = world.xyz;
  vec4 mv = viewMatrix * world;
  vDistance = -mv.z;
  gl_Position = projectionMatrix * mv;
}
`;

const terrainFragment = /* glsl */ `
uniform vec3 uLow;
uniform vec3 uHigh;
uniform vec3 uRim;
uniform vec3 uFog;
varying vec3 vWorld;
varying float vHeight;
varying float vDistance;

void main() {
  vec3 normal = normalize(cross(dFdx(vWorld), dFdy(vWorld)));
  vec3 light = normalize(vec3(-0.3, 0.55, -1.0));
  float diffuse = max(dot(normal, light), 0.0);
  float rim = pow(1.0 - max(dot(normal, normalize(cameraPosition - vWorld)), 0.0), 3.0);

  vec3 color = mix(uLow, uHigh, smoothstep(-0.1, 1.8, vHeight));
  color += uRim * diffuse * 0.9;
  color += uRim * rim * 0.25 * smoothstep(0.2, 1.4, vHeight);
  color = mix(color, uFog, smoothstep(5.0, 17.0, vDistance));

  float alpha = 1.0 - smoothstep(15.0, 20.0, vDistance);
  gl_FragColor = vec4(color, alpha);
  #include <colorspace_fragment>
}
`;

function Terrain({ segments }: { segments: number }) {
  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: terrainVertex,
        fragmentShader: terrainFragment,
        transparent: true,
        uniforms: {
          uTime: { value: 0 },
          uLow: { value: new THREE.Color('#05061a') },
          uHigh: { value: new THREE.Color('#2a1766') },
          uRim: { value: new THREE.Color('#7c5cff') },
          uFog: { value: new THREE.Color('#231452') },
        },
      }),
    [],
  );
  useEffect(() => () => material.dispose(), [material]);

  useFrame((state) => {
    material.uniforms.uTime.value = state.clock.elapsedTime * sceneState.motionScale;
  });

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.6, -8]} material={material}>
      <planeGeometry args={[40, 26, segments, Math.round(segments * 0.65)]} />
    </mesh>
  );
}

function CameraRig({ progressRef }: { progressRef: MutableRefObject<number> }) {
  const mouse = useMouseParallax(1.8);
  const target = useMemo(() => new THREE.Vector3(0, 0.6, -8), []);

  useFrame((state) => {
    const camera = state.camera;
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, mouse.current.x * 0.8, 0.06);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, 1.6 + mouse.current.y * 0.3 + (progressRef.current - 0.5) * 0.8, 0.06);
    camera.lookAt(target);
  });

  return null;
}

interface Props {
  active: boolean;
  tier: Tier;
  progressRef: MutableRefObject<number>;
}

/** Procedural mountain range under a starfield — the CTA's 3D backdrop. */
export default function CTAScene({ active, tier, progressRef }: Props) {
  const segments = tier === 'high' ? 180 : tier === 'mid' ? 120 : 70;

  return (
    <Canvas
      frameloop={active ? 'always' : 'never'}
      dpr={[1, tier === 'high' ? 1.5 : 1.2]}
      camera={{ position: [0, 1.6, 6], fov: 50 }}
      gl={{ alpha: true, antialias: tier !== 'low', powerPreference: 'high-performance' }}
    >
      <Suspense fallback={null}>
        <Terrain segments={segments} />
        <Stars radius={30} depth={20} count={tier === 'low' ? 400 : 1200} factor={2.5} saturation={0.6} fade speed={0.6} />
        <Sparkles count={tier === 'low' ? 20 : 60} scale={[14, 3, 6]} position={[0, 1.2, -4]} size={3} speed={0.35} color="#a78bfa" opacity={0.8} />
        <CameraRig progressRef={progressRef} />
      </Suspense>
    </Canvas>
  );
}
