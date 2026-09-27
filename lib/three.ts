import * as THREE from 'three';

/* ------------------------------------------------------------------ */
/* Device tiers                                                         */
/* ------------------------------------------------------------------ */

export type Tier = 'high' | 'mid' | 'low';

export interface TierSettings {
  dpr: [number, number];
  particles: number;
  floating: number;
  postprocessing: boolean;
  transmission: boolean;
  antialias: boolean;
  curveSegments: number;
  bevelSegments: number;
  rockDetail: number;
}

export const TIER_SETTINGS: Record<Tier, TierSettings> = {
  high: {
    dpr: [1, 1.75],
    particles: 1400,
    floating: 16,
    postprocessing: true,
    transmission: true,
    antialias: false,
    curveSegments: 48,
    bevelSegments: 5,
    rockDetail: 3,
  },
  mid: {
    dpr: [1, 1.5],
    particles: 800,
    floating: 10,
    postprocessing: false,
    transmission: false,
    antialias: true,
    curveSegments: 32,
    bevelSegments: 3,
    rockDetail: 2,
  },
  low: {
    dpr: [1, 1.25],
    particles: 360,
    floating: 6,
    postprocessing: false,
    transmission: false,
    antialias: true,
    curveSegments: 20,
    bevelSegments: 2,
    rockDetail: 1,
  },
};

export function detectTier(): Tier {
  if (typeof window === 'undefined') return 'mid';
  const width = window.innerWidth;
  const coarse = window.matchMedia('(pointer: coarse)').matches;
  const cores = navigator.hardwareConcurrency ?? 4;
  const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 8;

  if (width < 768 || cores <= 2 || memory <= 2) return 'low';
  if (width < 1200 || coarse || cores <= 4 || memory <= 4) return 'mid';
  return 'high';
}

export function hasWebGL() {
  if (typeof document === 'undefined') return false;
  try {
    const canvas = document.createElement('canvas');
    return Boolean(canvas.getContext('webgl2') || canvas.getContext('webgl'));
  } catch {
    return false;
  }
}

/* ------------------------------------------------------------------ */
/* Palette                                                              */
/* ------------------------------------------------------------------ */

export const PALETTE = {
  ink: '#03040b',
  cyan: '#29dcff',
  blue: '#2f6bff',
  violet: '#7c3aed',
  magenta: '#d946ef',
} as const;

const GRADIENT_STOPS: Array<[number, THREE.Color]> = [
  [0, new THREE.Color('#29dcff')],
  [0.38, new THREE.Color('#2f6bff')],
  [0.74, new THREE.Color('#7c3aed')],
  [1, new THREE.Color('#d946ef')],
];

export function sampleGradient(t: number, target = new THREE.Color()) {
  const x = THREE.MathUtils.clamp(t, 0, 1);
  for (let i = 1; i < GRADIENT_STOPS.length; i++) {
    const [stop, color] = GRADIENT_STOPS[i];
    if (x <= stop) {
      const [prevStop, prevColor] = GRADIENT_STOPS[i - 1];
      return target.copy(prevColor).lerp(color, (x - prevStop) / (stop - prevStop));
    }
  }
  return target.copy(GRADIENT_STOPS[GRADIENT_STOPS.length - 1][1]);
}

interface Bounds {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
}

/** Paints a diagonal cyan → magenta gradient into the geometry's vertex colors. */
export function paintGradient(geometry: THREE.BufferGeometry, bounds: Bounds) {
  const position = geometry.attributes.position;
  const colors = new Float32Array(position.count * 3);
  const color = new THREE.Color();
  for (let i = 0; i < position.count; i++) {
    const tx = (position.getX(i) - bounds.minX) / (bounds.maxX - bounds.minX);
    const ty = (position.getY(i) - bounds.minY) / (bounds.maxY - bounds.minY);
    sampleGradient(tx * 0.82 + (1 - ty) * 0.18, color);
    colors[i * 3] = color.r;
    colors[i * 3 + 1] = color.g;
    colors[i * 3 + 2] = color.b;
  }
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
}

/* ------------------------------------------------------------------ */
/* Duvion "D" mark — procedural geometry                                */
/* ------------------------------------------------------------------ */

/** The open "D" bowl. Its left side is cut in a chevron that frames the inner arrow. */
function dBodyShape() {
  const shape = new THREE.Shape();
  shape.moveTo(-1.35, 1.3);
  shape.lineTo(0.25, 1.3);
  shape.absarc(0.25, 0, 1.3, Math.PI / 2, -Math.PI / 2, true);
  shape.lineTo(-0.55, -1.3);
  shape.lineTo(-0.1, -0.62);
  shape.lineTo(0.25, -0.62);
  shape.absarc(0.25, 0, 0.62, -Math.PI / 2, Math.PI / 2, false);
  shape.lineTo(-0.75, 0.62);
  shape.closePath();
  return shape;
}

/** The forward-pointing chevron nested inside the bowl. */
function chevronShape() {
  const shape = new THREE.Shape();
  shape.moveTo(-1.55, 0.42);
  shape.lineTo(-0.98, 0.42);
  shape.lineTo(-0.28, -0.06);
  shape.lineTo(-0.72, -0.62);
  shape.lineTo(-1.15, -0.62);
  shape.lineTo(-0.8, -0.06);
  shape.closePath();
  return shape;
}

export function createLogoGeometries(curveSegments: number, bevelSegments: number) {
  const bevel = { bevelEnabled: true, bevelThickness: 0.07, bevelSize: 0.045, bevelSegments, curveSegments };
  const body = new THREE.ExtrudeGeometry(dBodyShape(), { depth: 0.56, ...bevel });
  const chevron = new THREE.ExtrudeGeometry(chevronShape(), { depth: 0.42, ...bevel });

  body.translate(0.02, 0, -0.28);
  chevron.translate(0.02, 0, -0.08);

  const bounds = { minX: -1.62, maxX: 1.6, minY: -1.36, maxY: 1.36 };
  paintGradient(body, bounds);
  paintGradient(chevron, bounds);

  return { body, chevron };
}

/* ------------------------------------------------------------------ */
/* Helpers                                                              */
/* ------------------------------------------------------------------ */

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

/** World-space size of the camera frustum at a given z plane. */
export function visibleSizeAt(camera: THREE.PerspectiveCamera, z: number) {
  const distance = camera.position.z - z;
  const height = 2 * Math.tan(THREE.MathUtils.degToRad(camera.fov) / 2) * distance;
  return { width: height * camera.aspect, height };
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

/**
 * Where the hero logo lives for each breakpoint, in world units at z = 0.
 * Matches the Tailwind breakpoints used by the hero copy (md = 768, lg = 1024).
 */
export function heroLayout(pixelWidth: number, width: number, height: number) {
  if (pixelWidth < 768) return { x: width * 0.1, y: height * 0.28, s: Math.min(width * 0.15, height * 0.068) };
  if (pixelWidth < 1024) return { x: width * 0.25, y: height * 0.2, s: Math.min(width * 0.12, height * 0.09) };
  return { x: width * 0.24, y: -height * 0.01, s: Math.min(height * 0.2, width * 0.105) };
}

export const SIMPLEX_NOISE_GLSL = /* glsl */ `
vec3 permute(vec3 x) { return mod(((x * 34.0) + 1.0) * x, 289.0); }

float snoise(vec2 v) {
  const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
  vec2 i = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod(i, 289.0);
  vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
  vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
  m = m * m;
  m = m * m;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
  vec3 g;
  g.x = a0.x * x0.x + h.x * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}
`;
