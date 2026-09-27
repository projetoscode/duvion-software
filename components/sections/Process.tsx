'use client';

import { useRef } from 'react';
import dynamic from 'next/dynamic';
import { gsap, ScrollTrigger, sectionTransition } from '@/lib/animations';
import { PROCESS_STEPS } from '@/lib/site';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import KineticText from '@/components/animations/KineticText';
import Reveal from '@/components/animations/Reveal';
import MagneticButton from '@/components/animations/MagneticButton';
import LazyScene from '@/components/3d/LazyScene';
import SectionTag from '@/components/ui/SectionTag';

const ProcessScene = dynamic(() => import('@/components/3d/ProcessScene'), { ssr: false });

export default function Process() {
  const section = useRef<HTMLElement>(null);
  const progress = useRef(0);

  useScrollAnimation(section, ({ root, reduced }) => {
    ScrollTrigger.create({
      trigger: root,
      start: 'top bottom',
      end: 'bottom top',
      onUpdate: (self) => {
        progress.current = self.progress;
      },
    });

    const list = root.querySelector<HTMLElement>('[data-steps]');
    const fill = root.querySelector<HTMLElement>('[data-line-fill]');
    const steps = gsap.utils.toArray<HTMLElement>('[data-step]', root);

    if (reduced) {
      gsap.set(fill, { scaleY: 1 });
      gsap.set(steps, { opacity: 1 });
      steps.forEach((step) => step.classList.add('is-active'));
      return;
    }

    const panel = root.querySelector<HTMLElement>('[data-panel]');
    if (panel) sectionTransition(panel, 'tilt');

    // The timeline line fills with the scroll and lights up each step as it passes.
    gsap.fromTo(fill, { scaleY: 0 }, { scaleY: 1, ease: 'none', scrollTrigger: { trigger: list, start: 'top 65%', end: 'bottom 55%', scrub: 0.6 } });
    steps.forEach((step) => {
      ScrollTrigger.create({
        trigger: step,
        start: 'top 62%',
        onEnter: () => step.classList.add('is-active'),
        onLeaveBack: () => step.classList.remove('is-active'),
      });
    });
    gsap.fromTo(
      steps,
      { opacity: 0, x: 50, filter: 'blur(8px)' },
      { opacity: 1, x: 0, filter: 'blur(0px)', duration: 1.1, ease: 'expo.out', stagger: 0.12, clearProps: 'filter', scrollTrigger: { trigger: list, start: 'top 85%', once: true } },
    );
  });

  return (
    <section id="sobre" ref={section} aria-labelledby="process-title" className="relative overflow-x-clip">
      <div data-panel className="section-panel relative overflow-hidden py-24 md:py-32">
        <div className="container-x grid items-center gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="relative lg:col-span-4">
            <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[radial-gradient(50%_50%_at_50%_50%,rgba(47,107,255,0.28),transparent_70%)]" />
            <LazyScene
              className="h-[280px] md:h-[360px] lg:h-[460px]"
              render={(active, tier) => <ProcessScene active={active} tier={tier} progressRef={progress} />}
            />
          </div>

          <div className="lg:col-span-4">
            <Reveal>
              <SectionTag>Como trabalhamos</SectionTag>
            </Reveal>
            <KineticText
              id="process-title"
              className="mt-6 font-display text-4xl font-semibold tracking-[-0.02em] md:text-5xl"
              lines={[[{ text: 'Do' }, { text: 'planejamento' }], [{ text: 'à' }, { text: 'entrega.', gradient: true }]]}
            />
            <Reveal delay={0.1}>
              <p className="mt-5 max-w-md text-white/65">
                Somos um estúdio de tecnologia e design. Seguimos um processo claro e eficiente para garantir que seu projeto seja entregue
                com qualidade, dentro do prazo e com total transparência.
              </p>
            </Reveal>
            <Reveal delay={0.2} className="mt-8">
              <MagneticButton href="/contato" variant="outline">
                Vamos conversar
              </MagneticButton>
            </Reveal>
          </div>

          <ol data-steps className="relative space-y-9 lg:col-span-4">
            <span aria-hidden="true" className="absolute bottom-7 left-[27px] top-7 w-px bg-white/10" />
            <span
              data-line-fill
              aria-hidden="true"
              className="absolute bottom-7 left-[27px] top-7 w-px origin-top bg-gradient-to-b from-cyan-300 via-blue-500 to-fuchsia-500 shadow-[0_0_12px_rgba(59,108,255,0.8)]"
            />
            {PROCESS_STEPS.map((step) => (
              <li key={step.number} data-step className="process-step relative flex gap-5">
                <span className="step-dot relative z-10 flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-white/15 bg-ink-900 font-display text-sm text-white/70">
                  {step.number}
                </span>
                <div className="pt-2">
                  <h3 className="font-display text-lg font-semibold text-white">{step.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-white/55">{step.description}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
