'use client';

import { MISSIONS } from '../data';
import { motion } from 'framer-motion';
import Card from './ui/Card';
import Link from 'next/link';
import { FaArrowRight } from 'react-icons/fa';
import { AnimatedWrapper, StaggerContainer, HoverAnimation } from './Animations';

export default function Mission() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1
    }
  };

  return (
    <section className="py-24 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedWrapper 
          variants={{
            hidden: { opacity: 0, y: -20 },
            visible: { opacity: 1, y: 0 }
          }}
          transition={{ duration: 0.8 }}
        >
          <div className="text-center mb-16">
            <motion.span 
              className="text-brand-orange font-semibold tracking-wide uppercase text-sm inline-block"
              whileHover={{ scale: 1.05 }}
              transition={{ stiffness: 400 }}
            >
              Notre Mission
            </motion.span>
            <motion.h2 
              className="mt-3 text-3xl font-bold text-white sm:text-4xl"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              Construire l&apos;Infrastructure Financière
            </motion.h2>
            <motion.p 
              className="mt-4 max-w-2xl mx-auto text-xl text-gray-400"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              Démocratiser l&apos;accès au savoir et à la souveraineté monétaire via Bitcoin.
            </motion.p>
          </div>
        </AnimatedWrapper>

        <StaggerContainer staggerDelay={0.1}>
          <motion.div 
            className="grid md:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            {MISSIONS.map((mission, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ 
                  y: -10
                }}
              >
                <HoverAnimation hoverScale={1.02}>
                  <Card className="h-full flex flex-col p-8 hover:shadow-glow-hover transition-all duration-500 group" variant="glass">
                    <motion.div 
                      className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center mb-6 text-brand-orange group-hover:bg-brand-orange group-hover:text-white transition-all duration-300 shadow-glass"
                      whileHover={{ 
                        rotate: 360,
                        scale: 1.1,
                        transition: { duration: 0.6 }
                      }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <mission.icon className="text-2xl" />
                    </motion.div>

                    <motion.h3 
                      className="text-xl font-bold text-white mb-3"
                      whileHover={{ x: 5 }}
                      transition={{ stiffness: 400 }}
                    >
                      {mission.title}
                    </motion.h3>
                    
                    <motion.p 
                      className="text-gray-400 mb-8 leading-relaxed flex-grow group-hover:text-gray-300 transition-colors"
                      initial={{ opacity: 0.8 }}
                      whileHover={{ opacity: 1 }}
                    >
                      {mission.description}
                    </motion.p>

                    <motion.div
                      whileHover={{ x: 5 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Link href={mission.href} className="inline-flex items-center text-brand-orange font-semibold hover:gap-2 transition-all">
                        {mission.buttonText} 
                        <motion.span
                          initial={{ x: 0 }}
                          whileHover={{ x: 5 }}
                          transition={{ stiffness: 400 }}
                        >
                          <FaArrowRight className="ml-2 text-sm" />
                        </motion.span>
                      </Link>
                    </motion.div>
                  </Card>
                </HoverAnimation>
              </motion.div>
            ))}
          </motion.div>
        </StaggerContainer>
      </div>
    </section>
  );
}