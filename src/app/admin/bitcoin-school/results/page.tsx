'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Button from '@/app/components/ui/Button';
import { FaTrophy, FaClock, FaMedal, FaArrowLeft, FaDownload } from 'react-icons/fa';

interface Result {
  id: string;
  score: number;
  duration_seconds: number;
  completed_at: string;
  participant: {
    full_name: string;
    email: string;
    city: string;
    session_year: number;
  };
}

export default function BitcoinSchoolResults() {
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterCity, setFilterCity] = useState('');
  const [filterSession, setFilterSession] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();

  const exportToCSV = () => {
    if (results.length === 0) {
      alert('Aucun résultat à exporter');
      return;
    }

    // En-têtes CSV
    const headers = ['Rang', 'Nom', 'Email', 'Ville', 'Session', 'Score', 'Temps', 'Date'];
    
    // Conversion des données en CSV
    const csvData = results.map((r, index) => [
      index + 1,
      r.participant.full_name,
      r.participant.email,
      r.participant.city,
      r.participant.session_year,
      r.score,
      `${Math.floor(r.duration_seconds / 60)}m ${r.duration_seconds % 60}s`,
      new Date(r.completed_at).toLocaleDateString('fr-FR')
    ]);

    // Création du contenu CSV
    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    // Création et téléchargement du fichier
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `bitcoin-exam-results-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  useEffect(() => {
    const init = async () => {
      if (!supabase) return;
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.replace('/login?redirectTo=/admin/bitcoin-school/results');
        return;
      }
      fetchResults();
    };
    init();
  }, [router, filterCity, filterSession, searchTerm]);

  const fetchResults = async () => {
    setLoading(true);
    if (!supabase) {
      setLoading(false);
      return;
    }
    try {
      let query = supabase
        .from('school_exam_results')
        .select(`
          *,
          participant:school_participants(full_name, email, city, session_year)
        `);

      // Appliquer les filtres
      if (filterCity) {
        query = query.eq('participant.city', filterCity);
      }
      if (filterSession) {
        query = query.eq('participant.session_year', parseInt(filterSession));
      }

      const { data, error } = await query
        .order('score', { ascending: false })
        .order('duration_seconds', { ascending: true });

      if (error) throw error;
      
      // Filtrer par terme de recherche (nom ou email)
      let filteredData = data || [];
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        filteredData = filteredData.filter(r => 
          r.participant.full_name.toLowerCase().includes(term) ||
          r.participant.email.toLowerCase().includes(term)
        );
      }
      
      setResults(filteredData);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-dark text-white p-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-12">
          <div>
            <button 
              onClick={() => router.push('/admin/bitcoin-school')}
              className="flex items-center gap-2 text-gray-400 hover:text-brand-green mb-4 transition-colors"
            >
              <FaArrowLeft /> Retour à la gestion
            </button>
            <h1 className="text-4xl font-display font-black flex items-center gap-3">
              <FaTrophy className="text-yellow-500" />
              Classement Bitcoin Exam
            </h1>
            <p className="text-gray-400 mt-2">Les meilleurs scores, départagés par le temps de réponse.</p>
          </div>
          <div className="flex gap-3">
            <Button onClick={exportToCSV} variant="primary" className="flex items-center gap-2">
              <FaDownload /> Export CSV
            </Button>
            <Button onClick={fetchResults} variant="ghost">Actualiser</Button>
          </div>
        </div>

        {/* Filtres et recherche */}
        <div className="bg-brand-charcoal border border-white/10 rounded-3xl p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Recherche</label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Nom ou email..."
                className="w-full bg-brand-dark border border-white/10 rounded-xl px-4 py-2 text-white focus:border-brand-green transition-colors outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Ville</label>
              <select
                value={filterCity}
                onChange={(e) => setFilterCity(e.target.value)}
                className="w-full bg-brand-dark border border-white/10 rounded-xl px-4 py-2 text-white focus:border-brand-green transition-colors outline-none"
              >
                <option value="">Toutes les villes</option>
                <option value="Cotonou">Cotonou</option>
                <option value="Porto Novo">Porto Novo</option>
                <option value="Abomey-Calavi">Abomey-Calavi</option>
                <option value="Parakou">Parakou</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Session</label>
              <select
                value={filterSession}
                onChange={(e) => setFilterSession(e.target.value)}
                className="w-full bg-brand-dark border border-white/10 rounded-xl px-4 py-2 text-white focus:border-brand-green transition-colors outline-none"
              >
                <option value="">Toutes les sessions</option>
                <option value="2026">2026</option>
                <option value="2025">2025</option>
                <option value="2024">2024</option>
              </select>
            </div>
            <div className="flex items-end">
              <Button 
                onClick={() => {
                  setFilterCity('');
                  setFilterSession('');
                  setSearchTerm('');
                }}
                variant="ghost"
                className="w-full"
              >
                Réinitialiser
              </Button>
            </div>
          </div>
        </div>

        <div className="bg-brand-charcoal border border-white/10 rounded-3xl overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-white/5 border-b border-white/10 text-gray-400">
                <th className="p-6">Rang</th>
                <th className="p-6">Participant</th>
                <th className="p-6">Ville</th>
                <th className="p-6">Session</th>
                <th className="p-6 text-center">Score</th>
                <th className="p-6 text-center">Temps</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} className="p-12 text-center text-gray-500">Chargement des résultats...</td></tr>
              ) : results.length === 0 ? (
                <tr><td colSpan={6} className="p-12 text-center text-gray-500">Aucun résultat pour le moment.</td></tr>
              ) : (
                results.map((r, index) => (
                  <tr key={r.id} className="border-b border-white/5 hover:bg-white/5 transition-colors group">
                    <td className="p-6">
                      <div className="flex items-center justify-center w-10 h-10 rounded-full font-bold">
                        {index === 0 ? <FaMedal className="text-yellow-400 text-2xl" /> : 
                         index === 1 ? <FaMedal className="text-gray-300 text-2xl" /> :
                         index === 2 ? <FaMedal className="text-orange-400 text-2xl" /> :
                         <span className="text-gray-500">#{index + 1}</span>}
                      </div>
                    </td>
                    <td className="p-6">
                      <div className="font-bold text-lg group-hover:text-brand-green transition-colors">{r.participant.full_name}</div>
                      <div className="text-sm text-gray-500">{r.participant.email}</div>
                    </td>
                    <td className="p-6 text-gray-400">{r.participant.city}</td>
                    <td className="p-6 text-gray-400">{r.participant.session_year}</td>
                    <td className="p-6 text-center">
                      <div className="inline-block px-4 py-1 rounded-full bg-brand-green/10 text-brand-green font-bold text-xl">
                        {r.score} <span className="text-xs text-brand-green/50">/ 100</span>
                      </div>
                    </td>
                    <td className="p-6 text-center text-gray-400">
                      <div className="flex items-center justify-center gap-2">
                        <FaClock className="text-xs" />
                        {Math.floor(r.duration_seconds / 60)}m {r.duration_seconds % 60}s
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
