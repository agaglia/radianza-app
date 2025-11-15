# ⚡ Comandi Rapidi - Radianza App

## 🚀 Sviluppo

### Avviare il Server di Sviluppo
```powershell
cd "c:\Users\Alessandro Gaglia\OneDrive\Git App Clone\Radianza\radianza-app"
npm run dev
```
Poi apri: http://localhost:3000

### Fermare il Server
Premi `Ctrl + C` nel terminale

---

## 🏗️ Build e Deploy

### Creare Build di Produzione
```powershell
npm run build
```

### Avviare Build di Produzione Localmente
```powershell
npm run start
```

### Lint del Codice
```powershell
npm run lint
```

---

## 📦 Gestione Dipendenze

### Installare Nuove Dipendenze
```powershell
npm install nome-pacchetto
```

### Aggiornare Dipendenze
```powershell
npm update
```

### Controllare Dipendenze Obsolete
```powershell
npm outdated
```

---

## 🗄️ Comandi Supabase

### Reset Completo Database
⚠️ **ATTENZIONE: Elimina tutti i dati!**

```sql
-- Esegui nella SQL Editor di Supabase
DROP TABLE IF EXISTS attendance CASCADE;
DROP TABLE IF EXISTS content CASCADE;
DROP TABLE IF EXISTS meetings CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;

-- Poi riesegui tutto lo script supabase-schema.sql
```

### Vedere Tutti gli Utenti
```sql
SELECT * FROM profiles ORDER BY created_at DESC;
```

### Rendere un Utente Admin
```sql
UPDATE profiles 
SET is_admin = true 
WHERE email = 'email@utente.com';
```

### Rimuovere Permessi Admin
```sql
UPDATE profiles 
SET is_admin = false 
WHERE email = 'email@utente.com';
```

### Vedere Tutte le Riunioni
```sql
SELECT * FROM meetings ORDER BY date DESC;
```

### Vedere Presenze di una Riunione
```sql
SELECT 
  p.full_name,
  p.email,
  a.status
FROM attendance a
JOIN profiles p ON a.user_id = p.id
WHERE a.meeting_id = 'ID_RIUNIONE_QUI';
```

### Contare Tutti i Contenuti
```sql
SELECT 
  type,
  COUNT(*) as totale
FROM content
GROUP BY type;
```

### Eliminare Tutti i Contenuti (⚠️ Attenzione!)
```sql
DELETE FROM content;
```

---

## 🔧 Troubleshooting Rapido

### L'app non parte
```powershell
# 1. Reinstalla node_modules
Remove-Item -Recurse -Force node_modules
Remove-Item package-lock.json
npm install

# 2. Cancella cache Next.js
Remove-Item -Recurse -Force .next
npm run dev
```

### Errori di TypeScript
```powershell
# Riavvia TypeScript server in VS Code
# Ctrl+Shift+P > "TypeScript: Restart TS Server"
```

### Problemi di Login
```powershell
# 1. Verifica variabili ambiente
cat .env.local

# 2. Controlla che l'utente sia confermato in Supabase
# Dashboard > Authentication > Users
```

---

## 🎨 Modifica Rapida Colori

Apri `app/globals.css` e modifica:

```css
:root {
  --radianza-gold: #D4AF37;          /* Oro */
  --radianza-light-gold: #F4E4C1;    /* Oro chiaro */
  --radianza-deep-blue: #1a237e;     /* Blu */
  --radianza-sky-blue: #4fc3f7;      /* Azzurro */
  --radianza-celestial: #e3f2fd;     /* Celeste */
}
```

---

## 📝 Creare Utente Admin Velocemente

### Via SQL Editor Supabase
```sql
-- 1. Crea utente in Authentication manualmente poi:
UPDATE profiles 
SET is_admin = true 
WHERE email = 'nuovoadmin@email.com';
```

---

## 🌐 Deployment Vercel

### Setup Iniziale
```powershell
# 1. Installa Vercel CLI
npm install -g vercel

# 2. Login
vercel login

# 3. Deploy
vercel
```

### Aggiungere Variabili d'Ambiente su Vercel
```powershell
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
```

