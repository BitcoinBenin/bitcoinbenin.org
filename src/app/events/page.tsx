'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { motion } from 'framer-motion';
import { FaCalendarAlt, FaMapMarkerAlt, FaArrowRight } from 'react-icons/fa';
import Link from 'next/link';
import Image from 'next/image';
import { AnimatedCounter } from '@/app/components/Animations';

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  location_link?: string;
  image?: string;
  registration_link?: string;
  created_at: string;
  updated_at: string;
}

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  location_link?: string;
  image?: string;
  registration_link?: string;
  created_at: string;
  updated_at: string;
}

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('date', { ascending: true });

      if (error) {
        console.error('Erreur lors du chargement des événements:', error);
      } else {
        setEvents(data || []);
      }
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const now = new Date();
  now.setHours(0, 0, 0, 0);
  
  // Upcoming events are those with date >= today
  const upcomingEvents = events.filter(
    (event) => new Date(event.date) >= now
  );
  // Past events are those with date < today
  const pastEvents = events.filter(
    (event) => new Date(event.date) < now
  );

  const EventCard = ({ event }: { event: Event }) => (
    <article key={event.id} className="group bg-brand-charcoal/50 border border-white/5 rounded-2xl overflow-hidden hover:border-brand-green/50 transition-all duration-300 hover:shadow-2xl hover:shadow-brand-green/10">
      {/* Image avec overlay */}
      <div className="relative h-72 overflow-hidden">
        <Image
          src={event.image || '/event.webp'}
          alt={`Affiche pour ${event.title}`}
          fill
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            console.error('Erreur chargement image:', event.image);
            e.currentTarget.src = '/event.webp';
          }}
        />
        
        {/* Badge de date */}
        <div className="absolute top-4 left-4 bg-brand-green/90 backdrop-blur-sm rounded-lg px-3 py-2 text-white font-bold text-sm">
          {new Date(event.date).toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'short'
          })}
        </div>
        
        {/* Overlay au survol */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
      
      <div className="p-6">
        {/* Date et heure */}
        <div className="flex items-center gap-3 mb-4">
          <div className="flex items-center gap-2 bg-brand-dark/50 rounded-lg px-3 py-1">
            <FaCalendarAlt className="text-brand-green text-sm" />
            <span className="text-brand-green font-medium text-sm">
              {new Date(event.date).toLocaleDateString('fr-FR', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </span>
          </div>
          {event.time && (
            <div className="flex items-center gap-1 bg-brand-dark/50 rounded-lg px-3 py-1">
              <span className="text-gray-300 text-sm font-medium">{event.time}</span>
            </div>
          )}
        </div>
        
        {/* Titre */}
        <h3 className="text-2xl font-display font-bold text-white mb-3 group-hover:text-brand-green transition-colors leading-tight">
          {event.title}
        </h3>
        
        {/* Description */}
        <p className="text-gray-400 mb-4 line-clamp-3 leading-relaxed text-sm">
          {event.description}
        </p>
        
        {/* Localisation */}
        <div className="flex items-center gap-2 mb-6">
          <FaMapMarkerAlt className="text-brand-accent text-sm" />
          <span className="text-gray-300 text-sm">{event.location}</span>
        </div>
        
        {/* Actions */}
        <div className="flex gap-3">
          {event.registration_link && (
            <Link
              href={event.registration_link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-brand-green text-white rounded-lg hover:bg-brand-accent transition-all duration-300 transform hover:scale-105 font-medium text-sm"
            >
              S&apos;inscrire
              <FaArrowRight className="text-xs" />
            </Link>
          )}
          
          {event.location_link && (
            <Link
              href={event.location_link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-brand-dark border border-white/10 text-gray-300 rounded-lg hover:border-brand-green/50 hover:text-brand-green transition-all duration-300 text-sm"
            >
              <FaMapMarkerAlt className="text-xs" />
              Localisation
            </Link>
          )}
        </div>
      </div>
    </article>
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white">Chargement des événements...</div>
      </div>
    );
  }

  if (!supabase) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-display font-bold text-white mb-4">Configuration requise</h2>
          <p className="text-gray-400">Veuillez configurer Supabase pour afficher les événements.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-dark">
      {/* Hero Section avec image de fond */}
      <section className="relative h-[95vh] md:h-screen flex items-center justify-center overflow-hidden pt-32">
        {/* Image de fond avec overlay */}
        <div className="absolute inset-0">
          <Image 
            src="/event-hero.webp" 
            alt="Événements Bitcoin Bénin"
            fill
            className="object-cover"
            onError={(e) => {
              // Fallback vers une image par défaut ou gradient
              e.currentTarget.style.display = 'none';
              e.currentTarget.parentElement?.classList.add('bg-gradient-to-br', 'from-brand-dark', 'via-brand-charcoal', 'to-brand-dark');
            }}
          />
          {/* Overlay sombre pour lisibilité */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80"></div>
        </div>
        
        {/* Contenu Hero */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-brand-green/10 backdrop-blur-md border border-brand-green/30 rounded-full px-4 py-2 mb-8">
              <FaCalendarAlt className="text-brand-green" />
              <span className="text-brand-green font-medium text-sm">
                Rejoignez notre communauté
              </span>
            </div>
            
            {/* Titre principal */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-black text-white mb-6 leading-tight">
              Événements
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-green to-brand-accent ml-2 md:ml-4 block md:inline">
                Bitcoin Bénin
              </span>
            </h1>
            
            {/* Sous-titre */}
            <p className="text-lg md:text-xl lg:text-2xl text-gray-200 max-w-4xl mx-auto leading-relaxed mb-12 backdrop-blur-sm">
              Rejoignez-nous pour des meetups, ateliers et conférences sur Bitcoin. 
              Apprenez, échangez et développez vos connaissances avec notre communauté passionnée.
            </p>
            
            {/* Statistiques Hero */}
            <div className="flex flex-wrap justify-center gap-6 md:gap-12 mb-12">
              <motion.div 
                className="text-center backdrop-blur-sm bg-white/5 rounded-xl px-6 py-4 border border-white/10"
                whileHover={{ 
                  scale: 1.05,
                  borderColor: "rgba(34, 197, 94, 0.5)"
                }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="text-3xl md:text-5xl font-display font-black text-brand-green mb-2">
                  <AnimatedCounter from={0} to={events.length} duration={2} />
                </div>
                <div className="text-gray-300 text-sm md:text-base uppercase tracking-wider">
                  Événements Total
                </div>
              </motion.div>
              <motion.div 
                className="text-center backdrop-blur-sm bg-white/5 rounded-xl px-6 py-4 border border-white/10"
                whileHover={{ 
                  scale: 1.05,
                  borderColor: "rgba(34, 197, 94, 0.5)"
                }}
                transition={{ type: "spring", stiffness: 300, delay: 0.1 }}
              >
                <div className="text-3xl md:text-5xl font-display font-black text-brand-green mb-2">
                  <AnimatedCounter from={0} to={upcomingEvents.length} duration={2} />
                </div>
                <div className="text-gray-300 text-sm md:text-base uppercase tracking-wider">
                  À Venir
                </div>
              </motion.div>
              <motion.div 
                className="text-center backdrop-blur-sm bg-white/5 rounded-xl px-6 py-4 border border-white/10"
                whileHover={{ 
                  scale: 1.05,
                  borderColor: "rgba(156, 163, 175, 0.5)"
                }}
                transition={{ type: "spring", stiffness: 300, delay: 0.2 }}
              >
                <div className="text-3xl md:text-5xl font-display font-black text-gray-300 mb-2">
                  <AnimatedCounter from={0} to={pastEvents.length} duration={2} />
                </div>
                <div className="text-gray-300 text-sm md:text-base uppercase tracking-wider">
                  Passés
                </div>
              </motion.div>
            </div>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {upcomingEvents.length > 0 && (
                <Link
                href="#upcoming-events"
                className="inline-flex items-center gap-3 px-8 py-4 bg-brand-green text-white rounded-xl hover:bg-brand-accent transition-all duration-300 transform hover:scale-105 font-bold text-lg shadow-lg shadow-brand-green/25 backdrop-blur-sm"
              >
                <FaCalendarAlt />
                Voir les événements à venir
                <FaArrowRight />
              </Link>
              )}
              <Link
                href="#past-events"
                className="inline-flex items-center gap-3 px-8 py-4 bg-brand-dark/80 backdrop-blur-md border border-white/20 text-gray-200 rounded-xl hover:border-brand-green/50 hover:text-brand-green transition-all duration-300 font-bold text-lg"
              >
                <FaCalendarAlt />
                Événements passés
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Contenu principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

        {/* Événements à venir */}
        <section id="upcoming-events" className="mb-16 scroll-mt-40">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-4 flex items-center justify-center gap-3">
              <FaCalendarAlt className="text-brand-green" />
              Événements à venir ({upcomingEvents.length})
            </h2>
            <div className="w-16 h-1 bg-gradient-to-r from-brand-green to-brand-accent mx-auto rounded-full"></div>
          </div>
          
          {upcomingEvents.length === 0 ? (
            <div className="text-center py-20 bg-brand-charcoal/30 rounded-3xl border border-white/5 backdrop-blur-sm">
              <div className="mb-6">
                <FaCalendarAlt className="text-8xl text-gray-500 mx-auto mb-4" />
              </div>
              <h3 className="text-3xl font-display font-bold text-gray-300 mb-4">
                Aucun événement à venir
              </h3>
              <p className="text-gray-400 text-lg mb-8 max-w-md mx-auto">
                Revenez bientôt pour découvrir nos prochains événements Bitcoin Bénin !
              </p>
              <div className="flex justify-center gap-4">
                <div className="px-6 py-3 bg-brand-dark/50 rounded-lg border border-white/10">
                  <div className="text-brand-green font-bold text-2xl mb-1">Bientôt</div>
                  <div className="text-gray-400 text-sm">Nouveaux événements</div>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {upcomingEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          )}
        </section>

        {/* Événements passés */}
        {pastEvents.length > 0 && (
          <section id="past-events" className="scroll-mt-40">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-4 flex items-center justify-center gap-3">
                <FaCalendarAlt className="text-gray-400" />
                Événements passés ({pastEvents.length})
              </h2>
              <div className="w-16 h-1 bg-gradient-to-r from-gray-400 to-gray-600 mx-auto rounded-full"></div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pastEvents.map((event) => (
                <article key={event.id} className="group relative bg-brand-charcoal/30 backdrop-blur-md border border-white/5 rounded-2xl overflow-hidden opacity-75 hover:opacity-90 transition-all duration-300">
                  {/* Image avec effet grayscale */}
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={event.image || '/event.webp'}
                      alt={`Affiche pour ${event.title}`}
                      fill
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 grayscale"
                      onError={(e) => {
                        e.currentTarget.src = '/event.webp';
                      }}
                    />
                    
                    {/* Badge "Passé" */}
                    <div className="absolute top-4 left-4 bg-gray-600/90 backdrop-blur-sm rounded-lg px-3 py-1 text-white font-bold text-xs">
                      Événement passé
                    </div>
                  </div>
                  
                  <div className="p-4">
                    {/* Date et heure */}
                    <div className="flex items-center gap-2 mb-3">
                      <FaCalendarAlt className="text-gray-400 text-xs" />
                      <span className="text-gray-400 font-medium text-xs">
                        {new Date(event.date).toLocaleDateString('fr-FR', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </span>
                      {event.time && (
                        <span className="text-gray-500 text-xs">• {event.time}</span>
                      )}
                    </div>
                    
                    {/* Titre */}
                    <h3 className="text-lg font-display font-bold text-gray-300 mb-2 leading-tight">
                      {event.title}
                    </h3>
                    
                    {/* Description */}
                    <p className="text-gray-500 mb-3 line-clamp-2 leading-relaxed text-xs">
                      {event.description}
                    </p>
                    
                    {/* Localisation */}
                    <div className="flex items-center gap-2">
                      <FaMapMarkerAlt className="text-gray-400 text-xs" />
                      <span className="text-gray-400 text-xs">{event.location}</span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}