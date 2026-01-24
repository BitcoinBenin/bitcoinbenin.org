'use client';

import Image from 'next/image';
import Button from './ui/Button';
import { motion } from 'framer-motion';

export default function JoinUs() {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <span className="text-brand-orange font-semibold tracking-wide uppercase text-sm mb-2 block">Communauté</span>
            <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-6">
              Discutez, Partagez, <br />
              <span className="text-brand-orange drop-shadow-lg">Explorez</span>
            </h2>

            <p className="text-lg text-gray-400 mb-8 leading-relaxed">
              Rejoignez notre réseau décentralisé.
              Retrouvez-nous sur <span className="font-semibold text-white">Telegram</span>,
              <span className="font-semibold text-white"> Discord</span>, ou
              <span className="font-semibold text-white"> Twitter</span>.
            </p>

            <div className="flex flex-wrap gap-4">
              <Button variant="primary" size="lg" onClick={() => window.open('https://t.me/+vUzohmB0EFMzZTI8', '_blank')}>
                Rejoindre Telegram
              </Button>
              <Button variant="secondary" size="lg" onClick={() => window.open('https://discord.gg/bitcoinbenin', '_blank')}>
                Rejoindre Discord
              </Button>
            </div>
          </motion.div>

          <motion.div
            className="relative"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-white/10 group">
              <Image
                src="/communaute.jpg"
                alt="Communauté Bitcoin Bénin"
                width={600}
                height={600}
                className="w-full h-auto object-cover hover:scale-105 transition-transform duration-700 opacity-90 group-hover:opacity-100"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-dark to-transparent pointer-events-none"></div>
            </div>
            {/* Glow behind image */}
            <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-brand-orange/20 blur-[80px] rounded-full"></div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
