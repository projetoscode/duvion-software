/**
 * Mutable, render-free state shared between DOM listeners and the WebGL scenes.
 * Three.js components read it inside useFrame, so nothing here triggers React re-renders.
 */
export const sceneState = {
  /** Pointer position normalized to [-1, 1] (y up). */
  pointer: { x: 0, y: 0 },
  /** 1 = full motion, lower when the user prefers reduced motion. */
  motionScale: 1,
};

let tracking = false;

export function startTracking() {
  if (tracking || typeof window === 'undefined') return;
  tracking = true;

  window.addEventListener(
    'pointermove',
    (event: PointerEvent) => {
      sceneState.pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
      sceneState.pointer.y = -((event.clientY / window.innerHeight) * 2 - 1);
    },
    { passive: true },
  );

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const applyMotion = () => {
    sceneState.motionScale = reduced.matches ? 0.15 : 1;
  };
  applyMotion();
  reduced.addEventListener('change', applyMotion);
}

/**
 * Target strength of the page-wide smoke (1 = full, lower = calmer behind content).
 * Sections write it from their ScrollTriggers; the smoke canvas eases toward it.
 * Shaped like a React ref so it can be passed straight to <SmokeCanvas intensityRef>.
 */
export const SMOKE_BASELINE = 0.45;
export const smokeIntensity = { current: 1 };
