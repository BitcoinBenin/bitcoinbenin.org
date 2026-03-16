'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCheckCircle, FaExclamationCircle, FaUserCheck, FaKey } from 'react-icons/fa';
import Button from '@/app/components/ui/Button';
import Card from '@/app/components/ui/Card';
import { validateSelfAttendance } from '@/app/admin/bitcoin-school/attendance-actions';

function CheckInForm() {
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  // Remplir le code automatiquement s'il est présent dans l'URL
  useEffect(() => {
    const codeFromUrl = searchParams.get('code');
    if (codeFromUrl) {
      setCode(codeFromUrl.toUpperCase());
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !code) return;

    setStatus('loading');
    const result = await validateSelfAttendance(email, code);

    if (result.success) {
      setStatus('success');
      setMessage(result.message || 'Votre présence a été enregistrée !');
      setEmail('');
      // On ne vide pas le code pour permettre de valider plusieurs emails avec le même code (cas des téléphones partagés)
    } else {
      setStatus('error');
      setMessage(result.error || 'Une erreur est survenue.');
    }
  };

  return (
    <Card className="p-8 bg-brand-charcoal border border-white/10 shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-brand-green/50 to-transparent" />
      
      <AnimatePresence mode="wait">
        {status === 'success' ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="text-center py-6"
          >
            <FaCheckCircle className="text-6xl text-brand-green mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-white mb-2">Félicitations !</h2>
            <p className="text-gray-400 mb-8">{message}</p>
            <Button 
              onClick={() => setStatus('idle')}
              variant="secondary"
              className="w-full"
            >
              Valider une autre présence
            </Button>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            <div>
              <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2 ml-1">
                Votre Email
              </label>
              <div className="relative">
                <input
                  type="email"
                  placeholder="nom@exemple.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-brand-dark border border-white/10 rounded-xl py-4 px-4 text-white outline-none focus:border-brand-green/50 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2 ml-1">
                Code Secret du Jour
              </label>
              <div className="relative">
                <FaKey className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" />
                <input
                  type="text"
                  placeholder="ENTREZ LE CODE"
                  required
                  maxLength={6}
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  className="w-full bg-brand-dark border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white outline-none focus:border-brand-green/50 transition-all font-mono tracking-widest text-center text-xl uppercase"
                />
              </div>
            </div>

            {status === 'error' && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-sm"
              >
                <FaExclamationCircle className="flex-shrink-0" />
                <span>{message}</span>
              </motion.div>
            )}

            <Button
              type="submit"
              variant="primary"
              className="w-full py-4 text-lg font-black"
              disabled={status === 'loading'}
            >
              {status === 'loading' ? 'Validation en cours...' : 'VALIDER MA PRÉSENCE'}
            </Button>

            <p className="text-center text-[10px] text-gray-600 uppercase tracking-widest">
              Ce code est disponible uniquement dans la salle de formation.
            </p>
          </motion.form>
        )}
      </AnimatePresence>
    </Card>
  );
}

export default function BitcoinSchoolCheckIn() {
  return (
    <div className="min-h-screen bg-brand-dark flex items-center justify-center p-6 py-20">
      <div className="max-w-md w-full">
        {/* Logo/Header */}
        <div className="text-center mb-10">
          <div className="inline-flex p-4 bg-brand-green/10 rounded-3xl mb-4">
            <FaUserCheck className="text-4xl text-brand-green" />
          </div>
          <h1 className="text-3xl font-display font-black text-white">
            Bitcoin <span className="text-brand-green">School</span>
          </h1>
          <p className="text-gray-400 mt-2">Validation de présence automatique</p>
        </div>

        <Suspense fallback={
          <Card className="p-8 bg-brand-charcoal border border-white/10 text-center">
            <p className="text-gray-400">Chargement du formulaire...</p>
          </Card>
        }>
          <CheckInForm />
        </Suspense>

        <p className="text-center mt-12 text-gray-600 text-sm">
          &copy; {new Date().getFullYear()} Bitcoin Bénin Community
        </p>
      </div>
    </div>
  );
}