### Deploy in Produzione
```powershell
vercel --prod
```

---

## 🔍 Debug Veloce

### Vedere Log del Server
Guarda il terminale dove hai eseguito `npm run dev`

### Vedere Log del Browser
1. Apri l'app nel browser
2. Premi `F12`
3. Vai su "Console"
4. Guarda eventuali errori in rosso

### Controllare Network Requests
1. F12 > Tab "Network"
2. Ricarica la pagina
3. Guarda le richieste a Supabase
4. Errori = richieste in rosso

---

## 📊 Statistiche Database Rapide

### Totale Utenti
```sql
SELECT COUNT(*) FROM profiles;
```

### Totale Riunioni
```sql
SELECT COUNT(*) FROM meetings;
```

### Totale Contenuti per Tipo
```sql
SELECT type, COUNT(*) 
FROM content 
GROUP BY type;
```

### Presenze Totali per Utente
```sql
SELECT 
  p.full_name,
  COUNT(CASE WHEN a.status = 'present' THEN 1 END) as presenze,
  COUNT(CASE WHEN a.status = 'absent' THEN 1 END) as assenze
FROM profiles p
LEFT JOIN attendance a ON p.id = a.user_id
GROUP BY p.id, p.full_name;
```

---

## 🔐 Reset Password Utente

### Via Supabase Dashboard
1. Vai su Authentication > Users
2. Trova l'utente
3. Clicca sui tre puntini "..."
4. "Send password reset email"

### Via SQL (Temporaneo)
```sql
-- Non consigliato, meglio usare reset email
-- Ma se necessario, l'utente dovrà essere ricreato
```

---

## 🎯 Workflow Sviluppo Giornaliero

```powershell
# 1. Avvia app
npm run dev

# 2. Fai modifiche al codice

# 3. L'app si ricarica automaticamente

# 4. Testa nel browser

# 5. Quando finisci
# Ctrl + C nel terminale
```

---

## ✅ Checklist Pre-Deploy

```powershell
# 1. Test build locale
npm run build
npm run start

# 2. Controlla errori
npm run lint

# 3. Test su mobile
# Usa Chrome DevTools > Toggle Device Toolbar

# 4. Verifica .env.local
cat .env.local

# 5. Deploy!
vercel --prod
```

---

## 📱 Test su Dispositivi Mobili

### Opzione 1: Chrome DevTools
1. F12
2. Clicca icona dispositivi (Ctrl+Shift+M)
3. Scegli iPhone/Android

### Opzione 2: Test su Vero Smartphone
1. Trova il tuo IP locale:
   ```powershell
   ipconfig
   ```
2. Avvia app: `npm run dev`
3. Sul telefono, vai a: `http://TUO_IP:3000`

---

## 🆘 Comandi di Emergenza

### App Completamente Rotta
```powershell
# Reset totale
Remove-Item -Recurse -Force node_modules
Remove-Item -Recurse -Force .next
Remove-Item package-lock.json
npm install
npm run dev
```

### Database Corrotto
```sql
-- In Supabase SQL Editor
-- Copia prima i dati importanti!
-- Poi drop e ricrea tutto da supabase-schema.sql
```

### Variabili d'Ambiente Sbagliate
```powershell
# 1. Verifica file
cat .env.local

# 2. Ricopia da Supabase
# Dashboard > Settings > API

# 3. Riavvia server
# Ctrl+C poi npm run dev
```

---

## 💡 Tips Produttività

### Hot Reload
Next.js ricarica automaticamente quando salvi file

### TypeScript IntelliSense
VS Code ti suggerisce mentre scrivi

### Formato Automatico
Installa Prettier extension per VS Code

### Git Commits
```powershell
git add .
git commit -m "Descrizione modifiche"
git push
```

---

## 🔗 Link Utili Rapidi

- **Supabase Dashboard**: https://app.supabase.com
- **Vercel Dashboard**: https://vercel.com/dashboard
- **Next.js Docs**: https://nextjs.org/docs
- **Tailwind Docs**: https://tailwindcss.com/docs

---

**Salva questo file nei preferiti per accesso rapido! 🚀**
