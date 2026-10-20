import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

export default function SectionTag({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <p className={cn('tag', className)}>
      <span className="h-1 w-1 rounded-full bg-brand-sky shadow-[0_0_8px_#00b4ff]" aria-hidden="true" />
      {children}
    </p>
  );
}
