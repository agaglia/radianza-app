'use client'

import { useState, useEffect } from 'react'
import { MessageSquare, Copy, Check, FileText } from 'lucide-react'

interface Meeting {
  id: string
  title: string
  description: string | null
  date: string
}

interface User {
  id: string
  full_name: string | null
  email: string
}

interface Template {
  id: string
  name: string
  type: 'email' | 'whatsapp'
  subject?: string
  body: string
}

export default function MessagesClient({ meetings, users }: { meetings: Meeting[], users: User[] }) {
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null)
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])
  const [customMessage, setCustomMessage] = useState('')
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null)
  const [copied, setCopied] = useState(false)
  const [templates, setTemplates] = useState<Template[]>([])

  // Carica templates da localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('radianza-templates')
      if (saved) {
        const allTemplates = JSON.parse(saved)
        // Filtra solo i template WhatsApp
        setTemplates(allTemplates.filter((t: Template) => t.type === 'whatsapp'))
      } else {
        // Templates predefiniti di fallback
        setTemplates(defaultTemplates)
      }
    }
  }, [])

  // Templates predefiniti
  const defaultTemplates: Template[] = [
    {
      id: '1',
      name: 'Promemoria Incontro Standard',
      type: 'whatsapp',
      body: `Caro/a {nome},

Ti ricordiamo il nostro prossimo incontro di meditazione Radianza:

📅 *{titolo_incontro}*
🕐 {data_incontro} alle ore {ora_incontro}

{descrizione_incontro}

Ti aspettiamo con gioia! ✨

In luce e amore,
Radianza`
    },
    {
      id: '2',
      name: 'Invito Incontro con Tema',
      type: 'whatsapp',
      body: `Carissimo/a {nome},

Siamo felici di invitarti al nostro prossimo incontro:

✨ *{titolo_incontro}*
📆 {data_incontro}
⏰ {ora_incontro}

Tema dell'incontro:
{descrizione_incontro}

La tua presenza è preziosa per il nostro cerchio di luce! 🌟

Con amore,
Radianza`
    },
    {
      id: '3',
      name: 'Promemoria Breve',
      type: 'whatsapp',
      body: `Ciao {nome}! 👋

Ti ricordiamo:
📅 {titolo_incontro}
🕐 {data_incontro} - {ora_incontro}

Ci vediamo! ✨`
    },
    {
      id: '4',
      name: 'Messaggio Generico',
      type: 'whatsapp',
      body: `Carissimi,

Ti ricordiamo il nostro prossimo incontro di meditazione Radianza:

📅 *{titolo_incontro}*
🕐 {data_incontro} alle ore {ora_incontro}

{descrizione_incontro}

Ti aspettiamo con gioia! ✨

In luce e amore,
Radianza`
    }
  ]

  // Quando cambia il template, aggiorna il messaggio personalizzato
  useEffect(() => {
    if (selectedTemplate) {
      setCustomMessage(selectedTemplate.body)
    }
  }, [selectedTemplate])

  // Ricarica templates quando la finestra ottiene il focus (per sincronizzare con Template page)
  useEffect(() => {
    const handleFocus = () => {
      if (typeof window !== 'undefined') {
        const saved = localStorage.getItem('radianza-templates')
        if (saved) {
          const allTemplates = JSON.parse(saved)
          setTemplates(allTemplates.filter((t: Template) => t.type === 'whatsapp'))
        }
      }
    }
    window.addEventListener('focus', handleFocus)
    return () => window.removeEventListener('focus', handleFocus)
  }, [])

  const generateMessage = () => {
    if (!selectedMeeting) return ''

    const date = new Date(selectedMeeting.date).toLocaleDateString('it-IT', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })

    const time = new Date(selectedMeeting.date).toLocaleTimeString('it-IT', {
      hour: '2-digit',
      minute: '2-digit'
    })

    const names = selectedUsers
      .map(id => users.find(u => u.id === id)?.full_name || 'Amico')
      .join(', ')

    const greeting = selectedUsers.length > 0 
      ? `Caro/a ${names},` 
      : 'Carissimi,'

    // Se c'è un messaggio personalizzato, sostituisci le variabili
    if (customMessage) {
      return customMessage
        .replace(/{nome}/g, names || 'Amico')
        .replace(/{titolo_incontro}/g, selectedMeeting.title)
        .replace(/{descrizione_incontro}/g, selectedMeeting.description || '')
        .replace(/{data_incontro}/g, date)
        .replace(/{ora_incontro}/g, time)
    }

    // Messaggio predefinito di fallback
    return `${greeting}

Ti ricordiamo il nostro prossimo incontro di meditazione Radianza:

📅 *${selectedMeeting.title}*
🕐 ${date} alle ore ${time}

${selectedMeeting.description || ''}

Ti aspettiamo con gioia! ✨

In luce e amore,
Radianza`
  }

  const handleCopy = async () => {
    const message = generateMessage()
    await navigator.clipboard.writeText(message)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const toggleUser = (userId: string) => {
    setSelectedUsers(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    )
  }

  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-radianza-deep-blue">Generatore Messaggi WhatsApp</h1>
          <p className="text-radianza-deep-blue/60 mt-2">Crea messaggi personalizzati da copiare e inviare</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Selezione Template */}
          <div className="bg-white/80 backdrop-blur-lg rounded-xl shadow-lg p-6 border border-radianza-gold/30">
            <h2 className="text-xl font-bold text-radianza-deep-blue mb-4 flex items-center">
              <FileText className="w-5 h-5 mr-2 text-radianza-gold" />
              1. Seleziona Template
            </h2>
            <div className="space-y-2 max-h-80 overflow-y-auto">
              {templates.map((template) => (
                <button
                  key={template.id}
                  onClick={() => setSelectedTemplate(template)}
                  className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                    selectedTemplate?.id === template.id
                      ? 'border-radianza-gold bg-radianza-gold/10'
                      : 'border-radianza-gold/20 hover:border-radianza-gold/50'
                  }`}
                >
                  <div className="font-semibold text-radianza-deep-blue">{template.name}</div>
                  <div className="text-xs text-radianza-deep-blue/60 mt-1 line-clamp-2">
                    {template.body.substring(0, 80)}...
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Selezione Incontro */}
          <div className="bg-white/80 backdrop-blur-lg rounded-xl shadow-lg p-6 border border-radianza-gold/30">
            <h2 className="text-xl font-bold text-radianza-deep-blue mb-4">2. Seleziona Incontro</h2>
            <div className="space-y-2 max-h-80 overflow-y-auto">
              {meetings.map((meeting) => (
                <button
                  key={meeting.id}
                  onClick={() => setSelectedMeeting(meeting)}
                  className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                    selectedMeeting?.id === meeting.id
                      ? 'border-radianza-gold bg-radianza-gold/10'
                      : 'border-radianza-gold/20 hover:border-radianza-gold/50'
                  }`}
                >
                  <div className="font-semibold text-radianza-deep-blue">{meeting.title}</div>
                  <div className="text-sm text-radianza-deep-blue/60">
                    {new Date(meeting.date).toLocaleDateString('it-IT', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Selezione Destinatari */}
          <div className="bg-white/80 backdrop-blur-lg rounded-xl shadow-lg p-6 border border-radianza-gold/30">
            <h2 className="text-xl font-bold text-radianza-deep-blue mb-4">3. Seleziona Destinatari (opzionale)</h2>
            <div className="space-y-2 max-h-80 overflow-y-auto">
              <button
                onClick={() => setSelectedUsers([])}
                className={`w-full text-left p-3 rounded-lg border transition-all ${
                  selectedUsers.length === 0
                    ? 'border-radianza-gold bg-radianza-gold/10'
                    : 'border-radianza-gold/20 hover:border-radianza-gold/50'
                }`}
              >
                <span className="text-radianza-deep-blue">Tutti (messaggio generico)</span>
              </button>
              {users.map((user) => (
                <button
                  key={user.id}
                  onClick={() => toggleUser(user.id)}
                  className={`w-full text-left p-3 rounded-lg border transition-all ${
                    selectedUsers.includes(user.id)
                      ? 'border-radianza-gold bg-radianza-gold/10'
                      : 'border-radianza-gold/20 hover:border-radianza-gold/50'
                  }`}
                >
                  <div className="text-radianza-deep-blue">{user.full_name || user.email}</div>
                  <div className="text-xs text-radianza-deep-blue/60">{user.email}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Messaggio Personalizzato */}
          <div className="lg:col-span-2 bg-white/80 backdrop-blur-lg rounded-xl shadow-lg p-6 border border-radianza-gold/30">
            <h2 className="text-xl font-bold text-radianza-deep-blue mb-4">4. Personalizza Messaggio (opzionale)</h2>
            <div className="mb-3 p-3 bg-radianza-celestial/20 rounded-lg">
              <p className="text-sm text-radianza-deep-blue/70">
                <strong>Variabili disponibili:</strong> {'{nome}'}, {'{titolo_incontro}'}, {'{descrizione_incontro}'}, {'{data_incontro}'}, {'{ora_incontro}'}
              </p>
            </div>
            <textarea
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
              rows={8}
              placeholder="Il template selezionato apparirà qui. Puoi modificarlo liberamente..."
              className="w-full px-4 py-3 border border-radianza-gold/30 rounded-lg focus:ring-2 focus:ring-radianza-gold outline-none font-mono text-sm"
            />
          </div>

          {/* Anteprima e Copia */}
          <div className="lg:col-span-2 bg-gradient-to-br from-radianza-celestial/50 to-white/80 backdrop-blur-lg rounded-xl shadow-lg p-6 border border-radianza-gold/30">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-radianza-deep-blue flex items-center">
                <MessageSquare className="w-6 h-6 mr-2 text-radianza-gold" />
                Anteprima Messaggio WhatsApp
              </h2>
              <button
                onClick={handleCopy}
                disabled={!selectedMeeting}
                className={`flex items-center space-x-2 px-6 py-3 rounded-lg transition-all ${
                  selectedMeeting
                    ? 'bg-green-600 hover:bg-green-700 text-white hover:shadow-lg'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {copied ? (
                  <>
                    <Check className="w-5 h-5" />
                    <span>Copiato!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-5 h-5" />
                    <span>Copia Messaggio</span>
                  </>
                )}
              </button>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-inner border border-radianza-gold/20">
              {selectedMeeting ? (
                <pre className="whitespace-pre-wrap font-sans text-radianza-deep-blue">
                  {generateMessage()}
                </pre>
              ) : (
                <p className="text-radianza-deep-blue/50 text-center py-8">
                  Seleziona un incontro per generare il messaggio
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
