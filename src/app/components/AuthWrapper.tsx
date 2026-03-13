'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

interface AuthWrapperProps {
  children: React.ReactNode;
  redirectTo?: string;
}

export default function AuthWrapper({ children, redirectTo = '/login' }: AuthWrapperProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (!supabase) {
          router.replace(redirectTo);
          return;
        }

        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Erreur session:', error);
          setIsAuthenticated(false);
          router.replace(redirectTo);
          return;
        }

        if (session) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
          // Ajouter le redirectTo actuel si ce n'est pas déjà la page de login
          const currentPath = window.location.pathname;
          if (currentPath !== '/login') {
            router.replace(`${redirectTo}?redirectTo=${currentPath}`);
          } else {
            router.replace(redirectTo);
          }
        }
      } catch (error) {
        console.error('Erreur auth:', error);
        router.replace(redirectTo);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();

    // Écouter les changements d'authentification
    const { data: { subscription } } = supabase?.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        setIsAuthenticated(false);
        router.replace(redirectTo);
      } else if (event === 'SIGNED_IN' && session) {
        setIsAuthenticated(true);
      }
    }) || { data: { subscription: null } };

    return () => {
      subscription?.unsubscribe();
    };
  }, [router, redirectTo]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-brand-dark flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-green mx-auto mb-4"></div>
          <p>Vérification de l&apos;authentification...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // La redirection se fait dans useEffect
  }

  return <>{children}</>;
}
