import * as THREE from 'three';

/* ------------------------------------------------------------------ */
/* Renderer helpers                                                     */
/* ------------------------------------------------------------------ */

/**
 * Canvas sizing: measure layout size (offsetWidth/Height), not the transformed rect, and
 * skip re-measuring on scroll. Scroll-scrubbed scale/rotate on a parent section otherwise
 * looks like a resize every frame and makes the renderer reallocate its buffers.
 */
export const CANVAS_RESIZE = { scroll: false, offsetSize: true, debounce: { scroll: 0, resize: 150 } };

/**
 * Production renderer tweaks. Checking shader errors forces a synchronous wait on every
 * compile (getProgramInfoLog), which stalls the main thread when a scene first draws.
 */
export function tuneRenderer(gl: THREE.WebGLRenderer) {
  gl.debug.checkShaderErrors = process.env.NODE_ENV !== 'production';
}

/* ------------------------------------------------------------------ */
/* Palette & helpers                                                    */
/* ------------------------------------------------------------------ */

export const PALETTE = {
  ink: '#05070d',
  navy: '#0a1a3a',
  blue: '#1e6bff',
  sky: '#00b4ff',
  ice: '#9fd8ff',
} as const;

/** Deterministic PRNG so procedural layouts are stable between renders. */
export function seededRandom(seed: number) {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

let glowTexture: THREE.CanvasTexture | null = null;

/** Soft radial sprite used for cheap volumetric-looking glows. */
export function getGlowTexture() {
  if (glowTexture) return glowTexture;
  const size = 256;
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
    gradient.addColorStop(0, 'rgba(255,255,255,1)');
    gradient.addColorStop(0.22, 'rgba(255,255,255,0.5)');
    gradient.addColorStop(0.55, 'rgba(255,255,255,0.12)');
    gradient.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, size, size);
  }
  glowTexture = new THREE.CanvasTexture(canvas);
  glowTexture.colorSpace = THREE.SRGBColorSpace;
  return glowTexture;
}
