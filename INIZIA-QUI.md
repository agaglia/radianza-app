# 🚀 INIZIA QUI - Primi Passi Rapidi

## 👋 Benvenuto!

Hai appena ricevuto l'app Radianza completa! Seguendo questa guida sarai operativo in **30 minuti**.

---

## ⚡ Setup in 3 Passi

### PASSO 1: Configurare Supabase (15 min)

#### 1.1 Crea Account
1. Vai su [supabase.com](https://supabase.com)
2. Clicca "Start your project"
3. Registrati (gratuito, no carta di credito)

#### 1.2 Crea Progetto
1. Clicca "New Project"
2. Compila:
   - Nome: `Radianza`
   - Password Database: **[SCEGLI E SALVA!]**
   - Region: `Europe West`
3. Clicca "Create" e ATTENDI 2 minuti

#### 1.3 Configura Database
1. Vai su **SQL Editor** (sidebar sinistra)
2. Clicca "+ New query"
3. Apri il file `supabase-schema.sql`
4. Copia TUTTO e incolla nell'editor
5. Clicca **RUN** (▶️)
6. ✅ Vedi "Success"? Perfetto!

#### 1.4 Ottieni Credenziali
1. Vai su **Settings** (⚙️ in basso)
2. Clicca **API**
3. Copia:
   - **Project URL** (esempio: `https://abc123.supabase.co`)
   - **anon public key** (lunga stringa che inizia con `eyJ...`)

#### 1.5 Configura App
1. Apri il file `.env.local`
2. Incolla i tuoi valori:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://tuoprogetto.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```
3. **SALVA** (Ctrl+S)

---

### PASSO 2: Creare l'Amministratore (5 min)

#### 2.1 Crea Utente
1. In Supabase, vai su **Authentication** > **Users**
2. Clicca "Add user" > "Create new user"
3. Inserisci:
   ```
   Email: admin@radianza.it
   Password: [password sicura]
   ✅ Auto Confirm User
   ```
4. Clicca "Create user"

#### 2.2 Rendilo Admin
1. Vai su **Table Editor** > Tabella `profiles`
2. Trova la riga con il tuo email
3. Clicca sulla riga per modificare
4. Cambia `is_admin` da `false` a `true`
5. Salva

---

### PASSO 3: Avviare l'App (5 min)

#### 3.1 Installa Dipendenze
```powershell
cd "c:\Users\Alessandro Gaglia\OneDrive\Git App Clone\Radianza\radianza-app"
npm install
```

#### 3.2 Avvia Server
```powershell
npm run dev
```

#### 3.3 Apri Browser
1. Vai su: [http://localhost:3000](http://localhost:3000)
2. Dovresti vedere la pagina di **LOGIN**
3. Inserisci:
   - Email: `admin@radianza.it`
   - Password: quella scelta prima
4. Clicca "Accedi"

#### 3.4 Verifica
✅ Vedi il pannello con il pulsante "Admin"? **PERFETTO!**

---

## 🎉 Sei Pronto!

Ora puoi:

### 1️⃣ Creare Utenti
1. Clicca "Admin"
2. Tab "Utenti"
3. "+ Nuovo Utente"
4. Compila form e crea

### 2️⃣ Aggiungere Contenuti
1. Tab "Contenuti"
2. "+ Nuovo Contenuto"
3. Scegli tipo (video, foto, testo, poesia, lettera)
4. Compila e pubblica

### 3️⃣ Programmare Riunioni
1. Tab "Riunioni"
2. "+ Nuova Riunione"
3. Inserisci data, ora e dettagli
4. Crea

---

## 📚 Prossimi Passi

Dopo aver testato tutto:

### Per Iniziare
1. ✅ Crea 2-3 utenti di test
2. ✅ Carica un contenuto di esempio
3. ✅ Programma una riunione di prova
4. ✅ Testa il login con un utente normale
5. ✅ Esplora il nuovo menu laterale

### Nuove Funzionalità
- 📧 **Email**: Configura il provider email (vedi [GUIDA-EMAIL-MESSAGGI.md](GUIDA-EMAIL-MESSAGGI.md))
- 💬 **WhatsApp**: Genera messaggi personalizzati da copiare
- 📝 **Template**: Crea template riutilizzabili per comunicazioni

### Per Produzione
1. 📖 Leggi il [MANUALE-UTENTE.md](MANUALE-UTENTE.md)
2. 📧 Configura [email notifications](GUIDA-EMAIL-MESSAGGI.md)
3. 👥 Crea tutti gli utenti del gruppo
4. 📚 Carica i contenuti iniziali
5. 📅 Programma le prossime riunioni
6. 🌐 Metti online (opzionale)

---

## 🆘 Problemi?

### "Invalid supabaseUrl"
→ Controlla che `.env.local` sia configurato correttamente
→ Riavvia il server (`Ctrl+C` poi `npm run dev`)

### "Invalid login credentials"
→ Verifica che l'utente sia "Confirmed" in Supabase
→ Controlla email e password

### Le tabelle non esistono
→ Vai in Supabase > Table Editor
→ Dovresti vedere: profiles, meetings, content, attendance
→ Se mancano, riesegui lo script SQL

### Altri problemi
→ Consulta [COMANDI-RAPIDI.md](COMANDI-RAPIDI.md)
→ Leggi [GUIDA-SUPABASE-DETTAGLIATA.md](GUIDA-SUPABASE-DETTAGLIATA.md)

---

## 📖 Documenti Utili

| Documento | Quando Usarlo |
|-----------|---------------|
| **INIZIA-QUI.md** | ← SEI QUI! Primi passi |
| **GUIDA-SUPABASE-DETTAGLIATA.md** | Setup database approfondito |
| **GUIDA-EMAIL-MESSAGGI.md** | Configurazione email e WhatsApp |
| **MANUALE-UTENTE.md** | Guida completa funzionalità |
| **COMANDI-RAPIDI.md** | Comandi sviluppo utili |
| **RIEPILOGO.md** | Panoramica progetto |

---

## ✅ Checklist Veloce

Hai completato:
- [ ] Account Supabase creato
- [ ] Progetto Supabase configurato
- [ ] Database schema eseguito
- [ ] Credenziali copiate in `.env.local`
- [ ] Utente admin creato e configurato
- [ ] App avviata con `npm run dev`
- [ ] Login effettuato con successo
- [ ] Pannello admin visibile

Se hai spuntato tutto: **CONGRATULAZIONI! 🎉**

---

## 🎯 Test Rapido

Prova tutte le funzionalità:

### Come Admin
1. ✅ Crea un utente di test
2. ✅ Aggiungi un contenuto (tipo "testo")
3. ✅ Programma una riunione domani
4. ✅ Fai logout

### Come Utente
1. ✅ Login con l'utente di test
2. ✅ Visualizza il contenuto appena creato
3. ✅ Vai nel calendario
4. ✅ Segna "Presente" alla riunione
5. ✅ Cambia in "Assente"
6. ✅ Fai logout

Se tutto funziona: **APP PRONTA! 🚀**

---

## 💡 Tips Iniziali

- 🔄 L'app si ricarica automaticamente quando modifichi il codice
- 🎨 Puoi cambiare i colori in `app/globals.css`
- 👤 Crea prima tutti gli utenti, poi invitali
- 📚 Organizza i contenuti per tipo
- 📅 Programma le riunioni con anticipo
- 💾 Supabase fa backup automatici ogni giorno

---

## 🌐 Mettere Online (Opzionale)

Quando sei pronto:

### Vercel (Consigliato - Gratis)
1. Vai su [vercel.com](https://vercel.com)
2. "Import Project"
3. Connetti GitHub
4. Aggiungi variabili d'ambiente
5. Deploy!

### Risultato
Avrai un URL tipo: `radianza.vercel.app`
Condividilo con il gruppo!

---

## 🎊 Fatto!

Ora hai:
- ✨ Un'app web professionale
- 🔐 Sistema di login sicuro
- 👥 Gestione utenti completa
- 📚 Archivio contenuti multimediali
- 📅 Calendario con presenze
- 🎨 Design personalizzato Radianza

**Inizia a usarla e fai brillare la tua community! ✨**

---

**Domande? Controlla gli altri documenti nella cartella del progetto!**

_Creato con ❤️ per il gruppo spirituale Radianza_
