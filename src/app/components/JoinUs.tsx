'use client';

import Image from 'next/image';
import InvertedWave from './InvertedWave';
import { motion, easeOut } from 'framer-motion';

export default function JoinUs() {

  const sectionVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: easeOut,
        when: "beforeChildren",
        staggerChildren: 0.3,
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

  return (
    <motion.section 
      className="relative bg-[#0D1117] text-white py-32 sm:py-48"
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.3 }}
      variants={sectionVariants}
    >
      <InvertedWave />
      <div className="max-w-7xl mx-auto px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
        
        {/* Left Column: Text and Buttons */}
        <motion.div 
          className="flex flex-col gap-8 text-center md:text-left"
          variants={slideInLeft}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-green-500 text-glow-green">
            Discutez, partagez, explorez
          </h2>
          <p className="text-lg leading-relaxed text-gray-300">
            Rejoignez notre communauté pour échanger, apprendre et construire ensemble. Sur
            Telegram, Discord, Twitter ou lors de nos meetups, vous trouverez des passionnés
            prêts à partager leurs expériences et leurs projets.
          </p>
          <p className="text-base text-gray-400 mt-2">
            De nombreuses ressources sont disponibles sur notre site. Prenez le temps d&apos;y
            faire un tour, et partagez vos trouvailles lors d&apos;un prochain événement !
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mt-6 justify-center md:justify-start">
            <a
              href="#"
              className="btn-primary-green text-white font-bold py-4 px-8 rounded-xl text-lg transform hover:scale-105 transition-all duration-300"
            >
              Nous rejoindre
            </a>
            <a
              href="#"
              className="btn-secondary-green-outline font-bold py-4 px-8 rounded-xl text-lg transform hover:scale-105 transition-all duration-300"
            >
              Nos ressources
            </a>
          </div>
        </motion.div>

        {/* Right Column: Image */}
        <motion.div 
          className="relative group"
          variants={slideInRight}
        >
          <div className="absolute -inset-0.5 bg-gradient-to-tr from-green-900/40 to-transparent rounded-2xl blur-lg group-hover:blur-xl transition-all duration-500 opacity-70 group-hover:opacity-100"></div>
          <div className="relative rounded-2xl shadow-2xl overflow-hidden">
            <Image
              src="/missions.png"
              alt="Rejoignez la communauté Bitcoin Benin"
              width={800}
              height={600}
              className="filter grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
            />
          </div>
        </motion.div>

      </div>
    </motion.section>
  );
}
