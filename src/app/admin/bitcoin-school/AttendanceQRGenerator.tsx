'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaQrcode, FaTimes, FaCalendarDay, FaExpand, FaCompress } from 'react-icons/fa';
import Button from '@/app/components/ui/Button';
import { generateAttendanceCode, getActiveAttendanceCode } from './attendance-actions';
import Image from 'next/image';

interface AttendanceQRGeneratorProps {
  city: string;
  year: number;
  onClose: () => void;
}

export default function AttendanceQRGenerator({ city, year, onClose }: AttendanceQRGeneratorProps) {
  const [day, setDay] = useState(1);
  const [code, setCode] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [baseUrl, setBaseUrl] = useState('');
  const [isFullscreen, setIsFullscreen] = useState(false);

  const checkExistingCode = useCallback(async () => {
    const existingCode = await getActiveAttendanceCode(city, day, year);
    if (existingCode) setCode(existingCode);
    else setCode(null);
  }, [city, day, year]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setBaseUrl(window.location.origin);
    }
    // Charger le code existant si disponible
    checkExistingCode();
  }, [checkExistingCode]);

  const handleGenerate = async () => {
    setLoading(true);
    const result = await generateAttendanceCode(city, day, year);
    if (result.success) {
      setCode(result.code!);
    } else {
      alert('Erreur: ' + result.error);
    }
    setLoading(false);
  };

  const checkInUrl = `${baseUrl}/bitcoin-school/check-in?code=${code || ''}`;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-brand-dark/95 backdrop-blur-xl"
        onClick={onClose}
      />
      
      <AnimatePresence>
        {isFullscreen && code && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed inset-0 z-[110] bg-brand-dark flex flex-col items-center justify-center p-10 text-center"
          >
            <button 
              onClick={() => setIsFullscreen(false)}
              className="absolute top-10 right-10 p-4 bg-white/5 hover:bg-white/10 rounded-full text-gray-400 hover:text-white transition-all text-2xl"
            >
              <FaCompress />
            </button>

            <div className="mb-10 text-center">
              <h2 className="text-4xl font-display font-black text-white mb-2">Scannez pour valider</h2>
              <p className="text-brand-green text-xl font-bold uppercase tracking-widest">{city} — Jour {day}</p>
            </div>

            <div className="bg-white p-10 rounded-[3rem] shadow-[0_0_100px_rgba(83,203,96,0.2)] mb-12">
              <Image 
                src={`https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=${encodeURIComponent(checkInUrl)}`}
                alt="QR Code Plein Écran"
                width={500}
                height={500}
                className="w-[300px] h-[300px] md:w-[500px] md:h-[500px]"
                unoptimized
              />
            </div>
            
            <p className="mt-4 text-gray-500 text-lg font-medium">
              Rendez-vous sur <span className="text-white">bitcoinbenin.org</span> pour valider
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="relative max-w-2xl w-full bg-brand-charcoal border border-white/10 rounded-[2.5rem] p-8 md:p-12 shadow-2xl"
      >
        {/* Background Decor */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-green/5 blur-[100px] rounded-full -mr-32 -mt-32 pointer-events-none" />
        
        <div className="flex justify-between items-center mb-10">
          <div>
            <h2 className="text-3xl font-display font-black text-white">QR Code de Présence</h2>
            <p className="text-gray-400 mt-1">{city} — Session {year}</p>
          </div>
          <button 
            onClick={onClose}
            className="p-3 bg-white/5 hover:bg-white/10 rounded-full text-gray-400 hover:text-white transition-all"
          >
            <FaTimes />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Settings */}
          <div className="space-y-8">
            <div>
              <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-4">Choisir le jour</label>
              <div className="flex gap-3">
                {[1, 2, 3].map(d => (
                  <button
                    key={d}
                    onClick={() => setDay(d)}
                    className={`flex-1 py-4 rounded-2xl font-black transition-all border ${
                      day === d 
                        ? 'bg-brand-green border-brand-green text-brand-dark shadow-glow' 
                        : 'bg-white/5 border-white/5 text-gray-400 hover:bg-white/10'
                    }`}
                  >
                    Jour {d}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-6 bg-brand-dark rounded-3xl border border-white/5">
              <div className="flex items-center gap-3 text-brand-green mb-4 font-bold">
                <FaCalendarDay />
                <span>Instructions</span>
              </div>
              <ul className="text-sm text-gray-400 space-y-3">
                <li>1. Affichez ce QR Code sur l&apos;écran géant.</li>
                <li>2. Les élèves scannent et arrivent sur la page de validation.</li>
                <li>3. Ils entrent leur email et le code secret affiché ici.</li>
              </ul>
            </div>

            <Button 
              onClick={handleGenerate} 
              disabled={loading}
              variant="primary" 
              className="w-full py-5 text-lg font-black"
            >
              {loading ? 'Génération...' : code ? 'Régénérer un code' : 'Générer le code'}
            </Button>
          </div>

          {/* QR Display */}
          <div className="flex flex-col items-center justify-center relative">
            {code ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center w-full"
              >
                <div className="relative group inline-block bg-white p-6 rounded-3xl shadow-[0_0_50px_rgba(255,255,255,0.1)] mb-6">
                  <Image 
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(checkInUrl)}`}
                    alt="QR Code de présence"
                    width={250}
                    height={250}
                    className="w-[200px] h-[200px] md:w-[250px] md:h-[250px]"
                    unoptimized
                  />
                  
                  <button 
                    onClick={() => setIsFullscreen(true)}
                    className="absolute -top-4 -right-4 bg-brand-green text-brand-dark p-3 rounded-2xl shadow-xl hover:scale-110 transition-transform flex items-center gap-2 font-black text-[10px] z-20"
                    title="Agrandir en plein écran"
                  >
                    <FaExpand /> PLEIN ÉCRAN
                  </button>
                </div>
                
                <div className="space-y-2">
                  <p className="text-xs font-black text-gray-500 uppercase tracking-[0.3em]">Code Secret</p>
                  <div className="text-5xl font-display font-black text-brand-green tracking-widest bg-brand-green/10 py-4 px-8 rounded-2xl border border-brand-green/20">
                    {code}
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="text-center py-20 px-10 bg-brand-dark rounded-[2rem] border border-dashed border-white/10 w-full">
                <FaQrcode className="text-6xl text-gray-700 mx-auto mb-4" />
                <p className="text-gray-500 font-bold">Cliquez sur générer pour afficher le QR Code</p>
              </div>
            )}
          </div>
        </div>
        
        <div className="mt-10 pt-8 border-t border-white/5 text-center">
          <p className="text-[10px] text-gray-600 font-black uppercase tracking-widest">
            Le code généré sera valide pendant 4 heures pour la ville de {city}
          </p>
        </div>
      </motion.div>
    </div>
  );
}
