import type { Metadata } from "next";
import { Inter, Orbitron, JetBrains_Mono } from "next/font/google";
import Script from 'next/script';
import Header from "./components/Header";
import Footer from "./components/Footer";
import AccessibilityPreferences from "./components/AccessibilityPreferences";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: '--font-inter' });
const orbitron = Orbitron({ subsets: ["latin"], variable: '--font-orbitron', display: 'swap' });
const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], variable: '--font-jetbrains-mono', display: 'swap' });

export const metadata: Metadata = {
  title: {
    default: "Bitcoin Bénin - Communauté Bitcoin au Bénin",
    template: "%s | Bitcoin Bénin"
  },
  description: "Site officiel Bitcoin Bénin - Découvrez, apprenez et développez l'écosystème Bitcoin au Bénin.",
  keywords: ["Bitcoin", "Bénin", "cryptomonnaie", "communauté", "éducation", "événement", "adoption"],
  metadataBase: new URL('https://bitcoinbenin.org'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    url: 'https://bitcoinbenin.org',
    siteName: 'Bitcoin Bénin',
    title: 'Bitcoin Bénin - Communauté Bitcoin au Bénin',
    description: "Site officiel Bitcoin Bénin - Découvrez, apprenez et développez l'écosystème Bitcoin au Bénin.",
    locale: 'fr_FR',
    images: [
      {
        url: '/8543eb7d1ba409ca6f0030d7180e88cd237fc221-1200x630-1-uai-720x540.jpg',
        width: 1200,
        height: 630,
        alt: 'Bitcoin Bénin',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bitcoin Bénin - Communauté Bitcoin au Bénin',
    description: "Site officiel Bitcoin Bénin - Découvrez, apprenez et développez l'écosystème Bitcoin au Bénin.",
    images: ['/8543eb7d1ba409ca6f0030d7180e88cd237fc221-1200x630-1-uai-720x540.jpg'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="scroll-smooth">
      <body className={`${inter.variable} ${orbitron.variable} ${jetbrainsMono.variable} font-sans bg-brand-dark text-gray-300 antialiased selection:bg-brand-green selection:text-white overflow-x-hidden`}>
        <Script
          id="structured-data"
          type="application/ld+json"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([
              {
                '@context': 'https://schema.org',
                '@type': 'Organization',
                name: 'Bitcoin Bénin',
                url: 'https://bitcoinbenin.org',
                logo: 'https://bitcoinbenin.org/favicon.ico',
                sameAs: ['https://x.com/bitcoinbenin'],
              },
              {
                '@context': 'https://schema.org',
                '@type': 'WebSite',
                name: 'Bitcoin Bénin',
                url: 'https://bitcoinbenin.org',
                inLanguage: 'fr',
              },
            ]),
          }}
        />
        {/* Simple Background */}
        <div className="fixed inset-0 z-[-1] bg-premium-gradient"></div>
        <div className="fixed top-0 left-0 w-full h-[500px] bg-brand-green/5 blur-[120px] rounded-full translate-y-[-50%] pointer-events-none opacity-40"></div>

        <div className="relative flex min-h-screen flex-col">
          {/* <TopBanner />  Preserve if needed, but maybe hide for "Pure Tech" look? keeping for now */}
          {/* TopBanner moved to Header */}
          <Header />
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
        </div>
        <AccessibilityPreferences />
      </body>
    </html>
  );
}