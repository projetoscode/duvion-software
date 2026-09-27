'use client';

import { useRef, type HTMLAttributes, type ReactNode } from 'react';
import { useTilt } from '@/hooks/useTilt';
import { cn } from '@/lib/utils';

interface Props extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  max?: number;
  scale?: number;
  depth?: number;
  glare?: boolean;
}

/**
 * Perspective card: tilts toward the cursor (rotateX / rotateY / translateZ)
 * and renders a radial glow that follows the pointer. Children can use
 * translateZ to pop out of the surface thanks to preserve-3d.
 */
export default function TiltCard({ children, className, max = 9, scale = 1.02, depth = 24, glare = true, ...rest }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  useTilt(ref, { max, scale, z: depth });

  return (
    <div ref={ref} className={cn('tilt-card relative [transform-style:preserve-3d]', className)} {...rest}>
      {glare && <span aria-hidden="true" className="tilt-glow pointer-events-none absolute inset-0 z-[1] rounded-[inherit]" />}
      {children}
    </div>
  );
}
