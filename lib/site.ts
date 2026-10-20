const WHATSAPP_NUMBER = '5544998400729';

/** wa.me link with a pre-filled message. */
export function whatsappLink(message = 'Olá, Eduardo! Vim pelo site da Duvion Softwares e quero conversar sobre um projeto.') {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export const SITE = {
  name: 'Duvion Softwares',
  shortName: 'Duvion',
  tagline: 'Tecnologia que transforma.',
  description:
    'Na Duvion Softwares, desenvolvemos soluções digitais personalizadas que conectam marcas, pessoas e resultados. Sites, landing pages e automações para empresas.',
  whatsapp: {
    display: '(44) 99840-0729',
    href: `https://wa.me/${WHATSAPP_NUMBER}`,
  },
  instagram: {
    handle: '@duvion_softwares',
    href: 'https://www.instagram.com/duvion_softwares/',
  },
  author: 'Eduardo de P. Campos',
  location: 'Brasil · Atendimento remoto em todo o país',
  hours: 'Seg. a Sex. · 9h às 18h',
  social: [
    { label: 'Instagram', href: 'https://www.instagram.com/duvion_softwares/', icon: 'instagram' },
    { label: 'WhatsApp', href: `https://wa.me/${WHATSAPP_NUMBER}`, icon: 'whatsapp' },
  ],
} as const;

export type SocialIconName = (typeof SITE.social)[number]['icon'];

export const NAV_LINKS = [
  { label: 'Início', href: '/#inicio', section: 'inicio' },
  { label: 'Sobre', href: '/#sobre', section: 'sobre' },
  { label: 'Serviços', href: '/#servicos', section: 'servicos' },
  { label: 'Portfólio', href: '/#projetos', section: 'projetos' },
  { label: 'Contato', href: '/contato', section: 'contato' },
] as const;

export const ABOUT = {
  paragraphs: [
    'Sou Eduardo de P. Campos, fundador da Duvion Softwares. Crio sites, landing pages e automações para empresas que querem crescer no digital — com design que impressiona e tecnologia que funciona.',
    'Cada projeto é feito sob medida: entendo o seu negócio, desenho a experiência e desenvolvo tudo com foco em performance, clareza e resultado. Do primeiro contato à entrega, você fala direto comigo.',
  ],
};

export type ServiceIconName = 'globe' | 'rocket' | 'flow';

export interface Service {
  id: string;
  title: string;
  description: string;
  icon: ServiceIconName;
  features: string[];
  /** Label of the WhatsApp link on the card. */
  cta: string;
}

export const SERVICES: Service[] = [
  {
    id: 'sites',
    title: 'Sites',
    description: 'Sua marca no digital com um site moderno e responsivo.',
    icon: 'globe',
    features: ['Site institucional completo', 'Design sob medida para a sua marca', 'SEO e performance desde o início'],
    cta: 'Quero um site',
  },
  {
    id: 'landing-pages',
    title: 'Landing Pages',
    description: 'Páginas estratégicas para transformar visitantes em clientes.',
    icon: 'rocket',
    features: ['Estrutura pensada para conversão', 'Integração com WhatsApp e anúncios', 'Carregamento rápido no celular'],
    cta: 'Quero uma landing page',
  },
  {
    id: 'automacoes',
    title: 'Automações',
    description: 'Automação e inteligência para aumentar seus resultados.',
    icon: 'flow',
    features: ['Atendimento automático no WhatsApp', 'Agendamento online integrado', 'Bots de orçamento que respondem na hora'],
    cta: 'Quero automatizar',
  },
];

export interface Testimonial {
  quote: string;
  name: string;
  role: string;
}

/**
 * Depoimentos reais de clientes. A seção só aparece no site quando houver itens aqui —
 * nunca publique depoimentos inventados.
 */
export const TESTIMONIALS: Testimonial[] = [];

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
    slug: 'conquista-ambientes-planejados',
    name: 'Conquista Ambientes Planejados',
    category: 'Site Institucional',
    description: 'Móveis planejados em Goioerê (PR) apresentados com uma cozinha 3D renderizada em tempo real.',
    image: '/projetos/conquista-ambplan.webp',
    url: 'https://conquista-ambplan.vercel.app/',
    year: '2026',
    segment: 'Móveis Planejados',
    services: ['UX/UI Design', 'Desenvolvimento Web', '3D Interativo'],
    stack: ['Next.js', 'React', 'Three.js'],
    challenge: 'Fazer o cliente enxergar o valor de um ambiente sob medida antes mesmo da primeira visita.',
    solution: 'Cozinha conceitual em 3D com pontos interativos, guia por ambiente — cozinhas, dormitórios, closets, banheiros — e uma seção de texturas e acabamentos.',
    delivery: 'Site responsivo com orçamento direto pelo WhatsApp, perguntas frequentes e SEO local para Goioerê.',
  },
  {
    slug: 'aa-polimentos-especiais',
    name: 'AA Polimentos Especiais',
    category: 'Landing Page',
    description: 'Estética automotiva premium com carro 3D interativo e simulação de correção de pintura.',
    image: '/projetos/aa-polimentos.webp',
    url: 'https://aa-polimentos-experience.vercel.app/',
    year: '2026',
    segment: 'Estética Automotiva',
    services: ['Direção de Arte', 'Desenvolvimento Web', '3D Interativo'],
    stack: ['Next.js', 'Three.js', 'Lenis'],
    challenge: 'Explicar a diferença entre polimento, correção de pintura e vitrificação para quem só enxerga o brilho final.',
    solution: 'Carro 3D com pontos de serviço, uma simulação em que o visitante arrasta para corrigir riscos na pintura e um anel para escolher cada serviço.',
    delivery: 'Experiência imersiva e responsiva, com contato direto pelo WhatsApp.',
  },
  {
    slug: 'villa-arbo-eventos',
    name: 'Villa Arbo Eventos',
    category: 'Landing Page',
    description: 'Espaço de eventos na natureza em Londrina (PR), apresentado como um percurso 3D capítulo a capítulo.',
    image: '/projetos/villa-arbo.webp',
    url: 'https://vila-arbo.vercel.app/',
    year: '2026',
    segment: 'Eventos & Celebrações',
    services: ['Storytelling', 'Desenvolvimento Web', '3D Interativo'],
    stack: ['Next.js', 'React', 'Three.js'],
    challenge: 'Transmitir a atmosfera de um espaço na natureza para quem ainda não o conhece pessoalmente.',
    solution: 'Narrativa guiada pelo scroll, com portais 3D que conduzem o visitante pela natureza, pela luz, pelo buffet e pela estrutura da Villa.',
    delivery: 'Landing page imersiva com chamadas para orçamento de casamentos, aniversários e eventos corporativos.',
  },
  {
    slug: 'imoveis-leandro',
    name: 'Imóveis Leandro',
    category: 'Site Institucional',
    description: 'Imóveis de médio e alto padrão com uma casa 3D no hero e busca por tipo, região e código.',
    image: '/projetos/imoveis-leandro.webp',
    url: 'https://imoveis-leandro.vercel.app/',
    year: '2026',
    segment: 'Mercado Imobiliário',
    services: ['UX/UI Design', 'Desenvolvimento Web', '3D Interativo'],
    stack: ['Next.js', 'React', 'Three.js'],
    challenge: 'Apresentar imóveis de alto padrão com a calma que uma decisão desse tamanho pede, mantendo o corretor perto do cliente.',
    solution: 'Casa contemporânea em 3D no hero, busca por finalidade, tipo, região e código, e fichas com fotografias de cada ambiente.',
    delivery: 'Site responsivo com contato direto com o corretor e agendamento de visitas pelo WhatsApp.',
  },
  {
    slug: 'bm-cars',
    name: 'BM Cars',
    category: 'Site Institucional',
    description: 'Vitrine de seminovos, máquinas agrícolas e pneus com negociação direta pelo WhatsApp.',
    image: '/projetos/bmcars.webp',
    url: 'https://bmcars-sand.vercel.app/',
    year: '2026',
    segment: 'Seminovos & Agronegócio',
    services: ['UX/UI Design', 'Desenvolvimento Web', 'Vitrine Digital'],
    stack: ['Next.js', 'React'],
    challenge: 'Reunir três negócios diferentes — seminovos, máquinas agrícolas e pneus — sem confundir quem chega procurando um deles.',
    solution: 'Vitrines com fotos e especificações de cada veículo e máquina, cotação de pneus pela medida e mensagens de WhatsApp que já saem com o item identificado.',
    delivery: 'Site responsivo que leva o cliente da vitrine à negociação em poucos toques.',
  },
  {
    slug: 'buffet-requinte',
    name: 'Buffet Requinte',
    category: 'Landing Page',
    description: 'Buffet para eventos em Boa Esperança (PR) com visual elegante e orçamento pelo WhatsApp.',
    image: '/projetos/buffet-requinte.webp',
    url: 'https://buffet-requinte.vercel.app/',
    year: '2026',
    segment: 'Gastronomia & Eventos',
    services: ['Direção de Arte', 'Desenvolvimento Web', 'Motion Design'],
    stack: ['Next.js', 'React'],
    challenge: 'Mostrar o cuidado do buffet em cada etapa da festa e transformar o interesse em pedidos de orçamento.',
    solution: 'Seções por tipo de celebração — casamentos, aniversários, 15 anos e eventos corporativos —, galeria gastronômica e um passo a passo de como contratar.',
    delivery: 'Site responsivo, com perguntas frequentes e pedido de orçamento em um toque pelo WhatsApp.',
  },
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

/** Numbers shown in the "Sobre" counters — derived from the real data above. */
export const STATS = [
  { value: PROJECTS.length, suffix: '', label: 'Projetos entregues' },
  { value: new Set(PROJECTS.map((p) => p.segment)).size, suffix: '', label: 'Segmentos atendidos' },
  { value: 100, suffix: '%', label: 'Sites responsivos' },
];
