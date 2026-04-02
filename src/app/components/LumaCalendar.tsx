'use client';

import { motion } from 'framer-motion';

export default function LumaCalendar() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full max-w-4xl mx-auto"
    >
      <div className="text-center mb-8">
        <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">
          Calendrier des Événements
        </h2>
        <p className="text-gray-300 text-lg">
          Consultez notre calendrier complet et inscrivez-vous à nos prochains événements
        </p>
      </div>
      
      <div className="bg-brand-charcoal/50 backdrop-blur-md border border-white/10 rounded-2xl p-6 md:p-8">
        <div className="relative w-full overflow-hidden rounded-xl">
          <iframe
            src="https://luma.com/embed/calendar/cal-o99gGDsb8inkK39/events"
            width="100%"
            height="1000"
            frameBorder="0"
            style={{ 
              border: '1px solid #bfcbda88', 
              borderRadius: '8px',
              background: 'white'
            }}
            allowFullScreen={true}
            aria-hidden="false"
            tabIndex={0}
            title="Calendrier des événements Bitcoin Bénin"
            className="w-full"
          />
        </div>
        
    
      </div>
    </motion.div>
  );
}
