'use client';

import { useRef } from 'react';
import { gsap, sectionTransition } from '@/lib/animations';
import { SERVICES } from '@/lib/site';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import KineticText from '@/components/animations/KineticText';
import TiltCard from '@/components/animations/TiltCard';
import Reveal from '@/components/animations/Reveal';
import { TransitionLink } from '@/components/animations/PageTransition';
import SectionTag from '@/components/ui/SectionTag';
import { ArrowIcon, ServiceIcon } from '@/components/ui/Icons';

export default function Services() {
  const section = useRef<HTMLElement>(null);

  useScrollAnimation(section, ({ root, reduced }) => {
    const cards = gsap.utils.toArray<HTMLElement>('[data-stagger-item]', root);
    if (reduced) {
      gsap.set(cards, { opacity: 1 });
      return;
    }

    const panel = root.querySelector<HTMLElement>('[data-panel]');
    if (panel) sectionTransition(panel, 'clip');

    // Cards cascade in one after another: fade + rise + rotateX + scale.
    gsap.fromTo(
      cards,
      { opacity: 0, y: 90, rotateX: -32, scale: 0.9, transformPerspective: 1200, transformOrigin: '50% 0%' },
      {
        opacity: 1,
        y: 0,
        rotateX: 0,
        scale: 1,
        duration: 1.2,
        ease: 'expo.out',
        stagger: 0.1,
        scrollTrigger: { trigger: root.querySelector('[data-grid]'), start: 'top 85%', once: true },
      },
    );
  });

  return (
    <section id="servicos" ref={section} aria-labelledby="services-title" className="relative">
      <div data-panel className="section-panel relative py-24 md:py-32">
        <div className="container-x">
          <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
            <div className="max-w-xl">
              <Reveal>
                <SectionTag>O que fazemos</SectionTag>
              </Reveal>
              <KineticText
                id="services-title"
                className="mt-6 font-display text-4xl font-semibold tracking-[-0.02em] md:text-5xl lg:text-6xl"
                lines={[[{ text: 'Nossas' }, { text: 'soluções', gradient: true }]]}
              />
              <Reveal delay={0.1}>
                <p className="mt-5 max-w-md text-white/65">
                  Soluções completas para o seu projeto, do planejamento à entrega — tecnologia de ponta, foco em performance e uma
                  experiência incrível.
                </p>
              </Reveal>
            </div>
            <Reveal delay={0.2}>
              <TransitionLink href="/contato" className="link-arrow">
                Solicitar orçamento
                <ArrowIcon className="h-4 w-4" />
              </TransitionLink>
            </Reveal>
          </div>

          <ul data-grid className="mt-14 grid grid-cols-1 gap-4 [perspective:1200px] min-[520px]:grid-cols-2 md:gap-5 lg:grid-cols-3">
            {SERVICES.map((service, index) => (
              <li key={service.id} data-stagger-item className="h-full">
                <TiltCard className="service-card group h-full rounded-[26px] has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-cyan-300">
                  <span aria-hidden="true" className="glass gradient-border absolute inset-0 rounded-[inherit]" />
                  <TransitionLink
                    href={`/contato?servico=${service.id}`}
                    data-cursor="Abrir"
                    className="relative z-[2] flex h-full min-h-[230px] flex-col p-6 [transform-style:preserve-3d] focus-visible:outline-none md:p-7"
                  >
                    <span className="icon-box [transform:translateZ(45px)]">
                      <ServiceIcon name={service.icon} className="h-7 w-7" />
                    </span>
                    <h3 className="mt-7 font-display text-lg font-semibold text-white [transform:translateZ(32px)]">{service.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-white/60 [transform:translateZ(22px)]">{service.description}</p>
                    <span className="mt-auto flex items-center justify-between pt-8 text-white/40 [transform:translateZ(28px)]">
                      <span className="text-xs tracking-[0.25em]">0{index + 1}</span>
                      <span className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-white/70 transition-all duration-500 group-hover:border-cyan-300/60 group-hover:bg-cyan-300/10 group-hover:text-white">
                        <ArrowIcon className="h-4 w-4 transition-transform duration-500 group-hover:-rotate-45" />
                      </span>
                    </span>
                  </TransitionLink>
                </TiltCard>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
