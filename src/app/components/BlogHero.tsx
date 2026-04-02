'use client';

import { motion } from 'framer-motion';
import { PageTransition } from './Animations';
import Image from 'next/image';
import { FaBook, FaTag, FaArrowRight } from 'react-icons/fa';
import Link from 'next/link';

interface BlogHeroProps {
  tagCount?: number;
  postCount?: number;
}

export default function BlogHero({ tagCount = 0, postCount = 0 }: BlogHeroProps) {
  return (
    <PageTransition>
      <section className="relative h-[80vh] md:h-[90vh] flex items-center justify-center overflow-hidden -mt-32 pt-32">
        {/* Image de fond avec overlay */}
        <div className="absolute inset-0">
          <Image
            src="/event-hero.webp"
            alt="Blog Bitcoin Bénin"
            fill
            className="object-cover"
            priority
            onError={(e) => {
              e.currentTarget.style.display = 'none';
              e.currentTarget.parentElement?.classList.add('bg-gradient-to-br', 'from-brand-dark', 'via-brand-charcoal', 'to-brand-dark');
            }}
          />
          {/* Overlay sombre pour lisibilité */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-brand-dark"></div>
        </div>

        {/* Contenu Hero */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-brand-green/10 backdrop-blur-md border border-brand-green/30 rounded-full px-4 py-2 mb-6">
              <FaBook className="text-brand-green" />
              <span className="text-brand-green font-medium text-sm">
                Restez informé
              </span>
            </div>

            {/* Titre principal */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-black text-white mb-6 leading-tight">
              Le Blog
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-green to-brand-accent ml-2 md:ml-4 block md:inline">
                Bitcoin Bénin
              </span>
            </h1>

            {/* Sous-titre */}
            <p className="text-lg md:text-xl lg:text-2xl text-gray-200 max-w-4xl mx-auto leading-relaxed mb-8">
              Découvrez nos articles sur Bitcoin, la cryptomonnaie, et l'écosystème blockchain au Bénin.
              Apprenez, comprenez et adoptez Bitcoin en toute sécurité.
            </p>

            {/* Statistiques Hero */}
            <div className="flex flex-wrap justify-center gap-6 md:gap-12 mb-12">
              <motion.div
                className="text-center backdrop-blur-sm bg-white/5 rounded-xl px-6 py-4 border border-white/10"
                whileHover={{
                  scale: 1.05,
                  borderColor: "rgba(34, 197, 94, 0.5)"
                }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="text-3xl md:text-5xl font-display font-black text-brand-green mb-2">
                  {postCount}
                </div>
                <div className="text-gray-300 text-sm md:text-base uppercase tracking-wider">
                  Articles
                </div>
              </motion.div>
              <motion.div
                className="text-center backdrop-blur-sm bg-white/5 rounded-xl px-6 py-4 border border-white/10"
                whileHover={{
                  scale: 1.05,
                  borderColor: "rgba(34, 197, 94, 0.5)"
                }}
                transition={{ type: "spring", stiffness: 300, delay: 0.1 }}
              >
                <div className="text-3xl md:text-5xl font-display font-black text-brand-green mb-2">
                  {tagCount}
                </div>
                <div className="text-gray-300 text-sm md:text-base uppercase tracking-wider">
                  Sujets
                </div>
              </motion.div>
            </div>

            {/* CTA Button */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="#articles"
                className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-brand-green text-white rounded-xl hover:bg-brand-accent transition-all duration-300 transform hover:scale-105 font-bold text-lg shadow-lg shadow-brand-green/25 backdrop-blur-sm"
              >
                <FaBook />
                Voir les articles
                <FaArrowRight />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </PageTransition>
  );
}
