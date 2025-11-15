-- STEP 1: Verifica quale ID utente sta usando l'app
-- Esegui questa query e dimmi cosa restituisce
SELECT 
  u.id as user_id,
  u.email as user_email,
  p.id as profile_id,
  p.email as profile_email,
  p.is_admin
FROM auth.users u
LEFT JOIN profiles p ON u.id = p.id
WHERE u.email = 'alessandro.gaglia@gmail.com';

-- STEP 2: Se vedi che profile_id è NULL, esegui questo per riparare
INSERT INTO profiles (id, email, full_name, is_admin)
SELECT u.id, u.email, 'Alessandro Gaglia', true
FROM auth.users u
WHERE u.email = 'alessandro.gaglia@gmail.com'
ON CONFLICT (id) DO UPDATE 
SET is_admin = EXCLUDED.is_admin, 
    full_name = EXCLUDED.full_name,
    email = EXCLUDED.email;

-- STEP 3: Verifica di nuovo
SELECT * FROM profiles WHERE email = 'alessandro.gaglia@gmail.com';
