import React from 'react';
import type { Metadata } from 'next';

import AcceptBitcoinHero from '../components/AcceptBitcoinHero';
import HowToIntegrate from '../components/HowToIntegrate';

export const metadata: Metadata = {
  title: "Accepter Bitcoin",
  description: "Découvrez comment accepter Bitcoin dans votre commerce au Bénin. Solutions de paiement, formations gratuites et accompagnement personnalisé pour les commerçants.",
};

export default function AcceptBitcoinPage() {
  return (
    <div className="bg-hero-gradient-dark text-gray-300 py-20 sm:py-32 pt-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <AcceptBitcoinHero />

        <div className="border-b border-gray-700 my-12"></div>

        <HowToIntegrate />

        {/* Call to Action Section */}
        <section className="bg-hero-gradient-dark text-white p-12 rounded-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-6">Besoin d&apos;aide ?</h2>
          <p className="text-base leading-8 text-gray-300 max-w-3xl mx-auto mb-8">
          La communauté Bitcoin Bénin vous accompagne gratuitement dans la mise en place de solutions de paiement Bitcoin pour votre commerce. Contactez-nous pour une consultation personnalisée.
          </p>
          <a
            href="mailto:bitcoinbenin@gmail.com" // Placeholder for contact link
            className="btn-primary-orange text-white font-bold py-3 px-6 rounded-lg text-base"
          >
            Contactez-nous
          </a>
        </section>
      </div>
    </div>
  );
}
