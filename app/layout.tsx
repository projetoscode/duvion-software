import type { Metadata, Viewport } from 'next';
import { Inter, Michroma, Sora } from 'next/font/google';
import type { ReactNode } from 'react';
import './globals.css';
import { SITE } from '@/lib/site';
import SmoothScroll from '@/components/providers/SmoothScroll';
import { PageTransitionProvider } from '@/components/animations/PageTransition';
import CustomCursor from '@/components/animations/CustomCursor';
import BackgroundCanvas from '@/components/3d/BackgroundCanvas';
import Navbar from '@/components/sections/Navbar';
import Footer from '@/components/sections/Footer';

const display = Sora({ subsets: ['latin'], weight: ['400', '500', '600', '700'], variable: '--font-display', display: 'swap' });
const body = Inter({ subsets: ['latin'], variable: '--font-body', display: 'swap' });
const brand = Michroma({ subsets: ['latin'], weight: '400', variable: '--font-brand', display: 'swap' });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'),
  title: {
    default: `${SITE.name} — Tecnologia que transforma ideias em experiências digitais`,
    template: `%s | ${SITE.name}`,
  },
  description: SITE.description,
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    siteName: SITE.name,
    title: SITE.name,
    description: SITE.description,
    images: [{ url: '/logo.png', width: 1536, height: 1024, alt: 'Duvion Software' }],
  },
};

export const viewport: Viewport = {
  themeColor: '#03040b',
  colorScheme: 'dark',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR" className={`${display.variable} ${body.variable} ${brand.variable}`} suppressHydrationWarning>
      <head>
        {/* Lets CSS hide elements that JS will animate in, without hiding them when JS is off. */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
      </head>
      <body className="font-body antialiased">
        <a href="#conteudo" className="skip-link">
          Pular para o conteúdo
        </a>
        <SmoothScroll>
          <PageTransitionProvider>
            <BackgroundCanvas />
            <CustomCursor />
            <Navbar />
            <div className="relative z-10">
              {children}
              <Footer />
            </div>
          </PageTransitionProvider>
        </SmoothScroll>
      </body>
    </html>
  );
}
