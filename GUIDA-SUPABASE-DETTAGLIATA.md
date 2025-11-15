# 📸 Guida Passo per Passo - Configurazione Supabase

## Passo 1: Creare un Account Supabase

1. Vai su [https://supabase.com](https://supabase.com)
2. Clicca su "Start your project" o "Sign Up"
3. Registrati con GitHub, Google o Email
4. Conferma la tua email se richiesto

## Passo 2: Creare il Progetto

1. Una volta loggato, clicca su "New Project" (grande pulsante verde)
2. Compila il form:
   ```
   Nome del progetto: Radianza
   Database Password: [SCEGLI UNA PASSWORD SICURA E SALVALA!]
   Region: Europe West (Ireland)
   Pricing Plan: Free (gratuito)
   ```
3. Clicca "Create new project"
4. **ATTENDI 1-2 MINUTI** - vedrai una barra di caricamento con scritto "Setting up project..."

## Passo 3: Configurare il Database

### 3.1 Aprire SQL Editor
1. Nella barra laterale sinistra, cerca l'icona "SQL Editor" (sembra </> )
2. Cliccala
3. Clicca su "+ New query" in alto a sinistra

### 3.2 Eseguire lo Schema
1. Apri il file `supabase-schema.sql` dal progetto
2. Seleziona TUTTO il contenuto (Ctrl+A)
3. Copia (Ctrl+C)
4. Incolla nell'editor SQL di Supabase (Ctrl+V)
5. Clicca il pulsante "RUN" (▶️) in basso a destra
6. Dovresti vedere: "Success. No rows returned"

✅ **CONGRATULAZIONI!** Il database è configurato!

## Passo 4: Ottenere le Credenziali

### 4.1 Andare nelle Impostazioni
1. Clicca sull'icona "⚙️ Settings" (ingranaggio) in basso nella barra laterale
2. Nel menu che appare, clicca su "API"

### 4.2 Copiare le Credenziali
Troverai due informazioni importanti:

**1. Project URL:**
```
https://xxxxxxxxx.supabase.co
```
→ Copia questo URL completo

**2. Project API keys > anon public:**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS...
```
→ Copia questa lunga stringa (clicca sull'icona "copia" accanto)

### 4.3 Configurare l'App
1. Apri il file `.env.local` nella cartella del progetto
2. Sostituisci i valori:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://tuoprogetto.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```
3. **SALVA il file** (Ctrl+S)

## Passo 5: Creare il Primo Amministratore

### 5.1 Andare in Authentication
1. Nella barra laterale, clicca sull'icona "👤 Authentication"
2. Assicurati di essere nella tab "Users"

### 5.2 Aggiungere l'Utente Admin
1. Clicca "Add user" (in alto a destra)
2. Seleziona "Create new user"
3. Compila:
   ```
   Email: admin@radianza.it (o la tua email)
   Password: [scegli una password sicura]
   Auto Confirm User: ✅ ATTIVA QUESTO!
   ```
4. Clicca "Create user"

### 5.3 Rendere l'Utente Amministratore
1. Vai su "Table Editor" nella barra laterale (icona tabella)
2. Seleziona la tabella "profiles" dal menu a tendina
3. Trova la riga con l'utente che hai appena creato
4. Clicca sull'icona "✏️" (matita) per modificare
5. Nella colonna "is_admin", cambia da `false` a `true`
6. Clicca "Save"

✅ **PERFETTO!** Ora hai un utente amministratore!

## Passo 6: Verificare la Configurazione

### 6.1 Controllare le Tabelle
Vai su "Table Editor" e verifica che esistano queste tabelle:
- ✅ profiles
- ✅ meetings  
- ✅ content
- ✅ attendance

### 6.2 Controllare l'Admin
Nella tabella "profiles":
- Deve esserci UNA riga
- Con il tuo email
- Con "is_admin" = true

## Passo 7: Avviare l'App

1. Apri il terminale nella cartella del progetto
2. Esegui:
   ```powershell
   npm run dev
   ```
3. Apri il browser su: [http://localhost:3000](http://localhost:3000)
4. Fai login con:
   - Email: quella che hai usato per creare l'admin
   - Password: quella che hai scelto

## 🎉 Fatto!

Se tutto funziona, dovresti:
1. Vedere la pagina di login con il design Radianza
2. Poter fare login
3. Vedere il pannello amministratore
4. Poter creare utenti, contenuti e riunioni

## ⚠️ Problemi Comuni

### "Invalid login credentials"
→ Controlla che l'utente sia "Confirmed" in Supabase > Authentication > Users
→ Riprova con email e password corrette

### "Invalid supabaseUrl"
→ Controlla che `.env.local` abbia i valori corretti
→ Riavvia il server (`npm run dev`)

### Le tabelle non esistono
→ Ricontrolla di aver eseguito tutto lo script SQL in "Passo 3"
→ Verifica in "Table Editor" che le tabelle ci siano

### L'utente non è admin
→ Vai in "Table Editor" > "profiles"
→ Modifica la riga e imposta "is_admin" a true

## 🆘 Hai Bisogno di Aiuto?

1. **Rileggi questa guida** passo per passo
2. **Controlla i log** nel terminale
3. **Controlla la console del browser** (F12)
4. **Verifica Supabase**: tutti i passi completati?

---

**Nota Importante:** Supabase offre un piano gratuito che include:
- ✅ 500 MB di spazio database
- ✅ 1 GB di storage per file
- ✅ 50.000 utenti attivi al mese
- ✅ Più che sufficiente per il gruppo Radianza!

**NON HAI BISOGNO DI CARTA DI CREDITO per il piano gratuito.**
