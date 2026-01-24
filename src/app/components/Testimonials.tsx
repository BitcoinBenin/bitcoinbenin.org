'use client';

import Card3D from './ui/Card3D';
import { FaQuoteLeft } from 'react-icons/fa';
import { motion } from 'framer-motion';

const testimonials = [
  {
    name: "Aurel",
    role: "Développeur",
    content: "La communauté m'a permis de comprendre les enjeux techniques du protocole Bitcoin et de lancer mon propre nœud."
  },
  {
    name: "SarahK",
    role: "Entrepreneure",
    content: "Grâce aux meetups, j'ai pu intégrer le paiement Bitcoin dans ma boutique en ligne facilement."
  },
  {
    name: "David",
    role: "Étudiant",
    content: "Une source d'information fiable et des passionnés toujours prêts à aider. Je recommande !"
  }
];

export default function Testimonials() {
  return (
    <section className="py-24 border-t border-white/5 bg-brand-charcoal/30">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            Ce qu&apos;en disent nos membres
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Card3D className="p-8 h-full" variant="premium">
                <FaQuoteLeft className="text-3xl text-brand-green/50 mb-6" />
                <p className="text-gray-300 mb-6 italic leading-relaxed">&ldquo;{t.content}&rdquo;</p>
                <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-brand-green to-brand-accent text-white flex items-center justify-center font-display font-black text-sm shadow-glow animate-glow-pulse">
                    {t.name[0]}
                  </div>
                  <div>
                    <h4 className="font-display font-bold text-white text-sm">{t.name}</h4>
                    <p className="text-xs font-medium text-brand-green">{t.role}</p>
                  </div>
                </div>
              </Card3D>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
