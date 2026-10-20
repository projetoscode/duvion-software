import { useId, type ReactNode } from 'react';
import type { ServiceIconName, SocialIconName } from '@/lib/site';
import { svgId } from '@/lib/utils';

const SERVICE_PATHS: Record<ServiceIconName, ReactNode> = {
  globe: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c2.5 2.7 3.8 5.7 3.8 9s-1.3 6.3-3.8 9c-2.5-2.7-3.8-5.7-3.8-9S9.5 5.7 12 3z" />
    </>
  ),
  rocket: (
    <>
      <path d="M14.5 4.5c2-1.3 4.3-1.8 6-1.5.3 1.7-.2 4-1.5 6l-7 7-4.5-4.5z" />
      <path d="M8 11.5 4.5 11 7 8.5h4M12.5 16l.5 3.5 2.5-2.5v-4" />
      <circle cx="15.5" cy="8.5" r="1.5" />
      <path d="M6.5 16.5c-1.5.5-2.5 2-3 4.5 2.5-.5 4-1.5 4.5-3" />
    </>
  ),
  // Automation flow: a trigger node branching into two actions.
  flow: (
    <>
      <rect x="3" y="3.5" width="6" height="6" rx="1.5" />
      <rect x="15" y="3.5" width="6" height="6" rx="1.5" />
      <rect x="15" y="14.5" width="6" height="6" rx="1.5" />
      <path d="M9 6.5h6M12 6.5v11h3" />
      <path d="M5 13.5l1.5 1.5L5 16.5" />
    </>
  ),
};

export function CheckIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M5 12.5l4.5 4.5L19 7.5" />
    </svg>
  );
}

/** Line icon stroked with the brand gradient. */
export function ServiceIcon({ name, className }: { name: ServiceIconName; className?: string }) {
  const id = svgId(useId());
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke={`url(#${id})`}
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={id} x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
          <stop stopColor="#9fd8ff" />
          <stop offset="0.5" stopColor="#00b4ff" />
          <stop offset="1" stopColor="#1e6bff" />
        </linearGradient>
      </defs>
      {SERVICE_PATHS[name]}
    </svg>
  );
}

export function ArrowIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

export function ArrowLeftIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M19 12H5M11 6l-6 6 6 6" />
    </svg>
  );
}

export function ExternalIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" />
    </svg>
  );
}

const SOCIAL_PATHS: Record<SocialIconName, ReactNode> = {
  instagram: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" />
    </>
  ),
  whatsapp: (
    <>
      <path d="M3.5 20.5l1.3-4.2A8.5 8.5 0 1 1 8 19.4z" />
      <path d="M9 8.5c0 3.5 3 6.5 6.5 6.5l1-1.6-2-1-1 .9c-1.3-.5-2.3-1.5-2.8-2.8l.9-1-1-2z" />
    </>
  ),
};

export function SocialIcon({ name, className }: { name: SocialIconName; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      {SOCIAL_PATHS[name]}
    </svg>
  );
}

export function MenuIcon({ open, className }: { open: boolean; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" className={className} aria-hidden="true">
      <path d={open ? 'M6 6l12 12' : 'M4 8h16'} className="transition-all duration-500" />
      <path d={open ? 'M18 6L6 18' : 'M8 16h12'} className="transition-all duration-500" />
    </svg>
  );
}
