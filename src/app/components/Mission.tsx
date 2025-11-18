'use client';

import { FaArrowRight } from 'react-icons/fa';
import { MISSIONS } from '../data';
import { motion, easeOut } from 'framer-motion';

export default function Mission() {
  const missions = MISSIONS;

  const sectionVariants = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const titleVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: easeOut } },
  };

  const cardGridVariants = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    show: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: easeOut } },
  };

  return (
    <motion.section
      className="bg-gray-50 py-24 -mt-1 relative z-10"
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.1 }}
      variants={sectionVariants}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div className="text-center" variants={titleVariants}>
          <h2 className="text-4xl font-bold text-gray-800 sm:text-5xl tracking-tight">
            Nos missions
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
            Au cœur de notre action : démocratiser Bitcoin pour tous.
          </p>
        </motion.div>

        <motion.div
          className="mt-20 grid md:grid-cols-2 lg:grid-cols-3 gap-10"
          variants={cardGridVariants}
        >
          {missions.map((mission) => (
            <motion.div
              key={mission.title}
              className="group bg-white rounded-2xl shadow-lg p-8 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 flex flex-col"
              variants={cardVariants}
            >
              <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-green-100 mb-8">
                <mission.icon className="text-4xl text-green-600 transition-transform duration-300 group-hover:rotate-12" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 text-center">{mission.title}</h3>
              <p className="mt-4 text-base text-gray-600 text-center flex-grow">{mission.description}</p>
              <div className="text-center mt-8">
                <a
                  href={mission.href}
                  className="btn-mission inline-flex items-center gap-2 text-white font-bold py-3 px-6 rounded-xl text-sm uppercase"
                >
                  {mission.buttonText} <FaArrowRight />
                </a>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
}
