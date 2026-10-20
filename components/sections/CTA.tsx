'use client';

import { useRef } from 'react';
import { ScrollTrigger, sectionTransition } from '@/lib/animations';
import { SMOKE_BASELINE, smokeIntensity } from '@/lib/store';
import { SITE, whatsappLink } from '@/lib/site';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { useDepthLayers } from '@/hooks/useDepthLayers';
import KineticText from '@/components/animations/KineticText';
import Reveal from '@/components/animations/Reveal';
import MagneticButton from '@/components/animations/MagneticButton';
import SectionTag from '@/components/ui/SectionTag';
import { SocialIcon } from '@/components/ui/Icons';

/** Closing call to action: the page-wide smoke swells back to full strength behind it. */
export default function CTA() {
  const section = useRef<HTMLElement>(null);
  useDepthLayers(section, 30);

  useScrollAnimation(section, ({ root, reduced }) => {
    ScrollTrigger.create({
      trigger: root,
      start: 'top bottom',
      end: 'center center',
      onUpdate: (self) => {
        smokeIntensity.current = SMOKE_BASELINE + (1 - SMOKE_BASELINE) * self.progress;
      },
    });
    if (reduced) return;
    const panel = root.querySelector<HTMLElement>('[data-panel]');
    if (panel) sectionTransition(panel, 'circle');
  });

  return (
    <section ref={section} aria-labelledby="cta-title" className="relative py-16 md:py-24">
      <div className="container-x">
        <div data-panel className="relative overflow-hidden rounded-[32px] border border-brand-sky/20 shadow-[0_0_80px_-30px_rgba(0,180,255,0.6)]">
          <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-b from-ink-950/30 via-transparent to-ink-950/70" />
          <div aria-hidden="true" className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-sky/80 to-transparent" />

          <div className="relative flex flex-col items-center px-6 py-20 text-center md:px-12 md:py-28">
            <div data-depth="0.3" className="flex flex-col items-center">
              <Reveal>
                <SectionTag>Vamos conversar</SectionTag>
              </Reveal>
              <KineticText
                id="cta-title"
                className="mt-6 max-w-3xl font-display text-[2.2rem] font-semibold leading-[1.05] tracking-[-0.03em] md:text-6xl"
                lines={[
                  [{ text: 'Seu' }, { text: 'próximo' }, { text: 'projeto' }],
                  [{ text: 'pode' }, { text: 'ser' }, { text: 'o' }, { text: 'nosso' }, { text: 'maior' }, { text: 'desafio.', gradient: true }],
                ]}
              />
              <Reveal delay={0.15}>
                <p className="mt-6 max-w-lg text-white/70">
                  Estamos prontos para transformar sua ideia em realidade. Fale com a gente e vamos construir algo incrível juntos.
                </p>
              </Reveal>
            </div>
            <Reveal delay={0.25} className="mt-10 flex flex-wrap items-center justify-center gap-3">
              <MagneticButton href={whatsappLink()} external icon={false}>
                <SocialIcon name="whatsapp" className="h-[18px] w-[18px]" />
                Falar no WhatsApp
              </MagneticButton>
              <MagneticButton href="/contato" variant="ghost">
                Enviar uma mensagem
              </MagneticButton>
            </Reveal>
            <Reveal delay={0.35}>
              <p className="mt-6 text-sm text-white/45">{SITE.whatsapp.display}</p>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
