'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { gsap, ScrollTrigger } from '@/lib/animations';
import { whatsappLink } from '@/lib/site';
import { SMOKE_BASELINE, smokeIntensity } from '@/lib/store';
import { cn } from '@/lib/utils';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { useDepthLayers } from '@/hooks/useDepthLayers';
import MagneticButton from '@/components/animations/MagneticButton';
import { SocialIcon } from '@/components/ui/Icons';


const WORD = 'DUVION';
const HEADLINE = ['Transformamos ideias', 'em experiências', 'digitais.'];
const INTRO_DELAY = 1.1;

/**
 * Hero: portrait centred over animated smoke, giant brand word behind it.
 * Depth comes from three layers moving at different speeds with the pointer
 * (word < portrait, smoke reacts in the shader). Scrolling away scales the
 * portrait back and dissipates the smoke.
 */
export default function Hero() {
  const section = useRef<HTMLElement>(null);
  useDepthLayers(section, 26);

  useScrollAnimation(section, ({ root, reduced }) => {
    const letters = root.querySelectorAll('[data-hero-letter]');
    const lines = root.querySelectorAll('[data-hero-line]');
    const fades = root.querySelectorAll('[data-hero-fade]');

    // The page-wide smoke is full here and settles to its calmer baseline as the hero leaves.
    ScrollTrigger.create({
      trigger: root,
      start: 'top top',
      end: 'bottom top',
      onUpdate: (self) => {
        smokeIntensity.current = 1 - self.progress * (1 - SMOKE_BASELINE);
      },
      onRefresh: (self) => {
        smokeIntensity.current = 1 - self.progress * (1 - SMOKE_BASELINE);
      },
    });

    if (reduced) {
      gsap.set([...letters, ...lines], { yPercent: 0, y: 0 });
      gsap.set(fades, { opacity: 1 });
      return;
    }

    // Entrance: portrait rises in, the brand word is revealed letter by letter,
    // the headline line by line, then the actions.
    gsap
      .timeline({ delay: INTRO_DELAY })
      .fromTo('[data-hero-photo-inner]', { opacity: 0, y: 70, scale: 1.04 }, { opacity: 1, y: 0, scale: 1, duration: 1.8, ease: 'expo.out' }, 0)
      .fromTo(letters, { yPercent: 110, y: 0 }, { yPercent: 0, y: 0, duration: 1.3, ease: 'expo.out', stagger: 0.07 }, 0.1)
      .fromTo(lines, { yPercent: 110, y: 0 }, { yPercent: 0, y: 0, duration: 1.1, ease: 'expo.out', stagger: 0.12 }, 0.55)
      .fromTo(fades, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 1, ease: 'expo.out', stagger: 0.1 }, 0.85);

    // Leaving: the portrait moves away (smaller, lower, fading), the word drifts up.
    gsap
      .timeline({ scrollTrigger: { trigger: root, start: 'top top', end: 'bottom top', scrub: 0.5 } })
      .to('[data-hero-photo]', { scale: 0.78, yPercent: 8, opacity: 0.1, ease: 'none' }, 0)
      .to('[data-hero-word]', { yPercent: -40, opacity: 0, ease: 'none' }, 0)
      .to('[data-hero-content]', { yPercent: -35, opacity: 0, ease: 'none' }, 0);
  });

  return (
    <section id="inicio" ref={section} aria-labelledby="hero-title" className="relative h-[100svh] min-h-[620px] overflow-hidden">

      {/* Giant brand word behind the portrait */}
      <div data-hero-word aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-[12%] flex justify-center md:top-[10%]">
        <div data-depth="0.25" className="flex flex-col items-end">
          <span className="flex font-display text-[26vw] font-bold leading-[0.82] tracking-[-0.055em] md:text-[19vw]">
            {WORD.split('').map((letter, i) => (
              <span key={i} className="reveal-mask">
                <span data-hero-letter className="hero-word inline-block">
                  {letter}
                </span>
              </span>
            ))}
          </span>
          <span data-hero-fade className="mt-3 mr-[0.4em] text-[10px] font-medium tracking-[0.9em] text-brand-ice/80 md:text-sm">
            SOFTWARES
          </span>
        </div>
      </div>

      {/* Portrait */}
      <div data-hero-photo className="pointer-events-none absolute inset-x-0 top-[17svh] flex justify-center md:top-[16svh] lg:top-[15svh]">
        <div data-depth="0.6">
          <div data-hero-photo-inner className="hero-photo-mask relative aspect-[1153/1346] h-[50svh] md:h-[56svh] lg:h-[64svh]">
            <div
              aria-hidden="true"
              className="absolute inset-x-[4%] top-[2%] h-[62%] rounded-full bg-[radial-gradient(closest-side,rgba(30,107,255,0.42),rgba(0,180,255,0.08)_60%,transparent)]"
            />
            <Image
              src="/images/eduardo-campos-2026.webp"
              alt="Eduardo de P. Campos, fundador da Duvion Softwares"
              fill
              priority
              sizes="(min-width: 1024px) 55vh, (min-width: 768px) 48vh, 43vh"
              className="hero-photo object-contain object-bottom"
            />
          </div>
        </div>
      </div>



      {/* Headline + actions */}
      <div data-hero-content className="absolute inset-x-0 bottom-0 z-10">
        <div className="container-x grid gap-6 pb-9 md:pb-12 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
          <div className="max-w-xl lg:max-w-[40vw]">
            <p data-hero-fade className="mb-4 flex items-center gap-3 text-[10px] font-medium uppercase tracking-[0.16em] text-brand-ice/85 md:text-[11px] md:tracking-[0.28em]">
              <span className="eyebrow-line" aria-hidden="true" />
              Sites · Landing pages · Automações
            </p>
            <h1 id="hero-title" className="font-display text-[2.1rem] font-semibold leading-[1.02] tracking-[-0.03em] min-[400px]:text-[2.35rem] md:text-[3.2rem] lg:text-[3rem] xl:text-[3.4rem]">
              <span className="sr-only">Duvion Softwares — </span>
              {HEADLINE.map((line, i) => (
                <span key={line} className="reveal-mask">
                  <span data-hero-line className={cn('block', i === HEADLINE.length - 1 && 'text-gradient')}>
                    {line}
                  </span>
                </span>
              ))}
            </h1>
          </div>

          <div data-hero-fade className="flex flex-wrap items-center gap-3 lg:justify-end">
            <MagneticButton href={whatsappLink()} external icon={false}>
              <SocialIcon name="whatsapp" className="h-[18px] w-[18px]" />
              Falar no WhatsApp
            </MagneticButton>
            <MagneticButton href="/#projetos" variant="ghost">
              Ver portfólio
            </MagneticButton>
          </div>
        </div>
      </div>

      {/* Scroll cue */}
      <div data-hero-fade aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-5 z-10 hidden flex-col items-center gap-2 lg:flex">
        <span className="scroll-cue" />
        <span className="text-[10px] uppercase tracking-[0.3em] text-white/45">Role para baixo</span>
      </div>
    </section>
  );
}
