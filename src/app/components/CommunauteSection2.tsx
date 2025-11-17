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
      className="bg-[#121212] w-full flex flex-col items-center px-4 py-12 md:px-6 md:py-16"
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.1 }}
    >
      <div className="max-w-4xl w-full">
        {/* Titre */}
        <motion.h2 
          className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#00843D] mb-8 md:mb-12 text-center"
          variants={titleVariants}
        >
          L&apos;histoire de la communauté Bitcoin Bénin
        </motion.h2>

        {/* Timeline */}
        <div className="relative">
          {/* Ligne verticale */}
          <motion.div 
            className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-[#00843D] transform md:-translate-x-1/2 origin-top"
            variants={lineVariants}
          ></motion.div>
          
          {/* Événements */}
          <div className="space-y-8">
            {events.map((event, index) => (
              <motion.div 
                key={index}
                className={`relative flex items-start ${
                  index % 2 === 0 ? 'md:flex-row-reverse' : 'md:flex-row'
                }`}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.5 }}
                variants={cardVariants(index % 2 === 0)}
              >
                {/* Point */}
                <div className="absolute left-4 md:left-1/2 w-3 h-3 bg-[#00843D] rounded-full transform -translate-x-1.5 md:-translate-x-1/2 z-10"></div>
                
                {/* Contenu */}
                <div className={`ml-12 md:ml-0 md:w-1/2 ${
                  index % 2 === 0 ? 'md:pr-8 md:text-right' : 'md:pl-8'
                }`}>
                  <div className="bg-[#1a1a1a] p-4 rounded-lg border border-gray-700 hover:border-[#00843D] transition-colors duration-300">
                    <div className="text-[#00843D] font-semibold text-lg mb-1">
                      {event.date}
                    </div>
                    <h3 className="text-white font-bold text-xl mb-2">
                      {event.title}
                    </h3>
                    <p className="text-gray-300 text-sm">
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
