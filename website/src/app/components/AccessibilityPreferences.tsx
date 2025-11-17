'use client';

import { useEffect } from 'react';

export default function AccessibilityPreferences() {
  useEffect(() => {
    // Vérifier les préférences de réduction de mouvement
    const handleReducedMotion = () => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        document.documentElement.classList.add('reduce-motion');
      } else {
        document.documentElement.classList.remove('reduce-motion');
      }
    };

    // Vérifier les préférences de contraste élevé
    const handleHighContrast = () => {
      if (window.matchMedia('(prefers-contrast: high)').matches) {
        document.documentElement.classList.add('high-contrast');
      } else {
        document.documentElement.classList.remove('high-contrast');
      }
    };

    // Appliquer les préférences au chargement
    handleReducedMotion();
    handleHighContrast();

    // Écouter les changements de préférences
    window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', handleReducedMotion);
    window.matchMedia('(prefers-contrast: high)').addEventListener('change', handleHighContrast);

    // Nettoyage des écouteurs
    return () => {
      window.matchMedia('(prefers-reduced-motion: reduce)').removeEventListener('change', handleReducedMotion);
      window.matchMedia('(prefers-contrast: high)').removeEventListener('change', handleHighContrast);
    };
  }, []);

  return null;
}