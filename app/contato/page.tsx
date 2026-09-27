import type { Metadata } from 'next';
import { SITE } from '@/lib/site';
import KineticText from '@/components/animations/KineticText';
import Reveal from '@/components/animations/Reveal';
import SectionTag from '@/components/ui/SectionTag';
import ContactForm from '@/components/contact/ContactForm';
import { SocialIcon } from '@/components/ui/Icons';

export const metadata: Metadata = {
  title: 'Contato',
  description: 'Fale com a Duvion Software e transforme sua ideia em uma experiência digital.',
};

export default function ContactPage() {
  return (
    <main id="conteudo" className="relative">
      <section aria-labelledby="contact-title" className="container-x grid gap-14 pb-24 pt-36 md:pt-44 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
        <div>
          <Reveal>
            <SectionTag>Contato</SectionTag>
          </Reveal>
          <KineticText
            as="h1"
            id="contact-title"
            trigger="mount"
            delay={0.9}
            className="mt-6 font-display text-[2.6rem] font-semibold leading-[1.04] tracking-[-0.03em] md:text-6xl"
            lines={[
              [{ text: 'Vamos' }, { text: 'construir' }],
              [{ text: 'algo' }, { text: 'incrível', gradient: true }],
              [{ text: 'juntos.', gradient: true }],
            ]}
          />
          <Reveal delay={0.2}>
            <p className="mt-6 max-w-md text-white/65">
              Conte sua ideia. Respondemos em até um dia útil com os próximos passos, uma estimativa inicial e como podemos ajudar.
            </p>
          </Reveal>

          <Reveal delay={0.3} as="dl" className="mt-12 space-y-6 text-sm">
            <div>
              <dt className="text-xs uppercase tracking-[0.25em] text-white/40">E-mail</dt>
              <dd className="mt-1.5">
                <a href={`mailto:${SITE.email}`} className="text-lg text-white transition-colors hover:text-cyan-300">
                  {SITE.email}
                </a>
              </dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-[0.25em] text-white/40">Onde estamos</dt>
              <dd className="mt-1.5 text-white/80">{SITE.location}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-[0.25em] text-white/40">Horário</dt>
              <dd className="mt-1.5 text-white/80">{SITE.hours}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-[0.25em] text-white/40">Redes</dt>
              <dd className="mt-3 flex gap-3">
                {SITE.social.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${social.label} (abre em nova aba)`}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-white/60 transition-all hover:border-cyan-300/50 hover:text-white"
                  >
                    <SocialIcon name={social.icon} className="h-[18px] w-[18px]" />
                  </a>
                ))}
              </dd>
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.25} className="glass gradient-border relative rounded-[32px] p-6 md:p-10">
          <h2 className="font-display text-2xl font-semibold">Conte sobre seu projeto</h2>
          <p className="mb-8 mt-2 text-sm text-white/55">Campos com * são obrigatórios.</p>
          <ContactForm />
        </Reveal>
      </section>
    </main>
  );
}
