import { useId } from 'react';
import { cn, svgId } from '@/lib/utils';

/** Flat version of the Duvion "D" mark — same geometry as the 3D logo. */
export function DMark({ className }: { className?: string }) {
  const id = svgId(useId());
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true">
      <defs>
        <linearGradient id={`${id}-g`} x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#29dcff" />
          <stop offset="0.45" stopColor="#2f6bff" />
          <stop offset="0.8" stopColor="#7c3aed" />
          <stop offset="1" stopColor="#d946ef" />
        </linearGradient>
      </defs>
      <path d="M8.1 11H56.1A39 39 0 0 1 56.1 89H32.1L45.6 68.6H56.1A18.6 18.6 0 0 0 56.1 31.4H26.1Z" fill={`url(#${id}-g)`} />
      <path d="M2.1 37.6H19.2L40.2 52 27 68.6H14.1L24.6 52Z" fill={`url(#${id}-g)`} opacity="0.92" />
    </svg>
  );
}

/** DUVION / SOFTWARE wordmark. */
export function Wordmark({ compact = false, className }: { compact?: boolean; className?: string }) {
  return (
    <span className={cn('inline-flex flex-col items-start leading-none', className)}>
      <span className="bg-gradient-to-r from-cyan-200 via-white to-violet-300 bg-clip-text font-brand text-[19px] tracking-[0.08em] text-transparent">
        DUVION
      </span>
      {!compact && <span className="mt-1.5 pl-[3px] text-[7.5px] font-medium tracking-[0.72em] text-white/60">SOFTWARE</span>}
    </span>
  );
}
