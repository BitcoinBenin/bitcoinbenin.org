'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { FaMobileAlt, FaPercent, FaFileInvoiceDollar } from 'react-icons/fa';

export default function HowToIntegrate() {
  const steps = [
    {
      icon: FaMobileAlt,
      text: "Accepter Bitcoin en quelques minutes, sans avoir besoin d’un TPE spécifique.",
    },
    {
      icon: FaPercent,
      text: "Paramétrer le pourcentage de bitcoins que vous souhaitez convertir en euros automatiquement.",
    },
    {
      icon: FaFileInvoiceDollar,
      text: "Exporter sa comptabilité en un clic pour une gestion simplifiée.",
    }
  ];

  return (
    <section className="my-20 relative">
      <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center">

        {/* Video Column */}
        <motion.div
          className="relative w-full rounded-2xl shadow-2xl overflow-hidden border border-white/10 group"
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="absolute inset-0 bg-brand-orange/10 pointer-events-none group-hover:bg-transparent transition-colors duration-300"></div>
          <div className="relative w-full h-0 pb-[56.25%]"> {/* 16:9 Aspect Ratio */}
            <iframe
              className="absolute top-0 left-0 w-full h-full"
              src="https://www.youtube.com/embed/-GJr4XjRCPo?si=Jrap-oToMMFeOIC8"
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </motion.div>

        {/* Text Column */}
        <motion.div
          className="flex flex-col gap-8"
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Comment <span className="text-brand-orange">l’intégrer ?</span>
          </h2>

          <div className="prose prose-invert max-w-none text-gray-300">
            <p className="text-lg leading-relaxed">
              Il existe de nombreuses solutions simples et intuitives permettant d’accepter Bitcoin sans difficulté. Parmi elles, l’application <span className="text-white font-bold">“Swiss Bitcoin Pay”</span> semble être la plus pertinente pour débuter. Elle permet en effet :
            </p>
          </div>

          <div className="grid gap-4">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                className="flex items-start gap-4 p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-brand-orange/30 transition-all duration-300"
                whileHover={{ scale: 1.02 }}
              >
                <div className="p-3 bg-brand-orange/10 rounded-full text-brand-orange shrink-0">
                  <step.icon size={20} />
                </div>
                <p className="text-gray-300 text-sm md:text-base pt-1">{step.text}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
