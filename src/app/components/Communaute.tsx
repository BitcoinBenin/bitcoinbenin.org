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
    hidden: { opacity: 0, x: -100 },
    show: { opacity: 1, x: 0, transition: { duration: 0.8, ease: easeOut } },
  };

  const slideInRight = {
    hidden: { opacity: 0, x: 100 },
    show: { opacity: 1, x: 0, transition: { duration: 0.8, ease: easeOut } },
  };

  const growWidth = {
    hidden: { width: '0%' },
    show: { width: '100%', transition: { duration: 1, ease: easeOut, delay: 0.5 } },
  };

  return (
    <motion.section 
      className="relative text-white py-16 md:py-24"
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.3 }}
      variants={sectionVariants}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center">

        {/* Texte à gauche */}
        <motion.div 
          className="flex flex-col gap-5 text-center md:text-left"
          variants={slideInLeft}
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-bitcoinOrange tracking-tight">
            Qui sommes-nous ?
          </h2>

          <p className="text-base sm:text-lg text-gray-300 leading-relaxed">
            Bitcoin Bénin est une communauté à but non lucratif œuvrant à
            l&apos;éducation sur Bitcoin au Bénin. Elle regroupe bitcoiners,
            néophytes et curieux souhaitant apprendre et partager dans un cadre
            ouvert à tous.
          </p>

          <p className="text-base sm:text-lg text-gray-300 leading-relaxed">
            Nous organisons mensuellement des rencontres gratuites, des
            conférences et des ateliers dans les écoles, universités et auprès
            des commerçants.
          </p>

          <p className="text-base sm:text-lg text-gray-300 leading-relaxed">
            Notre but : créer un réseau éducatif inclusif et décentralisé,
            permettant au plus grand nombre de comprendre la révolution
            Bitcoin, tant économique que technologique.
          </p>
        </motion.div>

        {/* Image à droite */}
        <motion.div 
          className="flex flex-col items-center md:items-end"
          variants={slideInRight}
        >
          <Image
            src="/association.jpg"
            alt="Première réunion officielle de la communauté"
            width={600}
            height={450}
            className="rounded-2xl shadow-2xl w-full max-w-[500px] object-cover"
            priority
          />
          <p className="text-gray-300 text-xs sm:text-sm mt-3 text-center md:text-right">
            Première réunion officielle de la communauté – le 27/01/2024.
          </p>
        </motion.div>

      </div>

      {/* Barre blanche sous le composant */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="w-full h-[3px] bg-white opacity-20 mt-10"
          variants={growWidth}
        ></motion.div>
      </div>
    </motion.section>
  );
}