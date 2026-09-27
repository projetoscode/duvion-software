import MagneticButton from '@/components/animations/MagneticButton';
import KineticText from '@/components/animations/KineticText';

export default function NotFound() {
  return (
    <main id="conteudo" className="container-x flex min-h-[80svh] flex-col items-start justify-center pt-32">
      <p className="tag">Erro 404</p>
      <KineticText
        as="h1"
        trigger="mount"
        delay={0.9}
        className="mt-6 font-display text-5xl font-semibold tracking-[-0.03em] md:text-7xl"
        lines={[[{ text: 'Página' }, { text: 'não' }], [{ text: 'encontrada.', gradient: true }]]}
      />
      <p className="mt-6 max-w-md text-white/65">O endereço pode ter mudado ou não existir mais. Que tal voltar para o início?</p>
      <div className="mt-10">
        <MagneticButton href="/">Voltar ao início</MagneticButton>
      </div>
    </main>
  );
}
