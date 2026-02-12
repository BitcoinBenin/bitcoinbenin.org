'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { AnimatedWrapper, TypewriterText } from './Animations';
import { useState, useEffect } from 'react';

export default function Hero() {
  const [showSubtitle, setShowSubtitle] = useState(false);

  // Afficher le sous-titre après que le titre soit complètement tapé
  useEffect(() => {
    const timer = setTimeout(() => setShowSubtitle(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="relative min-h-screen text-white flex items-center justify-center overflow-hidden">
      {/* Background image optimisée */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/hero.png"
          alt="Hero background"
          fill
          sizes="100vw"
          style={{ objectFit: 'cover', objectPosition: 'center' }}
          priority
          quality={75}
        />
      </div>
      
      {/* Overlay avec gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/95 via-black/85 to-black/75 z-10"></div>

      <div className="relative z-20 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center mt-20">
        {/* Titre principal avec effet typewriter */}
        <div className="mb-6">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight">
            <span className="block text-white mb-2">
              <TypewriterText text="Communauté Bitcoin" speed={0.1} />
            </span>
            <span className="block bg-gradient-to-r from-brand-green to-brand-accent bg-clip-text text-transparent">
              <TypewriterText text="Bénin" speed={0.1} delay={0.5} />
            </span>
          </h1>
        </div>

        {/* Sous-titre avec effet typewriter */}
        {showSubtitle && (
          <AnimatedWrapper
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 }
            }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-12 leading-relaxed">
              <TypewriterText 
                text="Rejoignez une communauté active qui transforme l'éducation, l'innovation et l'adoption Bitcoin dans tout le pays." 
                speed={0.05} 
              />
            </p>
          </AnimatedWrapper>
        )}

        {/* Boutons d'action */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <a
            href="https://x.com/bitcoinbenin"
            className="inline-flex items-center justify-center bg-gradient-to-r from-brand-green to-brand-accent hover:from-brand-green-dark hover:to-brand-green text-white font-semibold px-9 py-4 rounded-lg shadow-lg hover:shadow-glow transform hover:scale-105 transition-all duration-300 text-base"
          >
            <span className="flex items-center gap-2">
              Rejoindre la communauté
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </span>
          </a>
          
          <a
            href="/nous-soutenir"
            className="inline-flex items-center justify-center border-2 border-white/30 text-white hover:bg-white/10 hover:border-white/50 backdrop-blur-sm font-semibold px-9 py-4 rounded-lg transform hover:scale-105 transition-all duration-300 text-base"
          >
            Nous soutenir
          </a>
        </div>

        {/* Stats ou indicateurs sociaux */}
        <div className="grid grid-cols-3 gap-8 mt-16 max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-center"
          >
            <div className="text-3xl font-bold text-brand-green mb-2">1000+</div>
            <div className="text-sm text-gray-400">Membres</div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-center"
          >
            <div className="text-3xl font-bold text-brand-green mb-2">50+</div>
            <div className="text-sm text-gray-400">Événements</div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-center"
          >
            <div className="text-3xl font-bold text-brand-green mb-2">12</div>
            <div className="text-sm text-gray-400">Villes</div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
