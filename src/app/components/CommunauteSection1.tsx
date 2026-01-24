"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, easeOut } from 'framer-motion';

export default function Communautesection1() {

  const sectionVariants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.2 } },
  };

  const imageVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    show: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: easeOut } },
  };

  return (
    <motion.section
      className="py-12 px-4 md:px-6 relative overflow-hidden"
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
      variants={sectionVariants}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Galerie d'images */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { src: "/Events.jpg", desc: "Trezor Academy – 11/09/2025" },
            { src: "/event2.jpg", desc: "Conférence Équipe – 13-15 sept. 2025" },
            { src: "/event3.jpg", desc: "Atelier Multisig – 11/10/2025" }
          ].map((item, index) => (
            <motion.div
              key={index}
              className="group relative rounded-2xl overflow-hidden shadow-lg border border-white/5"
              variants={imageVariants}
            >
              <div className="relative h-64 w-full overflow-hidden">
                <Image
                  src={item.src}
                  alt={item.desc}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                <p className="text-center text-sm font-medium text-white/90">
                  {item.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Boutons centrés */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-6 mt-16">

          <Link
            href="/events"
            className="px-8 py-3 rounded-full font-bold text-white bg-gradient-to-r from-brand-orange to-brand-accent shadow-glow hover:shadow-glow-hover hover:scale-105 transition-all duration-300 min-w-[200px] text-center"
          >
            NOS ÉVÈNEMENTS
          </Link>

          <Link
            href="/nous-soutenir"
            className="px-8 py-3 rounded-full font-bold text-white bg-white/5 border border-white/10 hover:bg-white/10 hover:border-brand-orange/50 transition-all duration-300 min-w-[200px] text-center"
          >
            NOUS SOUTENIR
          </Link>

          <Link
            href="/statistiques"
            className="px-8 py-3 rounded-full font-bold text-gray-300 bg-transparent border border-gray-600 hover:text-white hover:border-white transition-all duration-300 min-w-[200px] text-center"
          >
            STATISTIQUES
          </Link>

        </div>

        <div className="w-full h-px bg-white/10 mt-20"></div>
      </div>
    </motion.section>
  );
}