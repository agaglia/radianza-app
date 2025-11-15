-- Script per creare il profilo admin mancante
-- Esegui questo in Supabase SQL Editor

-- Prima, trova l'ID del tuo utente
-- SELECT id, email FROM auth.users WHERE email = 'alessandro.gaglia@gmail.com';

-- Poi inserisci il profilo (sostituisci 'TUO-USER-ID' con l'ID trovato sopra)
INSERT INTO profiles (id, email, full_name, is_admin)
VALUES (
  (SELECT id FROM auth.users WHERE email = 'alessandro.gaglia@gmail.com'),
  'alessandro.gaglia@gmail.com',
  'Alessandro Gaglia',
  true
)
ON CONFLICT (id) DO UPDATE SET is_admin = true;
