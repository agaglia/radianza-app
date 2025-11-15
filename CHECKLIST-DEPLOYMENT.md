# 🚀 Checklist Deployment Produzione

## Prima del Deployment

### ✅ Configurazione Completa

- [ ] `.env.local` configurato con credenziali Supabase corrette
- [ ] Database Supabase completamente configurato
- [ ] Almeno un utente amministratore creato
- [ ] Schema database eseguito senza errori
- [ ] Policy RLS attive su tutte le tabelle

### ✅ Test Locali

- [ ] App si avvia senza errori (`npm run dev`)
- [ ] Login funziona correttamente
- [ ] Dashboard utente carica contenuti
- [ ] Pannello admin accessibile
- [ ] Creazione utenti funziona
- [ ] Creazione contenuti funziona
- [ ] Creazione riunioni funziona
- [ ] Gestione presenze/assenze funziona

### ✅ Build di Produzione

```powershell
npm run build
```

- [ ] Build completato senza errori
- [ ] Nessun warning critico
- [ ] Test build locale:
  ```powershell
  npm run start
  ```
- [ ] App funziona in modalità produzione

### ✅ Codice Pulito

```powershell
npm run lint
```

- [ ] Nessun errore di linting
- [ ] Codice formattato correttamente
- [ ] File inutili rimossi
- [ ] Commenti di debug rimossi

---

## Deployment Vercel

### 1. Preparazione Repository

- [ ] Codice pushato su GitHub/GitLab/Bitbucket
- [ ] Branch `main` o `master` aggiornato
- [ ] `.gitignore` include `.env.local`
- [ ] README.md completo

### 2. Setup Vercel

