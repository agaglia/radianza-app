# Radianza - Guida Deploy su Vercel

## 📋 Prerequisiti
- Account GitHub
- Account Vercel (collega con GitHub)
- Progetto Supabase configurato

## 🚀 Step 1: Preparazione Repository GitHub

### 1.1 Inizializza Git (se non già fatto)
```bash
cd "c:\Users\Alessandro Gaglia\OneDrive\Git App Clone\Radianza\radianza-app"
git init
git add .
git commit -m "Initial commit - Radianza app"
```

### 1.2 Crea Repository su GitHub
1. Vai su https://github.com/new
2. Nome repository: `radianza-app`
3. Visibilità: Private (consigliato)
4. NON inizializzare con README, .gitignore o license

### 1.3 Collega il repository locale a GitHub
```bash
git remote add origin https://github.com/TUO-USERNAME/radianza-app.git
git branch -M main
git push -u origin main
```

## 🌐 Step 2: Deploy su Vercel

### 2.1 Accedi a Vercel
1. Vai su https://vercel.com
2. Sign up / Login con GitHub
3. Autorizza Vercel ad accedere ai tuoi repository

### 2.2 Importa il Progetto
1. Clicca su "Add New..." → "Project"
2. Seleziona il repository `radianza-app`
3. Clicca "Import"

### 2.3 Configura il Progetto
- **Framework Preset**: Next.js (auto-detect)
- **Root Directory**: `./`
- **Build Command**: `npm run build` (default)
- **Output Directory**: `.next` (default)
- **Install Command**: `npm install` (default)

### 2.4 Environment Variables (IMPORTANTE!)
Nella sezione "Environment Variables", aggiungi:

```
NEXT_PUBLIC_SUPABASE_URL=https://qtsasjhevmxzffqlauyt.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<copia-da-supabase-dashboard>
```

**Come trovare SUPABASE_ANON_KEY:**
1. Vai su https://supabase.com/dashboard
2. Seleziona il progetto Radianza
3. Settings → API
4. Copia il valore di `anon` `public` key

### 2.5 Deploy
1. Clicca "Deploy"
2. Attendi 2-3 minuti per il build
3. ✅ Deploy completato!

## 🔧 Step 3: Configurazione Post-Deploy

### 3.1 Aggiorna Supabase Authentication
1. Vai su Supabase Dashboard → Authentication → URL Configuration
2. Aggiungi URL Vercel a **Site URL**: `https://tuo-app.vercel.app`
3. Aggiungi a **Redirect URLs**:
   - `https://tuo-app.vercel.app/auth/callback`
   - `https://tuo-app.vercel.app/dashboard`

### 3.2 Testa l'applicazione
1. Apri l'URL Vercel fornito
2. Testa login/registrazione
3. Verifica funzionalità admin
4. Controlla presenze e contenuti

## 🔄 Step 4: Aggiornamenti Futuri

### Push modifiche su GitHub
```bash
git add .
git commit -m "Descrizione modifiche"
git push
```

Vercel farà **auto-deploy** ad ogni push su `main`!

## 📝 Checklist Finale

- [ ] Repository GitHub creato e pushato
- [ ] Progetto importato su Vercel
- [ ] Environment variables configurate
- [ ] Deploy completato con successo
- [ ] URL Supabase aggiornati
- [ ] Login testato e funzionante
- [ ] Funzionalità admin verificate
- [ ] Sistema presenze operativo
- [ ] Contenuti visibili correttamente

## ⚠️ Troubleshooting

### Build fallisce
- Verifica che `package.json` sia presente
- Controlla errori TypeScript: `npm run build` in locale
- Verifica che tutte le dipendenze siano in `package.json`

### Login non funziona
- Verifica Environment Variables su Vercel
- Controlla Redirect URLs su Supabase
- Assicurati che ANON_KEY sia corretto

### Errori 500
- Controlla i log su Vercel: Dashboard → Deployments → Log
- Verifica connessione Supabase
- Controlla RLS policies su Supabase

## 🎯 URL Importanti

- **Supabase Dashboard**: https://supabase.com/dashboard/project/qtsasjhevmxzffqlauyt
- **Vercel Dashboard**: https://vercel.com/dashboard
- **GitHub Repository**: https://github.com/TUO-USERNAME/radianza-app

## 📞 Supporto

Se incontri problemi:
1. Controlla i log di Vercel
2. Verifica le Environment Variables
3. Testa l'app in locale con `npm run dev`
4. Controlla la console browser (F12) per errori JavaScript

---

**Fatto! La tua app Radianza è ora live su Vercel! 🎉**
