'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Button from '@/app/components/ui/Button';
import Card from '@/app/components/ui/Card';
import { FaUserPlus, FaCheck, FaTimes, FaTrash, FaSearch, FaGraduationCap, FaQuestionCircle, FaFileImport, FaMapMarkerAlt, FaEraser } from 'react-icons/fa';
import { getParticipants, addParticipant, updateAttendance, deleteParticipant, bulkAddParticipants, getSchoolStatsByCity, clearAllParticipants, Participant, Attendance } from './school-actions';

export default function BitcoinSchoolAdmin() {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [cityStats, setCityStats] = useState<Array<{
    name: string;
    participants: number;
    attendance_d1: number;
    attendance_d2: number;
    attendance_d3: number;
    total_exam_score: number;
    exam_count: number;
  }>>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCity, setSelectedCity] = useState('Toutes');
  const [importCity, setImportCity] = useState('Abomey-Calavi');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newParticipant, setNewParticipant] = useState({
    name: '',
    email: '',
    phone: '',
    city: 'Cotonou'
  });
  const router = useRouter();

  useEffect(() => {
    const init = async () => {
      if (!supabase) return;
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.replace('/login?redirectTo=/admin/bitcoin-school');
        return;
      }
      fetchData();
    };
    init();
  }, [router]);

  const fetchData = async () => {
    setLoading(true);
    const [pResult, sResult] = await Promise.all([
      getParticipants(),
      getSchoolStatsByCity()
    ]);
    
    if (pResult.success) setParticipants(pResult.data || []);
    if (sResult.success) setCityStats(sResult.data || []);
    
    setLoading(false);
  };

  const handleAddParticipant = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await addParticipant(
      newParticipant.name,
      newParticipant.email,
      newParticipant.phone,
      newParticipant.city
    );
    if (result.success) {
      setShowAddForm(false);
      setNewParticipant({ name: '', email: '', phone: '', city: 'Cotonou' });
      fetchData();
    } else {
      alert('Erreur: ' + result.error);
    }
  };

  const toggleAttendance = async (participantId: string, day: 1 | 2 | 3, currentStatus: boolean) => {
    const result = await updateAttendance(participantId, day, !currentStatus);
    if (result.success) {
      // On rafraîchit tout pour mettre à jour les statistiques globales en haut
      fetchData();
    }
  };

  const handleClearAll = async () => {
    if (confirm('ÊTES-VOUS SÛR ? Cette action supprimera TOUS les participants, toutes les présences et tous les résultats d&apos;examen de la base de données. Cette action est irréversible.')) {
      setLoading(true);
      const result = await clearAllParticipants();
      if (result.success) {
        alert('Toutes les données ont été effacées.');
        fetchData();
      } else {
        alert('Erreur: ' + result.error);
      }
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Supprimer ce participant ?')) {
      const result = await deleteParticipant(id);
      if (result.success) {
        setParticipants(participants.filter(p => p.id !== id));
      }
    }
  };

  const filteredParticipants = participants.filter(p => {
    const matchesSearch = p.full_name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         p.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCity = selectedCity === 'Toutes' || p.city === selectedCity;
    return matchesSearch && matchesCity;
  });

  const cities = ['Toutes', ...Array.from(new Set(participants.map(p => p.city)))];

  const handleImportCSV = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const text = event.target?.result as string;
      const lines = text.split('\n');
      const headers = lines[0].split(/[;,]/).map(h => h.trim().toLowerCase());
      
      const emailIdx = headers.findIndex(h => h.includes('email'));
      const nameIdx = headers.findIndex(h => h.includes('name') || h.includes('nom'));
      const phoneIdx = headers.findIndex(h => h.includes('phone') || h.includes('téléphone'));

      if (emailIdx === -1 || nameIdx === -1) {
        alert("Le CSV doit contenir au moins les colonnes 'Name' et 'Email'.");
        return;
      }

      const parsedParticipants = lines.slice(1)
        .filter(line => line.trim())
        .map(line => {
          const cols = line.split(/[;,]/);
          return {
            name: cols[nameIdx]?.trim(),
            email: cols[emailIdx]?.trim(),
            phone: phoneIdx !== -1 ? cols[phoneIdx]?.trim() : '',
            city: importCity // Utilise la ville sélectionnée pour l'import
          };
        })
        .filter(p => p.email && p.name);

      if (confirm(`Importer ${parsedParticipants.length} participants pour la ville de ${importCity} ?`)) {
        setLoading(true);
        const result = await bulkAddParticipants(parsedParticipants);
        if (result.success) {
          alert(`${result.count} participants importés avec succès !`);
          fetchData();
        } else {
          alert('Erreur: ' + result.error);
        }
        setLoading(false);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="p-8 md:p-12">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-4xl md:text-5xl font-display font-black text-white mb-4">
              Bitcoin 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-green to-brand-accent ml-3">
                School
              </span>
            </h1>
            <p className="text-xl text-gray-400 mt-2 tracking-wide">Gestion des présences et des participants</p>
          </div>
          <div className="flex gap-4 items-center flex-wrap">
            <div className="flex items-center gap-2 bg-brand-charcoal border border-white/10 rounded-xl px-4 py-2 hover:border-brand-green/30 transition-all">
              <span className="text-[10px] text-gray-500 font-black uppercase tracking-tighter">Ville d&apos;import:</span>
              <select 
                className="bg-transparent text-sm font-black text-brand-green outline-none cursor-pointer"
                value={importCity}
                onChange={(e) => setImportCity(e.target.value)}
              >
                <option value="Cotonou">Cotonou</option>
                <option value="Abomey-Calavi">Abomey-Calavi</option>
                <option value="Porto-Novo">Porto-Novo</option>
                <option value="Parakou">Parakou</option>
              </select>
            </div>
            <input
              type="file"
              accept=".csv"
              id="csv-import"
              className="hidden"
              onChange={handleImportCSV}
            />
            <Button 
              onClick={() => document.getElementById('csv-import')?.click()} 
              variant="ghost" 
              className="flex items-center gap-2 border border-white/10 hover:border-brand-green/50"
            >
              <FaFileImport className="text-brand-green" /> Import Luma CSV
            </Button>
            <Button 
              onClick={handleClearAll} 
              variant="ghost" 
              className="flex items-center gap-2 text-red-500 border border-red-500/10 hover:bg-red-500/10 transition-colors"
            >
              <FaEraser /> Vider la liste
            </Button>
            <Button onClick={() => setShowAddForm(!showAddForm)} variant="primary" className="flex items-center gap-2">
              <FaUserPlus /> Ajouter
            </Button>
            <Button onClick={() => router.push('/admin/bitcoin-school/questions')} variant="secondary" className="flex items-center gap-2">
              <FaQuestionCircle /> Gérer le QCM
            </Button>
            <Button onClick={() => router.push('/admin/bitcoin-school/results')} variant="ghost" className="flex items-center gap-2">
              <FaGraduationCap /> Résultats Examen
            </Button>
          </div>
        </div>

        {/* Statistiques par Ville */}
        {!loading && cityStats.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12 animate-fade-in">
            {cityStats.map((stat, idx) => (
              <Card key={idx} className="p-6 bg-brand-charcoal border border-white/5 hover:border-brand-green/30 transition-all group">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-3 bg-brand-green/10 rounded-xl text-brand-green group-hover:scale-110 transition-transform">
                    <FaMapMarkerAlt />
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-black text-gray-500 uppercase tracking-widest">Inscrits</div>
                    <div className="text-2xl font-black text-white">{stat.participants}</div>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-white mb-4">{stat.name}</h3>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Présence Moy.</span>
                    <span className="text-brand-green font-bold">
                      {stat.participants > 0 ? Math.round(((stat.attendance_d1 + stat.attendance_d2 + stat.attendance_d3) / (stat.participants * 3)) * 100) : 0}%
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-brand-green" 
                      style={{ width: `${stat.participants > 0 ? ((stat.attendance_d1 + stat.attendance_d2 + stat.attendance_d3) / (stat.participants * 3)) * 100 : 0}%` }}
                    />
                  </div>
                  
                  {/* Détail par jour */}
                  <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-tighter text-gray-500 pt-1">
                    <div className="flex flex-col items-center">
                      <span>Jour 1</span>
                      <span className="text-white text-xs">{stat.attendance_d1}</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <span>Jour 2</span>
                      <span className="text-white text-xs">{stat.attendance_d2}</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <span>Jour 3</span>
                      <span className="text-white text-xs">{stat.attendance_d3}</span>
                    </div>
                  </div>

                  <div className="flex justify-between text-sm pt-2 border-t border-white/5">
                    <span className="text-gray-400">Score Moyen</span>
                    <span className="text-brand-accent font-bold">
                      {stat.exam_count > 0 ? (stat.total_exam_score / stat.exam_count).toFixed(1) : 'N/A'}
                    </span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {showAddForm && (
          <Card className="mb-8 p-6 bg-brand-charcoal border border-white/10">
            <h2 className="text-xl font-bold mb-4">Nouveau Participant</h2>
            <form onSubmit={handleAddParticipant} className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <input
                type="text"
                placeholder="Nom complet"
                className="bg-brand-dark border border-white/10 p-2 rounded"
                value={newParticipant.name}
                onChange={e => setNewParticipant({...newParticipant, name: e.target.value})}
                required
              />
              <input
                type="email"
                placeholder="Email"
                className="bg-brand-dark border border-white/10 p-2 rounded"
                value={newParticipant.email}
                onChange={e => setNewParticipant({...newParticipant, email: e.target.value})}
                required
              />
              <input
                type="text"
                placeholder="Téléphone"
                className="bg-brand-dark border border-white/10 p-2 rounded"
                value={newParticipant.phone}
                onChange={e => setNewParticipant({...newParticipant, phone: e.target.value})}
              />
              <select
                className="bg-brand-dark border border-white/10 p-2 rounded"
                value={newParticipant.city}
                onChange={e => setNewParticipant({...newParticipant, city: e.target.value})}
              >
                <option value="Cotonou">Cotonou</option>
                <option value="Abomey-Calavi">Abomey-Calavi</option>
                <option value="Porto-Novo">Porto-Novo</option>
                <option value="Parakou">Parakou</option>
              </select>
              <div className="md:col-span-4 flex justify-end gap-2">
                <Button type="button" variant="ghost" onClick={() => setShowAddForm(false)}>Annuler</Button>
                <Button type="submit" variant="primary">Enregistrer</Button>
              </div>
            </form>
          </Card>
        )}

        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              placeholder="Rechercher un participant..."
              className="w-full bg-brand-charcoal border border-white/10 pl-10 pr-4 py-2 rounded-lg"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            className="bg-brand-charcoal border border-white/10 px-4 py-2 rounded-lg"
            value={selectedCity}
            onChange={e => setSelectedCity(e.target.value)}
          >
            {cities.map(city => <option key={city} value={city}>{city}</option>)}
          </select>
        </div>

        <div className="overflow-x-auto bg-brand-charcoal border border-white/10 rounded-xl">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/10 bg-white/5">
                <th className="p-4">Participant</th>
                <th className="p-4">Ville</th>
                <th className="p-4 text-center">Jour 1</th>
                <th className="p-4 text-center">Jour 2</th>
                <th className="p-4 text-center">Jour 3</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} className="p-8 text-center text-gray-400">Chargement...</td></tr>
              ) : filteredParticipants.length === 0 ? (
                <tr><td colSpan={6} className="p-8 text-center text-gray-400">Aucun participant trouvé</td></tr>
              ) : (
                filteredParticipants.map(p => (
                  <tr key={p.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="p-4">
                      <div className="font-bold">{p.full_name}</div>
                      <div className="text-sm text-gray-400">{p.email}</div>
                    </td>
                    <td className="p-4 text-gray-400">{p.city}</td>
                    {[1, 2, 3].map(day => (
                      <td key={day} className="p-4 text-center">
                        <button
                          onClick={() => toggleAttendance(p.id, day as 1 | 2 | 3, Boolean((p.attendance as Attendance)?.[`day_${day}` as keyof Attendance]))}
                          className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                            Boolean((p.attendance as Attendance)?.[`day_${day}` as keyof Attendance])
                              ? 'bg-brand-green text-white shadow-glow'
                              : 'bg-white/5 text-gray-500 hover:bg-white/10'
                          }`}
                        >
                          {Boolean((p.attendance as Attendance)?.[`day_${day}` as keyof Attendance]) ? <FaCheck /> : <FaTimes />}
                        </button>
                      </td>
                    ))}
                    <td className="p-4 text-right">
                      <button onClick={() => handleDelete(p.id)} className="text-gray-500 hover:text-red-500 p-2">
                        <FaTrash />
                      </button>
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
