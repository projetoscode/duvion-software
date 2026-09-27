import { NAV_LINKS, SITE } from '@/lib/site';
import { TransitionLink } from '@/components/animations/PageTransition';
import { Wordmark } from '@/components/ui/Logo';
import { SocialIcon } from '@/components/ui/Icons';

export default function Footer() {
  return (
    <footer className="relative border-t border-white/[0.07] bg-ink-950/80 backdrop-blur-sm">
      <div className="container-x py-12">
        <div className="flex flex-col gap-10 md:flex-row md:items-center md:justify-between">
          <TransitionLink href="/#inicio" aria-label="Duvion Software — página inicial" className="self-start rounded-md">
            <Wordmark />
          </TransitionLink>

          <nav aria-label="Rodapé">
            <ul className="flex flex-wrap gap-x-7 gap-y-3 text-sm text-white/60">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <TransitionLink href={link.href} className="transition-colors hover:text-white">
                    {link.label}
                  </TransitionLink>
                </li>
              ))}
            </ul>
          </nav>

          <ul className="flex gap-3">
            {SITE.social.map((social) => (
              <li key={social.label}>
                <a
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${social.label} (abre em nova aba)`}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-white/60 transition-all duration-500 hover:border-cyan-300/50 hover:text-white hover:shadow-[0_0_20px_rgba(34,211,238,0.35)]"
                >
                  <SocialIcon name={social.icon} className="h-[18px] w-[18px]" />
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-white/[0.06] pt-6 text-xs text-white/40 sm:flex-row sm:justify-between">
          <p>© 2026 Duvion Software. Todos os direitos reservados.</p>
          <p>
            Site desenvolvido por <span className="text-white/65">{SITE.author}</span> — Duvion Software
          </p>
        </div>
      </div>
    </footer>
  );
}
