'use client';

import { useEffect, useRef, type MutableRefObject } from 'react';
import * as THREE from 'three';
import { smokeFragment, smokeVertex } from '@/lib/shaders/smoke';
import { tuneRenderer } from '@/lib/three';
import { hasWebGL } from '@/lib/device';
import { prefersReducedMotion } from '@/lib/animations';
import { cn } from '@/lib/utils';

interface Props {
  className?: string;
  /** 1 = full smoke, 0 = dissipated. Read every frame, so scroll can drive it without re-renders. */
  intensityRef?: MutableRefObject<number>;
  /** Where the smoke concentrates, in 0..1 canvas space (y up). */
  focus?: [number, number];
}

/**
 * Full-bleed WebGL smoke. Plain Three.js (one quad, one shader) — no scene graph needed.
 *
 * Performance:
 *  - renders at a fraction of the screen resolution (smoke is soft, nobody can tell) with
 *    the device pixel ratio capped at 1.5;
 *  - phones / coarse pointers get fewer noise octaves and an even lower resolution;
 *  - the loop stops when the canvas is off screen or the tab is hidden;
 *  - prefers-reduced-motion renders a single still frame.
 */
export default function SmokeCanvas({ className, intensityRef, focus = [0.5, 0.42] }: Props) {
  const host = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = host.current;
    if (!el || !hasWebGL()) return;

    const compact = window.matchMedia('(max-width: 767px), (pointer: coarse)').matches;
    const reduced = prefersReducedMotion();
    const quality = compact ? { octaves: 3, scale: 0.4, density: 1.55 } : { octaves: 5, scale: 0.55, density: 1 };

    const renderer = new THREE.WebGLRenderer({
      antialias: false,
      alpha: false,
      depth: false,
      stencil: false,
      powerPreference: 'high-performance',
    });
    tuneRenderer(renderer);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5) * quality.scale);
    const canvas = renderer.domElement;
    canvas.style.cssText = 'display:block;width:100%;height:100%';
    el.appendChild(canvas);

    const uniforms = {
      uTime: { value: 0 },
      uResolution: { value: new THREE.Vector2(1, 1) },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uIntensity: { value: 1 },
      uDensity: { value: quality.density },
      uBase: { value: new THREE.Color('#05070d') },
      uDeep: { value: new THREE.Color('#0b2350') },
      uBlue: { value: new THREE.Color('#1e6bff') },
      uGlow: { value: new THREE.Color('#5cc8ff') },
      uFocus: { value: new THREE.Vector2(focus[0], focus[1]) },
    };

    const material = new THREE.ShaderMaterial({
      vertexShader: smokeVertex,
      fragmentShader: smokeFragment,
      uniforms,
      defines: { OCTAVES: quality.octaves },
      depthTest: false,
      depthWrite: false,
    });
    const geometry = new THREE.PlaneGeometry(2, 2);
    const scene = new THREE.Scene();
    scene.add(new THREE.Mesh(geometry, material));
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    const render = () => renderer.render(scene, camera);

    // Size follows the host element.
    const resize = () => {
      const { width, height } = el.getBoundingClientRect();
      renderer.setSize(Math.max(1, width), Math.max(1, height), false);
      uniforms.uResolution.value.set(width, height);
      if (!running) render();
    };
    const resizeObserver = new ResizeObserver(resize);

    // Pointer, smoothed every frame.
    const pointerTarget = new THREE.Vector2(0.5, 0.5);
    const onPointer = (event: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      pointerTarget.set((event.clientX - rect.left) / rect.width, 1 - (event.clientY - rect.top) / rect.height);
    };

    // Render loop that only runs while visible.
    let running = false;
    let frame = 0;
    let last = performance.now();
    let onScreen = true;

    const tick = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      uniforms.uTime.value += dt;
      uniforms.uMouse.value.lerp(pointerTarget, 1 - Math.exp(-dt * 2.5));
      // Ease toward the requested intensity so section changes blend instead of popping.
      const target = intensityRef?.current ?? 1;
      uniforms.uIntensity.value += (target - uniforms.uIntensity.value) * (1 - Math.exp(-dt * 2.5));
      render();
      frame = requestAnimationFrame(tick);
    };
    const start = () => {
      if (running || reduced) return;
      running = true;
      last = performance.now();
      frame = requestAnimationFrame(tick);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(frame);
    };
    const sync = () => (onScreen && !document.hidden ? start() : stop());

    const visibility = new IntersectionObserver(([entry]) => {
      onScreen = entry.isIntersecting;
      sync();
    });

    // Start the smoke a few seconds in, so the first still frame already looks alive.
    uniforms.uTime.value = 12;
    resize();
    resizeObserver.observe(el);
    visibility.observe(el);
    document.addEventListener('visibilitychange', sync);
    if (!compact) window.addEventListener('pointermove', onPointer, { passive: true });
    render();
    sync();

    return () => {
      stop();
      resizeObserver.disconnect();
      visibility.disconnect();
      document.removeEventListener('visibilitychange', sync);
      window.removeEventListener('pointermove', onPointer);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      canvas.remove();
    };
    // focus is a static configuration value per instance.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [intensityRef]);

  return (
    <div ref={host} aria-hidden="true" className={cn('pointer-events-none bg-[radial-gradient(70%_60%_at_50%_45%,#0b2350_0%,#05070d_70%)]', className)} />
  );
}
