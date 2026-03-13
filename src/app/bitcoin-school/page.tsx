'use client';

import Button from '@/app/components/ui/Button';
import { FaGraduationCap, FaCalendarCheck, FaAward, FaSchool, FaArrowRight } from 'react-icons/fa';

export default function BitcoinSchoolLanding() {

  const features = [
    {
      icon: FaSchool,
      title: "Formation Intensive",
      description: "3 jours pour maîtriser les fondamentaux de Bitcoin, de la théorie à la pratique."
    },
    {
      icon: FaCalendarCheck,
      title: "Présence Certifiée",
      description: "Un suivi rigoureux de la participation pour garantir une expérience d'apprentissage complète."
    },
    {
      icon: FaAward,
      title: "Bitcoin Exam",
      description: "Relevez le défi final : un QCM de 21 questions pour tester vos connaissances."
    }
  ];

  return (
    <div className="min-h-screen bg-brand-dark text-white">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-brand-green/10 via-transparent to-transparent opacity-50 pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-green/10 border border-brand-green/20 text-brand-green mb-8 animate-fade-in">
            <FaGraduationCap />
            <span className="text-sm font-bold tracking-wider uppercase">Édition 2024</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-display font-black mb-6 tracking-tight">
            Bitcoin <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-green to-brand-accent">School</span>
          </h1>
          
          <p className="text-xl text-gray-400 leading-relaxed">
            La formation de référence au Bénin pour comprendre Bitcoin. 
            Apprenez les fondamentaux, le fonctionnement technique et les enjeux économiques 
            en seulement 3 jours.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <Button 
              variant="primary" 
              size="lg" 
              className="px-8 py-4 text-lg flex items-center gap-2 group"
              onClick={() => window.open('https://school.bitcoinbenin.org/exam', '_blank')}
            >
              Passer l&apos;Examen <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button 
              variant="ghost" 
              size="lg" 
              className="px-8 py-4 text-lg"
              onClick={() => document.getElementById('programme')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Découvrir le programme
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-brand-charcoal/50 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="p-8 rounded-2xl bg-brand-dark/50 border border-white/5 hover:border-brand-green/30 transition-all group">
                <div className="w-14 h-14 rounded-xl bg-brand-green/10 flex items-center justify-center text-brand-green text-2xl mb-6 group-hover:scale-110 transition-transform">
                  <feature.icon />
                </div>
                <h3 className="text-2xl font-display font-bold mb-4">{feature.title}</h3>
                <p className="text-gray-400 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Program Section */}
      <section id="programme" className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-display font-black mb-4">Le Programme</h2>
            <div className="w-20 h-1.5 bg-brand-green mx-auto rounded-full" />
          </div>

          <div className="space-y-8">
            {[
              { day: "Jour 1", title: "Introduction & Histoire", topics: ["Origines de la monnaie", "Pourquoi Bitcoin ?", "Le Whitepaper de Satoshi Nakamoto"] },
              { day: "Jour 2", title: "Fonctionnement Technique", topics: ["Blockchain & Minage", "Clés privées & publiques", "Le réseau Lightning"] },
              { day: "Jour 3", title: "Sécurité & Pratique", topics: ["Configuration de wallets", "Bonnes pratiques de sécurité", "Économie du Bitcoin"] }
            ].map((day, idx) => (
              <div key={idx} className="relative pl-12 before:absolute before:left-4 before:top-0 before:bottom-0 before:w-0.5 before:bg-white/10">
                <div className="absolute left-0 top-0 w-8 h-8 rounded-full bg-brand-green flex items-center justify-center font-bold text-sm">
                  {idx + 1}
                </div>
                <div className="bg-brand-charcoal/30 border border-white/5 p-6 rounded-2xl">
                  <h4 className="text-brand-green font-bold mb-2">{day.day}</h4>
                  <h3 className="text-2xl font-display font-bold mb-4">{day.title}</h3>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {day.topics.map((topic, i) => (
                      <li key={i} className="flex items-center gap-2 text-gray-400">
                        <div className="w-1.5 h-1.5 rounded-full bg-brand-green/50" />
                        {topic}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-12 rounded-3xl bg-gradient-to-br from-brand-green/20 to-brand-purple/20 border border-white/10 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-green/10 blur-3xl -translate-y-1/2 translate-x-1/2" />
            <h2 className="text-4xl font-display font-black mb-6">Prêt pour le Bitcoin Exam ?</h2>
            <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
              Seuls les participants ayant validé leur présence les 3 jours peuvent prétendre aux récompenses.
            </p>
            <Button 
              variant="primary" 
              size="lg" 
              className="px-10 py-5 text-xl font-bold rounded-full shadow-glow hover:shadow-glow-hover transition-all"
              onClick={() => window.open('https://school.bitcoinbenin.org/exam', '_blank')}
            >
              Accéder à l&apos;examen
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
