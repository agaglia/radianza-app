# 🌟 Radianza - Gruppo Spirituale App

![Radianza](https://img.shields.io/badge/Radianza-Spiritual%20Community-gold?style=for-the-badge)
![Next.js](https://img.shields.io/badge/Next.js-16.0-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![Supabase](https://img.shields.io/badge/Supabase-Database-green?style=for-the-badge&logo=supabase)

Applicazione web completa per la gestione del gruppo spirituale Radianza con sistema di autenticazione, calendario riunioni, gestione presenze e archivio contenuti multimediali.

## ✨ Funzionalità Principali

- 🔐 **Autenticazione Sicura** - Login con email/password tramite Supabase
- 👥 **Gestione Utenti** - Pannello admin per creare e gestire membri
- 📅 **Calendario Riunioni** - Visualizzazione e gestione incontri del gruppo
- ✅ **Tracciamento Presenze** - Ogni utente può segnare presenza/assenza
- 📚 **Archivio Contenuti** - Video, foto, testi, poesie e lettere dei radianti
- 🎨 **Design Personalizzato** - Tema oro e celestiale ispirato a "Radianza"
- 📱 **Responsive** - Funziona su desktop, tablet e smartphone
- 🔒 **Sicuro** - Row Level Security (RLS) e policy di accesso

## 🚀 Quick Start

### Prerequisiti
- Node.js 18+ installato
- Account Supabase (gratuito)
- npm o yarn

### 1. Installazione
```bash
npm install
```

### 2. Configurazione
1. Copia `.env.example` in `.env.local`
2. Segui la **[GUIDA-SUPABASE-DETTAGLIATA.md](GUIDA-SUPABASE-DETTAGLIATA.md)** per:
   - Creare progetto Supabase
   - Eseguire lo schema database
   - Ottenere le credenziali
3. Inserisci le credenziali in `.env.local`

### 3. Avvio
```bash
npm run dev
```

Apri [http://localhost:3000](http://localhost:3000) nel browser.

## 📚 Documentazione

- 📘 **[GUIDA-CONFIGURAZIONE.md](GUIDA-CONFIGURAZIONE.md)** - Setup completo passo-passo
- 📗 **[GUIDA-SUPABASE-DETTAGLIATA.md](GUIDA-SUPABASE-DETTAGLIATA.md)** - Configurazione database dettagliata
- 📕 **[MANUALE-UTENTE.md](MANUALE-UTENTE.md)** - Guida per utenti finali
- 📙 **[COMANDI-RAPIDI.md](COMANDI-RAPIDI.md)** - Comandi utili per sviluppo
- 📓 **[RIEPILOGO.md](RIEPILOGO.md)** - Panoramica completa del progetto

## 🛠️ Stack Tecnologico

| Tecnologia | Scopo |
|------------|-------|
| Next.js 14 | Framework React con SSR |
| TypeScript | Type safety e autocomplete |
| Tailwind CSS | Styling utility-first |
| Supabase | Database PostgreSQL + Auth |
| date-fns | Gestione date |
| lucide-react | Icone moderne |

## 📂 Struttura Progetto

```
radianza-app/
├── app/
│   ├── login/              # Pagina login
│   ├── dashboard/          # Dashboard utente
│   ├── admin/             # Pannello amministratore
│   └── globals.css        # Stili globali
├── lib/
│   ├── supabase/          # Client Supabase
│   └── types/             # TypeScript types
├── public/
│   └── images/            # Logo e assets
├── supabase-schema.sql    # Schema database
└── .env.local             # Configurazione (non in git)
```

## 🎨 Design System

### Colori Radianza
```css
--radianza-gold: #D4AF37;          /* Oro principale */
--radianza-light-gold: #F4E4C1;    /* Oro chiaro */
--radianza-deep-blue: #1a237e;     /* Blu profondo */
--radianza-sky-blue: #4fc3f7;      /* Azzurro cielo */
--radianza-celestial: #e3f2fd;     /* Celeste */
```

## 🔐 Sicurezza

- ✅ Password hashate con bcrypt
- ✅ Row Level Security (RLS) su tutte le tabelle
- ✅ Token JWT per autenticazione
- ✅ HTTPS obbligatorio in produzione
- ✅ Validazione input lato server
- ✅ Policy di accesso granulari

## 📦 Comandi Disponibili

```bash
# Sviluppo
npm run dev          # Avvia server sviluppo

# Build
npm run build        # Crea build produzione
npm run start        # Avvia build produzione

# Quality
npm run lint         # Controlla errori linting
```

## 🚀 Deployment

### Opzione 1: Vercel (Consigliato)
1. Push codice su GitHub
2. Importa progetto su [Vercel](https://vercel.com)
3. Aggiungi variabili d'ambiente
4. Deploy automatico!

### Opzione 2: Netlify
1. Push codice su GitHub
2. Connetti a [Netlify](https://netlify.com)
3. Build command: `npm run build`
4. Publish directory: `.next`

## 🔄 Workflow Sviluppo

1. Modifica file in `app/` o `lib/`
2. Next.js rileva cambiamenti automaticamente
3. Browser si ricarica in live
4. Testa funzionalità
5. Commit e push

## 🐛 Troubleshooting

### L'app non parte
```bash
rm -rf node_modules .next
npm install
npm run dev
```

### Errori di build
- Controlla che `.env.local` sia configurato
- Verifica credenziali Supabase
- Controlla console browser (F12)

### Problemi login
- Verifica utente confermato in Supabase
- Controlla policy RLS nel database
- Verifica variabili d'ambiente

Vedi [COMANDI-RAPIDI.md](COMANDI-RAPIDI.md) per altri problemi comuni.

## 📊 Database Schema

### Tabelle Principali

**profiles** - Profili utenti
- id, email, full_name, is_admin

**meetings** - Riunioni del gruppo
- id, title, description, date

**content** - Contenuti multimediali
- id, title, type, url, text_content

**attendance** - Presenze/Assenze
- id, meeting_id, user_id, status

Schema completo in: `supabase-schema.sql`

## 🤝 Contribuire

1. Fork il progetto
2. Crea un branch (`git checkout -b feature/nuova-funzione`)
3. Commit (`git commit -m 'Aggiunge nuova funzione'`)
4. Push (`git push origin feature/nuova-funzione`)
5. Apri Pull Request

## 📝 Licenza

Questo progetto è creato per il gruppo spirituale Radianza.

## 🙏 Crediti

- Design ispirato ai valori di luce e spiritualità
- Built with ❤️ per la community Radianza
- Powered by Next.js, Supabase e Tailwind CSS

## 📞 Supporto

Per domande o problemi:
1. Consulta la documentazione in `/docs`
2. Controlla [MANUALE-UTENTE.md](MANUALE-UTENTE.md)
3. Verifica [COMANDI-RAPIDI.md](COMANDI-RAPIDI.md)

## 🎯 Roadmap Future

- [ ] Upload file diretto (drag & drop)
- [ ] Chat di gruppo in tempo reale
- [ ] Notifiche email per nuovi contenuti
- [ ] Statistiche presenze avanzate
- [ ] App mobile nativa
- [ ] Videoconferenza integrata

---

**Creato con ✨ per illuminare il cammino spirituale del gruppo Radianza**
