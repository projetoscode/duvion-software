'use client';

import type { ReactNode } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ScrollTrigger } from '@/lib/animations';

/**
 * Re-mounts on every navigation: the incoming page settles in from a slight
 * scale + fade while the curtain overlay opens above it.
 */
export default function Template({ children }: { children: ReactNode }) {
  const reduced = useReducedMotion();

  return (
    <motion.div
      initial={reduced ? false : { opacity: 0, scale: 0.985 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
      onAnimationComplete={() => ScrollTrigger.refresh()}
    >
      {children}
    </motion.div>
  );
}
