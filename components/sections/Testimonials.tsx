'use client';

import { useRef } from 'react';
import { gsap } from '@/lib/animations';
import { TESTIMONIALS } from '@/lib/site';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import KineticText from '@/components/animations/KineticText';
import TiltCard from '@/components/animations/TiltCard';
import Reveal from '@/components/animations/Reveal';
import SectionTag from '@/components/ui/SectionTag';

/**
 * Client testimonials. Renders nothing until real testimonials are added to
 * TESTIMONIALS in lib/site.ts — the site never shows invented quotes.
 */
export default function Testimonials() {
  const section = useRef<HTMLElement>(null);

  useScrollAnimation(section, ({ root, reduced }) => {
    const cards = gsap.utils.toArray<HTMLElement>('[data-stagger-item]', root);
    if (reduced) {
      gsap.set(cards, { opacity: 1 });
      return;
    }
    gsap.fromTo(
      cards,
      { opacity: 0, y: 70, scale: 0.95 },
      { opacity: 1, y: 0, scale: 1, duration: 1.1, ease: 'expo.out', stagger: 0.12, scrollTrigger: { trigger: root.querySelector('[data-grid]'), start: 'top 85%', once: true } },
    );
  });

  if (TESTIMONIALS.length === 0) return null;

  return (
    <section ref={section} aria-labelledby="testimonials-title" className="relative py-24 md:py-32">
      <div className="container-x">
        <div className="max-w-2xl">
          <Reveal>
            <SectionTag>Depoimentos</SectionTag>
          </Reveal>
          <KineticText
            id="testimonials-title"
            className="mt-6 font-display text-4xl font-semibold tracking-[-0.03em] md:text-6xl"
            lines={[[{ text: 'Quem' }, { text: 'já' }, { text: 'trabalhou' }, { text: 'com', gradient: true }, { text: 'a', gradient: true }, { text: 'gente', gradient: true }]]}
          />
        </div>

        <ul data-grid className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {TESTIMONIALS.map((item) => (
            <li key={`${item.name}-${item.role}`} data-stagger-item className="h-full">
              <TiltCard max={5} className="h-full rounded-[26px]">
                <span aria-hidden="true" className="glass gradient-border absolute inset-0 rounded-[inherit]" />
                <figure className="relative z-[2] flex h-full flex-col p-7 md:p-8">
                  <span aria-hidden="true" className="font-display text-6xl leading-none text-brand-sky/40">
                    &ldquo;
                  </span>
                  <blockquote className="mt-2 flex-1 text-[15px] leading-relaxed text-white/80">{item.quote}</blockquote>
                  <figcaption className="mt-8 border-t border-white/10 pt-5">
                    <p className="font-display font-semibold text-white">{item.name}</p>
                    <p className="mt-1 text-sm text-white/50">{item.role}</p>
                  </figcaption>
                </figure>
              </TiltCard>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
