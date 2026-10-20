import { NAV_LINKS, SITE, whatsappLink } from '@/lib/site';
import { TransitionLink } from '@/components/animations/PageTransition';
import { Wordmark } from '@/components/ui/Logo';
import { SocialIcon } from '@/components/ui/Icons';

export default function Footer() {
  const contacts = [
    { icon: 'instagram' as const, label: SITE.instagram.handle, href: SITE.instagram.href, srLabel: 'Instagram' },
    { icon: 'whatsapp' as const, label: SITE.whatsapp.display, href: whatsappLink(), srLabel: 'WhatsApp' },
  ];

  return (
    <footer className="relative border-t border-white/[0.07] bg-ink-950/80">
      <div aria-hidden="true" className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-sky/40 to-transparent" />
      <div className="container-x py-12">
        <div className="flex flex-col gap-10 md:flex-row md:items-center md:justify-between">
          <TransitionLink href="/#inicio" aria-label={`${SITE.name} — página inicial`} className="self-start rounded-md">
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

          <ul className="flex flex-col gap-3 sm:flex-row sm:gap-5">
            {contacts.map((contact) => (
              <li key={contact.srLabel}>
                <a
                  href={contact.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-2.5 text-sm text-white/65 transition-colors hover:text-white"
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 transition-all duration-500 group-hover:border-brand-sky/60 group-hover:shadow-[0_0_20px_rgba(0,180,255,0.4)]">
                    <SocialIcon name={contact.icon} className="h-[17px] w-[17px]" />
                  </span>
                  <span className="sr-only">{contact.srLabel}: </span>
                  {contact.label}
                  <span className="sr-only"> (abre em nova aba)</span>
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-white/[0.06] pt-6 text-xs text-white/40 sm:flex-row sm:justify-between">
          <p>© 2026 {SITE.name}. Todos os direitos reservados.</p>
          <p>
            Site desenvolvido por <span className="text-white/65">{SITE.author}</span> — {SITE.name}
          </p>
        </div>
      </div>
    </footer>
  );
}
