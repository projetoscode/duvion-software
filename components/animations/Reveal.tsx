'use client';

import { useRef, type ComponentType, type HTMLAttributes, type ReactNode, type Ref } from 'react';
import { gsap, prefersReducedMotion, useGSAP } from '@/lib/animations';

interface Props extends HTMLAttributes<HTMLElement> {
  children: ReactNode;
  as?: 'div' | 'section' | 'dl' | 'ul' | 'li' | 'span' | 'p';
  delay?: number;
  y?: number;
}

/** Fades, lifts and de-blurs its content the first time it enters the viewport. */
export default function Reveal({ children, as: Tag = 'div', delay = 0, y = 40, ...rest }: Props) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      if (prefersReducedMotion()) {
        gsap.set(el, { opacity: 1 });
        return;
      }
      gsap.fromTo(
        el,
        { opacity: 0, y, filter: 'blur(8px)' },
        {
          opacity: 1,
          y: 0,
          filter: 'blur(0px)',
          duration: 1.1,
          delay,
          ease: 'expo.out',
          clearProps: 'filter',
          scrollTrigger: { trigger: el, start: 'top 90%', once: true },
        },
      );
    },
    { scope: ref },
  );

  const Comp = Tag as unknown as ComponentType<HTMLAttributes<HTMLElement> & { ref?: Ref<HTMLElement>; 'data-reveal'?: boolean }>;

  return (
    <Comp ref={ref} data-reveal {...rest}>
      {children}
    </Comp>
  );
}
