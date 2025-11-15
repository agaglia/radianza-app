# 📧 Guida Email e Messaggi WhatsApp

## Panoramica
L'app Radianza offre un sistema completo per la comunicazione con i membri attraverso:
- **Email Notifications**: Invio email di gruppo
- **Template Manager**: Gestione template riutilizzabili
- **WhatsApp Message Generator**: Creazione messaggi da copiare

---

## 🎯 Funzionalità Email

### Configurazione Provider Email

#### Opzione 1: Resend (Consigliato)
1. Vai su [resend.com](https://resend.com) e crea un account
2. Ottieni la tua API key dal dashboard
3. Nell'app, vai a **Sistema > Impostazioni**
4. Seleziona "Resend" come provider
5. Inserisci l'API key
6. Configura l'email mittente (es: `noreply@tuodominio.com`)

#### Opzione 2: SendGrid
1. Crea un account su [sendgrid.com](https://sendgrid.com)
2. Genera una API key nelle impostazioni
3. Configura come sopra selezionando "SendGrid"

### Variabili d'Ambiente
Aggiungi al file `.env.local`:

```bash
# Email Configuration
EMAIL_PROVIDER=resend
EMAIL_API_KEY=re_xxxxxxxxxxxxxxxx
EMAIL_FROM=noreply@radianza.org
```

### Implementazione API Route
Crea il file `app/api/send-email/route.ts`:

```typescript
import { NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.EMAIL_API_KEY)

export async function POST(request: Request) {
  try {
    const { recipients, subject, message } = await request.json()

    const { data, error } = await resend.emails.send({
      from: process.env.EMAIL_FROM || 'noreply@radianza.org',
      to: recipients,
      subject: subject,
      html: message.replace(/\n/g, '<br>')
    })

    if (error) throw error

    return NextResponse.json({ success: true, data })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
```

### Installazione Dipendenze
```bash
npm install resend
```

---

## 📱 WhatsApp Message Generator

### Come Funziona
1. **Seleziona Incontro**: Scegli dalla lista degli incontri pianificati
2. **Destinatari (opzionale)**: Personalizza per utenti specifici
3. **Messaggio Custom (opzionale)**: Modifica il testo predefinito
4. **Copia**: Copia il messaggio generato negli appunti
5. **Invia**: Incolla in WhatsApp

### Template Predefinito
Il messaggio include automaticamente:
- Saluto personalizzato con nome destinatario
- Titolo incontro
- Data e ora formattate in italiano
- Descrizione evento
- Firma "Radianza"

### Variabili Disponibili
```
{nome}                - Nome completo utente
{email}               - Email utente
{titolo_incontro}     - Titolo meeting
{descrizione_incontro}- Descrizione meeting
{data_incontro}       - Data formattata
{ora_incontro}        - Ora formattata
```

---

## 📝 Gestione Template

### Tipi di Template
- **WhatsApp**: Per messaggi da copiare
- **Email**: Con oggetto e corpo messaggio

### Template Predefiniti
L'app include 3 template:
1. **Promemoria Incontro** (WhatsApp)
2. **Benvenuto Nuovo Membro** (Email)
3. **Assenza Incontro** (Email)

### Creare un Nuovo Template

1. Vai a **Comunicazioni > Template**
2. Clicca "Nuovo Template"
3. Compila i campi:
   - Nome template
   - Tipo (Email/WhatsApp)
   - Oggetto (solo per email)
   - Corpo messaggio
4. Usa le variabili con la sintassi `{variabile}`
5. Salva

### Esempio Template Email
```
Oggetto: Benvenuto/a {nome}!

Corpo:
Caro/a {nome},

Siamo felici di averti nella famiglia Radianza!

Il tuo account è stato creato con l'email: {email}

Ti aspettiamo al prossimo incontro!

In luce,
Radianza
```

---

## 🔔 Sistema Notifiche

### Invio Email di Gruppo

1. Vai a **Comunicazioni > Notifiche**
2. Seleziona i destinatari (uno o più utenti)
3. Scrivi oggetto e messaggio
4. Clicca "Invia"

### Cronologia Invii
Ogni invio viene registrato con:
- Timestamp
- Oggetto
- Numero destinatari
- Stato (inviato/fallito)

---

## 🛠️ Configurazione Supabase

### Allowed Redirect URLs
Per il corretto funzionamento dell'autenticazione, aggiungi questi URL in Supabase:

1. Vai su [Supabase Dashboard](https://app.supabase.com)
2. Seleziona il progetto Radianza
3. Vai a **Authentication > URL Configuration**
4. Aggiungi ai "Redirect URLs":
   ```
   http://localhost:3000/auth/callback
   https://tuo-dominio.com/auth/callback
   ```
5. Salva

### Email Templates Supabase
Personalizza le email di autenticazione:
1. **Authentication > Email Templates**
2. Modifica i template:
   - Confirm signup
   - Reset password
   - Magic link
3. Usa i colori Radianza per coerenza

---

## 🎨 Best Practices

### Email
- ✅ Usa oggetti chiari e descrittivi
- ✅ Mantieni i messaggi brevi e diretti
- ✅ Includi sempre una call-to-action
- ✅ Firma sempre con "Radianza"
- ❌ Non inviare troppo frequentemente
- ❌ Non usare CAPS LOCK eccessivo

### WhatsApp
- ✅ Personalizza con il nome quando possibile
- ✅ Usa emoji con moderazione ✨📅🕐
- ✅ Includi tutte le info necessarie
- ✅ Mantieni il tono amichevole e spirituale
- ❌ Non scrivere messaggi troppo lunghi
- ❌ Non abusare della formattazione (grassetto, corsivo)

### Template
- ✅ Crea template riutilizzabili per eventi ricorrenti
- ✅ Usa variabili per personalizzazione automatica
- ✅ Testa sempre prima di salvare
- ✅ Mantieni una libreria organizzata
- ❌ Non duplicare template simili
- ❌ Non dimenticare di aggiornare template obsoleti

---

## 🚀 Comandi Rapidi

### Avvio Server Sviluppo
```bash
npm run dev
```

### Test Invio Email (console)
```bash
curl -X POST http://localhost:3000/api/send-email \
  -H "Content-Type: application/json" \
  -d '{
    "recipients": ["test@example.com"],
    "subject": "Test",
    "message": "Messaggio di test"
  }'
```

---

## ❓ FAQ

**Q: Le email non vengono inviate**
A: Verifica che l'API key sia corretta e che il provider email sia configurato. Controlla anche i log della console.

**Q: Posso usare HTML nelle email?**
A: Sì, il sistema supporta HTML base. Il testo viene automaticamente convertito con `\n` → `<br>`.

**Q: Come posso inviare allegati via email?**
A: Al momento non supportato. Puoi includere link a file caricati su Supabase Storage.

**Q: I template WhatsApp supportano la formattazione?**
A: Sì, usa: `*grassetto*`, `_corsivo_`, `~barrato~`.

**Q: Quanti destinatari posso selezionare?**
A: Nessun limite nell'app, ma controlla i limiti del tuo piano email provider.

---

## 📞 Supporto

Per problemi tecnici o domande:
- Consulta la documentazione completa in `MANUALE-UTENTE.md`
- Controlla `COMANDI-RAPIDI.md` per troubleshooting
- Verifica gli errori nella console del browser (F12)

---

**Radianza - In Luce e Amore** ✨
