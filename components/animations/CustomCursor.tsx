'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from '@/lib/animations';
import { useFinePointer, useReducedMotion } from '@/hooks/useMediaQuery';
import { cn } from '@/lib/utils';

const TRAIL = 5;
const INTERACTIVE = 'a, button, [role="button"], input, textarea, select, label, [data-cursor]';

/**
 * Custom cursor: a precise dot, a trailing ring that expands over interactive
 * elements, a soft glow and a short particle trail. Desktop (fine pointer) only.
 */
export default function CustomCursor() {
  const fine = useFinePointer();
  const reduced = useReducedMotion();
  const enabled = fine && !reduced;

  const root = useRef<HTMLDivElement>(null);
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const glow = useRef<HTMLDivElement>(null);
  const trail = useRef<Array<HTMLDivElement | null>>([]);
  const [label, setLabel] = useState('');
  const [hovering, setHovering] = useState(false);

  useEffect(() => {
    if (!enabled || !root.current || !dot.current || !ring.current || !glow.current) return;
    const html = document.documentElement;
    html.classList.add('has-custom-cursor');

    const follow = (el: HTMLElement, duration: number) => {
      gsap.set(el, { xPercent: -50, yPercent: -50 });
      return {
        x: gsap.quickTo(el, 'x', { duration, ease: 'power3.out' }),
        y: gsap.quickTo(el, 'y', { duration, ease: 'power3.out' }),
      };
    };

    const movers = [
      follow(dot.current, 0.08),
      follow(ring.current, 0.35),
      follow(glow.current, 0.9),
      ...trail.current.filter((el): el is HTMLDivElement => Boolean(el)).map((el, i) => follow(el, 0.12 + i * 0.07)),
    ];

    let visible = false;
    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') return;
      if (!visible) {
        visible = true;
        gsap.to(root.current, { autoAlpha: 1, duration: 0.3 });
      }
      movers.forEach((m) => {
        m.x(event.clientX);
        m.y(event.clientY);
      });
    };

    const onOver = (event: PointerEvent) => {
      const target = (event.target as Element | null)?.closest<HTMLElement>(INTERACTIVE);
      setHovering(Boolean(target));
      setLabel(target?.dataset.cursor ?? '');
    };

    const onDown = () => gsap.to(ring.current, { scale: 0.75, duration: 0.2, ease: 'power2.out' });
    const onUp = () => gsap.to(ring.current, { scale: 1, duration: 0.5, ease: 'elastic.out(1, 0.5)' });
    const onLeave = () => {
      visible = false;
      gsap.to(root.current, { autoAlpha: 0, duration: 0.3 });
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerover', onOver, { passive: true });
    window.addEventListener('pointerdown', onDown);
    window.addEventListener('pointerup', onUp);
    document.documentElement.addEventListener('pointerleave', onLeave);

    return () => {
      html.classList.remove('has-custom-cursor');
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerover', onOver);
      window.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointerup', onUp);
      document.documentElement.removeEventListener('pointerleave', onLeave);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div ref={root} aria-hidden="true" className="pointer-events-none fixed inset-0 z-[100] opacity-0">
      <div ref={glow} className="cursor-glow" />
      {Array.from({ length: TRAIL }, (_, i) => (
        <div
          key={i}
          ref={(el) => {
            trail.current[i] = el;
          }}
          className="cursor-trail"
          style={{ opacity: 0.5 - i * 0.08, width: 6 - i * 0.8, height: 6 - i * 0.8 }}
        />
      ))}
      <div ref={ring} className="cursor-ring-anchor">
        <div className={cn('cursor-ring', hovering && 'is-hovering', label && 'has-label')}>
          {label && <span className="cursor-label">{label}</span>}
        </div>
      </div>
      <div ref={dot} className="cursor-dot" />
    </div>
  );
}
