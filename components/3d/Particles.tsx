'use client';

import { useEffect, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { sceneState } from '@/lib/store';
import { seededRandom } from '@/lib/three';
import { useMouseParallax } from '@/hooks/useMouseParallax';

const FIELD_HEIGHT = 16;

const vertexShader = /* glsl */ `
uniform float uTime;
uniform float uScroll;
uniform vec2 uMouse;
uniform float uPixelRatio;
uniform float uSize;
uniform float uHeight;

attribute float aSize;
attribute float aSpeed;
attribute float aPhase;
attribute float aDepth;
attribute float aHue;

varying float vAlpha;
varying float vHue;

void main() {
  vec3 p = position;

  // Depth-dependent drift + scroll parallax (near particles move more).
  p.y += uTime * aSpeed + uScroll * (0.25 + aDepth * 0.9);
  p.y = mod(p.y + uHeight * 0.5, uHeight) - uHeight * 0.5;
  p.x += sin(uTime * aSpeed * 4.0 + aPhase * 6.2831) * 0.12;
  p.xy += uMouse * (0.15 + aDepth * 0.85);

  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  gl_Position = projectionMatrix * mv;
  gl_PointSize = uSize * aSize * uPixelRatio / -mv.z;

  float twinkle = 0.55 + 0.45 * sin(uTime * (0.8 + aSpeed * 5.0) + aPhase * 6.2831);
  vAlpha = twinkle * (0.3 + aDepth * 0.7);
  vHue = aHue;
}
`;

const fragmentShader = /* glsl */ `
uniform vec3 uColorA;
uniform vec3 uColorB;
uniform vec3 uColorC;
varying float vAlpha;
varying float vHue;

void main() {
  float d = length(gl_PointCoord - 0.5);
  float alpha = pow(smoothstep(0.5, 0.0, d), 1.6) * vAlpha;
  if (alpha < 0.01) discard;
  vec3 color = vHue < 0.5 ? mix(uColorA, uColorB, vHue * 2.0) : mix(uColorB, uColorC, (vHue - 0.5) * 2.0);
  gl_FragColor = vec4(color, alpha);
  #include <colorspace_fragment>
}
`;

interface Props {
  count: number;
  /** Horizontal spread of the field, in world units. */
  spread?: number;
}

/** GPU particle field: every particle has its own size, speed, depth and hue. */
export default function Particles({ count, spread = 24 }: Props) {
  const mouse = useMouseParallax(2);

  const geometry = useMemo(() => {
    const random = seededRandom(1337);
    const positions = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const speeds = new Float32Array(count);
    const phases = new Float32Array(count);
    const depths = new Float32Array(count);
    const hues = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      const depth = random();
      positions[i * 3] = (random() - 0.5) * spread;
      positions[i * 3 + 1] = (random() - 0.5) * FIELD_HEIGHT;
      positions[i * 3 + 2] = THREE.MathUtils.lerp(-10, 3, depth);
      sizes[i] = 0.4 + Math.pow(random(), 3) * 2.2;
      speeds[i] = 0.02 + random() * 0.08;
      phases[i] = random();
      depths[i] = depth;
      hues[i] = random();
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1));
    geo.setAttribute('aSpeed', new THREE.BufferAttribute(speeds, 1));
    geo.setAttribute('aPhase', new THREE.BufferAttribute(phases, 1));
    geo.setAttribute('aDepth', new THREE.BufferAttribute(depths, 1));
    geo.setAttribute('aHue', new THREE.BufferAttribute(hues, 1));
    geo.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 40);
    return geo;
  }, [count, spread]);

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        uniforms: {
          uTime: { value: 0 },
          uScroll: { value: 0 },
          uMouse: { value: new THREE.Vector2() },
          uPixelRatio: { value: 1 },
          uSize: { value: 30 },
          uHeight: { value: FIELD_HEIGHT },
          uColorA: { value: new THREE.Color('#5fe3ff') },
          uColorB: { value: new THREE.Color('#5b7dff') },
          uColorC: { value: new THREE.Color('#c77dff') },
        },
      }),
    [],
  );

  useEffect(() => () => geometry.dispose(), [geometry]);
  useEffect(() => () => material.dispose(), [material]);

  useFrame((state) => {
    const u = material.uniforms;
    u.uTime.value = state.clock.elapsedTime * sceneState.motionScale;
    u.uScroll.value = (sceneState.scrollY / Math.max(1, state.size.height)) * state.viewport.height;
    u.uMouse.value.set(mouse.current.x * 0.6, mouse.current.y * 0.4);
    u.uPixelRatio.value = state.viewport.dpr;
  });

  return <points geometry={geometry} material={material} frustumCulled={false} />;
}
