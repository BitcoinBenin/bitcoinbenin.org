'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { FeaturedEvent } from '@/app/types/events';

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDontShowAgain: () => void;
  featuredEvent: FeaturedEvent | null;
}

export default function EventModal({ isOpen, onClose, onDontShowAgain, featuredEvent }: EventModalProps) {
  const [countdown, setCountdown] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isPast: false
  });
  const [hasTriggeredConfetti, setHasTriggeredConfetti] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const previousSecondsRef = useRef<number>(-1);

  // Initialize audio context
  useEffect(() => {
    if (typeof window !== 'undefined') {
      audioContextRef.current = new (window.AudioContext || (window as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext)();
    }
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  // Play tick sound for countdown
  const playTickSound = () => {
    if (!audioContextRef.current) return;
    
    const oscillator = audioContextRef.current.createOscillator();
    const gainNode = audioContextRef.current.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContextRef.current.destination);
    
    oscillator.frequency.value = 800;
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.1, audioContextRef.current.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContextRef.current.currentTime + 0.1);
    
    oscillator.start(audioContextRef.current.currentTime);
    oscillator.stop(audioContextRef.current.currentTime + 0.1);
  };

  // Play celebration sound
  const playCelebrationSound = () => {
    if (!audioContextRef.current) return;
    
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C, E, G, C (higher)
    notes.forEach((frequency, index) => {
      setTimeout(() => {
        const oscillator = audioContextRef.current!.createOscillator();
        const gainNode = audioContextRef.current!.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContextRef.current!.destination);
        
        oscillator.frequency.value = frequency;
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0.2, audioContextRef.current!.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContextRef.current!.currentTime + 0.5);
        
        oscillator.start(audioContextRef.current!.currentTime);
        oscillator.stop(audioContextRef.current!.currentTime + 0.5);
      }, index * 100);
    });
  };

  // Trigger confetti
  const triggerConfetti = () => {
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 5000); // Hide after 5 seconds
  };

  useEffect(() => {
    if (!isOpen || !featuredEvent) return;

    const targetDate = new Date(featuredEvent.start_date);
    const updateCountdown = () => {
      const now = new Date();
      const difference = targetDate.getTime() - now.getTime();

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);
        
        const newCountdown = { days, hours, minutes, seconds, isPast: false };
        setCountdown(newCountdown);
        
        // Play tick sound every second for last 10 seconds
        if (days === 0 && hours === 0 && minutes === 0 && seconds <= 10) {
          if (seconds !== previousSecondsRef.current) {
            playTickSound();
            previousSecondsRef.current = seconds;
          }
        }
      } else {
        // Événement en cours - temps écoulé depuis le début
        const elapsed = Math.abs(difference);
        const hours = Math.floor(elapsed / (1000 * 60 * 60));
        const minutes = Math.floor((elapsed % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((elapsed % (1000 * 60)) / 1000);
        
        const newCountdown = { days: 0, hours, minutes, seconds, isPast: true };
        setCountdown(newCountdown);
        
        // Trigger confetti and celebration sound when event starts
        if (!hasTriggeredConfetti) {
          triggerConfetti();
          playCelebrationSound();
          setHasTriggeredConfetti(true);
        }
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000); // Toutes les secondes

    return () => clearInterval(interval);
  }, [isOpen, featuredEvent, hasTriggeredConfetti]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Confetti Animation */}
          <AnimatePresence>
            {showConfetti && (
              <div className="absolute inset-0 pointer-events-none overflow-hidden">
                {[...Array(50)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ 
                      x: 0,
                      y: -50,
                      rotate: 0,
                      scale: Math.random() * 0.5 + 0.5
                    }}
                    animate={{ 
                      y: '100vh',
                      rotate: Math.random() * 720 - 360,
                      x: Math.random() * 200 - 100
                    }}
                    transition={{ 
                      duration: Math.random() * 3 + 2,
                      ease: "linear",
                      repeat: 0
                    }}
                    className="absolute w-3 h-3 rounded-full"
                    style={{
                      backgroundColor: ['#53CB60', '#00D9FF', '#8B5CF6', '#06FFA5', '#FFFFFF', '#3FA34C'][Math.floor(Math.random() * 6)],
                      left: `${Math.random() * 100}%`,
                      animationDelay: `${Math.random() * 2}s`
                    }}
                  />
                ))}
              </div>
            )}
          </AnimatePresence>

          {/* Animated Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-brand-dark via-brand-green/10 to-brand-charcoal animate-pulse" />
          
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/80 backdrop-blur-xl"
            onClick={onClose}
          />
          
          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", duration: 0.3 }}
            className="relative bg-brand-dark/40 backdrop-blur-2xl border border-brand-green/20 rounded-3xl p-6 lg:p-10 max-w-4xl w-full shadow-2xl overflow-hidden"
          >
            {/* Glossy overlay effect */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-brand-green/50 to-transparent" />

            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-6 right-6 z-10 p-2 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all duration-300"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Content */}
            <div className="flex flex-col lg:flex-row gap-10">
              {/* Left Side - Text Content */}
              <div className="flex-1 text-center lg:text-left order-2 lg:order-1">
                {/* Badge */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="inline-flex items-center gap-2 bg-brand-green/10 border border-brand-green/20 text-brand-green px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-6"
                >
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-green opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-green"></span>
                  </span>
                  Événement en Vedette
                </motion.div>

                {/* Title */}
                <h3 className="text-3xl lg:text-4xl font-display font-black text-white mb-4 leading-tight">
                  {featuredEvent?.title || 'Événement Bitcoin Bénin'}
                </h3>

                {/* Date & Location */}
                <div className="space-y-3 mb-6">
                  {featuredEvent && (
                    <>
                      <div className="flex items-center justify-center lg:justify-start gap-3 text-brand-green font-medium">
                        <div className="p-2 rounded-lg bg-brand-green/10">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <span className="text-gray-200">
                          {new Date(featuredEvent.start_date).toLocaleDateString('fr-FR', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                          {featuredEvent.end_date && featuredEvent.end_date !== featuredEvent.start_date && (
                            <> - {new Date(featuredEvent.end_date).toLocaleDateString('fr-FR', {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric'
                            })}</>
                          )}
                        </span>
                      </div>
                      <div className="flex items-center justify-center lg:justify-start gap-3 text-brand-green font-medium">
                        <div className="p-2 rounded-lg bg-brand-green/10">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          </svg>
                        </div>
                        <span className="text-gray-300 italic">{featuredEvent.location}</span>
                      </div>
                    </>
                  )}
                </div>

                {/* Description */}
                <p className="text-gray-400 text-lg leading-relaxed mb-8 line-clamp-3">
                  {featuredEvent?.description || 'Rejoignez-nous pour cet événement exceptionnel et découvrez le futur de la finance.'}
                </p>

                {/* Action Buttons */}
                <div className="flex flex-col gap-4">
                  <motion.button
                    whileHover={{ scale: 1.02, translateY: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => featuredEvent?.registration_url && window.open(featuredEvent.registration_url, '_blank')}
                    className="w-full bg-gradient-to-r from-brand-green to-brand-green-dark text-brand-dark font-black py-4 px-8 rounded-xl shadow-[0_0_20px_rgba(83,203,96,0.3)] hover:shadow-[0_0_30px_rgba(83,203,96,0.5)] transition-all duration-300 text-lg uppercase tracking-wider"
                  >
                     S&apos;inscrire Gratuitement
                  </motion.button>

                  <div className="flex gap-3">
                    <button
                      onClick={() => window.open('/events', '_self')}
                      className="flex-1 bg-white/5 border border-white/10 text-white py-3 px-4 rounded-xl hover:bg-white/10 transition-all text-sm font-semibold"
                    >
                       Tous les événements
                    </button>
                    
                    <button
                      onClick={onDontShowAgain}
                      className="flex-1 text-gray-500 py-3 px-4 rounded-xl hover:text-gray-300 transition-colors text-xs font-medium"
                    >
                       Ne plus afficher
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Side - Media & Timer */}
              <div className="flex-1 lg:max-w-md order-1 lg:order-2 space-y-6">
                {/* Countdown */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                  className="bg-brand-dark/60 backdrop-blur-xl rounded-3xl p-6 border border-white/5 shadow-glass relative overflow-hidden group"
                >
                  {/* Glowing background effect */}
                  <div className="absolute -top-20 -right-20 w-40 h-40 bg-brand-green/10 blur-[50px] rounded-full group-hover:bg-brand-green/20 transition-all duration-700" />
                  
                  <p className="text-gray-400 font-bold text-xs text-center mb-6 tracking-[0.2em] uppercase">
                    {countdown.isPast ? (
                      <span className="text-brand-green animate-pulse">
                        ÉVÉNEMENT EN COURS
                      </span>
                    ) : (
                      'Début dans'
                    )}
                  </p>
                  
                  {!countdown.isPast ? (
                    <div className="flex items-center justify-between gap-2">
                      {/* Days */}
                      <div className="flex-1 flex flex-col items-center">
                        <div className="relative w-full h-16 bg-white/5 rounded-xl border border-white/10 flex items-center justify-center overflow-hidden">
                          <AnimatePresence mode="wait">
                            <motion.span
                              key={countdown.days}
                              initial={{ y: 20, opacity: 0 }}
                              animate={{ y: 0, opacity: 1 }}
                              exit={{ y: -20, opacity: 0 }}
                              className="text-2xl lg:text-3xl font-black text-white tabular-nums"
                            >
                              {String(countdown.days).padStart(2, '0')}
                            </motion.span>
                          </AnimatePresence>
                        </div>
                        <span className="text-[10px] text-gray-500 font-bold mt-2 uppercase tracking-tighter">Jours</span>
                      </div>

                      <span className="text-brand-green/40 font-black mb-6 text-xl">:</span>

                      {/* Hours */}
                      <div className="flex-1 flex flex-col items-center">
                        <div className="relative w-full h-16 bg-white/5 rounded-xl border border-white/10 flex items-center justify-center overflow-hidden">
                          <AnimatePresence mode="wait">
                            <motion.span
                              key={countdown.hours}
                              initial={{ y: 20, opacity: 0 }}
                              animate={{ y: 0, opacity: 1 }}
                              exit={{ y: -20, opacity: 0 }}
                              className="text-2xl lg:text-3xl font-black text-white tabular-nums"
                            >
                              {String(countdown.hours).padStart(2, '0')}
                            </motion.span>
                          </AnimatePresence>
                        </div>
                        <span className="text-[10px] text-gray-500 font-bold mt-2 uppercase tracking-tighter">Heures</span>
                      </div>

                      <span className="text-brand-green/40 font-black mb-6 text-xl">:</span>

                      {/* Minutes */}
                      <div className="flex-1 flex flex-col items-center">
                        <div className="relative w-full h-16 bg-white/5 rounded-xl border border-white/10 flex items-center justify-center overflow-hidden">
                          <AnimatePresence mode="wait">
                            <motion.span
                              key={countdown.minutes}
                              initial={{ y: 20, opacity: 0 }}
                              animate={{ y: 0, opacity: 1 }}
                              exit={{ y: -20, opacity: 0 }}
                              className="text-2xl lg:text-3xl font-black text-white tabular-nums"
                            >
                              {String(countdown.minutes).padStart(2, '0')}
                            </motion.span>
                          </AnimatePresence>
                        </div>
                        <span className="text-[10px] text-gray-500 font-bold mt-2 uppercase tracking-tighter">Min</span>
                      </div>

                      <span className="text-brand-green/40 font-black mb-6 text-xl">:</span>

                      {/* Seconds */}
                      <div className="flex-1 flex flex-col items-center">
                        <div className={`relative w-full h-16 rounded-xl border flex items-center justify-center overflow-hidden transition-all duration-300 ${
                          countdown.days === 0 && countdown.hours === 0 && countdown.minutes === 0 && countdown.seconds <= 10
                            ? 'bg-brand-green/20 border-brand-green/50 shadow-[0_0_15px_rgba(83,203,96,0.2)]'
                            : 'bg-brand-green/5 border-brand-green/20'
                        }`}>
                          <AnimatePresence mode="wait">
                            <motion.span
                              key={countdown.seconds}
                              initial={{ y: 20, opacity: 0 }}
                              animate={{ y: 0, opacity: 1 }}
                              exit={{ y: -20, opacity: 0 }}
                              className={`text-2xl lg:text-3xl font-black tabular-nums ${
                                countdown.days === 0 && countdown.hours === 0 && countdown.minutes === 0 && countdown.seconds <= 10
                                  ? 'text-white'
                                  : 'text-brand-green'
                              }`}
                            >
                              {String(countdown.seconds).padStart(2, '0')}
                            </motion.span>
                          </AnimatePresence>
                        </div>
                        <span className="text-[10px] text-brand-green font-bold mt-2 uppercase tracking-tighter">Sec</span>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-2">
                      <motion.div
                        initial={{ scale: 0.9 }}
                        animate={{ scale: 1 }}
                        transition={{ repeat: Infinity, duration: 2, repeatType: "reverse" }}
                        className="space-y-3"
                      >
                        <div className="text-3xl lg:text-4xl font-display font-black text-brand-green drop-shadow-[0_0_10px_rgba(83,203,96,0.5)]">
                          C&apos;EST PARTI !
                        </div>
                        <div className="text-sm font-medium text-gray-400">
                          Depuis {countdown.hours}h {countdown.minutes}m {countdown.seconds}s
                        </div>
                      </motion.div>
                    </div>
                  )}
                </motion.div>

                {/* Image Preview */}
                <div className="relative group rounded-3xl overflow-hidden border border-white/5 shadow-2xl aspect-[4/3] lg:aspect-auto lg:h-56">
                  {featuredEvent?.image ? (
                    <Image
                      src={featuredEvent.image}
                      alt={`Preview for ${featuredEvent.title}`}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                      onError={(e) => {
                        e.currentTarget.src = '/bs1.webp';
                      }}
                    />
                  ) : (
                    <div className="w-full h-full relative overflow-hidden bg-brand-dark/50 flex items-center justify-center">
                      <Image
                        src="/bs1.webp"
                        alt="Bitcoin Benin Communauté"
                        fill
                        className="object-contain transition-transform duration-700 group-hover:scale-105"
                      />
                    </div>
                  )}
                  
                  {/* Video Overlay */}
                  {featuredEvent?.video_url && (
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <button
                        onClick={() => featuredEvent.video_url && window.open(featuredEvent.video_url, '_blank')}
                        className="bg-brand-green text-brand-dark rounded-full p-5 hover:scale-110 transition-transform shadow-glow"
                      >
                        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z"/>
                        </svg>
                      </button>
                    </div>
                  )}

                  {/* Top-right decorative badge */}
                  <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md border border-white/10 px-3 py-1 rounded-full text-[10px] font-bold text-white uppercase tracking-widest">
                    Direct
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
