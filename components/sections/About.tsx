'use client';

import { useRef } from 'react';
import dynamic from 'next/dynamic';
import { gsap, ScrollTrigger } from '@/lib/animations';
import { ABOUT, SITE, STATS } from '@/lib/site';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import KineticText from '@/components/animations/KineticText';
import Reveal from '@/components/animations/Reveal';
import LazyScene from '@/components/3d/LazyScene';
import SectionTag from '@/components/ui/SectionTag';

const ShapesScene = dynamic(() => import('@/components/3d/ShapesScene'), { ssr: false });

/** "Sobre": who is behind Duvion, animated counters and scroll-driven 3D shapes. */
export default function About() {
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

    // Counters tick up from zero the first time they enter the viewport.
    // Without JS (or with reduced motion) the real value is already in the HTML.
    if (reduced) return;
    root.querySelectorAll<HTMLElement>('[data-counter]').forEach((el) => {
      const target = Number(el.dataset.value);
      const suffix = el.dataset.suffix ?? '';
      const state = { value: 0 };
      el.textContent = `0${suffix}`;
      gsap.to(state, {
        value: target,
        duration: 2.2,
        ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 88%', once: true },
        onUpdate: () => {
          el.textContent = `${Math.round(state.value)}${suffix}`;
        },
      });
    });
  });

  return (
    <section id="sobre" ref={section} aria-labelledby="about-title" className="relative overflow-hidden py-24 md:py-36">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(45%_50%_at_80%_45%,rgba(30,107,255,0.16),transparent_70%),radial-gradient(35%_40%_at_10%_90%,rgba(0,180,255,0.08),transparent_70%)]"
      />
      <div className="container-x relative grid items-center gap-14 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <Reveal>
            <SectionTag>Sobre mim</SectionTag>
          </Reveal>
          <KineticText
            id="about-title"
            className="mt-6 font-display text-4xl font-semibold leading-[1.05] tracking-[-0.03em] md:text-6xl"
            lines={[
              [{ text: 'Prazer,' }, { text: 'eu' }, { text: 'sou' }, { text: 'o' }, { text: 'Eduardo.', gradient: true }],
            ]}
          />
          <div className="mt-8 max-w-2xl space-y-5 text-[17px] leading-relaxed text-white/70">
            {ABOUT.paragraphs.map((paragraph, i) => (
              <Reveal key={i} delay={0.1 + i * 0.1}>
                <p>{paragraph}</p>
              </Reveal>
            ))}
          </div>

          <dl className="mt-12 grid grid-cols-3 gap-4 border-t border-white/10 pt-8 md:gap-8">
            {STATS.map((stat, i) => (
              <Reveal key={stat.label} delay={0.15 + i * 0.1}>
                <dt className="sr-only">{stat.label}</dt>
                <dd>
                  <span
                    data-counter
                    data-value={stat.value}
                    data-suffix={stat.suffix}
                    className="block font-display text-4xl font-semibold tracking-tight text-white drop-shadow-[0_0_18px_rgba(0,180,255,0.45)] md:text-6xl"
                  >
                    {stat.value}
                    {stat.suffix}
                  </span>
                  <span aria-hidden="true" className="mt-2 block text-xs uppercase tracking-[0.18em] text-white/50 md:text-sm md:tracking-[0.2em]">
                    {stat.label}
                  </span>
                </dd>
              </Reveal>
            ))}
          </dl>

          <Reveal delay={0.2} className="mt-10 flex items-center gap-4">
            <span className="eyebrow-line" aria-hidden="true" />
            <p className="text-sm text-white/55">
              {SITE.author} — Fundador, {SITE.name}
            </p>
          </Reveal>
        </div>

        <div className="relative lg:col-span-5">
          <div aria-hidden="true" className="absolute inset-[8%] rounded-full bg-[radial-gradient(closest-side,rgba(30,107,255,0.3),transparent)]" />
          <LazyScene className="relative h-[320px] md:h-[440px] lg:h-[520px]" render={(active, tier) => <ShapesScene active={active} tier={tier} progressRef={progress} />} />
        </div>
      </div>
    </section>
  );
}
