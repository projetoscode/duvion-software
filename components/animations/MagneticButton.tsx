'use client';

import { useRef, type MouseEvent, type PointerEvent, type ReactNode } from 'react';
import { gsap, prefersReducedMotion } from '@/lib/animations';
import { useMagnetic } from '@/hooks/useMagnetic';
import { cn } from '@/lib/utils';
import { ArrowIcon } from '@/components/ui/Icons';
import { TransitionLink } from './PageTransition';

type Variant = 'primary' | 'outline' | 'ghost';

// Full class names (not template strings) so Tailwind keeps them in the build.
const VARIANT_CLASS: Record<Variant, string> = {
  primary: 'btn-primary',
  outline: 'btn-outline',
  ghost: 'btn-ghost',
};

interface Props {
  children: ReactNode;
  href?: string;
  /** Opens `href` in a new tab. */
  external?: boolean;
  onClick?: (event: MouseEvent<HTMLElement>) => void;
  variant?: Variant;
  icon?: boolean;
  className?: string;
  strength?: number;
  type?: 'button' | 'submit';
  disabled?: boolean;
  fullWidth?: boolean;
  'aria-label'?: string;
}

/** CTA with magnetic pull, layered inner motion and a click ripple. */
export default function MagneticButton({
  children,
  href,
  external = false,
  onClick,
  variant = 'primary',
  icon = true,
  className,
  strength = 0.35,
  type = 'button',
  disabled,
  fullWidth = false,
  ...rest
}: Props) {
  const wrap = useRef<HTMLSpanElement>(null);
  const inner = useRef<HTMLSpanElement>(null);
  useMagnetic(wrap, { strength, innerRef: inner });

  const ripple = (event: PointerEvent<HTMLElement>) => {
    const el = event.currentTarget;
    const rect = el.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height) * 2.4;
    const dot = document.createElement('span');
    dot.className = 'btn-ripple';
    dot.style.width = dot.style.height = `${size}px`;
    dot.style.left = `${event.clientX - rect.left}px`;
    dot.style.top = `${event.clientY - rect.top}px`;
    el.appendChild(dot);
    gsap.set(dot, { xPercent: -50, yPercent: -50 });
    gsap.fromTo(
      dot,
      { scale: 0, opacity: 0.55 },
      { scale: 1, opacity: 0, duration: prefersReducedMotion() ? 0.2 : 0.9, ease: 'expo.out', onComplete: () => dot.remove() },
    );
    if (!prefersReducedMotion()) gsap.fromTo(el, { scale: 0.96 }, { scale: 1, duration: 0.6, ease: 'elastic.out(1, 0.5)' });
  };

  const classes = cn('btn group', VARIANT_CLASS[variant], fullWidth && 'w-full', className);
  const content = (
    <span ref={inner} className="relative z-10 inline-flex items-center gap-2.5">
      {children}
      {icon && <ArrowIcon className="h-4 w-4 transition-transform duration-500 ease-expo group-hover:translate-x-1" />}
    </span>
  );

  return (
    <span ref={wrap} className={cn('will-change-transform', fullWidth ? 'block' : 'inline-block')} data-magnetic>
      {href ? (
        <TransitionLink
          href={href}
          className={classes}
          onPointerDown={ripple}
          onClick={onClick}
          {...(external && { target: '_blank', rel: 'noopener noreferrer' })}
          {...rest}
        >
          {content}
        </TransitionLink>
      ) : (
        <button type={type} className={classes} onPointerDown={ripple} onClick={onClick} disabled={disabled} {...rest}>
          {content}
        </button>
      )}
    </span>
  );
}
