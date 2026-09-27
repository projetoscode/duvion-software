'use client';

import { useEffect, useRef, useState, type FormEvent } from 'react';
import { SERVICES, SITE } from '@/lib/site';
import { cn } from '@/lib/utils';
import MagneticButton from '@/components/animations/MagneticButton';

type Field = 'nome' | 'email' | 'mensagem';
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Contact form without a backend: validates in the browser and opens the
 * visitor's e-mail app with a pre-filled message addressed to Duvion.
 */
export default function ContactForm() {
  const [service, setService] = useState('');
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});
  const [sent, setSent] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    const requested = new URLSearchParams(window.location.search).get('servico');
    if (requested && SERVICES.some((s) => s.id === requested)) setService(requested);
  }, []);

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = String(data.get('nome') ?? '').trim();
    const email = String(data.get('email') ?? '').trim();
    const company = String(data.get('empresa') ?? '').trim();
    const message = String(data.get('mensagem') ?? '').trim();

    const nextErrors: Partial<Record<Field, string>> = {};
    if (name.length < 2) nextErrors.nome = 'Informe seu nome.';
    if (!EMAIL_PATTERN.test(email)) nextErrors.email = 'Informe um e-mail válido.';
    if (message.length < 10) nextErrors.mensagem = 'Conte um pouco mais sobre o projeto (mínimo de 10 caracteres).';
    setErrors(nextErrors);

    const firstInvalid = (Object.keys(nextErrors) as Field[])[0];
    if (firstInvalid) {
      formRef.current?.querySelector<HTMLElement>(`[name="${firstInvalid}"]`)?.focus();
      return;
    }

    const serviceLabel = SERVICES.find((s) => s.id === service)?.title;
    const subject = `Novo projeto${serviceLabel ? ` — ${serviceLabel}` : ''} | ${name}`;
    const body = [
      `Nome: ${name}`,
      `E-mail: ${email}`,
      company ? `Empresa: ${company}` : null,
      serviceLabel ? `Serviço: ${serviceLabel}` : null,
      '',
      message,
    ]
      .filter((line): line is string => line !== null)
      .join('\n');

    window.location.href = `mailto:${SITE.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setSent(true);
  };

  const describedBy = (field: Field) => (errors[field] ? `${field}-erro` : undefined);

  return (
    <form ref={formRef} onSubmit={onSubmit} noValidate className="space-y-6" aria-describedby="form-status">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="nome" className="mb-2 block text-sm text-white/70">
            Nome <span aria-hidden="true" className="text-cyan-300">*</span>
          </label>
          <input id="nome" name="nome" autoComplete="name" required className="form-field" aria-invalid={Boolean(errors.nome)} aria-describedby={describedBy('nome')} />
          {errors.nome && (
            <p id="nome-erro" className="mt-2 text-xs text-pink-300">
              {errors.nome}
            </p>
          )}
        </div>
        <div>
          <label htmlFor="email" className="mb-2 block text-sm text-white/70">
            E-mail <span aria-hidden="true" className="text-cyan-300">*</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            className="form-field"
            aria-invalid={Boolean(errors.email)}
            aria-describedby={describedBy('email')}
          />
          {errors.email && (
            <p id="email-erro" className="mt-2 text-xs text-pink-300">
              {errors.email}
            </p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="empresa" className="mb-2 block text-sm text-white/70">
          Empresa <span className="text-white/35">(opcional)</span>
        </label>
        <input id="empresa" name="empresa" autoComplete="organization" className="form-field" />
      </div>

      <fieldset>
        <legend className="mb-3 text-sm text-white/70">Tipo de projeto</legend>
        <div className="flex flex-wrap gap-2">
          {SERVICES.map((item) => (
            <label key={item.id} className="relative cursor-pointer">
              <input
                type="radio"
                name="servico"
                value={item.id}
                checked={service === item.id}
                onChange={() => setService(item.id)}
                className="peer sr-only"
              />
              <span
                className={cn(
                  'inline-flex rounded-full border px-4 py-2 text-sm transition-all duration-300 peer-focus-visible:ring-2 peer-focus-visible:ring-cyan-300',
                  service === item.id
                    ? 'border-cyan-300/70 bg-cyan-300/10 text-white shadow-[0_0_20px_-6px_rgba(34,211,238,0.7)]'
                    : 'border-white/10 bg-white/[0.03] text-white/65 hover:border-white/25 hover:text-white',
                )}
              >
                {item.title}
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <div>
        <label htmlFor="mensagem" className="mb-2 block text-sm text-white/70">
          Sobre o projeto <span aria-hidden="true" className="text-cyan-300">*</span>
        </label>
        <textarea
          id="mensagem"
          name="mensagem"
          rows={5}
          required
          placeholder="Conte o que você precisa, prazos e objetivos."
          className="form-field resize-y"
          aria-invalid={Boolean(errors.mensagem)}
          aria-describedby={describedBy('mensagem')}
        />
        {errors.mensagem && (
          <p id="mensagem-erro" className="mt-2 text-xs text-pink-300">
            {errors.mensagem}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <MagneticButton type="submit">Enviar mensagem</MagneticButton>
        <p id="form-status" role="status" aria-live="polite" className="text-sm text-white/55">
          {sent ? 'Abrimos seu app de e-mail com a mensagem pronta. É só enviar!' : `Ou escreva para ${SITE.email}`}
        </p>
      </div>
    </form>
  );
}
