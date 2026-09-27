'use client';

import { Fragment, useRef, type ComponentType, type HTMLAttributes, type Ref } from 'react';
import { gsap, prefersReducedMotion, useGSAP } from '@/lib/animations';
import { cn } from '@/lib/utils';

export interface KineticWord {
  text: string;
  gradient?: boolean;
}

interface Props {
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'div' | 'span';
  id?: string;
  lines: KineticWord[][];
  className?: string;
  /** "mount" plays immediately (hero); "scroll" waits for the element to enter the viewport. */
  trigger?: 'mount' | 'scroll';
  delay?: number;
  stagger?: number;
}

/** Word-by-word typographic entrance: opacity + translateY + rotateX + scale + blur. */
export default function KineticText({ as: Tag = 'h2', id, lines, className, trigger = 'scroll', delay = 0, stagger = 0.08 }: Props) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const root = ref.current;
      if (!root) return;
      const words = root.querySelectorAll<HTMLElement>('[data-kinetic-word]');
      if (prefersReducedMotion()) {
        gsap.set(words, { opacity: 1 });
        return;
      }
      gsap.fromTo(
        words,
        { opacity: 0, yPercent: 70, rotateX: -55, scale: 0.9, filter: 'blur(14px)', transformPerspective: 800, transformOrigin: '50% 100%' },
        {
          opacity: 1,
          yPercent: 0,
          rotateX: 0,
          scale: 1,
          filter: 'blur(0px)',
          duration: 1.3,
          ease: 'expo.out',
          stagger,
          delay,
          clearProps: 'filter',
          scrollTrigger: trigger === 'scroll' ? { trigger: root, start: 'top 85%', once: true } : undefined,
        },
      );
    },
    { scope: ref },
  );

  const Comp = Tag as unknown as ComponentType<HTMLAttributes<HTMLElement> & { ref?: Ref<HTMLElement> }>;

  return (
    <Comp ref={ref} id={id} className={className}>
      {lines.map((line, lineIndex) => (
        <span key={lineIndex} className="block">
          {line.map((word, wordIndex) => (
            <Fragment key={wordIndex}>
              <span data-kinetic-word className={cn('inline-block will-change-transform', word.gradient && 'text-gradient pb-[0.1em]')}>
                {word.text}
              </span>
              {wordIndex < line.length - 1 ? ' ' : null}
            </Fragment>
          ))}{' '}
        </span>
      ))}
    </Comp>
  );
}
