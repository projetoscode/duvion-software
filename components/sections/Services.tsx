'use client';

import { useRef } from 'react';
import { gsap, sectionTransition } from '@/lib/animations';
import { SERVICES, whatsappLink } from '@/lib/site';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import KineticText from '@/components/animations/KineticText';
import TiltCard from '@/components/animations/TiltCard';
import Reveal from '@/components/animations/Reveal';
import SectionTag from '@/components/ui/SectionTag';
import { ArrowIcon, CheckIcon, ServiceIcon } from '@/components/ui/Icons';

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

    // Cards rise one after another (stagger), tipping forward in 3D.
    gsap.fromTo(
      cards,
      { opacity: 0, y: 110, rotateX: -26, scale: 0.92, transformPerspective: 1200, transformOrigin: '50% 0%' },
      {
        opacity: 1,
        y: 0,
        rotateX: 0,
        scale: 1,
        duration: 1.3,
        ease: 'expo.out',
        stagger: 0.14,
        scrollTrigger: { trigger: root.querySelector('[data-grid]'), start: 'top 85%', once: true },
      },
    );
  });

  return (
    <section id="servicos" ref={section} aria-labelledby="services-title" className="relative">
      <div data-panel className="section-panel relative py-24 md:py-32">
        <div className="container-x">
          <div className="max-w-2xl">
            <Reveal>
              <SectionTag>O que fazemos</SectionTag>
            </Reveal>
            <KineticText
              id="services-title"
              className="mt-6 font-display text-4xl font-semibold tracking-[-0.03em] md:text-6xl"
              lines={[[{ text: 'Nossas' }, { text: 'soluções', gradient: true }]]}
            />
            <Reveal delay={0.1}>
              <p className="mt-5 max-w-lg text-white/65">
                Soluções completas para o seu projeto, do planejamento à entrega — tecnologia de ponta, foco em performance e uma experiência
                incrível.
              </p>
            </Reveal>
          </div>

          <ul data-grid className="mt-14 grid gap-5 [perspective:1200px] md:grid-cols-3">
            {SERVICES.map((service, index) => (
              <li key={service.id} data-stagger-item className="h-full">
                <TiltCard className="service-card group h-full rounded-[28px] has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-brand-sky">
                  <span aria-hidden="true" className="glass gradient-border absolute inset-0 rounded-[inherit]" />
                  <span
                    aria-hidden="true"
                    className="absolute -right-10 -top-10 h-44 w-44 rounded-full bg-[radial-gradient(closest-side,rgba(0,180,255,0.25),transparent)] opacity-60 transition-opacity duration-700 group-hover:opacity-100"
                  />
                  <div className="relative z-[2] flex h-full flex-col p-7 [transform-style:preserve-3d] md:p-8">
                    <div className="flex items-start justify-between [transform:translateZ(45px)]">
                      <span className="icon-box">
                        <ServiceIcon name={service.icon} className="h-7 w-7" />
                      </span>
                      <span className="font-display text-sm tracking-[0.2em] text-white/30">0{index + 1}</span>
                    </div>
                    <h3 className="mt-8 font-display text-2xl font-semibold text-white [transform:translateZ(32px)]">{service.title}</h3>
                    <p className="mt-3 text-[15px] leading-relaxed text-white/65 [transform:translateZ(22px)]">{service.description}</p>
                    <ul className="mt-6 space-y-3 [transform:translateZ(18px)]">
                      {service.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-3 text-sm text-white/75">
                          <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-sky/15 text-brand-sky">
                            <CheckIcon className="h-3 w-3" />
                          </span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <a
                      href={whatsappLink(`Olá, Eduardo! Vim pelo site e tenho interesse em ${service.title}.`)}
                      target="_blank"
                      rel="noopener noreferrer"
                      data-cursor="Falar"
                      className="link-arrow mt-auto self-start pt-9 focus-visible:outline-none [transform:translateZ(26px)]"
                    >
                      {service.cta}
                      <ArrowIcon className="h-4 w-4" />
                      <span className="sr-only"> (WhatsApp, abre em nova aba)</span>
                    </a>
                  </div>
                </TiltCard>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
