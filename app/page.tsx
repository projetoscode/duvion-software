import Hero from '@/components/sections/Hero';
import Services from '@/components/sections/Services';
import Projects from '@/components/sections/Projects';
import Process from '@/components/sections/Process';
import CTA from '@/components/sections/CTA';

export default function HomePage() {
  return (
    <main id="conteudo">
      <Hero />
      <Services />
      <Projects />
      <Process />
      <CTA />
    </main>
  );
}
