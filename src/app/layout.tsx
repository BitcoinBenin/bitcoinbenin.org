import type { Metadata } from "next";
import { Inter, Orbitron, JetBrains_Mono } from "next/font/google";
import Script from 'next/script';
import Header from "./components/Header";
import Footer from "./components/Footer";
import AccessibilityPreferences from "./components/AccessibilityPreferences";
import "./globals.css";

const inter = Inter({ 
  subsets: ["latin"], 
  variable: '--font-inter',
  display: 'swap',
  preload: true
});
const orbitron = Orbitron({ 
  subsets: ["latin"], 
  variable: '--font-orbitron', 
  display: 'swap',
  preload: false
});
const jetbrainsMono = JetBrains_Mono({ 
  subsets: ["latin"], 
  variable: '--font-jetbrains-mono', 
  display: 'swap',
  preload: false
});

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
      <head>
        <link rel="preconnect" href="https://hgnwadiljauqbhsbtxkk.supabase.co" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <style dangerouslySetInnerHTML={{
          __html: `
            body{color:#f8fafc;background:#020617;font-family:'Inter',sans-serif;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale}
            ::-webkit-scrollbar{width:8px}
            ::-webkit-scrollbar-track{background:#020617}
            ::-webkit-scrollbar-thumb{background:#334155;border-radius:4px}
            ::-webkit-scrollbar-thumb:hover{background:#53CB60}
            .text-xl{font-size:1.25rem;line-height:1.75rem}
            .md\\:text-2xl{font-size:1.5rem;line-height:2rem}
            .text-gray-300{color:#d1d5db}
            .max-w-3xl{max-width:48rem}
            .mx-auto{margin-left:auto;margin-right:auto}
            .mb-12{margin-bottom:3rem}
            .leading-relaxed{line-height:1.625}
            .selection\\:bg-brand-green::selection{background-color:#53CB60}
            .selection\\:text-white::selection{color:#ffffff}
          `
        }} />
      </head>
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