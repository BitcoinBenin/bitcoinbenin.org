import React from 'react';
import Image from 'next/image';

export default function AcceptBitcoinHero() {
  return (
    <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
      {/* Text Column */}
      <div className="flex flex-col gap-6">
        <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
          Pourquoi accepter Bitcoin ?
        </h1>
        <p className="text-base leading-relaxed text-gray-300">
          Adopter Bitcoin dans son commerce, c&apos;est proposer à ses clients une solution de paiement moderne, rapide et sécurisée, tout en attirant une clientèle avisée et fidèle, soucieuse de soutenir les entreprises innovantes. De plus, contrairement aux paiements traditionnels, les transactions en bitcoin sont instantannées et ne nécessitent aucun intermédiaire, ce qui réduit les frais bancaires et renforce votre autonomie financière. Chaque paiement est donc définitif et sécurisé, vous garantissant une meilleure maîtrise de votre activité.
        </p>
        <p className="text-base leading-relaxed text-gray-300">
          Pour ce faire, la communauté a conçu des tutoriels et flyers permettant d&apos;accepter Bitcoin dans son commerce en une vingtaine de minutes, gratuitement et en toute autonomie. De plus, si vous avez besoin d’aide, la communauté se tient disponible pour vous accompagner et vous former.
        </p>
      </div>
      {/* Image Column */}
      <div>
        <Image 
          src="/accepte.png"
          alt="Accepter Bitcoin au Bénin"
          width={600}
          height={600}
          className="rounded-2xl shadow-lg"
        />
      </div>
    </div>
  );
}
