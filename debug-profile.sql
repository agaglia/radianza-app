-- VERIFICA 1: Controlla se l'utente esiste in auth.users
SELECT id, email, created_at 
FROM auth.users 
WHERE email = 'alessandro.gaglia@gmail.com';

-- VERIFICA 2: Controlla se il profilo esiste
SELECT * 
FROM profiles 
WHERE email = 'alessandro.gaglia@gmail.com';

-- SE IL PROFILO NON ESISTE, esegui questo:
-- (Sostituisci 'il-tuo-user-id' con l'ID ottenuto dalla VERIFICA 1)

INSERT INTO profiles (id, email, full_name, is_admin)
SELECT 
  id, 
  email, 
  'Alessandro Gaglia', 
  true
FROM auth.users 
WHERE email = 'alessandro.gaglia@gmail.com'
ON CONFLICT (id) DO UPDATE 
SET is_admin = true, full_name = 'Alessandro Gaglia';
