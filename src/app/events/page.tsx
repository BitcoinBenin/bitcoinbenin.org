'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { FaCalendarAlt, FaMapMarkerAlt, FaArrowRight } from 'react-icons/fa';

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
    <article key={event.id} className="group bg-brand-charcoal/50 border border-white/5 rounded-xl overflow-hidden hover:border-brand-green/50 transition-all duration-300">
      <div className="relative h-64 overflow-hidden">
        <img
          src={event.image || '/event.webp'}
          alt={`Affiche pour ${event.title}`}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            console.error('Erreur chargement image:', event.image);
            // Fallback vers l'image par défaut
            e.currentTarget.src = '/event.webp';
          }}
          onLoad={() => {
            console.log('Image chargée avec succès:', event.image);
          }}
        />
      </div>
      
      <div className="flex-1 w-full">
        <div className="flex items-center gap-2 mb-3">
          <FaCalendarAlt className="text-brand-green" />
          <span className="text-brand-green font-medium">{event.date}</span>
          <span className="text-gray-400">•</span>
          <span className="text-gray-300">{event.time}</span>
        </div>
        
        <h3 className="text-2xl font-display font-bold text-white mb-3 group-hover:text-brand-green transition-colors">
          {event.title}
        </h3>
        
        <p className="text-gray-400 mb-4 line-clamp-3 leading-relaxed">
          {event.description}
        </p>
        
        <div className="flex items-center gap-2 mb-4">
          <FaMapMarkerAlt className="text-brand-accent" />
          <span className="text-gray-300">{event.location}</span>
        </div>
        
        <div className="flex gap-3">
          {event.registration_link && (
            <Link
              href={event.registration_link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-brand-green text-white rounded-lg hover:bg-brand-accent transition-colors"
            >
              S&apos;inscrire
              <FaArrowRight className="text-sm" />
            </Link>
          )}
          
          {event.location_link && (
            <Link
              href={event.location_link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-brand-dark border border-white/10 text-gray-300 rounded-lg hover:border-brand-green/50 transition-colors"
            >
              <FaMapMarkerAlt className="text-sm" />
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-40 pb-8">
        <header className="text-center mb-8">
          <h1 className="text-5xl md:text-6xl font-display font-black text-white mb-4">
            Événements
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-green to-brand-accent ml-2">
              Bitcoin Bénin
            </span>
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
            Rejoignez-nous pour des meetups, ateliers et conférences sur Bitcoin. 
            Apprenez, échangez et développez vos connaissances avec notre communauté.
          </p>
        </header>

        {/* Événements à venir */}
        <section className="mb-8">
          <h2 className="text-3xl font-display font-bold text-white mb-4 flex items-center gap-3">
            <FaCalendarAlt className="text-brand-green" />
            Événements à venir ({upcomingEvents.length})
          </h2>
          
          {upcomingEvents.length === 0 ? (
            <div className="text-center py-16 bg-brand-charcoal/30 rounded-3xl border border-white/5">
              <FaCalendarAlt className="text-6xl text-gray-500 mx-auto mb-4" />
              <h3 className="text-2xl font-display font-bold text-gray-300 mb-2">
                Aucun événement à venir
              </h3>
              <p className="text-gray-400">
                Revenez bientôt pour découvrir nos prochains événements Bitcoin Bénin !
              </p>
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
          <section>
            <h2 className="text-3xl font-display font-bold text-white mb-4 flex items-center gap-3">
              <FaCalendarAlt className="text-gray-400" />
              Événements passés ({pastEvents.length})
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {pastEvents.map((event) => (
                <article key={event.id} className="group relative flex flex-col items-start justify-between p-6 rounded-3xl bg-brand-charcoal/30 backdrop-blur-md border border-white/5 opacity-75">
                  <div className="relative w-full h-72 rounded-2xl overflow-hidden mb-6 border border-white/5">
                    <img
                      src={event.image || '/event.webp'}
                      alt={`Affiche pour ${event.title}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 grayscale"
                    />
                  </div>
                  
                  <div className="flex-1 w-full">
                    <div className="flex items-center gap-2 mb-3">
                      <FaCalendarAlt className="text-gray-400" />
                      <span className="text-gray-400 font-medium">{event.date}</span>
                      <span className="text-gray-500">•</span>
                      <span className="text-gray-400">{event.time}</span>
                    </div>
                    
                    <h3 className="text-2xl font-display font-bold text-gray-300 mb-3">
                      {event.title}
                    </h3>
                    
                    <p className="text-gray-500 mb-4 line-clamp-2 leading-relaxed">
                      {event.description}
                    </p>
                    
                    <div className="flex items-center gap-2">
                      <FaMapMarkerAlt className="text-gray-400" />
                      <span className="text-gray-400">{event.location}</span>
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