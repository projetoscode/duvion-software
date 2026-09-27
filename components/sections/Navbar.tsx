'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { NAV_LINKS, SITE } from '@/lib/site';
import { cn } from '@/lib/utils';
import { useLenis } from '@/components/providers/SmoothScroll';
import { TransitionLink } from '@/components/animations/PageTransition';
import MagneticButton from '@/components/animations/MagneticButton';
import { Wordmark } from '@/components/ui/Logo';
import { MenuIcon, SocialIcon } from '@/components/ui/Icons';

const EASE = [0.76, 0, 0.24, 1] as const;

export default function Navbar() {
  const pathname = usePathname();
  const lenis = useLenis();
  const reduced = useReducedMotion();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const [entered, setEntered] = useState(false);
  const [active, setActive] = useState<string>('inicio');
  const toggleRef = useRef<HTMLButtonElement>(null);
  const firstLinkRef = useRef<HTMLAnchorElement>(null);

  // Transparent → glass after the first pixels; hides while scrolling down, returns on scroll up.
  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      const delta = y - last;
      last = y;
      setScrolled(y > 24);
      if (Math.abs(delta) > 4) setHidden(delta > 0 && y > 320);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Highlights the section currently in view on the home page.
  useEffect(() => {
    if (pathname !== '/') {
      setActive(pathname.startsWith('/contato') ? 'contato' : '');
      return;
    }
    const sections = NAV_LINKS.map((link) => document.getElementById(link.section)).filter((el): el is HTMLElement => Boolean(el));
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: '-45% 0px -50% 0px' },
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [pathname]);

  // Mobile menu: lock scroll, close on Escape, move focus in and back out.
  useEffect(() => {
    if (!open) return;
    lenis.current?.stop();
    document.documentElement.style.overflow = 'hidden';
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    const focusTimer = setTimeout(() => firstLinkRef.current?.focus(), 350);
    const toggle = toggleRef.current;
    return () => {
      clearTimeout(focusTimer);
      lenis.current?.start();
      document.documentElement.style.overflow = '';
      window.removeEventListener('keydown', onKey);
      toggle?.focus();
    };
  }, [open, lenis]);

  useEffect(() => setOpen(false), [pathname]);

  return (
    <>
      <motion.header
        initial={reduced ? false : { y: -100, opacity: 0 }}
        animate={{ y: hidden && !open ? -110 : 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: EASE, delay: entered || reduced ? 0 : 1.4 }}
        onAnimationComplete={() => setEntered(true)}
        className={cn(
          'fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-500',
          scrolled && !open ? 'border-b border-white/[0.07] bg-ink-950/55 backdrop-blur-xl' : 'border-b border-transparent',
        )}
      >
        <div className="container-x flex h-[72px] items-center justify-between md:h-20">
          <TransitionLink href="/#inicio" aria-label="Duvion Software — página inicial" className="rounded-md">
            <Wordmark />
          </TransitionLink>

          <nav aria-label="Navegação principal" className="hidden md:block">
            <ul className="flex items-center gap-1 lg:gap-2">
              {NAV_LINKS.map((link) => {
                const isActive = active === link.section;
                return (
                  <li key={link.href}>
                    <TransitionLink
                      href={link.href}
                      aria-current={isActive ? 'page' : undefined}
                      className={cn('nav-link', isActive && 'is-active')}
                    >
                      {link.label}
                    </TransitionLink>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="hidden md:block">
            <MagneticButton href="/contato" variant="outline" className="!px-5 !py-2.5 text-[13px]">
              Fale conosco
            </MagneticButton>
          </div>

          <button
            ref={toggleRef}
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? 'Fechar menu' : 'Abrir menu'}
            className="flex items-center gap-2.5 rounded-full border border-violet-400/40 bg-ink-900/60 py-2 pl-4 pr-3 text-[13px] text-white/90 backdrop-blur-md md:hidden"
          >
            {open ? 'Fechar' : 'Menu'}
            <MenuIcon open={open} className="h-5 w-5" />
          </button>
        </div>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Menu de navegação"
            className="fixed inset-0 z-40 flex flex-col bg-ink-950/95 px-6 pb-10 pt-28 backdrop-blur-2xl md:hidden"
            initial={{ clipPath: 'circle(0% at 88% 5%)' }}
            animate={{ clipPath: 'circle(150% at 88% 5%)' }}
            exit={{ clipPath: 'circle(0% at 88% 5%)' }}
            transition={{ duration: reduced ? 0.01 : 0.75, ease: EASE }}
          >
            <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_50%_at_80%_10%,rgba(59,108,255,0.25),transparent_70%),radial-gradient(60%_40%_at_10%_90%,rgba(139,92,246,0.2),transparent_70%)]" />
            <nav aria-label="Navegação móvel" className="relative flex-1">
              <ul className="space-y-2">
                {NAV_LINKS.map((link, index) => (
                  <motion.li
                    key={link.href}
                    initial={{ opacity: 0, y: 40, filter: 'blur(8px)' }}
                    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{ duration: 0.7, delay: reduced ? 0 : 0.2 + index * 0.06, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <TransitionLink
                      ref={index === 0 ? firstLinkRef : undefined}
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className="group flex items-baseline gap-4 py-2 font-display text-4xl font-semibold tracking-tight text-white/90"
                    >
                      <span className="text-xs font-medium text-cyan-300/70">0{index + 1}</span>
                      <span className="transition-colors group-hover:text-gradient">{link.label}</span>
                    </TransitionLink>
                  </motion.li>
                ))}
              </ul>
            </nav>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ delay: reduced ? 0 : 0.55 }}
              className="relative space-y-6"
            >
              <MagneticButton href="/contato" onClick={() => setOpen(false)} fullWidth>
                Fale conosco
              </MagneticButton>
              <div className="flex items-center justify-between text-sm text-white/50">
                <a href={SITE.whatsapp.href} target="_blank" rel="noopener noreferrer" className="hover:text-white">
                  {SITE.whatsapp.display}
                </a>
                <div className="flex gap-3">
                  {SITE.social.map((social) => (
                    <a key={social.label} href={social.href} target="_blank" rel="noopener noreferrer" aria-label={social.label} className="hover:text-white">
                      <SocialIcon name={social.icon} className="h-5 w-5" />
                    </a>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
