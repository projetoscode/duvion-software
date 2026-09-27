'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  type AnchorHTMLAttributes,
  type MouseEvent,
  type ReactNode,
  type Ref,
} from 'react';
import { gsap, prefersReducedMotion, ScrollTrigger } from '@/lib/animations';
import { useLenis } from '@/components/providers/SmoothScroll';
import { DMark, Wordmark } from '@/components/ui/Logo';

interface TransitionContextValue {
  navigate: (href: string) => void;
}

const TransitionContext = createContext<TransitionContextValue>({ navigate: () => undefined });

export function usePageTransition() {
  return useContext(TransitionContext);
}

const NAV_OFFSET = -72;

/**
 * Curtain transition between routes: the overlay wipes up (clip-path),
 * the route changes underneath it, then it wipes away revealing the new page.
 * The same overlay doubles as the brand intro on first load.
 */
export function PageTransitionProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const lenisRef = useLenis();
  const overlay = useRef<HTMLDivElement>(null);
  const busy = useRef(false);
  const pending = useRef<{ hash: string } | null>(null);
  const fallbackTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const firstRender = useRef(true);

  const scrollToHash = useCallback(
    (hash: string, immediate: boolean) => {
      const lenis = lenisRef.current;
      const target = hash ? document.querySelector<HTMLElement>(hash) : null;
      if (lenis) {
        lenis.scrollTo(target ?? 0, { offset: target ? NAV_OFFSET : 0, immediate, duration: 1.4, force: true });
        return;
      }
      const top = target ? target.getBoundingClientRect().top + window.scrollY + NAV_OFFSET : 0;
      window.scrollTo({ top, behavior: immediate || prefersReducedMotion() ? 'auto' : 'smooth' });
    },
    [lenisRef],
  );

  const reveal = useCallback((delay = 0.1) => {
    const el = overlay.current;
    if (!el) return;
    const done = () => {
      busy.current = false;
      gsap.set(el, { visibility: 'hidden' });
    };
    if (prefersReducedMotion()) {
      gsap.to(el, { autoAlpha: 0, duration: 0.25, delay, onComplete: done });
      return;
    }
    const mark = el.querySelector('[data-transition-mark]');
    gsap
      .timeline({ delay, onComplete: done })
      .to(mark, { opacity: 0, scale: 1.06, filter: 'blur(8px)', duration: 0.45, ease: 'power2.in' })
      .to(el, { clipPath: 'inset(0% 0% 100% 0%)', duration: 0.95, ease: 'expo.inOut' }, '-=0.2');
  }, []);

  // Brand intro on first load.
  useEffect(() => {
    const el = overlay.current;
    if (!el) return;
    const mark = el.querySelector('[data-transition-mark]');
    busy.current = true;
    gsap.set(el, { visibility: 'visible', opacity: 1, clipPath: 'inset(0% 0% 0% 0%)' });
    el.removeAttribute('data-intro');

    if (prefersReducedMotion()) {
      reveal(0);
      return;
    }

    const tl = gsap
      .timeline()
      .fromTo(mark, { opacity: 0, scale: 0.9, filter: 'blur(12px)' }, { opacity: 1, scale: 1, filter: 'blur(0px)', duration: 0.8, ease: 'expo.out' })
      .add(() => reveal(0.1), '+=0.25');

    return () => {
      tl.kill();
    };
  }, [reveal]);

  // After each route change: jump to the right place, refresh triggers, open the curtain.
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    const next = pending.current;
    pending.current = null;
    if (fallbackTimer.current) clearTimeout(fallbackTimer.current);

    requestAnimationFrame(() => {
      scrollToHash(next?.hash ?? '', true);
      ScrollTrigger.refresh();
      if (next) reveal(0.15);
    });
  }, [pathname, reveal, scrollToHash]);

  const navigate = useCallback(
    (href: string) => {
      const url = new URL(href, window.location.href);
      if (url.origin !== window.location.origin) {
        window.location.href = href;
        return;
      }

      const samePage = url.pathname === window.location.pathname && url.search === window.location.search;
      if (samePage) {
        scrollToHash(url.hash, false);
        return;
      }

      if (busy.current) return;
      busy.current = true;
      const destination = url.pathname + url.search + url.hash;
      const go = () => {
        pending.current = { hash: url.hash };
        router.push(destination, { scroll: false });
        // Safety net in case the navigation doesn't change the pathname.
        fallbackTimer.current = setTimeout(() => {
          if (pending.current) {
            pending.current = null;
            reveal(0);
          }
        }, 2500);
      };

      const el = overlay.current;
      if (!el) {
        go();
        return;
      }

      if (prefersReducedMotion()) {
        gsap.set(el, { visibility: 'visible', opacity: 1, clipPath: 'inset(0% 0% 0% 0%)' });
        go();
        return;
      }

      const mark = el.querySelector('[data-transition-mark]');
      lenisRef.current?.stop();
      gsap
        .timeline({
          onComplete: () => {
            lenisRef.current?.start();
            go();
          },
        })
        .set(el, { visibility: 'visible', opacity: 1, clipPath: 'inset(100% 0% 0% 0%)' })
        .set(mark, { opacity: 0, scale: 0.9, filter: 'blur(10px)' })
        .to(el, { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.75, ease: 'expo.inOut' })
        .to(mark, { opacity: 1, scale: 1, filter: 'blur(0px)', duration: 0.5, ease: 'expo.out' }, '-=0.3');
    },
    [lenisRef, reveal, router, scrollToHash],
  );

  return (
    <TransitionContext.Provider value={{ navigate }}>
      {children}
      <div ref={overlay} data-intro="" className="page-transition fixed inset-0 z-[90] flex items-center justify-center" aria-hidden="true">
        <div className="absolute inset-0 bg-ink-950" />
        <div className="absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_50%,rgba(47,107,255,0.22),transparent_70%)]" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400/70 to-transparent" />
        <div data-transition-mark className="relative flex flex-col items-center gap-6">
          <DMark className="h-20 w-20 drop-shadow-[0_0_30px_rgba(59,108,255,0.65)]" />
          <Wordmark />
          <span className="block h-px w-28 overflow-hidden bg-white/10">
            <span className="block h-full w-full animate-loader-line bg-gradient-to-r from-cyan-400 via-blue-500 to-fuchsia-500" />
          </span>
        </div>
      </div>
    </TransitionContext.Provider>
  );
}

type TransitionLinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> & {
  href: string;
  ref?: Ref<HTMLAnchorElement>;
};

/** Drop-in replacement for next/link that plays the page transition / smooth scroll. */
export function TransitionLink({ href, onClick, children, target, ...rest }: TransitionLinkProps) {
  const { navigate } = usePageTransition();

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event);
    if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0 || target === '_blank') {
      return;
    }
    event.preventDefault();
    navigate(href);
  };

  return (
    <Link href={href} onClick={handleClick} target={target} scroll={false} {...rest}>
      {children}
    </Link>
  );
}
