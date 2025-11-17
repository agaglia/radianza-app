'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Settings, Save, Mail, Palette, Info, LogOut, CheckCircle, AlertCircle } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export default function SettingsClient() {
  const router = useRouter()
  const supabase = createClient()
  
  const [settings, setSettings] = useState({
    groupName: 'Radianza',
    emailFrom: 'noreply@radianza.org',
    resendApiKey: '',
    primaryColor: '#D4AF37',
    secondaryColor: '#1a237e',
    logoUrl: ''
  })

  const [saved, setSaved] = useState(false)
  const [testEmail, setTestEmail] = useState('')
  const [testLoading, setTestLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const handleSave = async () => {
    setMessage(null)
    try {
      // Salva le credenziali Resend in Supabase
      const response = await fetch('/api/admin/settings/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resendApiKey: settings.resendApiKey,
          emailFrom: settings.emailFrom
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Errore nel salvataggio')
      }

      // Salva anche in localStorage per la UI
      localStorage.setItem('radianza_settings', JSON.stringify(settings))
      setSaved(true)
      setMessage({
        type: 'success',
        text: '✅ Impostazioni email salvate con successo!'
      })
      setTimeout(() => setSaved(false), 2000)
    } catch (error: any) {
      setMessage({
        type: 'error',
        text: `❌ Errore: ${error.message}`
      })
    }
  }

  const handleTestEmail = async () => {
    if (!testEmail) {
      setMessage({ type: 'error', text: '❌ Inserisci un indirizzo email di test' })
      return
    }

    setTestLoading(true)
    setMessage(null)

    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipients: [testEmail],
          subject: '🎉 Test Email Radianza',
          message: 'Questa è un\'email di test. La configurazione di Gmail funziona correttamente!',
          html: '<h2>Test Email Radianza</h2><p>Questa è un\'email di test. La configurazione di Gmail funziona correttamente! ✅</p>'
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Errore nell\'invio del test')
      }

      setMessage({
        type: 'success',
        text: `✅ Email di test inviata a ${testEmail}!`
      })
      setTestEmail('')
    } catch (error: any) {
      setMessage({
        type: 'error',
        text: `❌ Errore: ${error.message}`
      })
    } finally {
      setTestLoading(false)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-radianza-deep-blue">Impostazioni Generali</h1>
            <p className="text-radianza-deep-blue/60 mt-2">Configura le impostazioni dell'applicazione</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 px-4 py-2 bg-red-50 text-red-600 border border-red-200 rounded-lg hover:bg-red-100 transition-colors font-medium"
          >
            <LogOut className="w-5 h-5" />
            <span>Esci</span>
          </button>
        </div>

        <div className="space-y-6">
          {/* Messaggi */}
          {message && (
            <div
              className={`flex items-center space-x-3 p-4 rounded-lg border ${
                message.type === 'success'
                  ? 'bg-green-50 border-green-200 text-green-800'
                  : 'bg-red-50 border-red-200 text-red-800'
              }`}
            >
              {message.type === 'success' ? (
                <CheckCircle className="w-5 h-5" />
              ) : (
                <AlertCircle className="w-5 h-5" />
              )}
              <span>{message.text}</span>
            </div>
          )}

          {/* Informazioni Gruppo */}
          <div className="bg-white/80 backdrop-blur-lg rounded-xl shadow-lg p-6 border border-radianza-gold/30">
            <div className="flex items-center space-x-2 mb-4">
              <Info className="w-5 h-5 text-radianza-gold" />
              <h2 className="text-xl font-bold text-radianza-deep-blue">Informazioni Gruppo</h2>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-radianza-deep-blue mb-2">Nome Gruppo</label>
                <input
                  type="text"
                  value={settings.groupName}
                  onChange={(e) => setSettings({ ...settings, groupName: e.target.value })}
                  className="w-full px-4 py-2 border border-radianza-gold/30 rounded-lg focus:ring-2 focus:ring-radianza-gold outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-radianza-deep-blue mb-2">URL Logo</label>
                <input
                  type="url"
                  value={settings.logoUrl}
                  onChange={(e) => setSettings({ ...settings, logoUrl: e.target.value })}
                  placeholder="https://example.com/logo.png"
                  className="w-full px-4 py-2 border border-radianza-gold/30 rounded-lg focus:ring-2 focus:ring-radianza-gold outline-none"
                />
                <p className="text-xs text-radianza-deep-blue/60 mt-1">
                  Inserisci l'URL di un'immagine da usare come logo (lascia vuoto per usare il testo)
                </p>
              </div>
            </div>
          </div>

          {/* Configurazione Email Resend */}
          <div className="bg-white/80 backdrop-blur-lg rounded-xl shadow-lg p-6 border border-radianza-gold/30">
            <div className="flex items-center space-x-2 mb-4">
              <Mail className="w-5 h-5 text-radianza-gold" />
              <h2 className="text-xl font-bold text-radianza-deep-blue">Configurazione Email (Resend)</h2>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-radianza-deep-blue mb-2">Resend API Key</label>
                <input
                  type="password"
                  value={settings.resendApiKey}
                  onChange={(e) => setSettings({ ...settings, resendApiKey: e.target.value })}
                  placeholder="re_xxxxxxxxxxxxxxxxxx"
                  className="w-full px-4 py-2 border border-radianza-gold/30 rounded-lg focus:ring-2 focus:ring-radianza-gold outline-none"
                />
                <p className="text-xs text-radianza-deep-blue/60 mt-1">
                  La tua API key da{' '}
                  <a
                    href="https://resend.com/api-keys"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-radianza-gold hover:underline font-medium"
                  >
                    Resend Dashboard → API Keys
                  </a>
                  . Inizia con <code className="bg-white/50 px-1 rounded">re_</code>
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-radianza-deep-blue mb-2">Indirizzo Mittente</label>
                <input
                  type="email"
                  value={settings.emailFrom}
                  onChange={(e) => setSettings({ ...settings, emailFrom: e.target.value })}
                  placeholder="noreply@radianza.org"
                  className="w-full px-4 py-2 border border-radianza-gold/30 rounded-lg focus:ring-2 focus:ring-radianza-gold outline-none"
                />
                <p className="text-xs text-radianza-deep-blue/60 mt-1">
                  Nome visualizzato nelle email (es. Radianza &lt;noreply@radianza.org&gt;)
                </p>
              </div>

              {/* Test Email */}
              <div className="bg-radianza-celestial/30 rounded-lg p-4 border border-radianza-gold/20">
                <p className="text-sm font-medium text-radianza-deep-blue mb-3">Invia Email di Test</p>
                <div className="flex space-x-2">
                  <input
                    type="email"
                    value={testEmail}
                    onChange={(e) => setTestEmail(e.target.value)}
                    placeholder="test@example.com"
                    className="flex-1 px-4 py-2 border border-radianza-gold/30 rounded-lg focus:ring-2 focus:ring-radianza-gold outline-none"
                  />
                  <button
                    onClick={handleTestEmail}
                    disabled={testLoading || !settings.resendApiKey}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 transition-colors font-medium"
                  >
                    {testLoading ? 'Invio...' : 'Test'}
                  </button>
                </div>
                <p className="text-xs text-radianza-deep-blue/60 mt-2">
                  Invia un'email di test per verificare che la configurazione funzioni correttamente
                </p>
              </div>
            </div>
          </div>

          {/* Personalizzazione Colori */}
          <div className="bg-white/80 backdrop-blur-lg rounded-xl shadow-lg p-6 border border-radianza-gold/30">
            <div className="flex items-center space-x-2 mb-4">
              <Palette className="w-5 h-5 text-radianza-gold" />
              <h2 className="text-xl font-bold text-radianza-deep-blue">Personalizzazione Colori</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-radianza-deep-blue mb-2">Colore Primario (Gold)</label>
                <div className="flex space-x-2">
                  <input
                    type="color"
                    value={settings.primaryColor}
                    onChange={(e) => setSettings({ ...settings, primaryColor: e.target.value })}
                    className="w-16 h-10 border border-radianza-gold/30 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={settings.primaryColor}
                    onChange={(e) => setSettings({ ...settings, primaryColor: e.target.value })}
                    className="flex-1 px-4 py-2 border border-radianza-gold/30 rounded-lg focus:ring-2 focus:ring-radianza-gold outline-none font-mono"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-radianza-deep-blue mb-2">Colore Secondario (Deep Blue)</label>
                <div className="flex space-x-2">
                  <input
                    type="color"
                    value={settings.secondaryColor}
                    onChange={(e) => setSettings({ ...settings, secondaryColor: e.target.value })}
                    className="w-16 h-10 border border-radianza-gold/30 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={settings.secondaryColor}
                    onChange={(e) => setSettings({ ...settings, secondaryColor: e.target.value })}
                    className="flex-1 px-4 py-2 border border-radianza-gold/30 rounded-lg focus:ring-2 focus:ring-radianza-gold outline-none font-mono"
                  />
                </div>
              </div>
            </div>
            <div className="mt-4 p-4 bg-gradient-to-r from-radianza-gold to-radianza-deep-blue rounded-lg">
              <p className="text-white text-center font-medium">Anteprima Gradiente</p>
            </div>
          </div>

          {/* Pulsante Salva */}
          <div className="flex justify-end space-x-3">
            <button
              onClick={handleSave}
              disabled={!settings.resendApiKey}
              className="flex items-center space-x-2 px-8 py-3 bg-gradient-to-r from-radianza-gold to-radianza-deep-blue text-white rounded-lg hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <Save className="w-5 h-5" />
              <span>{saved ? 'Salvato!' : 'Salva Impostazioni Email'}</span>
            </button>
          </div>

          {/* Note */}
          <div className="bg-radianza-celestial/30 border border-radianza-gold/20 rounded-lg p-4">
            <p className="text-sm text-radianza-deep-blue">
              <strong>Nota:</strong> Alcune modifiche potrebbero richiedere il riavvio dell'applicazione per essere applicate completamente.
              Per modifiche ai colori del tema, sarà necessario aggiornare anche il file <code className="px-2 py-1 bg-white/50 rounded">tailwind.config.ts</code>.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
