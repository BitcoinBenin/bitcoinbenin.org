'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Button from '@/app/components/ui/Button';
import { FaTrophy, FaClock, FaMedal, FaArrowLeft } from 'react-icons/fa';

interface Result {
  id: string;
  score: number;
  duration_seconds: number;
  completed_at: string;
  participant: {
    full_name: string;
    email: string;
    city: string;
  };
}

export default function BitcoinSchoolResults() {
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

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
  }, [router]);

  const fetchResults = async () => {
    setLoading(true);
    if (!supabase) {
      setLoading(false);
      return;
    }
    try {
      const { data, error } = await supabase
        .from('school_exam_results')
        .select(`
          *,
          participant:school_participants(full_name, email, city)
        `)
        .order('score', { ascending: false })
        .order('duration_seconds', { ascending: true });

      if (error) throw error;
      setResults(data || []);
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
          <Button onClick={fetchResults} variant="ghost">Actualiser</Button>
        </div>

        <div className="bg-brand-charcoal border border-white/10 rounded-3xl overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-white/5 border-b border-white/10 text-gray-400">
                <th className="p-6">Rang</th>
                <th className="p-6">Participant</th>
                <th className="p-6">Ville</th>
                <th className="p-6 text-center">Score</th>
                <th className="p-6 text-center">Temps</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5} className="p-12 text-center text-gray-500">Chargement des résultats...</td></tr>
              ) : results.length === 0 ? (
                <tr><td colSpan={5} className="p-12 text-center text-gray-500">Aucun résultat pour le moment.</td></tr>
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
                    <td className="p-6 text-center">
                      <div className="inline-block px-4 py-1 rounded-full bg-brand-green/10 text-brand-green font-bold text-xl">
                        {r.score} <span className="text-xs text-brand-green/50">/ 21</span>
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
