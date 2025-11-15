-- ==========================================
-- QUERY SQL DA ESEGUIRE SU SUPABASE
-- ==========================================
-- URL: https://supabase.com/dashboard/project/qtsasjhevmxzffqlauyt/sql/new


-- 1. AGGIORNA TABELLA CONTENT
-- ==========================================
-- Aggiunge colonna per collegare contenuti agli incontri
ALTER TABLE content ADD COLUMN IF NOT EXISTS meeting_id UUID REFERENCES meetings(id) ON DELETE SET NULL;

-- Aggiorna i tipi di contenuto ammessi
ALTER TABLE content DROP CONSTRAINT IF EXISTS content_type_check;
ALTER TABLE content ADD CONSTRAINT content_type_check 
  CHECK (type IN ('music', 'letter', 'text', 'poem', 'image', 'mantra'));


-- 2. POLICY RLS PER TABELLA CONTENT
-- ==========================================
ALTER TABLE content ENABLE ROW LEVEL SECURITY;

-- Elimina policy esistenti se ci sono
DROP POLICY IF EXISTS "Allow all to read content" ON content;
DROP POLICY IF EXISTS "Allow admins to insert content" ON content;
DROP POLICY IF EXISTS "Allow admins to delete content" ON content;

-- Tutti possono leggere i contenuti
CREATE POLICY "Allow all to read content" 
  ON content 
  FOR SELECT 
  USING (true);

-- Solo admin possono creare contenuti
CREATE POLICY "Allow admins to insert content" 
  ON content 
  FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.is_admin = true
    )
  );

-- Solo admin possono eliminare contenuti
CREATE POLICY "Allow admins to delete content" 
  ON content 
  FOR DELETE 
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.is_admin = true
    )
  );


-- 3. POLICY RLS PER TABELLA MEETINGS
-- ==========================================
ALTER TABLE meetings ENABLE ROW LEVEL SECURITY;

-- Elimina policy esistenti se ci sono
DROP POLICY IF EXISTS "Allow all to read meetings" ON meetings;
DROP POLICY IF EXISTS "Allow admins to insert meetings" ON meetings;
DROP POLICY IF EXISTS "Allow admins to delete meetings" ON meetings;

-- Tutti possono leggere gli incontri
CREATE POLICY "Allow all to read meetings" 
  ON meetings 
  FOR SELECT 
  USING (true);

-- Solo admin possono creare incontri
CREATE POLICY "Allow admins to insert meetings" 
  ON meetings 
  FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.is_admin = true
    )
  );

-- Solo admin possono eliminare incontri
CREATE POLICY "Allow admins to delete meetings" 
  ON meetings 
  FOR DELETE 
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.is_admin = true
    )
  );


-- ==========================================
-- FINE QUERY
-- ==========================================
-- Dopo aver eseguito queste query, riavvia il server Next.js


-- ==========================================
-- 4. TABELLA ATTENDANCE (Presenze agli incontri)
-- ==========================================
CREATE TABLE IF NOT EXISTS attendance (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  meeting_id UUID REFERENCES meetings(id) ON DELETE CASCADE NOT NULL,
  status TEXT CHECK (status IN ('present', 'absent')) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, meeting_id)
);

-- Indici per performance
CREATE INDEX IF NOT EXISTS idx_attendance_user_id ON attendance(user_id);
CREATE INDEX IF NOT EXISTS idx_attendance_meeting_id ON attendance(meeting_id);

-- RLS per attendance
ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow users to read all attendance" ON attendance;
DROP POLICY IF EXISTS "Allow users to insert own attendance" ON attendance;
DROP POLICY IF EXISTS "Allow users to update own attendance" ON attendance;
DROP POLICY IF EXISTS "Allow admins to delete attendance" ON attendance;

-- Tutti possono vedere tutte le presenze
CREATE POLICY "Allow users to read all attendance" 
  ON attendance 
  FOR SELECT 
  USING (true);

-- Gli utenti possono inserire solo la propria presenza
CREATE POLICY "Allow users to insert own attendance" 
  ON attendance 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Gli utenti possono aggiornare solo la propria presenza
CREATE POLICY "Allow users to update own attendance" 
  ON attendance 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Solo admin possono eliminare presenze
CREATE POLICY "Allow admins to delete attendance" 
  ON attendance 
  FOR DELETE 
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.is_admin = true
    )
  );

-- Gli utenti possono eliminare solo la propria presenza
CREATE POLICY "Allow users to delete own attendance" 
  ON attendance 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Abilita Realtime per la tabella attendance
ALTER PUBLICATION supabase_realtime ADD TABLE attendance;


-- ==========================================
-- CONFIGURAZIONE REALTIME (Opzionale)
-- ==========================================
-- Se il comando sopra non funziona, vai su:
-- https://supabase.com/dashboard/project/qtsasjhevmxzffqlauyt/database/replication
-- E abilita manualmente "Realtime" per la tabella "attendance"


-- ==========================================
-- CONFIGURAZIONE: DISABILITA CONFERMA EMAIL
-- ==========================================
-- IMPORTANTE: Esegui questa query per confermare TUTTI gli utenti (esistenti e futuri)
UPDATE auth.users SET email_confirmed_at = NOW() WHERE email_confirmed_at IS NULL;

-- Per confermare automaticamente i nuovi utenti, vai anche su:
-- https://supabase.com/dashboard/project/qtsasjhevmxzffqlauyt/auth/providers
-- Scorri fino a "Email" e DISATTIVA "Confirm email"


-- ==========================================
-- EXTRA: CONFERMA EMAIL UTENTE SINGOLO
-- ==========================================
-- Se un utente esiste ma dice "Email not confirmed":
-- Vai su: https://supabase.com/dashboard/project/qtsasjhevmxzffqlauyt/auth/users
-- Trova l'utente e clicca "Confirm email"
--
-- OPPURE esegui questa query per confermare manualmente:
-- UPDATE auth.users SET email_confirmed_at = NOW() WHERE email = 'mancino.laura@gmail.com';
