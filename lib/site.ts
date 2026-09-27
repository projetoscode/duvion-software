export const SITE = {
  name: 'Duvion Software',
  shortName: 'Duvion',
  tagline: 'Tecnologia que transforma.',
  description:
    'Na Duvion Software, desenvolvemos soluções digitais personalizadas que conectam marcas, pessoas e resultados. Sites, sistemas, aplicativos e muito mais.',
  email: 'contato@duvionsoftware.com',
  location: 'Brasil · Atendimento remoto em todo o país',
  hours: 'Seg. a Sex. · 9h às 18h',
  social: [
    { label: 'Instagram', href: 'https://www.instagram.com/duvionsoftware', icon: 'instagram' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/company/duvionsoftware', icon: 'linkedin' },
    { label: 'GitHub', href: 'https://github.com/duvionsoftware', icon: 'github' },
  ],
} as const;

export type SocialIconName = (typeof SITE.social)[number]['icon'];

export const NAV_LINKS = [
  { label: 'Início', href: '/#inicio', section: 'inicio' },
  { label: 'Serviços', href: '/#servicos', section: 'servicos' },
  { label: 'Projetos', href: '/#projetos', section: 'projetos' },
  { label: 'Sobre', href: '/#sobre', section: 'sobre' },
  { label: 'Contato', href: '/contato', section: 'contato' },
] as const;

export type ServiceIconName = 'globe' | 'rocket' | 'code' | 'phone' | 'brain' | 'cart';

export interface Service {
  id: string;
  title: string;
  description: string;
  icon: ServiceIconName;
}

export const SERVICES: Service[] = [
  {
    id: 'sites',
    title: 'Sites Institucionais',
    description: 'Sua marca no digital com um site moderno e responsivo.',
    icon: 'globe',
  },
  {
    id: 'landing-pages',
    title: 'Landing Pages',
    description: 'Páginas estratégicas para transformar visitantes em clientes.',
    icon: 'rocket',
  },
  {
    id: 'sistemas',
    title: 'Sistemas Web',
    description: 'Soluções personalizadas para sua empresa.',
    icon: 'code',
  },
  {
    id: 'aplicativos',
    title: 'Aplicativos',
    description: 'Experiências digitais para levar sua marca ao próximo nível.',
    icon: 'phone',
  },
  {
    id: 'ia',
    title: 'Inteligência Artificial',
    description: 'Automação e inteligência para aumentar seus resultados.',
    icon: 'brain',
  },
  {
    id: 'ecommerce',
    title: 'E-commerce',
    description: 'Sua loja online, do jeito que você precisa.',
    icon: 'cart',
  },
];

export type ProjectArtVariant = 'site' | 'landing' | 'app' | 'system' | 'shop' | 'ai';

export interface Project {
  slug: string;
  name: string;
  category: string;
  description: string;
  art: ProjectArtVariant;
  hue: [string, string];
  year: string;
  segment: string;
  services: string[];
  stack: string[];
  challenge: string;
  solution: string;
  delivery: string;
}

export const PROJECTS: Project[] = [
  {
    slug: 'evolux-tecnologia',
    name: 'Evolux Tecnologia',
    category: 'Site Institucional',
    description: 'Presença digital imersiva para uma empresa de tecnologia em plena expansão.',
    art: 'site',
    hue: ['#22d3ee', '#3b6cff'],
    year: '2026',
    segment: 'Tecnologia B2B',
    services: ['UX/UI Design', 'Desenvolvimento Web', 'WebGL'],
    stack: ['Next.js', 'Three.js', 'GSAP'],
    challenge:
      'Traduzir um portfólio técnico e denso em uma narrativa clara, capaz de gerar confiança em poucos segundos de navegação.',
    solution:
      'Arquitetura de conteúdo orientada a jornadas, hero 3D interativo e microinterações que guiam o visitante até o contato.',
    delivery: 'Site responsivo, otimizado para performance e SEO, com painel para a equipe atualizar conteúdos.',
  },
  {
    slug: 'nexa-pro',
    name: 'Nexa Pro',
    category: 'Landing Page',
    description: 'Lançamento de produto com narrativa cinematográfica e foco total em conversão.',
    art: 'landing',
    hue: ['#8b5cf6', '#d946ef'],
    year: '2026',
    segment: 'Hardware & Wearables',
    services: ['Estratégia de conversão', 'Motion Design', 'Desenvolvimento'],
    stack: ['React', 'GSAP', 'Tailwind CSS'],
    challenge: 'Apresentar um produto premium em uma única página, mantendo a atenção do início ao fim.',
    solution: 'Storytelling guiado pelo scroll, blocos de prova social e CTAs posicionados nos momentos de maior intenção.',
    delivery: 'Landing page de alta performance integrada a ferramentas de análise e automação de marketing.',
  },
  {
    slug: 'connect-app',
    name: 'Connect App',
    category: 'Aplicativo',
    description: 'Aplicativo que aproxima pessoas e serviços com uma experiência fluida.',
    art: 'app',
    hue: ['#3b6cff', '#22d3ee'],
    year: '2025',
    segment: 'Serviços & Comunidade',
    services: ['Product Design', 'Aplicativo mobile', 'API'],
    stack: ['React Native', 'TypeScript', 'Node.js'],
    challenge: 'Criar um app simples o suficiente para qualquer pessoa, sem abrir mão de recursos avançados.',
    solution: 'Fluxos enxutos, design system próprio e notificações inteligentes baseadas no comportamento do usuário.',
    delivery: 'Aplicativo iOS e Android publicado, com back-end escalável e painel administrativo.',
  },
  {
    slug: 'orbit-gestao',
    name: 'Orbit Gestão',
    category: 'Sistema Web',
    description: 'Plataforma de gestão que centraliza operações, indicadores e equipes.',
    art: 'system',
    hue: ['#22d3ee', '#8b5cf6'],
    year: '2025',
    segment: 'Operações & Logística',
    services: ['Discovery', 'Sistema Web', 'Dashboards'],
    stack: ['Next.js', 'PostgreSQL', 'Prisma'],
    challenge: 'Substituir planilhas espalhadas por uma fonte única de verdade para toda a operação.',
    solution: 'Módulos sob medida, permissões por perfil e dashboards em tempo real com os indicadores do negócio.',
    delivery: 'Sistema web seguro, com integrações e treinamento para a equipe.',
  },
  {
    slug: 'lumen-store',
    name: 'Lumen Store',
    category: 'E-commerce',
    description: 'Loja online com vitrine envolvente e checkout sem atritos.',
    art: 'shop',
    hue: ['#d946ef', '#3b6cff'],
    year: '2025',
    segment: 'Varejo & Lifestyle',
    services: ['E-commerce', 'UX de checkout', 'Integrações'],
    stack: ['Next.js', 'Stripe', 'Headless CMS'],
    challenge: 'Aumentar a conversão de uma loja com alto tráfego e muitos abandonos no carrinho.',
    solution: 'Vitrine rápida, busca inteligente e um checkout em poucas etapas, pensado primeiro para o celular.',
    delivery: 'E-commerce headless com gestão de catálogo, pagamentos e logística integrados.',
  },
  {
    slug: 'synapse-ia',
    name: 'Synapse IA',
    category: 'Inteligência Artificial',
    description: 'Assistente inteligente que automatiza o atendimento e qualifica leads.',
    art: 'ai',
    hue: ['#8b5cf6', '#22d3ee'],
    year: '2026',
    segment: 'Atendimento & Vendas',
    services: ['Automação', 'Integração com IA', 'Chatbots'],
    stack: ['Python', 'LLMs', 'Next.js'],
    challenge: 'Responder rapidamente a um volume crescente de contatos sem perder o tom humano da marca.',
    solution: 'Assistente treinado com a base de conhecimento da empresa, integrado aos canais e ao CRM.',
    delivery: 'Automação em produção com painel de conversas, métricas e ajustes contínuos.',
  },
];

export const PROCESS_STEPS = [
  {
    number: '01',
    title: 'Planejamento',
    description: 'Entendemos suas necessidades, seus objetivos e o público que você quer alcançar.',
  },
  {
    number: '02',
    title: 'Design',
    description: 'Criamos a experiência visual ideal, com identidade, clareza e propósito.',
  },
  {
    number: '03',
    title: 'Desenvolvimento',
    description: 'Transformamos o design em código com tecnologia de ponta e alta performance.',
  },
  {
    number: '04',
    title: 'Entrega',
    description: 'Testamos, otimizamos e colocamos seu projeto no ar — e seguimos ao seu lado.',
  },
];
