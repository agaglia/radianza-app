-- Schema Database Radianza
-- Esegui questo script nella SQL Editor di Supabase

-- Tabella Profiles (Utenti)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  is_admin BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabella Meetings (Riunioni)
CREATE TABLE IF NOT EXISTS meetings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  date TIMESTAMPTZ NOT NULL,
  meet_link TEXT,
  meet_link_2 TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES profiles(id) ON DELETE SET NULL
);

-- Tabella Content (Contenuti Multimediali)
CREATE TABLE IF NOT EXISTS content (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL CHECK (type IN ('video', 'photo', 'text', 'poem', 'letter', 'music', 'image', 'mantra', 'mediradiananza')),
  url TEXT,
  text_content TEXT,
  meeting_id UUID REFERENCES meetings(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES profiles(id) ON DELETE SET NULL
);

-- Tabella Attendance (Presenze/Assenze)
CREATE TABLE IF NOT EXISTS attendance (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  meeting_id UUID REFERENCES meetings(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('present', 'absent', 'pending')) DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(meeting_id, user_id)
);

-- Indici per migliorare le performance
CREATE INDEX IF NOT EXISTS idx_meetings_date ON meetings(date);
CREATE INDEX IF NOT EXISTS idx_meetings_meet_link ON meetings(meet_link);
CREATE INDEX IF NOT EXISTS idx_meetings_meet_link_2 ON meetings(meet_link_2);
CREATE INDEX IF NOT EXISTS idx_content_created_at ON content(created_at);
CREATE INDEX IF NOT EXISTS idx_attendance_meeting_id ON attendance(meeting_id);
CREATE INDEX IF NOT EXISTS idx_attendance_user_id ON attendance(user_id);

-- Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE meetings ENABLE ROW LEVEL SECURITY;
ALTER TABLE content ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;

-- Policy per Profiles
CREATE POLICY "Utenti possono vedere tutti i profili"
  ON profiles FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Utenti possono aggiornare il proprio profilo"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Admin possono fare tutto sui profili"
  ON profiles FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND is_admin = TRUE
    )
  );

-- Policy per Meetings
CREATE POLICY "Utenti autenticati possono vedere le riunioni"
  ON meetings FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Solo admin possono creare/modificare/eliminare riunioni"
  ON meetings FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND is_admin = TRUE
    )
  );

-- Policy per Content
CREATE POLICY "Utenti autenticati possono vedere i contenuti"
  ON content FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Solo admin possono gestire i contenuti"
  ON content FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND is_admin = TRUE
    )
  );

-- Policy per Attendance
CREATE POLICY "Utenti possono vedere le presenze"
  ON attendance FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Utenti possono gestire le proprie presenze"
  ON attendance FOR ALL
  USING (user_id = auth.uid());

CREATE POLICY "Admin possono gestire tutte le presenze"
  ON attendance FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND is_admin = TRUE
    )
  );

-- Trigger per aggiornare updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_attendance_updated_at
  BEFORE UPDATE ON attendance
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Funzione per creare automaticamente un profilo quando si registra un utente
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger per creare il profilo automaticamente
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Storage bucket per i file multimediali (facoltativo)
-- Puoi creare questo bucket dalla dashboard di Supabase > Storage
-- Nome bucket: radianza-media
-- Policy: public per lettura, solo admin per scrittura
