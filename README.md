# Duvion Software — landing page 3D

Next.js 15 · React 19 · TypeScript · Tailwind CSS · Three.js / React Three Fiber / Drei · GSAP + ScrollTrigger · Lenis · Framer Motion.

```bash
npm install
npm run dev      # http://localhost:3000
npm run build && npm start
```

## Estrutura

```
app/                    rotas: / · /contato · /projetos/[slug] · template (transição de página)
components/3d/          cena WebGL fixa (HeroScene), logo "D" procedural, floating objects,
                        partículas GLSL, nebulosa, cluster de cubos, montanhas do CTA
components/animations/  MagneticButton, TiltCard, KineticText, PageTransition, CustomCursor, Reveal
components/sections/    Navbar, Hero, Services, Projects, Process, CTA, Footer
components/providers/   SmoothScroll (Lenis + ScrollTrigger no mesmo ticker do GSAP)
hooks/                  useMouseParallax, useMagnetic, useTilt, useScrollAnimation, useDepthLayers…
lib/                    site.ts (conteúdo), three.ts (geometria/tiers), animations.ts, store.ts
```

## Onde editar o conteúdo

Todo o texto, serviços, projetos, WhatsApp e redes sociais estão em `lib/site.ts`.
Os projetos são exemplos: substitua pelos cases reais. O formulário de contato abre o WhatsApp
com a mensagem pronta para `SITE.whatsapp`.

## Performance

- Three.js carrega só no cliente (`next/dynamic`), fora do bundle inicial.
- Três níveis de qualidade (`lib/three.ts → TIER_SETTINGS`), escolhidos pela tela, CPU, memória e
  pela GPU real (integradas e software ficam no nível médio/baixo); `PerformanceMonitor` reduz o DPR se o FPS cair.
- O canvas de fundo só renderiza enquanto o hero está na tela; abaixo dele, o último quadro fica congelado.
- As cenas de "Como trabalhamos" e do CTA montam e pré-compilam quando o navegador está ocioso,
  e pausam fora da tela. Nenhum shader é compilado durante a rolagem.
- Sem `backdrop-filter`, sem `filter: blur` animado e sem `clip-path` animado: as transições usam só transform.
- `prefers-reduced-motion`: sem Lenis, sem cursor customizado, animações mínimas e cena 3D quase parada.
