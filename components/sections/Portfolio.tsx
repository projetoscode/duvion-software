'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { gsap } from '@/lib/animations';
import { PROJECTS, whatsappLink } from '@/lib/site';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import KineticText from '@/components/animations/KineticText';
import TiltCard from '@/components/animations/TiltCard';
import Reveal from '@/components/animations/Reveal';
import MagneticButton from '@/components/animations/MagneticButton';
import { TransitionLink } from '@/components/animations/PageTransition';
import SectionTag from '@/components/ui/SectionTag';
import { ArrowIcon, ExternalIcon, SocialIcon } from '@/components/ui/Icons';

/**
 * Portfolio with a pinned horizontal scroll (tablet/desktop): the section locks to the
 * viewport and vertical scrolling slides the cards sideways. On phones it becomes a
 * native swipe carousel — pinning fights the mobile address bar and feels heavy there.
 */
export default function Portfolio() {
  const section = useRef<HTMLElement>(null);
  const pin = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLSpanElement>(null);

  useScrollAnimation(section, ({ root, reduced }) => {
    const cards = gsap.utils.toArray<HTMLElement>('[data-slide]', root);
    if (reduced) {
      gsap.set(cards, { opacity: 1 });
      return;
    }

    const mm = gsap.matchMedia();

    mm.add('(min-width: 768px)', () => {
      const trackEl = track.current;
      const pinEl = pin.current;
      if (!trackEl || !pinEl) return;
      gsap.set(cards, { opacity: 1 });
      const distance = () => Math.max(0, trackEl.scrollWidth - window.innerWidth);

      const slide = gsap.to(trackEl, {
        x: () => -distance(),
        ease: 'none',
        scrollTrigger: {
          trigger: pinEl,
          start: 'top top',
          end: () => `+=${distance()}`,
          pin: true,
          scrub: 0.7,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            if (bar.current) bar.current.style.transform = `scaleX(${self.progress})`;
          },
        },
      });

      // Each screenshot eases from a slight zoom to rest as its card crosses the screen.
      cards.forEach((card) => {
        const image = card.querySelector('[data-card-img]');
        if (!image) return;
        gsap.fromTo(
          image,
          { scale: 1.18, xPercent: 6 },
          {
            scale: 1,
            xPercent: -6,
            ease: 'none',
            scrollTrigger: { trigger: card, containerAnimation: slide, start: 'left right', end: 'right left', scrub: true },
          },
        );
      });
    });

    mm.add('(max-width: 767px)', () => {
      gsap.fromTo(
        cards,
        { opacity: 0, x: 80 },
        { opacity: 1, x: 0, duration: 1.1, ease: 'expo.out', stagger: 0.1, scrollTrigger: { trigger: track.current, start: 'top 85%', once: true } },
      );
    });
  });

  return (
    <section id="projetos" ref={section} aria-labelledby="projects-title" className="relative">
      <div ref={pin} className="relative flex flex-col justify-center overflow-hidden py-24 md:h-[100svh] md:py-0 md:pt-16">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(50%_45%_at_15%_20%,rgba(30,107,255,0.14),transparent_70%)]" />

        {/* Compact header: the pinned section has to fit header + cards in one viewport. */}
        <div className="container-x relative flex flex-col gap-5 md:flex-row md:items-end md:justify-between md:gap-10">
          <div>
            <Reveal>
              <SectionTag>Portfólio</SectionTag>
            </Reveal>
            <KineticText
              id="projects-title"
              className="mt-5 font-display text-4xl font-semibold tracking-[-0.03em] md:text-5xl xl:text-6xl"
              lines={[[{ text: 'Alguns' }, { text: 'dos' }, { text: 'nossos' }], [{ text: 'trabalhos', gradient: true }]]}
            />
          </div>
          <div className="max-w-sm md:pb-2">
            <Reveal delay={0.1}>
              <p className="text-white/65">
                Cada projeto é único. Criamos soluções sob medida para diferentes segmentos, sempre com foco em inovação e resultados.
              </p>
            </Reveal>
            <Reveal delay={0.15} className="mt-5 hidden md:block">
              <p className="mb-3 flex items-center justify-between text-[11px] uppercase tracking-[0.25em] text-white/45">
                Role para navegar <ArrowIcon className="h-3.5 w-3.5" />
              </p>
              <span className="block h-px w-full overflow-hidden bg-white/10">
                <span ref={bar} className="block h-full w-full origin-left scale-x-0 bg-gradient-to-r from-brand-sky to-brand-blue shadow-[0_0_10px_#00b4ff]" />
              </span>
            </Reveal>
          </div>
        </div>

        <div
          ref={track}
          role="region"
          aria-label="Projetos em destaque"
          tabIndex={0}
          className="no-scrollbar relative mt-10 flex snap-x snap-mandatory gap-5 overflow-x-auto px-5 pb-4 pt-2 focus-visible:outline-offset-[-2px] md:mt-9 md:w-max md:snap-none md:gap-7 md:overflow-visible md:pl-[max(2rem,calc((100vw-1320px)/2+3rem))] md:pr-[12vw]"
        >
          {PROJECTS.map((project, i) => (
            <article key={project.slug} data-slide aria-label={`${i + 1} de ${PROJECTS.length}: ${project.name}`} className="portfolio-card snap-center">
              <TiltCard max={6} className="group h-full rounded-[28px]" data-cursor="Ver">
                <span aria-hidden="true" className="glass gradient-border absolute inset-0 rounded-[inherit]" />
                <div className="relative z-[2] flex h-full flex-col p-3 [transform-style:preserve-3d]">
                  <div className="portfolio-media relative overflow-hidden rounded-[20px] [transform:translateZ(30px)]">
                    <div data-card-img className="absolute inset-0">
                      <Image
                        src={project.image}
                        alt={`Página inicial do site ${project.name}`}
                        fill
                        draggable={false}
                        sizes="(min-width: 1280px) 600px, (min-width: 768px) 46vw, 84vw"
                        className="object-cover object-top transition-transform duration-[1200ms] ease-expo group-hover:scale-110"
                      />
                    </div>
                    <span aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-ink-950/90 via-ink-950/10 to-transparent" />
                    <span
                      aria-hidden="true"
                      className="absolute inset-0 bg-gradient-to-br from-brand-sky/0 to-brand-blue/0 transition-colors duration-700 group-hover:from-brand-sky/15 group-hover:to-brand-blue/25"
                    />
                    <span className="absolute left-4 top-4 rounded-full border border-white/15 bg-ink-950/70 px-2.5 py-1 font-display text-[11px] tracking-[0.2em] text-white/75">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col px-3 pb-3 pt-5 [transform:translateZ(22px)]">
                    <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-brand-sky">{project.category}</p>
                    <h3 className="mt-2 font-display text-xl font-semibold text-white md:text-2xl">{project.name}</h3>
                    <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-white/60">{project.description}</p>
                    <div className="mt-auto flex flex-wrap items-center gap-x-6 gap-y-3 pt-5">
                      <TransitionLink href={`/projetos/${project.slug}`} className="link-arrow">
                        Ver projeto
                        <ArrowIcon className="h-4 w-4" />
                        <span className="sr-only">: {project.name}</span>
                      </TransitionLink>
                      <a
                        href={project.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-sm font-medium text-white/55 transition-colors hover:text-white"
                      >
                        Site ao vivo
                        <ExternalIcon className="h-3.5 w-3.5" />
                        <span className="sr-only">: {project.name} (abre em nova aba)</span>
                      </a>
                    </div>
                  </div>
                </div>
              </TiltCard>
            </article>
          ))}

          {/* Closing card: invitation to be the next project. */}
          <article data-slide aria-label="Seu projeto" className="portfolio-card snap-center">
            <div className="relative flex h-full min-h-[320px] flex-col items-start justify-end overflow-hidden rounded-[28px] border border-brand-sky/25 bg-[radial-gradient(80%_70%_at_70%_20%,rgba(30,107,255,0.35),transparent_70%),linear-gradient(160deg,#0a1a3a,#05070d)] p-8 md:p-10">
              <span aria-hidden="true" className="absolute right-8 top-8 font-display text-8xl font-bold leading-none text-white/[0.06]">
                {String(PROJECTS.length + 1).padStart(2, '0')}
              </span>
              <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-brand-sky">Próximo projeto</p>
              <h3 className="mt-3 max-w-xs font-display text-3xl font-semibold leading-tight text-white">O próximo pode ser o seu.</h3>
              <p className="mt-3 max-w-xs text-sm text-white/60">Conte sua ideia e receba uma proposta sob medida.</p>
              <div className="mt-8">
                <MagneticButton href={whatsappLink('Olá, Eduardo! Vi o portfólio da Duvion e quero fazer um projeto.')} external icon={false}>
                  <SocialIcon name="whatsapp" className="h-[18px] w-[18px]" />
                  Começar meu projeto
                </MagneticButton>
              </div>
            </div>
          </article>
        </div>

        <p className="container-x mt-2 text-xs uppercase tracking-[0.25em] text-white/40 md:hidden" aria-hidden="true">
          Deslize para ver mais →
        </p>
      </div>
    </section>
  );
}
