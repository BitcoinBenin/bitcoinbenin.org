'use client';

import { PARTNERS } from '../data';
import { motion, easeOut, useReducedMotion } from 'framer-motion';
import Image from 'next/image';
import { AnimatedWrapper } from './Animations';

export default function Partners() {
  const partners = PARTNERS;
  const prefersReducedMotion = useReducedMotion();

  const sectionVariants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.1 } },
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
      className="bg-brand-dark py-24 sm:py-32 relative overflow-hidden"
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
      variants={sectionVariants}
    >
      {/* Background pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-brand-dark via-brand-charcoal to-brand-dark opacity-50"></div>
      
      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
        <AnimatedWrapper
          variants={{
            hidden: { opacity: 0, y: 30 },
            visible: { opacity: 1, y: 0 }
          }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="mx-auto max-w-4xl text-center w-full">
            <motion.span 
              className="text-brand-green font-semibold tracking-wide uppercase text-sm mb-4 block inline-block"
              whileHover={{ scale: 1.05 }}
              transition={{ stiffness: 400 }}
            >
              Partenariats
            </motion.span>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white sm:text-5xl text-center w-full mb-6">
              Nos partenaires & <span className="text-brand-green">soutiens</span>
            </h2>
            <p className="mt-6 text-lg leading-8 text-gray-300 text-center w-full max-w-3xl mx-auto">
              Nous collaborons avec des acteurs de l&apos;écosystème Bitcoin, des universités et
              des communautés locales pour promouvoir l&apos;adoption du Bitcoin au Bénin.
            </p>
          </div>
        </AnimatedWrapper>

        <div className="mx-auto mt-20 w-full overflow-hidden">
          <motion.div
            className="flex w-max gap-8"
            variants={logoGridVariants}
            animate={prefersReducedMotion ? undefined : { x: ['0%', '-50%'] }}
            transition={
              prefersReducedMotion
                ? undefined
                : { duration: 25, ease: 'linear', repeat: Infinity }
            }
          >
            {[...partners, ...partners].map((partner, idx) => (
              <motion.div
                key={`${partner.name}-${idx}`}
                className="flex items-center justify-center p-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl hover:bg-white/10 hover:border-brand-green/30 transition-all duration-500 transform hover:scale-105 group shrink-0"
                variants={logoVariants}
                whileHover={{ y: -5 }}
              >
                <div className="flex items-center justify-center w-44 h-20 bg-white/90 rounded-xl px-4 py-3">
                  <Image 
                    src={partner.logo} 
                    alt={`${partner.name} logo`}
                    width={140}
                    height={80}
                    className="object-contain w-auto h-auto max-w-full max-h-full"
                  />
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        <AnimatedWrapper
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0 }
          }}
          transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
        >
          <div className="mt-20 text-center w-full">
            <a
              href="/contact"
              className="inline-flex items-center justify-center bg-gradient-to-r from-brand-green to-brand-accent hover:from-brand-green-dark hover:to-brand-green text-white font-semibold px-9 py-4 rounded-lg shadow-lg hover:shadow-glow transform hover:scale-105 transition-all duration-300 text-base"
            >
              <span className="flex items-center gap-2">
                Devenir partenaire
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </span>
            </a>
          </div>
        </AnimatedWrapper>
      </div>
    </motion.section>
  );
}
