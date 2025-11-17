import type { Metadata } from "next";
// import { Inter } from "next/font/google"; // Désactivé en cas de problème de connexion
import TopBanner from "./components/TopBanner";
import Header from "./components/Header";
import Footer from "./components/Footer";
import AccessibilityPreferences from "./components/AccessibilityPreferences";
import "./globals.css";

// Utilisation d'une font système en attendant
const interFont = {
  className: 'font-sans',
};

export const metadata: Metadata = {
  title: {
    default: "Bitcoin Bénin - Communauté Bitcoin au Bénin",
    template: "%s | Bitcoin Bénin"
  },
  description: "Site officiel Bitcoin Bénin - Découvrez, apprenez et développez l'écosystème Bitcoin au Bénin. Rejoignez notre communauté pour des événements, des ressources éducatives et des opportunités commerciales.",
  keywords: ["Bitcoin", "Bénin", "cryptomonnaie", "communauté", "éducation", "événement", "adoption"],
  authors: [{ name: "Bitcoin Bénin" }],
  creator: "Bitcoin Bénin",
  publisher: "Bitcoin Bénin",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: "https://bitcoinbenin.org",
    title: "Bitcoin Bénin - Communauté Bitcoin au Bénin",
    description: "Site officiel Bitcoin Bénin - Découvrez, apprenez et développez l'écosystème Bitcoin au Bénin. Rejoignez notre communauté pour des événements, des ressources éducatives et des opportunités commerciales.",
    siteName: "Bitcoin Bénin",
  },
  twitter: {
    card: "summary_large_image",
    title: "Bitcoin Bénin - Communauté Bitcoin au Bénin",
    description: "Site officiel Bitcoin Bénin - Découvrez, apprenez et développez l'écosystème Bitcoin au Bénin.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className={`${interFont.className} bg-gray-900 text-white antialiased`}>
        <AccessibilityPreferences />
        <TopBanner />
        <Header />
        <main id="main-content">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
