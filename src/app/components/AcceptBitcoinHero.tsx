'use client';

import React from 'react';
import Image from 'next/image';
import { motion, easeOut } from 'framer-motion';

export default function AcceptBitcoinHero() {
  const textVariants = {
    hidden: { opacity: 0, x: -50 },
    show: { opacity: 1, x: 0, transition: { duration: 0.8, ease: easeOut } },
  };

  const imageVariants = {
    hidden: { opacity: 0, x: 50 },
    show: { opacity: 1, x: 0, transition: { duration: 0.8, ease: easeOut, delay: 0.2 } },
  };

  return (
    <section className="relative grid md:grid-cols-2 gap-12 lg:gap-20 items-center mb-20">
      {/* Text Column */}
      <motion.div
        className="flex flex-col gap-8 relative z-10"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.3 }}
        variants={textVariants}
      >
        <div className="inline-block relative">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
            Pourquoi accepter <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-orange to-brand-accent">Bitcoin ?</span>
          </h1>
          <div className="absolute -z-10 top-1/2 left-0 w-32 h-32 bg-brand-orange/20 blur-3xl rounded-full"></div>
        </div>

        <div className="space-y-6 text-lg text-gray-400 leading-relaxed text-justify">
          <p>
            Adopter Bitcoin dans son commerce, c&apos;est proposer à ses clients une solution de paiement <span className="text-white font-semibold">moderne, rapide et sécurisée</span>, tout en attirant une clientèle avisée et fidèle, soucieuse de soutenir les entreprises innovantes.
          </p>
          <p>
            De plus, contrairement aux paiements traditionnels, les transactions en bitcoin sont <span className="text-brand-orange">instantanées</span> et ne nécessitent aucun intermédiaire, ce qui réduit les frais bancaires et renforce votre autonomie financière. Chaque paiement est donc définitif et sécurisé, vous garantissant une meilleure maîtrise de votre activité.
          </p>
          <div className="glass-panel p-6 rounded-2xl border border-white/5 bg-white/5 mt-4">
            <p className="text-gray-300 text-sm italic">
              &ldquo;Pour ce faire, la communauté a conçu des tutoriels et flyers permettant d&apos;accepter Bitcoin dans son commerce en une vingtaine de minutes, gratuitement et en toute autonomie.&rdquo;
            </p>
          </div>
        </div>
      </motion.div>

      {/* Image Column */}
      <motion.div
        className="relative group"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.3 }}
        variants={imageVariants}
      >
        <div className="absolute inset-0 bg-brand-orange/20 blur-[50px] rounded-full opacity-50 group-hover:opacity-70 transition-opacity duration-700"></div>
        <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-white/10 glass-panel">
          <Image
            src="/accepte.png"
            alt="Accepter Bitcoin au Bénin"
            width={600}
            height={600}
            className="w-full h-auto transform group-hover:scale-105 transition-transform duration-700"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
        </div>
      </motion.div>
    </section>
  );
}
