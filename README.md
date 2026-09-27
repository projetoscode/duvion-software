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
- Três níveis de qualidade (`lib/three.ts → TIER_SETTINGS`): partículas, objetos, transmissão
  de vidro, bloom e DPR mudam conforme o dispositivo; `PerformanceMonitor` reduz o DPR se o FPS cair.
- As cenas de "Como trabalhamos" e do CTA só montam perto da viewport e pausam fora dela.
- `prefers-reduced-motion`: sem Lenis, sem cursor customizado, animações mínimas e cena 3D quase parada.
