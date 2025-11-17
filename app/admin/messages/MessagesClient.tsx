'use client'

import { useState, useEffect } from 'react'
import { MessageSquare, Copy, Check, FileText, Mail, Send } from 'lucide-react'

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
  htmlBody?: string
}

export default function MessagesClient({ meetings, users }: { meetings: Meeting[], users: User[] }) {
  const [activeTab, setActiveTab] = useState<'whatsapp' | 'email'>('whatsapp')
  
  // WhatsApp State
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null)
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])
  const [customMessage, setCustomMessage] = useState('')
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null)
  const [copied, setCopied] = useState(false)
  const [templates, setTemplates] = useState<Template[]>([])

  // Email State
  const [emailTemplates, setEmailTemplates] = useState<Template[]>([])
  const [selectedEmailTemplate, setSelectedEmailTemplate] = useState<Template | null>(null)
  const [emailSubject, setEmailSubject] = useState('')
  const [emailBody, setEmailBody] = useState('')
  const [selectedEmailUsers, setSelectedEmailUsers] = useState<string[]>([])
  const [selectedEmailMeeting, setSelectedEmailMeeting] = useState<Meeting | null>(null)
  const [emailSending, setEmailSending] = useState(false)
  const [emailMessage, setEmailMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [emailHtml, setEmailHtml] = useState('') // Store HTML version of email

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
      name: 'Incontro con Link Meet',
      type: 'email',
      subject: '📹 Incontro Radianza - Link di accesso',
      body: `Caro partecipante,

Ti comunichiamo che l'incontro di Radianza è programmato come segue:

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📅 DATA E ORA
{data_incontro} ore {ora_incontro}

📚 ARGOMENTO
{titolo_incontro}

{descrizione_incontro}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ NON è necessaria alcuna registrazione preventiva.
Puoi accedere direttamente all'incontro.

A presto!

Radianza`,
      htmlBody: `<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <style>
      body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
      .container { max-width: 600px; margin: 0 auto; padding: 20px; }
      .header { text-align: center; color: #5a4a7d; margin-bottom: 30px; }
      .section { background-color: #f8f6fc; border-left: 4px solid #d4a574; padding: 20px; margin: 20px 0; border-radius: 4px; }
      .section-title { font-size: 14px; font-weight: bold; color: #5a4a7d; margin-bottom: 10px; text-transform: uppercase; letter-spacing: 1px; }
      .section-content { font-size: 16px; color: #333; }
      .divider { height: 2px; background: linear-gradient(to right, #d4a574, transparent); margin: 30px 0; }
      .footer { color: #999; font-size: 12px; text-align: center; margin-top: 30px; border-top: 1px solid #eee; padding-top: 20px; }
      .emoji { margin-right: 8px; }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>📹 Incontro Radianza</h1>
      </div>

      <p>Caro partecipante,</p>
      <p>Ti comunichiamo che l'incontro di Radianza è programmato come segue:</p>

      <div class="section">
        <div class="section-title"><span class="emoji">📅</span>DATA E ORA</div>
        <div class="section-content">{data_incontro} ore {ora_incontro}</div>
      </div>

      <div class="section">
        <div class="section-title"><span class="emoji">📚</span>ARGOMENTO</div>
        <div class="section-content">{titolo_incontro}</div>
      </div>

      <div class="section">
        <div class="section-title"><span class="emoji">📝</span>DESCRIZIONE</div>
        <div class="section-content">{descrizione_incontro}</div>
      </div>

      <div class="divider"></div>

      <div class="section">
        <div style="margin: 0;">
          <strong>✅ NON è necessaria alcuna registrazione preventiva.</strong><br>
          Puoi accedere direttamente all'incontro.
        </div>
      </div>

      <p style="font-size: 16px; font-weight: bold; color: #5a4a7d; text-align: center; margin-top: 30px;">
        A presto sull'incontro!<br>
        <span style="font-size: 18px;">✨ Radianza ✨</span>
      </p>

      <div class="footer">
        <p>Questo è un messaggio automatico da Radianza.</p>
      </div>
    </div>
  </body>
</html>`
    }
  ]

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('radianza-templates')
      if (saved) {
        const allTemplates = JSON.parse(saved)
        setTemplates(allTemplates.filter((t: Template) => t.type === 'whatsapp'))
        setEmailTemplates(allTemplates.filter((t: Template) => t.type === 'email'))
      } else {
        setTemplates(defaultTemplates.filter((t: Template) => t.type === 'whatsapp'))
        setEmailTemplates(defaultTemplates.filter((t: Template) => t.type === 'email'))
      }
    }
  }, [])

  useEffect(() => {
    if (selectedTemplate) {
      setCustomMessage(selectedTemplate.body)
    }
  }, [selectedTemplate])

  useEffect(() => {
    const handleFocus = () => {
      if (typeof window !== 'undefined') {
        const saved = localStorage.getItem('radianza-templates')
        if (saved) {
          const allTemplates = JSON.parse(saved)
          setTemplates(allTemplates.filter((t: Template) => t.type === 'whatsapp'))
          setEmailTemplates(allTemplates.filter((t: Template) => t.type === 'email'))
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

    if (customMessage) {
      return customMessage
        .replace(/{nome}/g, names || 'Amico')
        .replace(/{titolo_incontro}/g, selectedMeeting.title)
        .replace(/{descrizione_incontro}/g, selectedMeeting.description || '')
        .replace(/{data_incontro}/g, date)
        .replace(/{ora_incontro}/g, time)
    }

    return `Caro/a ${names},

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

  const toggleEmailUser = (userId: string) => {
    setSelectedEmailUsers(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    )
  }

  const handleSelectEmailTemplate = (template: Template) => {
    setSelectedEmailTemplate(template)
    setEmailSubject(template.subject || '')
    setEmailBody(template.body)
    setEmailHtml(template.htmlBody || template.body) // Use HTML if available
  }

  const handleSendEmail = async () => {
    if (!selectedEmailMeeting || selectedEmailUsers.length === 0 || !emailSubject.trim() || !emailBody.trim()) {
      setEmailMessage({ type: 'error', text: '❌ Completa tutti i campi obbligatori' })
      return
    }

    setEmailSending(true)
    setEmailMessage(null)

    try {
      const recipients = selectedEmailUsers.map(userId => {
        const user = users.find(u => u.id === userId)
        return user?.email || ''
      }).filter(e => e)

      if (recipients.length === 0) throw new Error('Nessun indirizzo email valido')

      const date = new Date(selectedEmailMeeting.date).toLocaleDateString('it-IT', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      })

      const time = new Date(selectedEmailMeeting.date).toLocaleTimeString('it-IT', {
        hour: '2-digit',
        minute: '2-digit'
      })

      const eventDateTime = `${date} ore ${time}`

      let subject = emailSubject
        .replace(/{titolo_incontro}/g, selectedEmailMeeting.title)
        .replace(/{data_incontro}/g, date)
        .replace(/{ora_incontro}/g, time)
        .replace(/{eventDateTime}/g, eventDateTime)
        .replace(/{topic}/g, selectedEmailMeeting.title)

      let body = emailBody
        .replace(/{titolo_incontro}/g, selectedEmailMeeting.title)
        .replace(/{descrizione_incontro}/g, selectedEmailMeeting.description || '')
        .replace(/{data_incontro}/g, date)
        .replace(/{ora_incontro}/g, time)
        .replace(/{eventDateTime}/g, eventDateTime)
        .replace(/{topic}/g, selectedEmailMeeting.title)

      // Also replace variables in HTML if available
      let html = emailHtml
        .replace(/{titolo_incontro}/g, selectedEmailMeeting.title)
        .replace(/{descrizione_incontro}/g, selectedEmailMeeting.description || '')
        .replace(/{data_incontro}/g, date)
        .replace(/{ora_incontro}/g, time)
        .replace(/{eventDateTime}/g, eventDateTime)
        .replace(/{topic}/g, selectedEmailMeeting.title)

      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipients,
          subject,
          message: body,
          html: html // Send HTML version if available
        })
      })

      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Errore nell\'invio')

      setEmailMessage({
        type: 'success',
        text: `✅ Email inviata a ${recipients.length} destinatari!`
      })
      setTimeout(() => {
        setEmailSubject('')
        setEmailBody('')
        setEmailHtml('')
        setSelectedEmailUsers([])
        setSelectedEmailMeeting(null)
        setSelectedEmailTemplate(null)
        setEmailMessage(null)
      }, 2000)
    } catch (error: any) {
      setEmailMessage({
        type: 'error',
        text: `❌ Errore: ${error.message}`
      })
    } finally {
      setEmailSending(false)
    }
  }

  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-radianza-deep-blue">Generatore Messaggi</h1>
          <p className="text-radianza-deep-blue/60 mt-2">Crea e invia messaggi via WhatsApp o Email</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-radianza-gold/30">
          <button
            onClick={() => setActiveTab('whatsapp')}
            className={`px-6 py-3 font-medium transition-colors flex items-center gap-2 ${
              activeTab === 'whatsapp'
                ? 'text-radianza-gold border-b-2 border-radianza-gold'
                : 'text-radianza-deep-blue/60 hover:text-radianza-deep-blue'
            }`}
          >
            <MessageSquare className="w-5 h-5" />
            <span>WhatsApp (Copia)</span>
          </button>
          <button
            onClick={() => setActiveTab('email')}
            className={`px-6 py-3 font-medium transition-colors flex items-center gap-2 ${
              activeTab === 'email'
                ? 'text-radianza-gold border-b-2 border-radianza-gold'
                : 'text-radianza-deep-blue/60 hover:text-radianza-deep-blue'
            }`}
          >
            <Mail className="w-5 h-5" />
            <span>Email (Invio Diretto)</span>
          </button>
        </div>

        {/* WhatsApp Tab */}
        {activeTab === 'whatsapp' && (
          <div className="grid lg:grid-cols-2 gap-6">
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

            <div className="bg-white/80 backdrop-blur-lg rounded-xl shadow-lg p-6 border border-radianza-gold/30">
              <h2 className="text-xl font-bold text-radianza-deep-blue mb-4">3. Seleziona Destinatari</h2>
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

            <div className="lg:col-span-2 bg-white/80 backdrop-blur-lg rounded-xl shadow-lg p-6 border border-radianza-gold/30">
              <h2 className="text-xl font-bold text-radianza-deep-blue mb-4">4. Personalizza Messaggio</h2>
              <div className="mb-3 p-3 bg-radianza-celestial/20 rounded-lg">
                <p className="text-sm text-radianza-deep-blue/70">
                  <strong>Variabili:</strong> {`{nome}, {titolo_incontro}, {descrizione_incontro}, {data_incontro}, {ora_incontro}`}
                </p>
              </div>
              <textarea
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
                rows={8}
                placeholder="Il template selezionato apparirà qui..."
                className="w-full px-4 py-3 border border-radianza-gold/30 rounded-lg focus:ring-2 focus:ring-radianza-gold outline-none font-mono text-sm"
              />
            </div>

            <div className="lg:col-span-2 bg-gradient-to-br from-radianza-celestial/50 to-white/80 backdrop-blur-lg rounded-xl shadow-lg p-6 border border-radianza-gold/30">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-radianza-deep-blue flex items-center">
                  <MessageSquare className="w-6 h-6 mr-2 text-radianza-gold" />
                  Anteprima WhatsApp
                </h2>
                <button
                  onClick={handleCopy}
                  disabled={!selectedMeeting}
                  className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-all ${
                    selectedMeeting
                      ? 'bg-green-600 hover:bg-green-700 text-white'
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
                      <span>Copia</span>
                    </>
                  )}
                </button>
              </div>
              <div className="bg-white rounded-lg p-6 shadow-inner border border-radianza-gold/20">
                {selectedMeeting ? (
                  <pre className="whitespace-pre-wrap font-sans text-radianza-deep-blue text-sm">
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
        )}

        {/* Email Tab */}
        {activeTab === 'email' && (
          <div className="grid lg:grid-cols-2 gap-6">
            <div className="bg-white/80 backdrop-blur-lg rounded-xl shadow-lg p-6 border border-radianza-gold/30">
              <h2 className="text-xl font-bold text-radianza-deep-blue mb-4 flex items-center">
                <FileText className="w-5 h-5 mr-2 text-radianza-gold" />
                1. Seleziona Template Email
              </h2>
              <div className="space-y-2 max-h-80 overflow-y-auto">
                {emailTemplates.length > 0 ? (
                  emailTemplates.map((template) => (
                    <button
                      key={template.id}
                      onClick={() => handleSelectEmailTemplate(template)}
                      className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                        selectedEmailTemplate?.id === template.id
                          ? 'border-radianza-gold bg-radianza-gold/10'
                          : 'border-radianza-gold/20 hover:border-radianza-gold/50'
                      }`}
                    >
                      <div className="font-semibold text-radianza-deep-blue">{template.name}</div>
                      <div className="text-xs text-radianza-deep-blue/60 mt-1">
                        {template.subject || 'Email personalizzata'}
                      </div>
                    </button>
                  ))
                ) : (
                  <p className="text-radianza-deep-blue/60 text-center py-8">Nessun template email</p>
                )}
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-lg rounded-xl shadow-lg p-6 border border-radianza-gold/30">
              <h2 className="text-xl font-bold text-radianza-deep-blue mb-4">2. Seleziona Incontro</h2>
              <div className="space-y-2 max-h-80 overflow-y-auto">
                {meetings.map((meeting) => (
                  <button
                    key={meeting.id}
                    onClick={() => setSelectedEmailMeeting(meeting)}
                    className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                      selectedEmailMeeting?.id === meeting.id
                        ? 'border-radianza-gold bg-radianza-gold/10'
                        : 'border-radianza-gold/20 hover:border-radianza-gold/50'
                    }`}
                  >
                    <div className="font-semibold text-radianza-deep-blue">{meeting.title}</div>
                    <div className="text-sm text-radianza-deep-blue/60">
                      {new Date(meeting.date).toLocaleDateString('it-IT', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-lg rounded-xl shadow-lg p-6 border border-radianza-gold/30">
              <h2 className="text-xl font-bold text-radianza-deep-blue mb-4">3. Seleziona Destinatari</h2>
              <div className="space-y-2 max-h-80 overflow-y-auto">
                {users.map((user) => (
                  <button
                    key={user.id}
                    onClick={() => toggleEmailUser(user.id)}
                    className={`w-full text-left p-3 rounded-lg border transition-all ${
                      selectedEmailUsers.includes(user.id)
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

            <div className="bg-white/80 backdrop-blur-lg rounded-xl shadow-lg p-6 border border-radianza-gold/30">
              <h2 className="text-xl font-bold text-radianza-deep-blue mb-4">4. Oggetto Email</h2>
              <div className="mb-3 p-3 bg-radianza-celestial/20 rounded-lg">
                <p className="text-sm text-radianza-deep-blue/70">
                  <strong>Variabili:</strong> {`{titolo_incontro}, {data_incontro}, {ora_incontro}`}
                </p>
              </div>
              <input
                type="text"
                value={emailSubject}
                onChange={(e) => setEmailSubject(e.target.value)}
                placeholder="Oggetto dell'email..."
                className="w-full px-4 py-3 border border-radianza-gold/30 rounded-lg focus:ring-2 focus:ring-radianza-gold outline-none"
              />
            </div>

            <div className="lg:col-span-2 bg-white/80 backdrop-blur-lg rounded-xl shadow-lg p-6 border border-radianza-gold/30">
              <h2 className="text-xl font-bold text-radianza-deep-blue mb-4">5. Corpo Email</h2>
              <div className="mb-3 p-3 bg-radianza-celestial/20 rounded-lg">
                <p className="text-sm text-radianza-deep-blue/70">
                  <strong>Variabili:</strong> {`{titolo_incontro}, {descrizione_incontro}, {data_incontro}, {ora_incontro}`}
                </p>
              </div>
              <textarea
                value={emailBody}
                onChange={(e) => setEmailBody(e.target.value)}
                rows={10}
                placeholder="Corpo dell'email..."
                className="w-full px-4 py-3 border border-radianza-gold/30 rounded-lg focus:ring-2 focus:ring-radianza-gold outline-none font-mono text-sm"
              />
            </div>

            <div className="lg:col-span-2">
              {emailMessage && (
                <div
                  className={`flex items-center gap-3 p-4 rounded-lg border mb-6 ${
                    emailMessage.type === 'success'
                      ? 'bg-green-50 border-green-200 text-green-800'
                      : 'bg-red-50 border-red-200 text-red-800'
                  }`}
                >
                  <span>{emailMessage.text}</span>
                </div>
              )}
              <button
                onClick={handleSendEmail}
                disabled={emailSending || !selectedEmailMeeting || selectedEmailUsers.length === 0}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-radianza-gold to-radianza-deep-blue text-white rounded-lg hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium"
              >
                <Send className="w-5 h-5" />
                <span>{emailSending ? 'Invio...' : `Invia Email (${selectedEmailUsers.length})`}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
