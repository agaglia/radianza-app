# 🌟 Radianza - Gruppo Spirituale App

App web per la gestione del gruppo spirituale Radianza con autenticazione, calendario riunioni, gestione presenze e archivio contenuti multimediali.

## 📋 Funzionalità

- ✨ **Autenticazione sicura** con Supabase
- 👥 **Gestione utenti** (solo amministratori)
- 📅 **Calendario riunioni** con tracciamento presenze/assenze
- 📚 **Archivio contenuti**: video, foto, testi, poesie, lettere dei radianti
- 🎨 **Design personalizzato** con colori celestiali e dorati
- 🔐 **Spazi personali** per ogni utente
- 👑 **Pannello amministratore** completo

## 🚀 Configurazione Iniziale

### 1. Configurare Supabase

1. Vai su [supabase.com](https://supabase.com) e crea un account gratuito
2. Clicca su "New Project"
3. Inserisci:
   - **Project Name**: Radianza
   - **Database Password**: (scegli una password sicura e salvala)
   - **Region**: Europe West (Ireland) - o la più vicina a te
4. Clicca "Create new project" e attendi 1-2 minuti

### 2. Creare il Database

1. Nel tuo progetto Supabase, vai su **SQL Editor** (icona nella barra laterale)
2. Clicca su "New Query"
3. Copia tutto il contenuto del file `supabase-schema.sql` 
4. Incolla nell'editor SQL
5. Clicca "Run" (▶️) in basso a destra
6. Dovresti vedere il messaggio "Success. No rows returned"

### 3. Ottenere le Credenziali Supabase

1. Vai su **Project Settings** (icona ingranaggio in basso a sinistra)
2. Clicca su **API** nel menu laterale
3. Troverai:
   - **Project URL**: qualcosa come `https://xxxxx.supabase.co`
   - **anon public key**: una lunga stringa che inizia con `eyJ...`

### 4. Configurare l'App

1. Apri il file `.env.local` nella cartella del progetto
2. Sostituisci i valori:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://tuoprogetto.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=la-tua-chiave-anon
   ```
3. Salva il file

### 5. Creare il Primo Utente Amministratore

1. In Supabase, vai su **Authentication** > **Users**
2. Clicca "Add user" > "Create new user"
3. Inserisci:
   - Email: la tua email amministratore
   - Password: una password sicura
   - Auto Confirm User: ✅ (attiva)
4. Clicca "Create user"
5. Vai su **Table Editor** > **profiles**
6. Trova l'utente appena creato
7. Modifica la riga e imposta `is_admin` a `true`
8. Salva

## 💻 Avviare l'App

1. Apri il terminale nella cartella del progetto
2. Avvia il server di sviluppo:
   ```powershell
   npm run dev
   ```
3. Apri il browser su [http://localhost:3000](http://localhost:3000)
4. Fai login con le credenziali amministratore

## 🎯 Come Usare l'App

### Per l'Amministratore:

1. **Login** con le credenziali admin
2. Clicca su **"Admin"** nell'header
3. Da qui puoi:
   - **Creare nuovi utenti** (tab Utenti)
   - **Aggiungere contenuti** multimediali (tab Contenuti)
   - **Programmare riunioni** (tab Riunioni)
   - **Eliminare** contenuti e riunioni

### Per gli Utenti:

1. **Login** con le credenziali fornite dall'admin
2. Visualizza:
   - **Contenuti**: tutti i contenuti condivisi (video, foto, testi, poesie, lettere)
   - **Calendario**: riunioni programmate con possibilità di segnare presenza/assenza
3. Gestisci le tue **presenze** direttamente dal calendario

## 🎨 Personalizzazione

### Cambiare i Colori

Modifica i colori in `app/globals.css`:

```css
:root {
  --radianza-gold: #D4AF37;          /* Oro principale */
  --radianza-light-gold: #F4E4C1;    /* Oro chiaro */
  --radianza-deep-blue: #1a237e;     /* Blu profondo */
  --radianza-sky-blue: #4fc3f7;      /* Azzurro cielo */
  --radianza-celestial: #e3f2fd;     /* Celeste */
}
```

### Aggiungere il Logo Personalizzato

1. Salva il logo come `logo.png` in `public/images/`
2. Modifica `app/login/page.tsx` e `app/dashboard/DashboardClient.tsx`
3. Sostituisci l'icona `Sparkles` con:
   ```tsx
   <Image src="/images/logo.png" alt="Radianza" width={80} height={80} />
   ```

## 📱 Deployment (Messa Online)

### Opzione 1: Vercel (Consigliato - Gratis)

1. Vai su [vercel.com](https://vercel.com)
2. Clicca "Import Project"
3. Connetti il tuo repository GitHub
4. Aggiungi le variabili d'ambiente:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. Clicca "Deploy"

### Opzione 2: Netlify

1. Vai su [netlify.com](https://netlify.com)
2. Trascina la cartella del progetto
3. Configura build command: `npm run build`
4. Aggiungi le variabili d'ambiente

## 🔒 Sicurezza

- ✅ Row Level Security (RLS) abilitata su tutte le tabelle
- ✅ Solo admin possono creare/modificare utenti e contenuti
- ✅ Gli utenti possono solo visualizzare contenuti e gestire le proprie presenze
- ✅ Autenticazione sicura con Supabase Auth

## 📚 Struttura del Progetto

```
radianza-app/
├── app/
│   ├── login/           # Pagina di login
│   ├── dashboard/       # Dashboard utente
│   ├── admin/          # Pannello amministratore
│   └── globals.css     # Stili globali
├── lib/
│   ├── supabase/       # Client Supabase
│   └── types/          # Tipi TypeScript
├── public/
│   └── images/         # Logo e immagini
├── .env.local          # Variabili d'ambiente
└── supabase-schema.sql # Schema database
```

## 🆘 Risoluzione Problemi

### Errore di login
- Verifica che le credenziali in `.env.local` siano corrette
- Controlla che l'utente sia confermato in Supabase > Authentication > Users

### Contenuti non visibili
- Verifica che l'utente abbia effettuato il login
- Controlla le policy RLS nel database

### Errore "Cannot find module"
- Esegui `npm install` per reinstallare le dipendenze

## 📞 Supporto

Per domande o problemi:
1. Controlla questo README
2. Verifica la configurazione Supabase
3. Controlla i log del browser (F12 > Console)

## 🎉 Prossimi Passi

Dopo aver configurato tutto:
1. Crea tutti gli utenti del gruppo
2. Carica i primi contenuti multimediali
3. Programma le prossime riunioni
4. Condividi il link dell'app con il gruppo

---

**Creato con ❤️ per il Gruppo Spirituale Radianza**
