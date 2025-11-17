"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, easeOut } from 'framer-motion';

export default function Communautesection1() {

  const sectionVariants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.2 } },
  };

  const imageGridVariants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.2 } },
  };

  const imageVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    show: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: easeOut } },
  };

  const buttonsVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: easeOut, delay: 0.6 } },
  };

  return (
    <motion.section 
      className="bg-anthracite text-white py-12 px-4 md:px-6"
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
      variants={sectionVariants}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Galerie d'images */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start"
          variants={imageGridVariants}
        >
          <motion.div className="rounded-lg overflow-hidden shadow-lg" variants={imageVariants}>
            <Image
              src="/Events.jpg"
              alt="Meet-up"
              className="w-full h-64 object-cover rounded-lg"
              width={1200}
              height={800}
            />
            <p className="text-center text-sm italic text-gray-300 mt-3">
              Trezor Academy – le 11/09/2025.
            </p>
          </motion.div>

          <motion.div className="rounded-lg overflow-hidden shadow-lg" variants={imageVariants}>
            <Image
              src="/event2.jpg"
              alt="Conférence"
              className="w-full h-64 object-cover rounded-lg"
              width={1200}
              height={800}
            />
            <p className="text-center text-sm italic text-gray-300 mt-3">
              Conférence Equipe Bitcoin Bénin – le 13 au 15 septembre 2025.
            </p>
          </motion.div>

          <motion.div className="rounded-lg overflow-hidden shadow-lg" variants={imageVariants}>
            <Image
              src="/event3.jpg"
              alt="Atelier"
              className="w-full h-64 object-cover rounded-lg"
              width={1200}
              height={800}
            />
            <p className="text-center text-sm italic text-gray-300 mt-3">
              Atelier &quot;Pratique pour découvrir et expérimenter le multising Bitcoin&quot; – le 11/10/2025.
            </p>
          </motion.div>
        </motion.div>

       {/* Boutons centrés */}
        <motion.div 
          className="flex flex-col md:flex-row items-center justify-center gap-8 mt-10"
          variants={buttonsVariants}
        >

  {/* Boutons orange -> hover noir */}
   <Link
    href="/events"
     className="bg-bitcoinOrange text-white px-8 md:px-10 py-3 rounded-full font-semibold tracking-wide shadow 
    transition-colors duration-300 hover:bg-black hover:text-orange-bitcoin"
    aria-label="Nos évènements"
  >
    NOS ÉVÈNEMENTS
   </Link>

  <Link
    href="/nous-soutenir"
    className="bg-bitcoinOrange text-white px-8 md:px-10 py-3 rounded-full font-semibold tracking-wide shadow 
    transition-colors duration-300 hover:bg-black hover:text-orange-bitcoin"
    aria-label="Nous soutenir"
  >
    NOUS SOUTENIR
   </Link>

          {/* Bouton noir -> hover orange */}
          <Link
            href="/statistiques"
            className="bg-black text-white border border-white px-8 md:px-10 py-3 rounded-full font-semibold tracking-wide 
            transition-colors duration-300 hover:bg-orange-bitcoin hover:text-black hover:border-orange-bitcoin inline-flex items-center justify-center"
            aria-label="Statistiques"
          >
            STATISTIQUES
          </Link>
        </motion.div>


        <div className="col-span-2 w-full h-[3px] bg-white opacity-30 mt-6"></div>
      </div>
    </motion.section>
  );
}