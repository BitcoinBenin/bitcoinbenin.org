'use client';

import { motion, easeOut, easeIn } from 'framer-motion';

export default function Communautesection2() {
  const events = [
    {
      date: "27/01/2024",
      title: "Premier meet-up",
      description: '"Bitcoin Bénin" '
    },
    {
      date: "15/11/2025",
      title: "Dernier meet-up",
      description: '"Bitcoin Talks Bénin" (bloc 503 212)'
    },
    {
      date: "16/06/2022",
      title: "Relance de la communauté",
      description: "Bitcoin à Cotonou (bloc 741 061)"
    },
    {
      date: "31/05/2023",
      title: "Création de la communauté",
      description: "Bitcoin Bénin (bloc 792 277)"
    },
  ];

  const titleVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: easeOut } },
  };

  const lineVariants = {
    hidden: { scaleY: 0 },
    show: { scaleY: 1, transition: { duration: 2, ease: easeIn } },
  };

  const cardVariants = (isRight: boolean) => ({
    hidden: { opacity: 0, x: isRight ? 50 : -50 },
    show: { opacity: 1, x: 0, transition: { duration: 0.6, ease: easeOut } },
  });

  return (
    <motion.section
      className="relative w-full flex flex-col items-center px-4 py-20 md:px-6 md:py-32 overflow-hidden"
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.1 }}
    >
      <div className="absolute inset-0 bg-brand-dark opacity-90 -z-10"></div>

      {/* Background Glow */}
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-brand-orange/5 blur-[100px] rounded-full pointer-events-none translate-x-1/2 translate-y-1/2"></div>

      <div className="max-w-4xl w-full relative z-10">
        {/* Titre */}
        <motion.h2
          className="text-3xl md:text-5xl font-bold text-white mb-16 md:mb-24 text-center"
          variants={titleVariants}
        >
          L&apos;histoire de la <span className="text-brand-orange">communauté</span>
        </motion.h2>

        {/* Timeline */}
        <div className="relative">
          {/* Ligne verticale */}
          <motion.div
            className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-brand-orange/80 via-brand-orange/40 to-transparent transform md:-translate-x-1/2 origin-top shadow-[0_0_10px_rgba(247,147,26,0.5)]"
            variants={lineVariants}
          ></motion.div>

          {/* Événements */}
          <div className="space-y-12">
            {events.map((event, index) => (
              <motion.div
                key={index}
                className={`relative flex items-start ${index % 2 === 0 ? 'md:flex-row-reverse' : 'md:flex-row'
                  }`}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.5 }}
                variants={cardVariants(index % 2 === 0)}
              >
                {/* Point */}
                <div className="absolute left-4 md:left-1/2 w-4 h-4 bg-brand-dark border-2 border-brand-orange rounded-full transform -translate-x-2 md:-translate-x-1/2 z-10 shadow-[0_0_15px_rgba(247,147,26,0.6)]"></div>

                {/* Contenu */}
                <div className={`ml-12 md:ml-0 md:w-1/2 ${index % 2 === 0 ? 'md:pr-12 md:text-right' : 'md:pl-12'
                  }`}>
                  <div className="glass-panel p-6 rounded-2xl border border-white/5 hover:bg-white/5 transition-all duration-300 group">
                    <div className="text-brand-orange font-bold text-lg mb-2 group-hover:text-brand-accent transition-colors">
                      {event.date}
                    </div>
                    <h3 className="text-white font-bold text-xl mb-2 tracking-tight">
                      {event.title}
                    </h3>
                    <p className="text-gray-400 text-sm leading-relaxed">
                      {event.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.section>
  );
}
