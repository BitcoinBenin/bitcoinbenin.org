-- ============================================
-- Configuration pour le Bitcoin School Bénin
-- ============================================

-- 1. Table des participants
CREATE TABLE IF NOT EXISTS school_participants (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  city TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Table des présences (3 jours)
CREATE TABLE IF NOT EXISTS school_attendance (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  participant_id UUID REFERENCES school_participants(id) ON DELETE CASCADE,
  day_1 BOOLEAN DEFAULT FALSE,
  day_2 BOOLEAN DEFAULT FALSE,
  day_3 BOOLEAN DEFAULT FALSE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(participant_id)
);

-- 3. Table des questions d'examen
CREATE TABLE IF NOT EXISTS school_exam_questions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  question_text TEXT NOT NULL,
  options JSONB NOT NULL, -- Format: ["Option A", "Option B", "Option C", "Option D"]
  correct_option_index INTEGER NOT NULL,
  points INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Table des résultats de l'examen
CREATE TABLE IF NOT EXISTS school_exam_results (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  participant_id UUID REFERENCES school_participants(id) ON DELETE CASCADE,
  score INTEGER NOT NULL,
  total_questions INTEGER DEFAULT 21,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  duration_seconds INTEGER, -- Pour départager les égalités (plus rapide = mieux)
  UNIQUE(participant_id)
);

-- Activation RLS
ALTER TABLE school_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE school_attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE school_exam_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE school_exam_results ENABLE ROW LEVEL SECURITY;

-- Politiques RLS (Lecture publique pour les questions, Admin pour le reste)
CREATE POLICY "Lecture publique des questions" ON school_exam_questions FOR SELECT USING (true);
CREATE POLICY "Admin full access participants" ON school_participants USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access attendance" ON school_attendance USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access results" ON school_exam_results USING (auth.role() = 'authenticated');

-- Trigger pour la mise à jour automatique des participants
CREATE TRIGGER update_school_participants_updated_at BEFORE UPDATE ON school_participants
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 5. Table pour les codes de présence éphémères
CREATE TABLE IF NOT EXISTS school_attendance_codes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  city TEXT NOT NULL,
  day_number INTEGER NOT NULL,
  session_year INTEGER NOT NULL,
  code TEXT NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(city, day_number, session_year)
);

-- Activation RLS
ALTER TABLE school_attendance_codes ENABLE ROW LEVEL SECURITY;

-- Politiques RLS pour les codes (Lecture publique, Admin pour le reste)
CREATE POLICY "Lecture publique des codes" ON school_attendance_codes FOR SELECT USING (true);
CREATE POLICY "Admin full access codes" ON school_attendance_codes USING (auth.role() = 'authenticated');
