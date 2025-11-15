'use client'

import { useState } from 'react'
import { Settings, Save, Mail, Palette, Info } from 'lucide-react'

export default function SettingsClient() {
  const [settings, setSettings] = useState({
    groupName: 'Radianza',
    emailFrom: 'noreply@radianza.org',
    emailProvider: 'resend',
    emailApiKey: '',
    primaryColor: '#D4AF37',
    secondaryColor: '#1a237e',
    logoUrl: ''
  })

  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    // TODO: Salvare le impostazioni in Supabase o in variabili d'ambiente
    localStorage.setItem('radianza_settings', JSON.stringify(settings))
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
    alert('✅ Impostazioni salvate!')
  }

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-radianza-deep-blue">Impostazioni Generali</h1>
          <p className="text-radianza-deep-blue/60 mt-2">Configura le impostazioni dell'applicazione</p>
        </div>

        <div className="space-y-6">
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

          {/* Configurazione Email */}
          <div className="bg-white/80 backdrop-blur-lg rounded-xl shadow-lg p-6 border border-radianza-gold/30">
            <div className="flex items-center space-x-2 mb-4">
              <Mail className="w-5 h-5 text-radianza-gold" />
              <h2 className="text-xl font-bold text-radianza-deep-blue">Configurazione Email</h2>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-radianza-deep-blue mb-2">Provider Email</label>
                <select
                  value={settings.emailProvider}
                  onChange={(e) => setSettings({ ...settings, emailProvider: e.target.value })}
                  className="w-full px-4 py-2 border border-radianza-gold/30 rounded-lg focus:ring-2 focus:ring-radianza-gold outline-none"
                >
                  <option value="resend">Resend</option>
                  <option value="sendgrid">SendGrid</option>
                  <option value="smtp">SMTP Generico</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-radianza-deep-blue mb-2">Email Mittente</label>
                <input
                  type="email"
                  value={settings.emailFrom}
                  onChange={(e) => setSettings({ ...settings, emailFrom: e.target.value })}
                  className="w-full px-4 py-2 border border-radianza-gold/30 rounded-lg focus:ring-2 focus:ring-radianza-gold outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-radianza-deep-blue mb-2">API Key</label>
                <input
                  type="password"
                  value={settings.emailApiKey}
                  onChange={(e) => setSettings({ ...settings, emailApiKey: e.target.value })}
                  placeholder="Inserisci la tua API key"
                  className="w-full px-4 py-2 border border-radianza-gold/30 rounded-lg focus:ring-2 focus:ring-radianza-gold outline-none"
                />
                <p className="text-xs text-radianza-deep-blue/60 mt-1">
                  Ottieni l'API key dal tuo provider email (Resend, SendGrid, ecc.)
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
          <div className="flex justify-end">
            <button
              onClick={handleSave}
              className="flex items-center space-x-2 px-8 py-3 bg-gradient-to-r from-radianza-gold to-radianza-deep-blue text-white rounded-lg hover:shadow-lg transition-all"
            >
              <Save className="w-5 h-5" />
              <span>{saved ? 'Salvato!' : 'Salva Impostazioni'}</span>
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
