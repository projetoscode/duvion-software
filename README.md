# Duvion Softwares — site

Next.js 15 · React 19 · TypeScript · Tailwind CSS · Three.js / React Three Fiber · GSAP + ScrollTrigger · Lenis · Framer Motion.

```bash
npm install
npm run dev      # http://localhost:3000
npm run build && npm start
```

## Estrutura

```
app/                    rotas: / · /contato · /projetos/[slug] · template (transição de página)
components/smoke/       fumaça WebGL: SmokeCanvas (renderer) e SmokeBackground (camada fixa da página)
lib/shaders/smoke.ts    shader da fumaça (fBm com domain warping), separado do componente
components/3d/          ShapesScene (formas do "Sobre"), CubeCluster/ProcessScene ("Como trabalhamos"), LazyScene
components/animations/  MagneticButton, TiltCard, KineticText, PageTransition, CustomCursor, Reveal
components/sections/    Navbar, Hero, About, Services, Portfolio, Process, Testimonials, CTA, Footer
components/providers/   SmoothScroll (Lenis + ScrollTrigger no mesmo ticker do GSAP)
hooks/                  useMouseParallax, useDepthLayers, useMagnetic, useTilt, useScrollAnimation…
lib/                    site.ts (conteúdo), store.ts (estado da fumaça/ponteiro), three.ts, animations.ts
public/images/          foto do hero (recortada, fundo transparente)
```

## Onde editar o conteúdo

Tudo fica em `lib/site.ts`: textos, serviços, projetos, WhatsApp, Instagram e a mensagem pré-preenchida
(`whatsappLink`). Os números do "Sobre" (`STATS`) são calculados a partir dos projetos.

**Depoimentos:** adicione depoimentos reais em `TESTIMONIALS`. Enquanto a lista estiver vazia, a seção não aparece.

## Fumaça

Uma única camada fixa (`SmokeBackground`) fica atrás de todas as páginas. A intensidade é controlada pelo scroll
(`smokeIntensity` em `lib/store.ts`): cheia no hero, mais calma no meio da página, cheia de novo no CTA.

## Performance

- A fumaça renderiza em resolução reduzida (DPR máx. 1,5 × 0,55; no celular × 0,4 e menos oitavas de ruído)
  e para quando a aba fica oculta. Com `prefers-reduced-motion`, vira um quadro estático.
- As cenas 3D ("Sobre" e "Como trabalhamos") montam e pré-compilam quando o navegador está ocioso e pausam fora da tela.
- Sem `backdrop-filter`, `filter: blur` animado ou `clip-path` animado: as transições usam só transform.
- `prefers-reduced-motion`: sem Lenis, sem cursor customizado, animações mínimas.
