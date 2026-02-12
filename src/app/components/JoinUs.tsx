'use client';

import Image from 'next/image';
import Button from './ui/Button';
import { motion } from 'framer-motion';
import { AnimatedWrapper, HoverAnimation, useParallax } from './Animations';

export default function JoinUs() {
  const { ref: parallaxRef, y } = useParallax(0.3);

  const buttonVariants = {
    initial: { scale: 1 },
    hover: { scale: 1.05, transition: { duration: 0.2 } },
    tap: { scale: 0.95 }
  };

  return (
    <section className="py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          <AnimatedWrapper
            variants={{
              hidden: { opacity: 0, x: -50 },
              visible: { opacity: 1, x: 0 }
            }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <motion.div>
              <motion.span 
                className="text-brand-orange font-semibold tracking-wide uppercase text-sm mb-2 block inline-block"
                whileHover={{ scale: 1.1, color: "#ff6b35" }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                Communauté
              </motion.span>
              
              <motion.h2 
                className="text-4xl md:text-5xl font-bold text-white leading-tight mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
              >
                Discutez, Partagez, <br />
                <motion.span 
                  className="text-brand-orange drop-shadow-lg inline-block"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  Explorez
                </motion.span>
              </motion.h2>

              <motion.p 
                className="text-lg text-gray-400 mb-8 leading-relaxed"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.6 }}
              >
                Rejoignez notre réseau décentralisé.
                Retrouvez-nous sur 
                <motion.span 
                  className="font-semibold text-white mx-1 inline-block"
                  whileHover={{ scale: 1.1, color: "#ff6b35" }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  Telegram
                </motion.span>
                ,
                <motion.span 
                  className="font-semibold text-white mx-1 inline-block"
                  whileHover={{ scale: 1.1, color: "#ff6b35" }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  Whatsapp
                </motion.span>
                , ou
                <motion.span 
                  className="font-semibold text-white mx-1 inline-block"
                  whileHover={{ scale: 1.1, color: "#ff6b35" }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  Twitter
                </motion.span>
                .
              </motion.p>

              <motion.div 
                className="flex flex-wrap gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.6 }}
              >
                <motion.div variants={buttonVariants} initial="initial" whileHover="hover" whileTap="tap">
                  <Button 
                    variant="primary" 
                    size="lg" 
                    onClick={() => window.open('https://t.me/+vUzohmB0EFMzZTI8', '_blank')}
                    className="relative overflow-hidden group"
                  >
                    <motion.span
                      className="relative z-10"
                      whileHover={{ x: 2 }}
                      transition={{ type: "spring", stiffness: 400 }}
                    >
                      Rejoindre Telegram
                    </motion.span>
                    <motion.div
                      className="absolute inset-0 bg-white/20"
                      initial={{ x: "-100%" }}
                      whileHover={{ x: "100%" }}
                      transition={{ duration: 0.3 }}
                    />
                  </Button>
                </motion.div>

                <motion.div variants={buttonVariants} initial="initial" whileHover="hover" whileTap="tap">
                  <Button 
                    variant="secondary" 
                    size="lg" 
                    onClick={() => window.open('https://chat.whatsapp.com/BVAQ7yk3fLY6zdOQvJM2zu', '_blank')}
                    className="relative overflow-hidden group"
                  >
                    <motion.span
                      className="relative z-10"
                      whileHover={{ x: 2 }}
                      transition={{ type: "spring", stiffness: 400 }}
                    >
                      Rejoindre Whatsapp
                    </motion.span>
                    <motion.div
                      className="absolute inset-0 bg-white/10"
                      initial={{ x: "-100%" }}
                      whileHover={{ x: "100%" }}
                      transition={{ duration: 0.3 }}
                    />
                  </Button>
                </motion.div>
              </motion.div>
            </motion.div>
          </AnimatedWrapper>

          <AnimatedWrapper
            variants={{
              hidden: { opacity: 0, x: 50 },
              visible: { opacity: 1, x: 0 }
            }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <motion.div ref={parallaxRef} style={{ y }} className="relative">
              <HoverAnimation hoverScale={1.02} hoverY={-5}>
                <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-white/10 group">
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-brand-orange/20 to-brand-green/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                  />
                  <Image
                    src="/communaute.jpg"
                    alt="Communauté Bitcoin Bénin"
                    width={362}
                    height={241}
                    className="w-full h-auto object-cover hover:scale-105 transition-transform duration-700 opacity-90 group-hover:opacity-100"
                  />
                  <motion.div 
                    className="absolute inset-0 bg-gradient-to-t from-brand-dark to-transparent pointer-events-none"
                    initial={{ opacity: 0.7 }}
                    whileHover={{ opacity: 0.5 }}
                  />
                </div>
              </HoverAnimation>
              
              {/* Glow behind image */}
              <motion.div 
                className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-brand-orange/20 blur-[80px] rounded-full"
                animate={{ 
                  scale: [1, 1.1, 1],
                  opacity: [0.5, 0.8, 0.5]
                }}
                transition={{ 
                  duration: 4, 
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            </motion.div>
          </AnimatedWrapper>
        </div>
      </div>
    </section>
  );
}
