'use client';

import { useCallback, useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react';
import Image from 'next/image';
import { gsap, sectionTransition } from '@/lib/animations';
import { PROJECTS } from '@/lib/site';
import { cn } from '@/lib/utils';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { useReducedMotion } from '@/hooks/useMediaQuery';
import KineticText from '@/components/animations/KineticText';
import TiltCard from '@/components/animations/TiltCard';
import Reveal from '@/components/animations/Reveal';
import MagneticButton from '@/components/animations/MagneticButton';
import { TransitionLink } from '@/components/animations/PageTransition';
import SectionTag from '@/components/ui/SectionTag';
import { ArrowIcon, ArrowLeftIcon, ExternalIcon } from '@/components/ui/Icons';

export default function Projects() {
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const drag = useRef({ active: false, moved: false, startX: 0, startScroll: 0 });
  const reduced = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [pages, setPages] = useState(PROJECTS.length);

  const step = useCallback(() => {
    const el = track.current;
    const first = el?.querySelector<HTMLElement>('[data-slide]');
    if (!el || !first) return 1;
    const gap = parseFloat(getComputedStyle(el).columnGap || '0') || 0;
    return first.offsetWidth + gap;
  }, []);

  const measure = useCallback(() => {
    const el = track.current;
    if (!el) return;
    const size = step();
    const perView = Math.max(1, Math.round((el.clientWidth + 1) / size));
    setPages(Math.max(1, PROJECTS.length - perView + 1));
    setIndex(Math.round(el.scrollLeft / size));
  }, [step]);

  useEffect(() => {
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [measure]);

  const goTo = (target: number) => {
    const el = track.current;
    if (!el) return;
    const clamped = Math.max(0, Math.min(pages - 1, target));
    el.scrollTo({ left: clamped * step(), behavior: reduced ? 'auto' : 'smooth' });
  };

  // Mouse drag-to-scroll on desktop (touch devices keep native swiping).
  const onPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== 'mouse' || !track.current) return;
    drag.current = { active: true, moved: false, startX: event.clientX, startScroll: track.current.scrollLeft };
  };
  const onPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    const el = track.current;
    if (!drag.current.active || !el) return;
    const dx = event.clientX - drag.current.startX;
    if (Math.abs(dx) > 5 && !drag.current.moved) {
      drag.current.moved = true;
      el.style.scrollSnapType = 'none';
      el.setPointerCapture(event.pointerId);
    }
    if (drag.current.moved) el.scrollLeft = drag.current.startScroll - dx;
  };
  const endDrag = () => {
    const el = track.current;
    if (!drag.current.active || !el) return;
    drag.current.active = false;
    if (drag.current.moved) {
      const size = step();
      el.style.scrollSnapType = '';
      el.scrollTo({ left: Math.round(el.scrollLeft / size) * size, behavior: 'smooth' });
    }
  };

  useScrollAnimation(section, ({ root, reduced: reducedMotion }) => {
    const slides = gsap.utils.toArray<HTMLElement>('[data-slide]', root);
    if (reducedMotion) {
      gsap.set(slides, { opacity: 1 });
      return;
    }
    const panel = root.querySelector<HTMLElement>('[data-panel]');
    if (panel) sectionTransition(panel, 'rise');
    gsap.fromTo(
      slides,
      { opacity: 0, x: 120, rotateY: -18, transformPerspective: 1400 },
      {
        opacity: 1,
        x: 0,
        rotateY: 0,
        duration: 1.3,
        ease: 'expo.out',
        stagger: 0.12,
        scrollTrigger: { trigger: track.current, start: 'top 85%', once: true },
      },
    );
  });

  return (
    <section id="projetos" ref={section} aria-labelledby="projects-title" className="relative">
      <div data-panel className="relative py-24 md:py-32">
        <div className="container-x">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-xl">
              <Reveal>
                <SectionTag>Projetos</SectionTag>
              </Reveal>
              <KineticText
                id="projects-title"
                className="mt-6 font-display text-4xl font-semibold tracking-[-0.02em] md:text-5xl lg:text-6xl"
                lines={[[{ text: 'Alguns' }, { text: 'dos' }, { text: 'nossos' }], [{ text: 'trabalhos', gradient: true }]]}
              />
              <Reveal delay={0.1}>
                <p className="mt-5 max-w-md text-white/65">
                  Cada projeto é único. Criamos soluções sob medida para diferentes segmentos, sempre com foco em inovação e resultados.
                </p>
              </Reveal>
            </div>

            <Reveal delay={0.2} className="flex items-center gap-4">
              <MagneticButton href="/contato" variant="outline">
                Iniciar um projeto
              </MagneticButton>
              <div className="hidden items-center gap-2 sm:flex">
                <button type="button" className="carousel-btn" onClick={() => goTo(index - 1)} disabled={index <= 0} aria-label="Projeto anterior" aria-controls="projects-track">
                  <ArrowLeftIcon className="h-5 w-5" />
                </button>
                <button type="button" className="carousel-btn" onClick={() => goTo(index + 1)} disabled={index >= pages - 1} aria-label="Próximo projeto" aria-controls="projects-track">
                  <ArrowIcon className="h-5 w-5" />
                </button>
              </div>
            </Reveal>
          </div>

          <div
            id="projects-track"
            ref={track}
            role="region"
            aria-roledescription="carrossel"
            aria-label="Projetos em destaque"
            tabIndex={0}
            onScroll={measure}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={endDrag}
            onPointerCancel={endDrag}
            onClickCapture={(event) => {
              if (drag.current.moved) {
                event.preventDefault();
                event.stopPropagation();
                drag.current.moved = false;
              }
            }}
            className="project-track no-scrollbar -mx-5 mt-12 flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-px-5 px-5 py-8 focus-visible:outline-offset-[-2px] md:-mx-8 md:scroll-px-8 md:px-8 lg:-mx-12 lg:scroll-px-12 lg:px-12"
          >
            {PROJECTS.map((project, i) => (
              <article
                key={project.slug}
                data-slide
                role="group"
                aria-roledescription="slide"
                aria-label={`${i + 1} de ${PROJECTS.length}: ${project.name}`}
                className="project-slide shrink-0 snap-start"
              >
                <TiltCard max={7} className="group h-full rounded-[28px]" data-cursor="Ver">
                  <span aria-hidden="true" className="glass gradient-border absolute inset-0 rounded-[inherit]" />
                  <div className="relative z-[2] flex h-full flex-col p-3 [transform-style:preserve-3d]">
                    <div className="relative aspect-[16/10] overflow-hidden rounded-[20px] [transform:translateZ(30px)]">
                      <Image
                        src={project.image}
                        alt={`Página inicial do site ${project.name}`}
                        fill
                        draggable={false}
                        sizes="(min-width: 1024px) 40vw, (min-width: 640px) 60vw, 90vw"
                        priority={i < 2}
                        className="object-cover object-top transition-transform duration-[1200ms] ease-expo group-hover:scale-110"
                      />
                      <span aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-ink-950/85 via-transparent to-transparent opacity-70 transition-opacity duration-700 group-hover:opacity-95" />
                      <span
                        aria-hidden="true"
                        className="absolute inset-0 bg-gradient-to-br from-cyan-400/0 via-transparent to-fuchsia-500/0 mix-blend-screen transition-all duration-700 group-hover:from-cyan-400/25 group-hover:to-fuchsia-500/30"
                      />
                      <span className="absolute left-4 top-4 rounded-full border border-white/15 bg-ink-950/50 px-2.5 py-1 text-[10px] tracking-[0.2em] text-white/70 backdrop-blur-md">
                        {project.year}
                      </span>
                    </div>
                    <div className="flex flex-1 flex-col px-3 pb-3 pt-5 [transform:translateZ(22px)]">
                      <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-cyan-300/85">{project.category}</p>
                      <h3 className="mt-2 font-display text-xl font-semibold text-white md:text-2xl">{project.name}</h3>
                      <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-white/60">{project.description}</p>
                      <div className="mt-auto flex flex-wrap items-center gap-x-6 gap-y-3 pt-6">
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
          </div>

          <div className="mt-2 flex items-center justify-center gap-2" role="group" aria-label="Paginação dos projetos">
            {Array.from({ length: pages }, (_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => goTo(i)}
                aria-label={`Ir para o projeto ${i + 1}`}
                aria-current={i === index ? 'true' : undefined}
                className="group flex h-8 items-center px-1"
              >
                <span
                  className={cn(
                    'block h-1 rounded-full transition-all duration-500',
                    i === index ? 'w-8 bg-gradient-to-r from-cyan-300 to-blue-500' : 'w-2.5 bg-white/20 group-hover:bg-white/40',
                  )}
                />
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
