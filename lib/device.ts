/**
 * Device capability checks. Kept free of Three.js imports so that UI code can call them
 * without pulling the 3D library into the initial bundle.
 */

/* ------------------------------------------------------------------ */
/* Device tiers                                                         */
/* ------------------------------------------------------------------ */

export type Tier = 'high' | 'mid' | 'low';

/** Reads the GPU name so integrated / software renderers get a lighter scene. */
function gpuClass(): 'software' | 'integrated' | 'dedicated' {
  try {
    const gl = document.createElement('canvas').getContext('webgl');
    const ext = gl?.getExtension('WEBGL_debug_renderer_info');
    const renderer = ext && gl ? String(gl.getParameter(ext.UNMASKED_RENDERER_WEBGL)) : '';
    if (/swiftshader|llvmpipe|software|basic render/i.test(renderer)) return 'software';
    if (/intel|uhd|iris|mali|adreno|powervr|vivante|videocore/i.test(renderer)) return 'integrated';
  } catch {
    // Unknown GPU: fall back to the other heuristics.
  }
  return 'dedicated';
}

export function detectTier(): Tier {
  if (typeof window === 'undefined') return 'mid';
  const width = window.innerWidth;
  const coarse = window.matchMedia('(pointer: coarse)').matches;
  const cores = navigator.hardwareConcurrency ?? 4;
  const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 8;
  const gpu = gpuClass();

  if (width < 768 || cores <= 2 || memory <= 2 || gpu === 'software') return 'low';
  if (width < 1200 || coarse || cores <= 4 || memory <= 4 || gpu === 'integrated') return 'mid';
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
