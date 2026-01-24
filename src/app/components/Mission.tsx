'use client';

import { MISSIONS } from '../data';
import { motion } from 'framer-motion';
import Card from './ui/Card';
import Link from 'next/link';
import { FaArrowRight } from 'react-icons/fa';

export default function Mission() {
  return (
    <section className="py-24 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-brand-orange font-semibold tracking-wide uppercase text-sm">Notre Mission</span>
          <h2 className="mt-3 text-3xl font-bold text-white sm:text-4xl">
            Construire l&apos;Infrastructure Financière
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-400">
            Démocratiser l&apos;accès au savoir et à la souveraineté monétaire via Bitcoin.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {MISSIONS.map((mission, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="h-full flex flex-col p-8 hover:shadow-glow-hover transition-all duration-500 group" variant="glass">
                <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center mb-6 text-brand-orange group-hover:bg-brand-orange group-hover:text-white transition-all duration-300 shadow-glass">
                  <mission.icon className="text-2xl" />
                </div>

                <h3 className="text-xl font-bold text-white mb-3">{mission.title}</h3>
                <p className="text-gray-400 mb-8 leading-relaxed flex-grow group-hover:text-gray-300 transition-colors">
                  {mission.description}
                </p>

                <Link href={mission.href} className="inline-flex items-center text-brand-orange font-semibold hover:gap-2 transition-all">
                  {mission.buttonText} <FaArrowRight className="ml-2 text-sm" />
                </Link>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
