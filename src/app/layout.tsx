import type { Metadata } from "next";
import { Inter, Orbitron, JetBrains_Mono } from "next/font/google";
import Header from "./components/Header";
import Footer from "./components/Footer";
import AccessibilityPreferences from "./components/AccessibilityPreferences";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: '--font-inter' });
const orbitron = Orbitron({ subsets: ["latin"], variable: '--font-orbitron' });
const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], variable: '--font-jetbrains-mono' });

export const metadata: Metadata = {
  title: {
    default: "Bitcoin Bénin - Communauté Bitcoin au Bénin",
    template: "%s | Bitcoin Bénin"
  },
  description: "Site officiel Bitcoin Bénin - Découvrez, apprenez et développez l'écosystème Bitcoin au Bénin.",
  keywords: ["Bitcoin", "Bénin", "cryptomonnaie", "communauté", "éducation", "événement", "adoption"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="scroll-smooth">
      <body className={`${inter.variable} ${orbitron.variable} ${jetbrainsMono.variable} font-sans bg-brand-dark text-gray-300 antialiased selection:bg-brand-green selection:text-white overflow-x-hidden`}>
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
