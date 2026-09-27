'use client';

import { useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { sceneState } from '@/lib/store';
import { visibleSizeAt } from '@/lib/three';
import { useMouseParallax } from '@/hooks/useMouseParallax';

const Z = -14;

const vertexShader = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const fragmentShader = /* glsl */ `
uniform float uTime;
uniform float uProgress;
uniform float uAspect;
uniform vec2 uMouse;
uniform vec3 uBase;
uniform vec3 uColorA;
uniform vec3 uColorB;
uniform vec3 uColorC;
varying vec2 vUv;

float blob(vec2 uv, vec2 center, float radius) {
  vec2 d = (uv - center) * vec2(uAspect, 1.0);
  return exp(-dot(d, d) / (radius * radius));
}

void main() {
  vec2 uv = vUv;
  vec3 color = uBase;

  vec2 a = vec2(0.06 + 0.04 * sin(uTime * 0.09), 0.62 - uProgress * 0.35) + uMouse * 0.025;
  vec2 b = vec2(0.94 - 0.04 * cos(uTime * 0.11), 0.28 + uProgress * 0.45) - uMouse * 0.02;
  vec2 c = vec2(0.72 + 0.03 * sin(uTime * 0.07), 0.78 - uProgress * 0.55);

  color += uColorA * blob(uv, a, 0.42) * 0.55;
  color += uColorB * blob(uv, b, 0.46) * 0.5;
  color += uColorC * blob(uv, c, 0.3) * 0.35;

  float grain = fract(sin(dot(uv * 1000.0 + uTime, vec2(12.9898, 78.233))) * 43758.5453);
  color += (grain - 0.5) * 0.012;

  gl_FragColor = vec4(color, 1.0);
  #include <colorspace_fragment>
}
`;

/** Full-screen backdrop with slow-moving color nebulas that drift as the page scrolls. */
export default function Nebula() {
  const mesh = useRef<THREE.Mesh>(null);
  const camera = useThree((state) => state.camera) as THREE.PerspectiveCamera;
  const mouse = useMouseParallax(1.5);

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        depthWrite: false,
        uniforms: {
          uTime: { value: 0 },
          uProgress: { value: 0 },
          uAspect: { value: 1 },
          uMouse: { value: new THREE.Vector2() },
          uBase: { value: new THREE.Color('#03040b') },
          uColorA: { value: new THREE.Color('#1733b8') },
          uColorB: { value: new THREE.Color('#4a1a9e') },
          uColorC: { value: new THREE.Color('#0b4f7a') },
        },
      }),
    [],
  );

  useFrame((state) => {
    if (!mesh.current) return;
    const { width, height } = visibleSizeAt(camera, Z);
    mesh.current.scale.set(width * 1.15, height * 1.15, 1);
    material.uniforms.uTime.value = state.clock.elapsedTime * sceneState.motionScale;
    material.uniforms.uProgress.value = THREE.MathUtils.lerp(material.uniforms.uProgress.value, sceneState.pageProgress, 0.05);
    material.uniforms.uAspect.value = width / height;
    material.uniforms.uMouse.value.set(mouse.current.x, mouse.current.y);
  });

  return (
    <mesh ref={mesh} position={[0, 0, Z]} renderOrder={-1} material={material}>
      <planeGeometry args={[1, 1]} />
    </mesh>
  );
}
