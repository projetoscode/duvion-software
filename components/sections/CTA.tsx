'use client';

import { useRef } from 'react';
import dynamic from 'next/dynamic';
import { ScrollTrigger, sectionTransition } from '@/lib/animations';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { useDepthLayers } from '@/hooks/useDepthLayers';
import KineticText from '@/components/animations/KineticText';
import Reveal from '@/components/animations/Reveal';
import MagneticButton from '@/components/animations/MagneticButton';
import LazyScene from '@/components/3d/LazyScene';
import SectionTag from '@/components/ui/SectionTag';

const CTAScene = dynamic(() => import('@/components/3d/CTAScene'), { ssr: false });

export default function CTA() {
  const section = useRef<HTMLElement>(null);
  const progress = useRef(0.5);
  useDepthLayers(section, 30);

  useScrollAnimation(section, ({ root, reduced }) => {
    ScrollTrigger.create({
      trigger: root,
      start: 'top bottom',
      end: 'bottom top',
      onUpdate: (self) => {
        progress.current = self.progress;
      },
    });
    if (reduced) return;
    const panel = root.querySelector<HTMLElement>('[data-panel]');
    if (panel) sectionTransition(panel, 'circle');
  });

  return (
    <section ref={section} aria-labelledby="cta-title" className="relative py-16 md:py-24">
      <div className="container-x">
        <div data-panel className="cta-panel relative overflow-hidden rounded-[32px] border border-white/10">
          <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(180deg,#04050f_0%,#0d0c2e_38%,#2b1766_62%,#10123a_100%)]" />
          <LazyScene
            className="absolute inset-0"
            render={(active, tier) => <CTAScene active={active} tier={tier} progressRef={progress} />}
          />
          <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-r from-ink-950/85 via-ink-950/35 to-ink-950/10" />
          <div aria-hidden="true" className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300/60 to-transparent" />

          <div className="relative grid gap-10 px-6 py-14 md:grid-cols-2 md:items-center md:px-12 md:py-20 lg:px-16 lg:py-24">
            <div data-depth="0.35">
              <Reveal>
                <SectionTag>Vamos conversar</SectionTag>
              </Reveal>
              <KineticText
                id="cta-title"
                className="mt-6 font-display text-[2.1rem] font-semibold leading-[1.08] tracking-[-0.02em] md:text-5xl"
                lines={[
                  [{ text: 'Seu' }, { text: 'próximo' }, { text: 'projeto' }],
                  [{ text: 'pode' }, { text: 'ser' }, { text: 'o' }, { text: 'nosso' }, { text: 'maior' }],
                  [{ text: 'desafio.', gradient: true }],
                ]}
              />
            </div>
            <div data-depth="0.7" className="md:justify-self-end">
              <Reveal delay={0.15} className="glass max-w-sm rounded-3xl p-6 md:p-8">
                <p className="text-white/75">Estamos prontos para transformar sua ideia em realidade. Fale com a gente e vamos construir algo incrível juntos.</p>
                <div className="mt-7">
                  <MagneticButton href="/contato">Entrar em contato</MagneticButton>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
