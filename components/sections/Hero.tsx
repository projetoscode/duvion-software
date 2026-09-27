'use client';

import { useRef } from 'react';
import { gsap, ScrollTrigger } from '@/lib/animations';
import { sceneState } from '@/lib/store';
import { SITE } from '@/lib/site';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { useDepthLayers } from '@/hooks/useDepthLayers';
import KineticText from '@/components/animations/KineticText';
import MagneticButton from '@/components/animations/MagneticButton';

const INTRO_DELAY = 1.2;

export default function Hero() {
  const section = useRef<HTMLElement>(null);
  useDepthLayers(section, 28);

  useScrollAnimation(section, ({ root, reduced }) => {
    // Feeds the WebGL hero: 0 at the top, 1 once the hero has left the screen.
    ScrollTrigger.create({
      trigger: root,
      start: 'top top',
      end: 'bottom top',
      onUpdate: (self) => {
        sceneState.heroProgress = self.progress;
      },
      onRefresh: (self) => {
        sceneState.heroProgress = self.progress;
      },
    });

    const fades = root.querySelectorAll('[data-hero-fade]');
    if (reduced) {
      gsap.set(fades, { opacity: 1 });
      return;
    }

    gsap.fromTo(
      fades,
      { opacity: 0, y: 30, filter: 'blur(10px)' },
      { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1.2, ease: 'expo.out', stagger: 0.12, delay: INTRO_DELAY + 0.55, clearProps: 'filter' },
    );

    // Copy leaves with depth: rises, shrinks slightly and blurs as the 3D mark takes over.
    gsap.to('[data-hero-content]', {
      yPercent: -14,
      scale: 0.95,
      opacity: 0,
      filter: 'blur(10px)',
      ease: 'none',
      scrollTrigger: { trigger: root, start: 'top top', end: 'bottom 25%', scrub: 0.5 },
    });

    gsap.to('[data-hero-hud]', {
      opacity: 0,
      y: -60,
      ease: 'none',
      scrollTrigger: { trigger: root, start: 'top top', end: '40% top', scrub: 0.5 },
    });
  });

  return (
    <section id="inicio" ref={section} aria-labelledby="hero-title" className="relative flex min-h-[100svh] items-center overflow-hidden">
      <div className="container-x relative w-full pb-20 pt-[46svh] md:pb-24 md:pt-32 lg:pt-28">
        <div data-hero-content className="max-w-xl will-change-transform md:max-w-[56%] lg:max-w-[600px]">
          <p data-hero-fade className="tag mb-7">
            Tecnologia <span className="text-fuchsia-300/80">+</span> Design <span className="text-fuchsia-300/80">+</span> Resultados
          </p>

          <KineticText
            as="h1"
            id="hero-title"
            trigger="mount"
            delay={INTRO_DELAY}
            stagger={0.09}
            className="font-display text-[2.7rem] font-semibold leading-[1.02] tracking-[-0.03em] text-white min-[400px]:text-5xl md:text-[3.6rem] lg:text-[4.6rem] xl:text-[5.1rem]"
            lines={[
              [{ text: 'Transformamos' }],
              [{ text: 'ideias' }, { text: 'em' }],
              [{ text: 'experiências', gradient: true }],
              [{ text: 'digitais.', gradient: true }],
            ]}
          />

          <p data-hero-fade className="mt-7 max-w-md text-[15px] leading-relaxed text-white/70 md:text-base">
            {SITE.description}
          </p>

          <div data-hero-fade className="mt-10 flex flex-wrap items-center gap-4">
            <MagneticButton href="/#servicos">Conheça nossos serviços</MagneticButton>
            <MagneticButton href="/contato" variant="ghost">
              Fale conosco
            </MagneticButton>
          </div>

          <div data-hero-fade className="mt-14 flex items-center gap-3 text-xs text-white/55">
            <span className="relative flex h-9 w-6 justify-center rounded-full border border-white/25" aria-hidden="true">
              <span className="mt-2 h-1.5 w-1 rounded-full bg-cyan-300 animate-scroll-dot" />
            </span>
            Role para explorar
          </div>
        </div>
      </div>

      <div data-hero-hud aria-hidden="true" className="pointer-events-none absolute right-8 top-32 hidden xl:block">
        <div data-depth="0.7" className="flex gap-4">
          <span className="h-28 w-px bg-gradient-to-b from-cyan-300/70 via-violet-400/40 to-transparent" />
          <ul className="space-y-2 text-[10px] font-medium tracking-[0.32em] text-white/55">
            <li className="text-cyan-300">+</li>
            <li>IDEIAS</li>
            <li>PROJETOS</li>
            <li>REALIZAÇÕES</li>
          </ul>
        </div>
      </div>

      <div data-hero-hud aria-hidden="true" className="pointer-events-none absolute bottom-10 right-8 hidden lg:block">
        <div data-depth="0.4" className="flex items-center gap-3 text-[10px] tracking-[0.3em] text-white/40">
          <span className="h-px w-16 bg-gradient-to-r from-transparent to-white/40" />
          DUVION / 2026
        </div>
      </div>

      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-ink-950/60" />
    </section>
  );
}
