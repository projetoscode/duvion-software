import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PROJECTS } from '@/lib/site';
import KineticText from '@/components/animations/KineticText';
import Reveal from '@/components/animations/Reveal';
import TiltCard from '@/components/animations/TiltCard';
import MagneticButton from '@/components/animations/MagneticButton';
import { TransitionLink } from '@/components/animations/PageTransition';
import SectionTag from '@/components/ui/SectionTag';
import ProjectArt from '@/components/ui/ProjectArt';
import { ArrowIcon, ArrowLeftIcon } from '@/components/ui/Icons';

interface Params {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return PROJECTS.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const project = PROJECTS.find((p) => p.slug === slug);
  if (!project) return {};
  return { title: project.name, description: project.description };
}

export default async function ProjectPage({ params }: Params) {
  const { slug } = await params;
  const index = PROJECTS.findIndex((p) => p.slug === slug);
  if (index === -1) notFound();
  const project = PROJECTS[index];
  const next = PROJECTS[(index + 1) % PROJECTS.length];

  const story = [
    { label: 'O desafio', text: project.challenge },
    { label: 'A solução', text: project.solution },
    { label: 'A entrega', text: project.delivery },
  ];

  return (
    <main id="conteudo" className="relative">
      <article className="container-x pb-24 pt-32 md:pt-40">
        <Reveal>
          <TransitionLink href="/#projetos" className="link-arrow">
            <ArrowLeftIcon className="h-4 w-4" />
            Voltar aos projetos
          </TransitionLink>
        </Reveal>

        <header className="mt-10 grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:items-end">
          <div>
            <Reveal>
              <SectionTag>{project.category}</SectionTag>
            </Reveal>
            <KineticText
              as="h1"
              trigger="mount"
              delay={0.9}
              className="mt-6 font-display text-5xl font-semibold tracking-[-0.03em] md:text-7xl"
              lines={[project.name.split(' ').map((word, i, all) => ({ text: word, gradient: i === all.length - 1 }))]}
            />
            <Reveal delay={0.15}>
              <p className="mt-6 max-w-lg text-lg text-white/70">{project.description}</p>
            </Reveal>
          </div>

          <Reveal delay={0.2} as="dl" className="grid grid-cols-2 gap-6 text-sm">
            {[
              { label: 'Ano', value: project.year },
              { label: 'Segmento', value: project.segment },
              { label: 'Serviços', value: project.services.join(' · ') },
              { label: 'Tecnologias', value: project.stack.join(' · ') },
            ].map((item) => (
              <div key={item.label} className="border-t border-white/10 pt-4">
                <dt className="text-xs uppercase tracking-[0.25em] text-white/40">{item.label}</dt>
                <dd className="mt-2 text-white/85">{item.value}</dd>
              </div>
            ))}
          </Reveal>
        </header>

        <Reveal delay={0.1} className="mt-16">
          <TiltCard max={4} scale={1.01} className="rounded-[32px]" data-cursor="Duvion">
            <span aria-hidden="true" className="glass gradient-border absolute inset-0 rounded-[inherit]" />
            <div className="relative z-[2] overflow-hidden rounded-[28px] p-2 md:p-3">
              <ProjectArt variant={project.art} hue={project.hue} label={`Ilustração do projeto ${project.name}`} className="aspect-[16/9] w-full rounded-[24px]" />
            </div>
          </TiltCard>
        </Reveal>

        <section aria-label="Estudo de caso" className="mt-20 grid gap-5 md:grid-cols-3">
          {story.map((item, i) => (
            <Reveal key={item.label} delay={i * 0.1} className="glass gradient-border relative rounded-3xl p-7">
              <p className="text-xs tracking-[0.25em] text-cyan-300/80">0{i + 1}</p>
              <h2 className="mt-4 font-display text-xl font-semibold">{item.label}</h2>
              <p className="mt-3 text-sm leading-relaxed text-white/65">{item.text}</p>
            </Reveal>
          ))}
        </section>

        <Reveal className="mt-20 flex flex-col items-start justify-between gap-8 border-t border-white/10 pt-12 md:flex-row md:items-center">
          <div>
            <p className="text-sm text-white/50">Próximo projeto</p>
            <TransitionLink href={`/projetos/${next.slug}`} className="group mt-2 inline-flex items-center gap-4 font-display text-3xl font-semibold md:text-4xl">
              <span className="transition-colors group-hover:text-gradient">{next.name}</span>
              <ArrowIcon className="h-7 w-7 transition-transform duration-500 group-hover:translate-x-2" />
            </TransitionLink>
          </div>
          <MagneticButton href="/contato">Quero um projeto assim</MagneticButton>
        </Reveal>
      </article>
    </main>
  );
}
