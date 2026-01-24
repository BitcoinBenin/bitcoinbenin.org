'use client';

import Image from 'next/image';
import { motion, easeOut } from 'framer-motion';

export default function Communaute() {

  const sectionVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        ease: easeOut
      },
    },
  };

  const slideInLeft = {
    hidden: { opacity: 0, x: -50 },
    show: { opacity: 1, x: 0, transition: { duration: 0.8, ease: easeOut } },
  };

  const slideInRight = {
    hidden: { opacity: 0, x: 50 },
    show: { opacity: 1, x: 0, transition: { duration: 0.8, ease: easeOut } },
  };

  return (
    <motion.section
      className="relative py-20 md:py-32 overflow-hidden"
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.3 }}
      variants={sectionVariants}
    >
      {/* Background Ambience */}
      <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-brand-orange/5 blur-[120px] rounded-full pointer-events-none -translate-x-1/2 -translate-y-1/2"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center relative z-10">

        {/* Texte à gauche */}
        <motion.div
          className="flex flex-col gap-8 text-center md:text-left"
          variants={slideInLeft}
        >
          <div>
            <h2 className="text-4xl md:text-6xl font-bold text-white tracking-tight leading-tight">
              Qui sommes <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-orange to-brand-accent">nous ?</span>
            </h2>
          </div>

          <div className="space-y-6 text-lg text-gray-400 leading-relaxed">
            <p>
              Bitcoin Bénin est une communauté à but non lucratif œuvrant à
              l&apos;éducation sur Bitcoin au Bénin. Elle regroupe bitcoiners,
              néophytes et curieux souhaitant apprendre et partager dans un cadre
              ouvert à tous.
            </p>

            <p>
              Nous organisons mensuellement des rencontres gratuites, des
              conférences et des ateliers dans les écoles, universités et auprès
              des commerçants.
            </p>

            <p>
              Notre but : créer un réseau éducatif inclusif et décentralisé,
              permettant au plus grand nombre de comprendre la révolution
              Bitcoin, tant économique que technologique.
            </p>
          </div>
        </motion.div>

        {/* Image à droite */}
        <motion.div
          className="relative flex flex-col items-center md:items-end group"
          variants={slideInRight}
        >
          <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-white/5 bg-brand-dark/50">
            <div className="absolute inset-0 bg-brand-orange/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10"></div>
            <Image
              src="/association.jpg"
              alt="Première réunion officielle de la communauté"
              width={600}
              height={450}
              className="object-cover w-full h-full transform group-hover:scale-105 transition-transform duration-700"
              priority
            />
          </div>
          <p className="text-brand-orange/80 text-sm mt-4 font-mono">
            Première réunion officielle – 27/01/2024
          </p>
        </motion.div>

      </div>

      {/* Separator */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-24">
        <div className="w-full h-px bg-white/10"></div>
      </div>
    </motion.section>
  );
}