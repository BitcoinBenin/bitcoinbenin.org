'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Card from '@/app/components/ui/Card';
import AuthWrapper from '@/app/components/AuthWrapper';
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
      console.error('Erreur lors du chargement des statistiques:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <AuthWrapper>
      <div className="p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-display font-black text-white mb-4">
              Tableau de Bord
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-green to-brand-accent ml-3">
                Admin
              </span>
            </h1>
            <p className="text-gray-400">Gérez votre site Bitcoin Bénin</p>
          </div>

          {/* Stats Cards */}
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-green"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card className="bg-brand-charcoal/50 border border-white/10 p-6 hover:border-brand-green/30 transition-all">
                <div className="flex items-center justify-between mb-4">
                  <FaCalendarAlt className="text-3xl text-brand-green" />
                  <span className="text-3xl font-black text-white">{stats.events}</span>
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Événements</h3>
                <p className="text-gray-400 text-sm">Événements publiés</p>
                <Link href="/admin/events" className="inline-flex items-center gap-2 text-brand-green hover:text-brand-accent mt-4 transition-colors">
                  Gérer <FaArrowRight className="text-sm" />
                </Link>
              </Card>

              <Card className="bg-brand-charcoal/50 border border-white/10 p-6 hover:border-brand-green/30 transition-all">
                <div className="flex items-center justify-between mb-4">
                  <FaImages className="text-3xl text-brand-green" />
                  <span className="text-3xl font-black text-white">{stats.gallery}</span>
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Galerie</h3>
                <p className="text-gray-400 text-sm">Images uploadées</p>
                <Link href="/admin/gallery" className="inline-flex items-center gap-2 text-brand-green hover:text-brand-accent mt-4 transition-colors">
                  Gérer <FaArrowRight className="text-sm" />
                </Link>
              </Card>

              <Card className="bg-brand-charcoal/50 border border-white/10 p-6 hover:border-brand-green/30 transition-all">
                <div className="flex items-center justify-between mb-4">
                  <FaSchool className="text-3xl text-brand-green" />
                  <span className="text-3xl font-black text-white">{stats.school}</span>
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Bitcoin School</h3>
                <p className="text-gray-400 text-sm">Participants inscrits</p>
                <Link href="/admin/bitcoin-school" className="inline-flex items-center gap-2 text-brand-green hover:text-brand-accent mt-4 transition-colors">
                  Gérer <FaArrowRight className="text-sm" />
                </Link>
              </Card>
            </div>
          )}

          {/* Quick Actions */}
          <Card className="bg-brand-charcoal/50 border border-white/10 p-8">
            <h2 className="text-2xl font-bold text-white mb-6">Actions Rapides</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link href="/admin/events" className="block">
                <Card className="bg-brand-dark/50 border border-white/5 p-4 hover:border-brand-green/30 transition-all cursor-pointer">
                  <div className="flex items-center gap-3">
                    <FaCalendarAlt className="text-2xl text-brand-green" />
                    <div>
                      <h3 className="font-bold text-white">Créer un événement</h3>
                      <p className="text-gray-400 text-sm">Ajouter un nouvel événement</p>
                    </div>
                  </div>
                </Card>
              </Link>

              <Link href="/admin/gallery" className="block">
                <Card className="bg-brand-dark/50 border border-white/5 p-4 hover:border-brand-green/30 transition-all cursor-pointer">
                  <div className="flex items-center gap-3">
                    <FaImages className="text-2xl text-brand-green" />
                    <div>
                      <h3 className="font-bold text-white">Ajouter des photos</h3>
                      <p className="text-gray-400 text-sm">Uploader de nouvelles images</p>
                    </div>
                  </div>
                </Card>
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </AuthWrapper>
  );
}
