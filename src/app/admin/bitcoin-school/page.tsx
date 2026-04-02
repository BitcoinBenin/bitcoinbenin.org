'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { AnimatePresence } from 'framer-motion';
import Button from '@/app/components/ui/Button';
import Card from '@/app/components/ui/Card';
import { 
  FaUserPlus, FaCheck, FaTimes, FaTrash, FaSearch, FaGraduationCap, 
  FaQuestionCircle, FaFileImport, FaMapMarkerAlt, FaEraser, FaCalendarAlt,
  FaChevronRight, FaArrowLeft, FaSchool, FaQrcode
} from 'react-icons/fa';
import { 
  getParticipants, addParticipant, updateAttendance, deleteParticipant, 
  bulkAddParticipants, getSchoolStatsByCity, clearAllParticipants, 
  getAvailableYears, clearCityParticipants, Participant, Attendance 
} from './school-actions';
import AttendanceQRGenerator from './AttendanceQRGenerator';

type ViewMode = 'years' | 'cities' | 'management';

export default function BitcoinSchoolAdmin() {
  const [viewMode, setViewMode] = useState<ViewMode>('years');
  const [availableYears, setAvailableYears] = useState<number[]>([]);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [showQRGenerator, setShowQRGenerator] = useState(false);
  
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
      fetchInitialData();
    };
    init();
  }, [router]);

  const fetchInitialData = async () => {
    setLoading(true);
    const result = await getAvailableYears();
    if (result.success) {
      setAvailableYears(result.data || [new Date().getFullYear()]);
    }
    setLoading(false);
  };

  const handleSelectYear = async (year: number) => {
    setSelectedYear(year);
    setLoading(true);
    const result = await getSchoolStatsByCity(year);
    if (result.success) {
      setCityStats(result.data || []);
      setViewMode('cities');
    }
    setLoading(false);
  };

  const handleSelectCity = async (city: string) => {
    setSelectedCity(city);
    setLoading(true);
    const result = await getParticipants(selectedYear!, city);
    if (result.success) {
      setParticipants(result.data || []);
      setViewMode('management');
    }
    setLoading(false);
  };

  const refreshData = async () => {
    if (viewMode === 'cities' && selectedYear) {
      const result = await getSchoolStatsByCity(selectedYear);
      if (result.success) setCityStats(result.data || []);
    } else if (viewMode === 'management' && selectedYear && selectedCity) {
      const [pResult, sResult] = await Promise.all([
        getParticipants(selectedYear, selectedCity),
        getSchoolStatsByCity(selectedYear)
      ]);
      if (pResult.success) setParticipants(pResult.data || []);
      if (sResult.success) setCityStats(sResult.data || []);
    }
  };

  const handleAddParticipant = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedYear || !selectedCity) {
      alert('Veuillez sélectionner une année et une ville');
      return;
    }

    if (!newParticipant.name || !newParticipant.email) {
      alert('Le nom et l\'email sont obligatoires');
      return;
    }

    setLoading(true);
    
    try {
      const result = await addParticipant(
        newParticipant.name.trim(),
        newParticipant.email.trim(),
        newParticipant.phone.trim(),
        selectedCity, // Utilise la ville actuellement gérée
        selectedYear
      );
      
      if (result.success) {
        setShowAddForm(false);
        setNewParticipant({ name: '', email: '', phone: '', city: selectedCity });
        refreshData();
        alert('Participant ajouté avec succès !');
      } else {
        alert('Erreur: ' + result.error);
      }
    } catch (error) {
      console.error('Erreur lors de l\'ajout du participant:', error);
      alert('Une erreur est survenue. Veuillez réessayer.');
    }
    
    setLoading(false);
  };

  const toggleAttendance = async (participantId: string, day: 1 | 2 | 3, currentStatus: boolean) => {
    // Mise à jour optimiste
    setParticipants(prev => prev.map(p => {
      if (p.id === participantId) {
        let currentAttendance: Attendance | undefined;
        if (Array.isArray(p.attendance)) {
          currentAttendance = p.attendance[0];
        } else {
          currentAttendance = p.attendance;
        }

        const newAttendance: Attendance = {
          participant_id: participantId,
          day_1: currentAttendance?.day_1 || false,
          day_2: currentAttendance?.day_2 || false,
          day_3: currentAttendance?.day_3 || false,
          ...currentAttendance,
          [`day_${day}`]: !currentStatus
        } as Attendance;

        return {
          ...p,
          attendance: Array.isArray(p.attendance) ? [newAttendance] : newAttendance
        };
      }
      return p;
    }));

    const result = await updateAttendance(participantId, day, !currentStatus);
    if (result.success) {
      refreshData();
    } else {
      alert('Erreur: ' + result.error);
      refreshData();
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Supprimer ce participant ?')) {
      const result = await deleteParticipant(id);
      if (result.success) {
        setParticipants(participants.filter(p => p.id !== id));
        refreshData();
      } else {
        alert('Erreur: ' + result.error);
      }
    }
  };

  const handleClearCity = async () => {
    if (!selectedCity || !selectedYear) return;
    
    // CONFIRMATION SIMPLE pour éviter les erreurs
    const confirmation = confirm(`⚠️  ATTENTION - SUPPRESSION IRRÉVERSIBLE ⚠️\n\nÊtes-vous sûr de vouloir supprimer TOUS les participants de ${selectedCity} ?\n\nCette action supprimera:\n- Les participants de cette ville\n- Leurs données de présence\n- Leurs résultats d'examen\n\nCette action est IRRÉVERSIBLE!`);
    
    if (!confirmation) {
      return;
    }
    
    setLoading(true);
    
    // Utiliser server action correctement
    try {
      const result = await clearCityParticipants(selectedCity, selectedYear);
      if (result.success) {
        alert(`${result.count} participants de ${selectedCity} ont été supprimés.\n\n⚠️  Cette action est irréversible!`);
        // Recharger les données pour la ville
        if (viewMode === 'management') {
          handleSelectCity(selectedCity);
        } else {
          refreshData();
        }
      } else {
        alert('Erreur: ' + result.error);
      }
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      alert('Une erreur est survenue. Veuillez réessayer.');
    }
    
    setLoading(false);
  };

  const handleImportCSV = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedYear || !selectedCity) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const text = event.target?.result as string;
        if (!text) {
          alert('Erreur de lecture du fichier');
          return;
        }
        
        const lines = text.split('\n').filter(line => line.trim());
        if (lines.length < 2) {
          alert('Le fichier CSV est vide ou invalide');
          return;
        }
        
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
            city: selectedCity,
            session_year: selectedYear
          };
        })
        .filter(p => p.email && p.name);

      if (confirm(`Importer ${parsedParticipants.length} participants pour ${selectedCity} (${selectedYear}) ?`)) {
        setLoading(true);
        const result = await bulkAddParticipants(parsedParticipants);
        if (result.success) {
          alert(`${result.count} participants importés avec succès !`);
          refreshData();
        } else {
          alert('Erreur: ' + result.error);
        }
        setLoading(false);
      }
      } catch (error) {
        console.error('Erreur lors de l\'import CSV:', error);
        alert('Une erreur est survenue lors de l\'import du fichier CSV. Veuillez vérifier le format.');
        setLoading(false);
      }
    };
    reader.readAsText(file);
  };

  const filteredParticipants = participants.filter(p => {
    const matchesSearch = p.full_name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         p.email.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="p-6 md:p-12">
      <div className="max-w-7xl mx-auto">
        {/* Header avec Navigation Breadcrumb */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
          <div>
            <div className="flex items-center gap-3 text-gray-500 mb-4 text-sm font-bold uppercase tracking-widest">
              <span className="hover:text-brand-green cursor-pointer" onClick={() => setViewMode('years')}>Bitcoin School</span>
              {selectedYear && (
                <>
                  <FaChevronRight className="text-[10px]" />
                  <span className="hover:text-brand-green cursor-pointer" onClick={() => handleSelectYear(selectedYear)}>Session {selectedYear}</span>
                </>
              )}
              {selectedCity && viewMode === 'management' && (
                <>
                  <FaChevronRight className="text-[10px]" />
                  <span className="text-brand-green">{selectedCity}</span>
                </>
              )}
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-black text-white leading-tight">
              {viewMode === 'years' && "Sessions Annuelles"}
              {viewMode === 'cities' && `Session ${selectedYear}`}
              {viewMode === 'management' && selectedCity}
            </h1>
          </div>

          <div className="flex gap-3 flex-wrap">
            <Button onClick={() => router.push('/admin/bitcoin-school/questions')} variant="secondary" className="flex items-center gap-2">
              <FaQuestionCircle /> Questions QCM
            </Button>
            <Button onClick={() => router.push('/admin/bitcoin-school/results')} variant="ghost" className="flex items-center gap-2">
              <FaGraduationCap /> Résultats Examen
            </Button>
          </div>
        </div>

        {/* --- VUE 1 : CHOIX DE L'ANNÉE --- */}
        {viewMode === 'years' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-fade-in">
            {availableYears.map(year => (
              <Card 
                key={year} 
                onClick={() => handleSelectYear(year)}
                className="p-8 bg-brand-charcoal border border-white/5 hover:border-brand-green/50 cursor-pointer transition-all group relative overflow-hidden"
              >
                <div className="absolute -right-4 -top-4 text-8xl text-white/5 font-black group-hover:text-brand-green/10 transition-colors">
                  {year}
                </div>
                <FaCalendarAlt className="text-4xl text-brand-green mb-6 group-hover:scale-110 transition-transform" />
                <h3 className="text-3xl font-black text-white mb-2">Session {year}</h3>
                <p className="text-gray-400">Gérer les participants et les villes pour cette année.</p>
                <div className="mt-8 flex items-center gap-2 text-brand-green font-bold text-sm">
                  Ouvrir la session <FaChevronRight />
                </div>
              </Card>
            ))}
            
            {/* Bouton pour ajouter une nouvelle année/session */}
            <Card 
              onClick={() => {
                const nextYear = Math.max(...availableYears) + 1;
                handleSelectYear(nextYear);
              }}
              className="p-8 bg-brand-dark border-2 border-dashed border-white/10 hover:border-brand-green/30 cursor-pointer transition-all flex flex-col items-center justify-center text-center group"
            >
              <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4 group-hover:bg-brand-green/10 transition-colors">
                <FaUserPlus className="text-2xl text-gray-500 group-hover:text-brand-green" />
              </div>
              <h3 className="text-xl font-bold text-gray-400 group-hover:text-white">Nouvelle Session</h3>
              <p className="text-gray-500 text-sm mt-2">Démarrer la gestion pour une nouvelle année.</p>
            </Card>
          </div>
        )}

        {/* --- VUE 2 : CHOIX DE LA VILLE --- */}
        {viewMode === 'cities' && (
          <div className="space-y-8 animate-fade-in">
            <div className="flex items-center gap-4">
              <Button onClick={() => setViewMode('years')} variant="ghost" className="flex items-center gap-2">
                <FaArrowLeft /> Retour aux années
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {cityStats.length === 0 ? (
                <div className="col-span-full p-12 text-center bg-brand-charcoal border border-white/5 rounded-3xl">
                  <FaSchool className="text-6xl text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400 text-xl font-bold">Aucune donnée pour cette année.</p>
                  <p className="text-gray-500 mt-2">Ajoutez des participants ou importez un fichier CSV pour commencer.</p>
                  <Button 
                    onClick={() => {
                      setSelectedCity('Cotonou'); // Ville par défaut
                      setViewMode('management');
                    }} 
                    variant="primary" 
                    className="mt-6"
                  >
                    Démarrer la gestion
                  </Button>
                </div>
              ) : (
                cityStats.map((stat, idx) => (
                  <Card 
                    key={idx} 
                    onClick={() => handleSelectCity(stat.name)}
                    className="p-6 bg-brand-charcoal border border-white/5 hover:border-brand-green/30 cursor-pointer transition-all group"
                  >
                    <div className="flex justify-between items-start mb-6">
                      <div className="p-3 bg-brand-green/10 rounded-xl text-brand-green group-hover:scale-110 transition-transform">
                        <FaMapMarkerAlt />
                      </div>
                      <div className="text-right">
                        <div className="text-xs font-black text-gray-500 uppercase tracking-widest">Inscrits</div>
                        <div className="text-2xl font-black text-white">{stat.participants}</div>
                      </div>
                    </div>
                    <h3 className="text-2xl font-black text-white mb-6">{stat.name}</h3>
                    
                    <div className="space-y-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Présence Moyenne</span>
                        <span className="text-brand-green font-bold">
                          {stat.participants > 0 ? Math.round(((stat.attendance_d1 + stat.attendance_d2 + stat.attendance_d3) / (stat.participants * 3)) * 100) : 0}%
                        </span>
                      </div>
                      <div className="grid grid-cols-3 gap-3 text-xs">
                        <div className="bg-white/5 rounded-lg p-2 text-center border border-white/5">
                          <div className="text-gray-500 font-black uppercase tracking-widest">Jour 1</div>
                          <div className="text-white font-black mt-1">
                            {stat.attendance_d1}/{stat.participants}
                          </div>
                        </div>
                        <div className="bg-white/5 rounded-lg p-2 text-center border border-white/5">
                          <div className="text-gray-500 font-black uppercase tracking-widest">Jour 2</div>
                          <div className="text-white font-black mt-1">
                            {stat.attendance_d2}/{stat.participants}
                          </div>
                        </div>
                        <div className="bg-white/5 rounded-lg p-2 text-center border border-white/5">
                          <div className="text-gray-500 font-black uppercase tracking-widest">Jour 3</div>
                          <div className="text-white font-black mt-1">
                            {stat.attendance_d3}/{stat.participants}
                          </div>
                        </div>
                      </div>
                      <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-brand-green shadow-[0_0_10px_rgba(83,203,96,0.5)] transition-all duration-1000"
                          style={{ width: `${stat.participants > 0 ? ((stat.attendance_d1 + stat.attendance_d2 + stat.attendance_d3) / (stat.participants * 3)) * 100 : 0}%` }}
                        />
                      </div>
                    </div>
                    
                    <div className="mt-8 pt-6 border-t border-white/5 flex justify-between items-center text-xs font-bold uppercase tracking-widest text-gray-500">
                      <span>Gérer la ville</span>
                      <FaChevronRight className="group-hover:translate-x-1 transition-transform" />
                    </div>
                  </Card>
                ))
              )}

              {/* Ajouter une nouvelle ville */}
              {cityStats.length > 0 && (
                <Card 
                  onClick={() => {
                    const newCity = prompt('Nom de la nouvelle ville ?');
                    if (newCity) handleSelectCity(newCity);
                  }}
                  className="p-6 bg-brand-dark border-2 border-dashed border-white/10 hover:border-brand-green/30 cursor-pointer transition-all flex flex-col items-center justify-center text-center group"
                >
                  <FaMapMarkerAlt className="text-2xl text-gray-500 group-hover:text-brand-green mb-2" />
                  <span className="text-gray-400 group-hover:text-white font-bold">Ajouter une ville</span>
                </Card>
              )}
            </div>
          </div>
        )}

        {/* --- VUE 3 : GESTION DES PARTICIPANTS --- */}
        {viewMode === 'management' && (
          <div className="space-y-8 animate-fade-in">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <Button onClick={() => setViewMode('cities')} variant="ghost" className="flex items-center gap-2">
                <FaArrowLeft /> Retour aux villes
              </Button>
              
              <div className="flex gap-3 flex-wrap">
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
                  <FaFileImport className="text-brand-green" /> Importer CSV
                </Button>
                <Button 
                  onClick={() => setShowQRGenerator(true)} 
                  variant="secondary" 
                  className="flex items-center gap-2 border border-brand-green/20"
                >
                  <FaQrcode className="text-brand-green" /> Générer QR Présence
                </Button>
                <Button onClick={() => setShowAddForm(!showAddForm)} variant="primary" className="flex items-center gap-2">
                  <FaUserPlus /> Ajouter un participant
                </Button>
                <Button 
                  onClick={handleClearCity} 
                  variant="ghost" 
                  className="flex items-center gap-2 text-red-500 border border-red-500/10 hover:bg-red-500/10 transition-colors"
                >
                  <FaEraser /> Vider la ville
                </Button>
              </div>
            </div>

            {/* Formulaire d'ajout */}
            {showAddForm && (
              <Card className="p-6 bg-brand-charcoal border border-white/10 animate-fade-in-up">
                <h2 className="text-xl font-bold mb-4">Nouveau Participant à {selectedCity}</h2>
                <form onSubmit={handleAddParticipant} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <input
                    type="text"
                    placeholder="Nom complet"
                    className="bg-brand-dark border border-white/10 p-2 rounded outline-none focus:border-brand-green/50 transition-colors"
                    value={newParticipant.name}
                    onChange={e => setNewParticipant({...newParticipant, name: e.target.value})}
                    required
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    className="bg-brand-dark border border-white/10 p-2 rounded outline-none focus:border-brand-green/50 transition-colors"
                    value={newParticipant.email}
                    onChange={e => setNewParticipant({...newParticipant, email: e.target.value})}
                    required
                  />
                  <input
                    type="text"
                    placeholder="Téléphone"
                    className="bg-brand-dark border border-white/10 p-2 rounded outline-none focus:border-brand-green/50 transition-colors"
                    value={newParticipant.phone}
                    onChange={e => setNewParticipant({...newParticipant, phone: e.target.value})}
                  />
                  <div className="md:col-span-3 flex justify-end gap-2">
                    <Button type="button" variant="ghost" onClick={() => setShowAddForm(false)}>Annuler</Button>
                    <Button type="submit" variant="primary">Enregistrer</Button>
                  </div>
                </form>
              </Card>
            )}

            {/* Barre de recherche */}
            <div className="relative">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                type="text"
                placeholder="Rechercher un participant (nom ou email)..."
                className="w-full bg-brand-charcoal border border-white/5 rounded-xl py-4 pl-12 pr-4 text-white outline-none focus:border-brand-green/50 transition-all"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Tableau des participants */}
            <div className="overflow-x-auto bg-brand-charcoal border border-white/10 rounded-2xl shadow-2xl">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-white/10 bg-white/5 text-xs font-black uppercase tracking-widest text-gray-500">
                    <th className="p-6">Participant</th>
                    <th className="p-6 text-center">Jour 1</th>
                    <th className="p-6 text-center">Jour 2</th>
                    <th className="p-6 text-center">Jour 3</th>
                    <th className="p-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {loading ? (
                    <tr><td colSpan={5} className="p-12 text-center text-gray-500">Chargement des données...</td></tr>
                  ) : filteredParticipants.length === 0 ? (
                    <tr><td colSpan={5} className="p-12 text-center text-gray-500">Aucun participant trouvé</td></tr>
                  ) : (
                    filteredParticipants.map(p => {
                      let attendance: Attendance | undefined;
                      if (Array.isArray(p.attendance)) {
                        attendance = p.attendance[0];
                      } else {
                        attendance = p.attendance;
                      }
                      
                      return (
                        <tr key={p.id} className="hover:bg-white/5 transition-colors group">
                          <td className="p-6">
                            <div className="font-bold text-white group-hover:text-brand-green transition-colors">{p.full_name}</div>
                            <div className="text-sm text-gray-500">{p.email}</div>
                            {p.phone && <div className="text-xs text-gray-600">{p.phone}</div>}
                          </td>
                          {[1, 2, 3].map(day => {
                            const isPresent = Boolean(attendance?.[`day_${day as 1|2|3}` as keyof Attendance]);
                            return (
                              <td key={day} className="p-6 text-center">
                                <button
                                  onClick={() => toggleAttendance(p.id, day as 1 | 2 | 3, isPresent)}
                                  className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                                    isPresent
                                      ? 'bg-brand-green text-brand-dark shadow-[0_0_15px_rgba(83,203,96,0.3)]'
                                      : 'bg-white/5 text-gray-600 hover:bg-white/10 hover:text-gray-400'
                                  }`}
                                >
                                  {isPresent ? <FaCheck className="font-black" /> : <FaTimes />}
                                </button>
                              </td>
                            );
                          })}
                          <td className="p-6 text-right">
                            <button 
                              onClick={() => handleDelete(p.id)} 
                              className="w-10 h-10 rounded-xl bg-red-500/10 text-red-500 flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-red-500 hover:text-white transition-all mx-auto md:ml-auto md:mr-0"
                              title="Supprimer"
                            >
                              <FaTrash />
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Modal QR Generator */}
        <AnimatePresence>
          {showQRGenerator && selectedCity && selectedYear && (
            <AttendanceQRGenerator 
              city={selectedCity}
              year={selectedYear}
              onClose={() => {
                setShowQRGenerator(false);
                refreshData();
              }}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
