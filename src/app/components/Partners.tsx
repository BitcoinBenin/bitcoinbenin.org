'use client';

import { PARTNERS } from '../data';
import { motion, easeOut } from 'framer-motion';
import Image from 'next/image';

export default function Partners() {
  const partners = PARTNERS;

  const sectionVariants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.1 } },
  };

  const titleVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: easeOut } },
  };

  const logoGridVariants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.1 } },
  };

  const logoVariants = {
    hidden: { opacity: 0, scale: 0.5 },
    show: { opacity: 1, scale: 1, transition: { duration: 0.4, ease: easeOut } },
  };

  return (
    <motion.section 
      className="bg-gradient-to-br from-[#F5F9F6] to-[#E8F5E9] py-24 sm:py-32"
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
      variants={sectionVariants}
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div 
          className="mx-auto max-w-2xl text-center w-full"
          variants={titleVariants}
        >
          <h2 className="text-4xl font-bold tracking-tight text-[#0A0F0C] sm:text-5xl text-center w-full mb-4">
            Nos partenaires & soutiens
          </h2>
          <p className="mt-6 text-lg leading-8 text-gray-600 text-center w-full max-w-3xl mx-auto">
            Nous collaborons avec des acteurs de l’écosystème Bitcoin, des universités et
            des communautés locales pour promouvoir l’adoption du Bitcoin au Bénin.
          </p>
        </motion.div>
        <motion.div 
          className="mx-auto mt-16 flex flex-wrap justify-center items-center gap-12"
          variants={logoGridVariants}
        >
          {partners.map((partner) => (
            <motion.div
              key={partner.name}
              className="flex flex-col items-center justify-center p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-110 w-40"
              variants={logoVariants}
            >
              <div className="flex items-center justify-center w-full h-20">
                <Image 
                  src={partner.logo} 
                  alt={`${partner.name} logo`}
                  width={140}
                  height={80}
                  className="object-contain w-auto h-auto max-w-full max-h-full"
                />
              </div>
              <p className="text-base font-semibold text-gray-800 mt-3 text-center">{partner.name}</p>
            </motion.div>
          ))}
        </motion.div>
        <motion.div 
          className="mt-20 text-center w-full"
          variants={titleVariants}
        >
          <a
            href="#"
            className="btn-primary-green text-white font-bold py-4 px-8 rounded-xl text-lg transform hover:scale-105 transition-all duration-300 inline-block mx-auto shadow-lg hover:shadow-xl"
          >
            Devenir partenaire
          </a>
        </motion.div>
      </div>
    </motion.section>
  );
}