#### 2.1 Creare Account
- [ ] Vai su [vercel.com](https://vercel.com)
- [ ] Sign up con GitHub (consigliato)
- [ ] Autorizza l'accesso ai repository

#### 2.2 Importare Progetto
- [ ] Clicca "Add New" > "Project"
- [ ] Seleziona repository `radianza-app`
- [ ] Clicca "Import"

#### 2.3 Configurare Build
```
Framework Preset: Next.js
Root Directory: ./
Build Command: npm run build
Output Directory: (lasciare automatico)
Install Command: npm install
```

- [ ] Impostazioni corrette

#### 2.4 Variabili d'Ambiente
Aggiungi in "Environment Variables":

```
Name: NEXT_PUBLIC_SUPABASE_URL
Value: https://tuoprogetto.supabase.co

Name: NEXT_PUBLIC_SUPABASE_ANON_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

- [ ] `NEXT_PUBLIC_SUPABASE_URL` aggiunta
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` aggiunta
- [ ] Valori copiati correttamente da Supabase

#### 2.5 Deploy
- [ ] Clicca "Deploy"
- [ ] Attendi 1-3 minuti
- [ ] Deploy completato con successo

### 3. Verifica Deployment

- [ ] Apri l'URL Vercel (es: `radianza.vercel.app`)
- [ ] Pagina di login carica correttamente
- [ ] Login funziona
- [ ] Dashboard carica
- [ ] Contenuti visibili
- [ ] Calendario funziona
- [ ] Admin panel accessibile (se admin)

### 4. Configurazione Dominio (Opzionale)

#### 4.1 Acquistare Dominio
- [ ] Acquistato dominio (es: `radianza.it`)
- [ ] Accesso al pannello DNS

#### 4.2 Configurare in Vercel
- [ ] Vai su Project > Settings > Domains
- [ ] Aggiungi dominio personalizzato
- [ ] Copia record DNS forniti

#### 4.3 Configurare DNS
Nel tuo provider DNS:
```
Type: A
Name: @
Value: 76.76.21.21

Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

- [ ] Record A configurato
- [ ] Record CNAME configurato
- [ ] Attendi propagazione DNS (30 min - 24h)
- [ ] HTTPS automatico attivato

---

## Deployment Netlify (Alternativa)

### 1. Setup Netlify

- [ ] Vai su [netlify.com](https://netlify.com)
- [ ] Sign up con GitHub
- [ ] Clicca "Add new site" > "Import existing project"

### 2. Configurazione

```
Build command: npm run build
Publish directory: .next
```

- [ ] Repository collegato
- [ ] Branch: `main`
- [ ] Build command configurato

### 3. Variabili d'Ambiente

In Site settings > Environment variables:

- [ ] `NEXT_PUBLIC_SUPABASE_URL` aggiunta
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` aggiunta

### 4. Deploy

- [ ] Clicca "Deploy site"
- [ ] Attendi build
- [ ] Sito online

---

## Post-Deployment

### ✅ Configurazione Supabase

#### Allowed URLs
In Supabase > Authentication > URL Configuration:

Aggiungi in "Site URL":
```
https://tuoapp.vercel.app
```

Aggiungi in "Redirect URLs":
```
https://tuoapp.vercel.app/**
http://localhost:3000/**
```

- [ ] Site URL configurato
- [ ] Redirect URLs configurati
- [ ] Salvato

### ✅ Test Completi

#### Test Funzionalità Base
- [ ] Login da produzione funziona
- [ ] Logout funziona
- [ ] Redirect corretti

#### Test Admin
- [ ] Accesso pannello admin
- [ ] Creazione nuovo utente
- [ ] Creazione contenuto
- [ ] Creazione riunione
- [ ] Eliminazione contenuto
- [ ] Eliminazione riunione

#### Test Utente
- [ ] Login utente normale
- [ ] Visualizzazione contenuti
- [ ] Calendario riunioni
- [ ] Segnalazione presenza
- [ ] Segnalazione assenza
- [ ] Cambio stato presenza

#### Test Mobile
- [ ] Apri da smartphone
- [ ] Login mobile funziona
- [ ] Layout responsive corretto
- [ ] Navigazione funziona
- [ ] Form compilabili
- [ ] Pulsanti cliccabili

### ✅ Performance

Usa [PageSpeed Insights](https://pagespeed.web.dev/):

- [ ] Score > 80 su mobile
- [ ] Score > 90 su desktop
- [ ] First Contentful Paint < 2s
- [ ] Time to Interactive < 3s

### ✅ Sicurezza

- [ ] HTTPS attivo (lucchetto verde)
- [ ] RLS attivo su tutte le tabelle Supabase
- [ ] `.env.local` NON presente su GitHub
- [ ] Password admin forte
- [ ] API keys non esposte nel codice

---

## Lancio Ufficiale

### 1. Comunicazione

- [ ] Email a tutti i membri con:
  - [ ] Link all'app
  - [ ] Istruzioni per il primo accesso
  - [ ] Credenziali di login
  - [ ] Link al MANUALE-UTENTE.md

### 2. Training

- [ ] Sessione dimostrativa per il gruppo
- [ ] Spiegazione dashboard utente
- [ ] Spiegazione calendario
- [ ] Spiegazione presenze
- [ ] Q&A

### 3. Onboarding Utenti

Per ogni membro:
- [ ] Account creato
- [ ] Email di benvenuto inviata
- [ ] Credenziali comunicate (password temporanea)
- [ ] Primo login verificato
- [ ] Cambio password suggerito

### 4. Contenuti Iniziali

- [ ] Caricati primi 5-10 contenuti
- [ ] Programmate prossime 3 riunioni
- [ ] Descrizioni complete
- [ ] Media testati e funzionanti

---

## Monitoraggio Post-Lancio

### Prima Settimana

Controlla giornalmente:
- [ ] Numero login utenti
- [ ] Errori in Vercel Analytics
- [ ] Feedback utenti
- [ ] Presenze segnalate
- [ ] Nuovi contenuti visti

### Primo Mese

Controlla settimanalmente:
- [ ] Engagement complessivo
- [ ] Statistiche presenze riunioni
- [ ] Richieste nuove funzionalità
- [ ] Problemi tecnici segnalati
- [ ] Utilizzo storage Supabase

### Metriche Successo

- [ ] > 80% utenti hanno fatto login
- [ ] > 70% presenze segnalate
- [ ] 0 errori critici
- [ ] Feedback positivo dalla maggioranza

---

## Manutenzione Regolare

### Settimanale
- [ ] Controllare Vercel Dashboard
- [ ] Verificare uptime (dovrebbe essere ~100%)
- [ ] Rispondere a feedback utenti

### Mensile
- [ ] Aggiornare dipendenze npm
  ```powershell
  npm update
  npm audit fix
  ```
- [ ] Verificare storage Supabase
- [ ] Backup database (automatico, verificare)
- [ ] Analisi utilizzo features

### Trimestrale
- [ ] Review sicurezza
- [ ] Aggiornamento Next.js/Supabase
- [ ] Pulizia dati non necessari
- [ ] Raccolta feedback per nuove features

---

## Rollback (Se Necessario)

### Se il deployment fallisce:

1. **Vercel**
   - [ ] Vai su Deployments
   - [ ] Trova ultimo deployment funzionante
   - [ ] Clicca "..." > "Promote to Production"

2. **Codice**
   ```powershell
   git revert HEAD
   git push
   ```

3. **Database**
   - [ ] Vai su Supabase > Database > Backups
   - [ ] Restore backup precedente

---

## Troubleshooting Deployment

### Build Fallisce

**Errore:** `Module not found`
```powershell
# Soluzione
rm -rf node_modules
npm install
git add .
git commit -m "Fix dependencies"
git push
```

**Errore:** `Invalid environment variables`
- [ ] Verifica variabili in Vercel/Netlify
- [ ] Controlla che siano esattamente:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### App Non Carica

**Errore 500**
- [ ] Controlla Vercel logs
- [ ] Verifica variabili d'ambiente
- [ ] Controlla Supabase status

**Pagina Bianca**
- [ ] Apri Console browser (F12)
- [ ] Cerca errori JavaScript
- [ ] Verifica che NEXT_PUBLIC_* siano pubblici

### Login Non Funziona

- [ ] Verifica Allowed URLs in Supabase
- [ ] Controlla credenziali
- [ ] Verifica utente confermato
- [ ] Test con altro browser

---

## 🎉 Deployment Completato!

Se hai spuntato tutto:
- ✅ App online e funzionante
- ✅ Tutti i test passati
- ✅ Utenti creati e notificati
- ✅ Monitoraggio attivo

**Congratulazioni! L'app Radianza è LIVE! 🌟**

---

## 📞 Supporto Post-Deployment

### Vercel Support
- Dashboard: [vercel.com/dashboard](https://vercel.com/dashboard)
- Docs: [vercel.com/docs](https://vercel.com/docs)
- Status: [vercel-status.com](https://vercel-status.com)

### Supabase Support
- Dashboard: [app.supabase.com](https://app.supabase.com)
- Docs: [supabase.com/docs](https://supabase.com/docs)
- Status: [status.supabase.com](https://status.supabase.com)

---

_Checklist aggiornata: Novembre 2025_
_Creata con ❤️ per il gruppo Radianza_
