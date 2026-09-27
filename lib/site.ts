export const SITE = {
  name: 'Duvion Software',
  shortName: 'Duvion',
  tagline: 'Tecnologia que transforma.',
  description:
    'Na Duvion Software, desenvolvemos soluções digitais personalizadas que conectam marcas, pessoas e resultados. Sites, sistemas, aplicativos e muito mais.',
  whatsapp: {
    display: '(44) 99840-0729',
    href: 'https://wa.me/5544998400729',
  },
  author: 'Eduardo de P. Campos',
  location: 'Brasil · Atendimento remoto em todo o país',
  hours: 'Seg. a Sex. · 9h às 18h',
  social: [
    { label: 'Instagram', href: 'https://www.instagram.com/duduu_camposs/', icon: 'instagram' },
    { label: 'WhatsApp', href: 'https://wa.me/5544998400729', icon: 'whatsapp' },
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

export interface Project {
  slug: string;
  name: string;
  category: string;
  description: string;
  image: string;
  url: string;
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
    slug: 'pinho-engenharia',
    name: 'Pinho Engenharia',
    category: 'Landing Page',
    description: 'Presença digital de alto padrão para uma construtora que transforma projetos em obras memoráveis.',
    image: '/projetos/pinho-engenharia.webp',
    url: 'https://projetoscode.github.io/pinho-engenharia/',
    year: '2026',
    segment: 'Engenharia & Construção',
    services: ['UX/UI Design', 'Desenvolvimento Web', 'Motion Design'],
    stack: ['HTML', 'CSS', 'JavaScript'],
    challenge:
      'Transmitir, logo no primeiro contato, a precisão técnica e o acabamento premium que a construtora entrega em cada obra.',
    solution:
      'Visual escuro com detalhes dourados, elemento 3D no hero e seções claras para serviços, diferenciais, processo e portfólio de obras.',
    delivery: 'Landing page responsiva, rápida e com chamadas diretas para orçamento pelo WhatsApp.',
  },
  {
    slug: 'brothers-barbearia',
    name: 'Brothers Barbearia',
    category: 'Landing Page',
    description: 'Experiência premium para uma barbearia que une estilo, precisão e atitude em cada corte.',
    image: '/projetos/brothers-barbearia.webp',
    url: 'https://projetoscode.github.io/brothers-barbearia/',
    year: '2026',
    segment: 'Beleza & Cuidados Masculinos',
    services: ['Identidade Visual Digital', 'Desenvolvimento Web', 'Animações'],
    stack: ['HTML', 'CSS', 'JavaScript'],
    challenge: 'Posicionar a barbearia como premium e facilitar o agendamento para quem chega pelo celular.',
    solution:
      'Tipografia elegante, paleta azul-noite com dourado, cards interativos de serviços e galeria que mostra o resultado de cada corte.',
    delivery: 'Site responsivo com agendamento em um toque pelo WhatsApp e animações suaves ao rolar a página.',
  },
  {
    slug: 'calle',
    name: 'Calle',
    category: 'Landing Page',
    description: 'Vitrine editorial para uma boutique de moda feminina autoral.',
    image: '/projetos/calle.webp',
    url: 'https://projetoscode.github.io/calle/',
    year: '2026',
    segment: 'Moda & Varejo',
    services: ['Direção de Arte', 'Desenvolvimento Web', 'Motion Design'],
    stack: ['HTML', 'CSS', 'JavaScript'],
    challenge: 'Levar para o digital a sofisticação da boutique e transformar a admiração pelas peças em vendas.',
    solution:
      'Estética de revista de moda, com vídeo em preto e branco, tipografia serifada e uma narrativa que acompanha a história de cada cliente.',
    delivery: 'Landing page imersiva com compra direta pelo WhatsApp, pensada primeiro para o celular.',
  },
  {
    slug: 'elivelton-polimentos',
    name: 'Elivelton Polimentos',
    category: 'Landing Page',
    description: 'Estúdio de estética automotiva apresentado com o mesmo cuidado de ourives aplicado a cada carro.',
    image: '/projetos/elivelton-polimentos.webp',
    url: 'https://projetoscode.github.io/elivelton-polimentos/',
    year: '2026',
    segment: 'Estética Automotiva',
    services: ['UX/UI Design', 'Desenvolvimento Web', 'Vídeo & Galeria'],
    stack: ['HTML', 'CSS', 'JavaScript'],
    challenge:
      'Mostrar a qualidade de serviços técnicos como PPF, coating cerâmico e martelinho de ouro para quem não conhece o processo.',
    solution:
      'Hero em vídeo, galeria de antes e depois, reels do dia a dia do estúdio e uma seção dedicada aos cursos de formação profissional.',
    delivery: 'Landing page responsiva com contato direto pelo WhatsApp e conteúdo que valoriza cada trabalho entregue.',
  },
  {
    slug: 'nutritiva',
    name: 'Nutritiva',
    category: 'Landing Page',
    description: 'Loja de produtos naturais e suplementos com vitrine clara e pedido rápido.',
    image: '/projetos/nutritiva.webp',
    url: 'https://projetoscode.github.io/nutritiva-site/',
    year: '2026',
    segment: 'Saúde & Bem-estar',
    services: ['UX/UI Design', 'Desenvolvimento Web', 'SEO Local'],
    stack: ['HTML', 'CSS', 'JavaScript'],
    challenge: 'Organizar um catálogo amplo de suplementos e produtos naturais de forma simples para toda a família.',
    solution:
      'Vitrine com fotos reais dos produtos, categorias como imunidade, performance, emagrecimento e linha kids, e visual leve em tons de verde.',
    delivery: 'Site responsivo, otimizado para buscas em Campo Mourão, com pedidos direto pelo WhatsApp.',
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
