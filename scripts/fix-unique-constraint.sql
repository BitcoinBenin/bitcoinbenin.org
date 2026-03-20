-- SCRIPT POUR CORRIGER LA CONTRAINTE UNIQUE
-- Permettre le même email dans différentes villes et années

-- 1. D'abord, ajouter la colonne session_year si elle n'existe pas
ALTER TABLE school_participants 
ADD COLUMN IF NOT EXISTS session_year INTEGER NOT NULL DEFAULT 2026;

-- 2. Supprimer l'ancienne contrainte unique sur email uniquement
ALTER TABLE school_participants 
DROP CONSTRAINT IF EXISTS school_participants_email_key;

-- 3. Créer la nouvelle contrainte unique sur (email, city, session_year)
ALTER TABLE school_participants 
ADD CONSTRAINT school_participants_email_city_year_unique 
UNIQUE (email, city, session_year);

-- 4. Afficher la nouvelle structure
\d school_participants;
