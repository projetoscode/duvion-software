/**
 * Mutable, render-free state shared between the DOM (GSAP / Lenis / pointer)
 * and the WebGL scenes. Three.js components read it inside useFrame, so
 * nothing here triggers React re-renders.
 */
export type SceneMode = 'home' | 'page';

export const sceneState = {
  /** Pointer position normalized to [-1, 1] (y up). */
  pointer: { x: 0, y: 0 },
  scrollY: 0,
  viewportHeight: 1,
  /** 0 → 1 across the whole document. */
  pageProgress: 0,
  /** 0 → 1 while the hero scrolls out of view. */
  heroProgress: 0,
  mode: 'home' as SceneMode,
  /** 1 = full motion, lower values when the user prefers reduced motion. */
  motionScale: 1,
};

let tracking = false;

export function startTracking() {
  if (tracking || typeof window === 'undefined') return;
  tracking = true;

  const onPointer = (event: PointerEvent) => {
    sceneState.pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
    sceneState.pointer.y = -((event.clientY / window.innerHeight) * 2 - 1);
  };

  const onScroll = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    sceneState.scrollY = window.scrollY;
    sceneState.viewportHeight = window.innerHeight;
    sceneState.pageProgress = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
  };

  window.addEventListener('pointermove', onPointer, { passive: true });
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  onScroll();
}
