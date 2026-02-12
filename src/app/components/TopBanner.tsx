'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { FaCalendarAlt, FaUsers, FaStar, FaArrowRight, FaTimes, FaClock } from 'react-icons/fa';

interface EventData {
  id: number;
  title: string;
  date: string;
  location?: string;
  description?: string;
  imageUrl?: string;
}

interface BannerMessage {
  id: number;
  text: string;
  highlight?: string;
  link?: string;
  icon?: React.ReactNode;
  type?: 'event' | 'announcement' | 'stat';
  event?: EventData;
}

export default function TopBanner() {
  const [currentMessage, setCurrentMessage] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [upcomingEvent, setUpcomingEvent] = useState<EventData | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Fonctions utilitaires - déclarées avant utilisation
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    if (date.toDateString() === today.toDateString()) {
      return "Aujourd'hui";
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return "Demain";
    } else {
      return date.toLocaleDateString('fr-FR', { 
        day: 'numeric', 
        month: 'short' 
      });
    }
  };

  const getEventHighlight = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    if (date.toDateString() === today.toDateString()) {
      return "AUJOURD'HUI";
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return "DEMAIN";
    } else {
      return "ÉVÉNEMENT";
    }
  };
  
  // Messages de base
  const baseMessages: BannerMessage[] = [
    {
      id: 2,
      text: "Rejoignez notre communauté Bitcoin",
      highlight: "500+",
      link: "/events",
      icon: <FaUsers className="text-xs" />,
      type: 'stat'
    },
    {
      id: 3,
      text: "Découvrez nos ressources gratuites",
      highlight: "GRATUIT",
      link: "/events",
      icon: <FaStar className="text-xs" />,
      type: 'announcement'
    }
  ];

  // Récupérer le prochain événement
  useEffect(() => {
    const fetchUpcomingEvent = async () => {
      if (!supabase) {
        setLoading(false);
        return;
      }

      try {
        const today = new Date().toISOString().split('T')[0];
        const { data, error } = await supabase
          .from('events')
          .select('*')
          .gte('date', today)
          .order('date', { ascending: true })
          .limit(1);

        if (error) {
          console.error('Erreur récupération événement:', error);
        } else if (data && data.length > 0) {
          setUpcomingEvent(data[0]);
        }
      } catch (error) {
        console.error('Erreur:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUpcomingEvent();
  }, []);

  // Construire les messages dynamiquement
  const messages: BannerMessage[] = loading ? [] : [
    // Message de l'événement à venir (priorité)
    ...(upcomingEvent ? [{
      id: 1,
      text: `${upcomingEvent.title} - ${formatDate(upcomingEvent.date)}`,
      highlight: getEventHighlight(upcomingEvent.date),
      link: "/events",
      icon: <FaCalendarAlt className="text-xs" />,
      type: 'event' as const,
      event: upcomingEvent
    }] : []),
    ...baseMessages
  ];

  useEffect(() => {
    if (!isVisible || messages.length === 0) return;
    
    const interval = setInterval(() => {
      setCurrentMessage((prev) => (prev + 1) % messages.length);
    }, 4000); // Change toutes les 4 secondes

    return () => clearInterval(interval);
  }, [messages.length, isVisible]);

  // Ajouter l'animation CSS de manière SSR-safe
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const styleId = 'top-banner-progress-animations';
    
    // Vérifier si le style existe déjà
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style');
      style.id = styleId;
      style.textContent = `
        @keyframes progress {
          from { width: 0%; }
          to { width: 100%; }
        }
      `;
      document.head.appendChild(style);
    }
  }, []);

  const handleMessageClick = (index: number) => {
    setCurrentMessage(index);
  };

  const currentMsg = messages[currentMessage];

  if (!isVisible || messages.length === 0) {
    return null;
  }

  return (
    <div className="relative inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-brand-dark/80 backdrop-blur-md border border-white/5 text-[10px] md:text-xs font-medium text-gray-400 shadow-lg group">
      {/* Bouton fermer */}
      <button
        onClick={() => setIsVisible(false)}
        className="absolute -top-1 -right-1 p-1 rounded-full bg-brand-dark/90 border border-white/10 text-gray-500 hover:text-white transition-all opacity-0 group-hover:opacity-100"
        aria-label="Fermer la bannière"
      >
        <FaTimes className="text-xs" />
      </button>

      {/* Navigation dots */}
      {messages.length > 1 && (
        <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {messages.map((_, index) => (
            <button
              key={index}
              onClick={() => handleMessageClick(index)}
              className={`w-1.5 h-1.5 rounded-full transition-all ${
                index === currentMessage 
                  ? 'bg-brand-green w-3' 
                  : 'bg-white/30 hover:bg-white/50'
              }`}
              aria-label={`Aller au message ${index + 1}`}
              aria-current={index === currentMessage ? 'true' : 'false'}
            />
          ))}
        </div>
      )}

      <Link 
        href={currentMsg.link || '#'} 
        className="group flex items-center gap-2 hover:text-white transition-all duration-300"
      >
        {/* Point animé */}
        <span className="relative">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-green animate-pulse"></span>
          <span className="absolute inset-0 w-1.5 h-1.5 rounded-full bg-brand-green animate-ping"></span>
        </span>
        
        {/* Icône du message */}
        {currentMsg.icon && (
          <span className="text-brand-green">
            {currentMsg.icon}
          </span>
        )}
        
        {/* Texte du message */}
        <p className="flex items-center gap-1">
          {currentMsg.highlight && (
            <span className={`font-bold animate-pulse ${
              currentMsg.type === 'event' && currentMsg.event?.date && getEventHighlight(currentMsg.event.date) === 'AUJOURD\'HUI' 
                ? 'text-orange-400' 
                : 'text-brand-green'
            }`}>
              [{currentMsg.highlight}]
            </span>
          )}
          <span className="group-hover:translate-x-1 transition-transform duration-300">
            {currentMsg.text}
          </span>
          {currentMsg.type === 'event' && (
            <FaClock className="text-xs opacity-70" />
          )}
          <FaArrowRight className="text-xs opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-1" />
        </p>
      </Link>

      {/* Indicateur de progression */}
      {messages.length > 1 && (
        <div className="absolute bottom-0 left-0 h-0.5 bg-brand-green rounded-full transition-all duration-4000 ease-linear"
          style={{
            width: `${((currentMessage + 1) / messages.length) * 100}%`,
            animation: 'progress 4s linear infinite'
          }}
        />
      )}
    </div>
  );
}