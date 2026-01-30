'use client';

import { useState, useEffect } from 'react';
import { supabase, clearSupabaseSession } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Button from '@/app/components/ui/Button';
import { FaLock, FaEnvelope } from 'react-icons/fa';

export default function LoginPage() {
  const [email, setEmail] = useState('benedoffice@gmail.com');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    // Vérifier si l'utilisateur est déjà connecté
    const checkAuth = async () => {
      if (!supabase) return; // Sortir si Supabase n'est pas configuré
      
      console.log('🔍 Vérification session existante...');
      const { data: { session } } = await supabase.auth.getSession();
      console.log('Session trouvée:', session ? '✅ Oui' : '❌ Non');
      
      // TEMPORAIREMENT DÉSACTIVÉ - Pour permettre la déconnexion forcée
      // if (session) {
      //   console.log('🔄 Redirection vers admin...');
      //   router.push('/admin/gallery');
      // } else {
      //   console.log('✅ Aucune session, affichage formulaire');
      // }
      console.log('🔧 Redirection désactivée temporairement');
    };
    checkAuth();
  }, [router]);

  const handleLogout = async () => {
    try {
      console.log('🧹 Nettoyage de la session Supabase...');
      await clearSupabaseSession();
      console.log('✅ Session nettoyée avec succès');
      // Forcer le rechargement de la page
      window.location.reload();
    } catch (error) {
      console.error('❌ Erreur lors du nettoyage:', error);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('Tentative de connexion...');
    console.log('Supabase configuré:', !!supabase);
    console.log('Email:', email);
    console.log('Password length:', password.length);
    
    if (!supabase) {
      setError('Supabase n\'est pas configuré. Veuillez vérifier les variables d\'environnement.');
      return;
    }
    
    setLoading(true);
    setError('');

    try {
      console.log('Appel à Supabase auth.signInWithPassword...');
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      console.log('Réponse Supabase:', { data, error });

      if (error) {
        console.error('Erreur Supabase:', error);
        setError('Email ou mot de passe incorrect');
      } else {
        console.log('Connexion réussie, redirection...');
        router.push('/admin/gallery');
      }
    } catch (error) {
      console.error('Erreur catch:', error);
      setError('Erreur de connexion');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-dark flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* Formulaire centré sans header */}
        <div className="bg-brand-charcoal/50 border border-white/5 rounded-2xl p-8 backdrop-blur-md">
          {/* Titre simple */}
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

          {/* Formulaire */}
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
                className="w-full bg-brand-dark border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-brand-green transition-colors"
                placeholder="benedoffice@gmail.com"
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
                className="w-full bg-brand-dark border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-brand-green transition-colors"
                placeholder="•••••"
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

          {/* Instructions */}
          <div className="mt-8 p-4 bg-white/5 rounded-lg">
            <h3 className="text-sm font-display font-bold text-white mb-2 flex items-center gap-2">
              <FaLock />
              Accès Administrateur
            </h3>
            <p className="text-xs text-gray-400 leading-relaxed mb-3">
              Cette page est réservée aux administrateurs de Bitcoin Bénin. 
              Pour obtenir l&apos;accès, veuillez contacter l&apos;équipe.
            </p>
            
            {/* Bouton de déconnexion forcée */}
            <button
              onClick={handleLogout}
              className="w-full bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 rounded-lg px-3 py-2 text-red-400 text-xs transition-colors"
            >
              🚪 Forcer la déconnexion
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
