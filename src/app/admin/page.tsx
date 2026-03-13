'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Card from '@/app/components/ui/Card';
import { 
  FaImages, 
  FaCalendarAlt, 
  FaSchool, 
  FaChartBar,
  FaArrowRight
} from 'react-icons/fa';
import Link from 'next/link';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    events: 0,
    gallery: 0,
    school: 0
  });
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const init = async () => {
      if (!supabase) {
        router.replace('/login');
        return;
      }

      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.replace('/login?redirectTo=/admin');
        return;
      }

      fetchStats();
    };

    init();
  }, [router]);

  const fetchStats = async () => {
    setLoading(true);
    if (!supabase) {
      setLoading(false);
      return;
    }
    try {
      const [eventsCount, galleryCount, schoolCount] = await Promise.all([
        supabase.from('events').select('*', { count: 'exact', head: true }),
        supabase.from('gallery_images').select('*', { count: 'exact', head: true }),
        supabase.from('school_participants').select('*', { count: 'exact', head: true })
      ]);

      setStats({
        events: eventsCount.count || 0,
        gallery: galleryCount.count || 0,
        school: schoolCount.count || 0
      });
    } catch (error) {
      console.error('Erreur stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const dashboardCards = [
    {
      title: 'Gallery Photos',
      description: 'Gérez les albums et les photos de la communauté.',
      icon: FaImages,
      count: stats.gallery,
      href: '/admin/gallery',
      color: 'from-brand-green to-emerald-500'
    },
    {
      title: 'Événements',
      description: 'Créez et modifiez les événements à venir.',
      icon: FaCalendarAlt,
      count: stats.events,
      href: '/admin/events',
      color: 'from-blue-500 to-brand-electric'
    },
    {
      title: 'Bitcoin School',
      description: 'Gestion des participants, présences et examens.',
      icon: FaSchool,
      count: stats.school,
      href: '/admin/bitcoin-school',
      color: 'from-brand-green to-brand-accent'
    }
  ];

  return (
    <div className="p-8 md:p-12">
      {/* Welcome Header */}
      <div className="mb-12 animate-fade-in">
        <h1 className="text-4xl md:text-5xl font-display font-black text-white mb-4">
          Bonjour, 
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-green to-brand-accent ml-3">
            Administrateur
          </span>
        </h1>
        <p className="text-xl text-gray-400">
          Voici un aperçu de l&apos;activité de Bitcoin Bénin.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        {dashboardCards.map((card, index) => (
          <Link href={card.href} key={index} className="group">
            <Card className="relative p-8 h-full bg-brand-charcoal hover:bg-white/5 border border-white/5 hover:border-brand-green/30 transition-all duration-500">
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${card.color} p-4 text-white text-3xl mb-8 group-hover:scale-110 transition-transform`}>
                <card.icon />
              </div>
              
              <div className="mb-6">
                <div className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-2">
                  {card.title}
                </div>
                <div className="text-4xl font-display font-black text-white">
                  {loading ? '...' : card.count}
                </div>
              </div>

              <p className="text-gray-400 leading-relaxed mb-8">
                {card.description}
              </p>

              <div className="flex items-center gap-2 text-brand-green font-bold group-hover:translate-x-2 transition-transform">
                Gérer <FaArrowRight />
              </div>
            </Card>
          </Link>
        ))}
      </div>

      {/* Recent Activity or Placeholder */}
      <div className="bg-brand-charcoal/30 border border-white/5 rounded-3xl p-12 text-center">
        <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center text-3xl text-gray-500 mx-auto mb-6">
          <FaChartBar />
        </div>
        <h2 className="text-2xl font-display font-bold text-white mb-4">Statistiques Détaillées</h2>
        <p className="text-gray-400 max-w-xl mx-auto">
          Les graphiques d&apos;engagement et les rapports détaillés seront bientôt disponibles ici pour vous aider à mieux suivre l&apos;évolution de la communauté.
        </p>
      </div>
    </div>
  );
}
