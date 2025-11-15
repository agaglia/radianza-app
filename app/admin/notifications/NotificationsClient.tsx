'use client'

import { useState } from 'react'
import { Send, Mail, AlertCircle, CheckCircle } from 'lucide-react'

interface User {
  id: string
  full_name: string | null
  email: string
}

interface NotificationHistory {
  id: string
  timestamp: Date
  recipients: string[]
  subject: string
  status: 'sent' | 'failed'
}

export default function NotificationsClient({ users }: { users: User[] }) {
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [sending, setSending] = useState(false)
  const [history, setHistory] = useState<NotificationHistory[]>([])

  const toggleUser = (userId: string) => {
    setSelectedUsers(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    )
  }

  const selectAll = () => {
    setSelectedUsers(users.map(u => u.id))
  }

  const deselectAll = () => {
    setSelectedUsers([])
  }

  const handleSend = async () => {
    if (selectedUsers.length === 0 || !subject || !message) {
      alert('⚠️ Compila tutti i campi e seleziona almeno un destinatario')
      return
    }

    setSending(true)

    try {
      const recipients = selectedUsers.map(id => 
        users.find(u => u.id === id)?.email || ''
      ).filter(Boolean)

      // Chiamata API per invio email
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ recipients, subject, message })
      })

      const result = await response.json()

      if (!result.success) {
        throw new Error(result.error || 'Errore durante l\'invio')
      }

      const newEntry: NotificationHistory = {
        id: Date.now().toString(),
        timestamp: new Date(),
        recipients,
        subject,
        status: 'sent'
      }

      setHistory([newEntry, ...history])
      
      alert(`✅ Email inviata con successo a ${recipients.length} destinatari!`)
      setSubject('')
      setMessage('')
      setSelectedUsers([])
    } catch (error: any) {
      alert('❌ Errore durante l\'invio: ' + error.message)
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-radianza-deep-blue">Notifiche Email</h1>
          <p className="text-radianza-deep-blue/60 mt-2">Invia email di gruppo ai membri</p>
        </div>

        {/* Alert Configurazione */}
        <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex items-start space-x-3">
          <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
          <div>
            <p className="text-sm text-yellow-800">
              <strong>Configurazione richiesta:</strong> Per abilitare l'invio di email, configura un servizio di email (Resend, SendGrid, ecc.) 
              nelle variabili d'ambiente. Vedi documentazione per dettagli.
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Destinatari */}
          <div className="lg:col-span-1 bg-white/80 backdrop-blur-lg rounded-xl shadow-lg p-6 border border-radianza-gold/30">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-radianza-deep-blue">
                Destinatari ({selectedUsers.length}/{users.length})
              </h2>
              <div className="flex space-x-2">
                <button
                  onClick={selectAll}
                  className="text-xs px-2 py-1 text-radianza-sky-blue hover:bg-radianza-sky-blue/10 rounded transition-colors"
                >
                  Tutti
                </button>
                <button
                  onClick={deselectAll}
                  className="text-xs px-2 py-1 text-radianza-deep-blue/60 hover:bg-radianza-deep-blue/10 rounded transition-colors"
                >
                  Nessuno
                </button>
              </div>
            </div>
            <div className="space-y-2 max-h-96 overflow-y-auto">
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
                  <div className="text-sm text-radianza-deep-blue font-medium">
                    {user.full_name || 'Utente'}
                  </div>
                  <div className="text-xs text-radianza-deep-blue/60">{user.email}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Composizione Email */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white/80 backdrop-blur-lg rounded-xl shadow-lg p-6 border border-radianza-gold/30">
              <h2 className="text-lg font-bold text-radianza-deep-blue mb-4">Componi Email</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-radianza-deep-blue mb-2">Oggetto *</label>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Oggetto dell'email..."
                    className="w-full px-4 py-2 border border-radianza-gold/30 rounded-lg focus:ring-2 focus:ring-radianza-gold outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-radianza-deep-blue mb-2">Messaggio *</label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={10}
                    placeholder="Scrivi il messaggio qui..."
                    className="w-full px-4 py-2 border border-radianza-gold/30 rounded-lg focus:ring-2 focus:ring-radianza-gold outline-none"
                  />
                </div>
                <button
                  onClick={handleSend}
                  disabled={sending || selectedUsers.length === 0 || !subject || !message}
                  className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-radianza-gold to-radianza-deep-blue text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-5 h-5" />
                  <span>{sending ? 'Invio in corso...' : `Invia a ${selectedUsers.length} destinatari`}</span>
                </button>
              </div>
            </div>

            {/* Cronologia */}
            <div className="bg-white/80 backdrop-blur-lg rounded-xl shadow-lg p-6 border border-radianza-gold/30">
              <h2 className="text-lg font-bold text-radianza-deep-blue mb-4">Cronologia Invii</h2>
              {history.length === 0 ? (
                <p className="text-center text-radianza-deep-blue/60 py-8">Nessuna email inviata</p>
              ) : (
                <div className="space-y-3">
                  {history.map((entry) => (
                    <div
                      key={entry.id}
                      className="p-4 bg-radianza-celestial/20 rounded-lg border border-radianza-gold/20"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          {entry.status === 'sent' ? (
                            <CheckCircle className="w-5 h-5 text-green-600" />
                          ) : (
                            <AlertCircle className="w-5 h-5 text-red-600" />
                          )}
                          <span className="font-semibold text-radianza-deep-blue">{entry.subject}</span>
                        </div>
                        <span className="text-xs text-radianza-deep-blue/60">
                          {entry.timestamp.toLocaleDateString('it-IT')} {entry.timestamp.toLocaleTimeString('it-IT')}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-radianza-deep-blue/70">
                        <Mail className="w-4 h-4" />
                        <span>{entry.recipients.length} destinatari</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
