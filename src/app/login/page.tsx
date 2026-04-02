'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter, useSearchParams } from 'next/navigation';
import Button from '@/app/components/ui/Button';
import { FaLock, FaEnvelope } from 'react-icons/fa';
import { Suspense } from 'react';

function LoginContent() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirectTo') || '/admin';

  useEffect(() => {
    const checkAuth = async () => {
      if (!supabase) return;

      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session) {
        router.replace(redirectTo);
      }
    };

    checkAuth();
  }, [router, redirectTo]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!supabase) {
      setError('Supabase n\'est pas configuré. Veuillez vérifier les variables d\'environnement.');
      return;
    }
    
    setLoading(true);
    setError('');

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError('Email ou mot de passe incorrect');
      } else {
        router.replace(redirectTo);
      }
    } catch {
      setError('Erreur de connexion');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-dark flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-brand-charcoal/50 border border-white/5 rounded-2xl p-8 backdrop-blur-md">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-display font-black text-white mb-2">
              Bitcoin Bénin
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-green to-brand-accent ml-2">
                Admin
              </span>
            </h1>
            <p className="text-gray-400 text-sm">
              Connexion administrateur
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6" autoComplete="off">
            {error && (
              <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <FaEnvelope className="inline mr-2" />
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-brand-dark border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand-green transition-colors"
                autoComplete="email"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <FaLock className="inline mr-2" />
                Mot de passe
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full bg-brand-dark border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand-green transition-colors"
                autoComplete="current-password"
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              disabled={loading || !email || !password}
              className="w-full"
            >
              {loading ? 'Chargement...' : 'Se connecter'}
            </Button>
          </form>

          <div className="mt-8 p-4 bg-white/5 rounded-lg">
            <h3 className="text-sm font-display font-bold text-white mb-2 flex items-center gap-2">
              <FaLock />
              Accès Administrateur
            </h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Cette page est réservée aux administrateurs de Bitcoin Bénin. 
              Pour obtenir l&apos;accès, veuillez contacter l&apos;équipe.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-brand-dark flex items-center justify-center text-white">Chargement...</div>}>
      <LoginContent />
    </Suspense>
  );
}
