"use client";

import Link from 'next/link';
import { useEffect } from 'react';
import AnimatedCounter from '../components/AnimatedCounter';
import EventPieChart from '../components/EventPieChart';
import EngagementBarChart from '../components/EngagementBarChart';

export default function StatistiquesPage() {
  useEffect(() => {
    // Timer pour l'animation des barres (utilisé dans les composants enfants)
    const timer = setTimeout(() => {
      // Animation activée
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <main className="bg-hero-gradient-dark text-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center mb-8">
          <Link 
            href="/communaute" 
            className="flex items-center text-vert hover:text-vert-light transition-colors duration-300"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Retour à la communauté
          </Link>
        </div>

        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 animate-fade-in">Statistiques de la Communauté</h1>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto animate-fade-in-delay">
            Découvrez les chiffres clés de notre communauté Bitcoin Bénin
          </p>
        </div>

        {/* Section des statistiques principales */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-black bg-opacity-30 rounded-xl p-6 text-center border border-gray-700 transform transition-all duration-500 hover:scale-105 hover:shadow-xl">
            <div className="flex justify-center">
              <AnimatedCounter target={150} suffix="+" />
            </div>
            <div className="text-lg animate-fade-in-up">Membres Actifs</div>
            <div className="text-sm text-gray-400 mt-2 animate-fade-in-up-delay">Dans notre communauté</div>
          </div>
          
          <div className="bg-black bg-opacity-30 rounded-xl p-6 text-center border border-gray-700 transform transition-all duration-500 hover:scale-105 hover:shadow-xl">
            <div className="flex justify-center">
              <AnimatedCounter target={24} />
            </div>
            <div className="text-lg animate-fade-in-up">Événements Organisés</div>
            <div className="text-sm text-gray-400 mt-2 animate-fade-in-up-delay">Depuis notre création</div>
          </div>
          
          <div className="bg-black bg-opacity-30 rounded-xl p-6 text-center border border-gray-700 transform transition-all duration-500 hover:scale-105 hover:shadow-xl">
            <div className="flex justify-center">
              <AnimatedCounter target={4} />
            </div>
            <div className="text-lg animate-fade-in-up">Partenaires</div>
            <div className="text-sm text-gray-400 mt-2 animate-fade-in-up-delay">4 partenaires actifs</div>
          </div>
        </div>

        {/* Section détaillée */}
        <div className="bg-black bg-opacity-30 rounded-xl p-6 md:p-8 border border-gray-700 mb-12 transform transition-all duration-700 hover:shadow-2xl">
          <h2 className="text-2xl font-bold mb-6 text-vert animate-fade-in">Nos Activités en Chiffres</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <EventPieChart />
            <EngagementBarChart />
          </div>
        </div>

        {/* Section des objectifs */}
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-6 text-vert animate-fade-in">Nos Objectifs pour 2025</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-black bg-opacity-30 rounded-xl p-6 border border-gray-700 transform transition-all duration-500 hover:scale-105 hover:shadow-lg animate-fade-in-up">
              <div className="text-4xl mb-4"></div>
              <h3 className="text-lg font-semibold mb-2">250+ Membres</h3>
              <p className="text-sm text-gray-400">Élargir notre communauté</p>
            </div>
            
            <div className="bg-black bg-opacity-30 rounded-xl p-6 border border-gray-700 transform transition-all duration-500 hover:scale-105 hover:shadow-lg animate-fade-in-up-delay">
              <div className="text-4xl mb-4"></div>
              <h3 className="text-lg font-semibold mb-2">36 Événements</h3>
              <p className="text-sm text-gray-400">Plus d&apos;activités tout au long de l&apos;année</p>
            </div>
            
            <div className="bg-black bg-opacity-30 rounded-xl p-6 border border-gray-700 transform transition-all duration-500 hover:scale-105 hover:shadow-lg animate-fade-in-up-delay-2">
              <div className="text-4xl mb-4"></div>
              <h3 className="text-lg font-semibold mb-2">5 Villes</h3>
              <p className="text-sm text-gray-400">Étendre notre présence au Bénin</p>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes fadeInUp {
          from { 
            opacity: 0; 
            transform: translateY(20px); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0); 
          }
        }
        
        @keyframes fadeInLeft {
          from { 
            opacity: 0; 
            transform: translateX(-20px); 
          }
          to { 
            opacity: 1; 
            transform: translateX(0); 
          }
        }
        
        @keyframes fadeInRight {
          from { 
            opacity: 0; 
            transform: translateX(20px); 
          }
          to { 
            opacity: 1; 
            transform: translateX(0); 
          }
        }
        
        .animate-fade-in {
          animation: fadeIn 0.8s ease-out;
        }
        
        .animate-fade-in-delay {
          animation: fadeIn 0.8s ease-out 0.2s both;
        }
        
        .animate-fade-in-up {
          animation: fadeInUp 0.6s ease-out;
        }
        
        .animate-fade-in-up-delay {
          animation: fadeInUp 0.6s ease-out 0.2s both;
        }
        
        .animate-fade-in-up-delay-2 {
          animation: fadeInUp 0.6s ease-out 0.4s both;
        }
        
        .animate-fade-in-left {
          animation: fadeInLeft 0.6s ease-out;
        }
        
        .animate-fade-in-right {
          animation: fadeInRight 0.6s ease-out;
        }
      `}</style>
    </main>
  );
}