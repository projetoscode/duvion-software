'use client';

import { useEffect, useState, type RefObject } from 'react';

interface Options {
  rootMargin?: string;
  once?: boolean;
}

/** IntersectionObserver wrapper — used to mount and pause WebGL scenes only when needed. */
export function useInView<T extends Element>(ref: RefObject<T | null>, { rootMargin = '0px', once = false }: Options = {}) {
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting);
        if (entry.isIntersecting && once) observer.disconnect();
      },
      { rootMargin },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref, rootMargin, once]);

  return inView;
}
