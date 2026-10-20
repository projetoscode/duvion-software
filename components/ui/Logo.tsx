import { useId } from 'react';
import { cn, svgId } from '@/lib/utils';

/** Flat version of the Duvion "D" mark. */
export function DMark({ className }: { className?: string }) {
  const id = svgId(useId());
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true">
      <defs>
        <linearGradient id={`${id}-g`} x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#7fd6ff" />
          <stop offset="0.45" stopColor="#00b4ff" />
          <stop offset="0.8" stopColor="#1e6bff" />
          <stop offset="1" stopColor="#1a4fd8" />
        </linearGradient>
      </defs>
      <path d="M8.1 11H56.1A39 39 0 0 1 56.1 89H32.1L45.6 68.6H56.1A18.6 18.6 0 0 0 56.1 31.4H26.1Z" fill={`url(#${id}-g)`} />
      <path d="M2.1 37.6H19.2L40.2 52 27 68.6H14.1L24.6 52Z" fill={`url(#${id}-g)`} opacity="0.92" />
    </svg>
  );
}

/** DUVION / SOFTWARES wordmark. */
export function Wordmark({ compact = false, className }: { compact?: boolean; className?: string }) {
  return (
    <span className={cn('inline-flex flex-col items-start leading-none', className)}>
      <span className="bg-gradient-to-r from-white via-white to-brand-ice bg-clip-text font-brand text-[20px] font-bold tracking-[0.04em] text-transparent">
        DUVION
      </span>
      {!compact && <span className="mt-1.5 pl-[3px] text-[7.5px] font-medium tracking-[0.62em] text-brand-ice/70">SOFTWARES</span>}
    </span>
  );
}
