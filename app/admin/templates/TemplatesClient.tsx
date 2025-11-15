'use client'

import { useState, useEffect } from 'react'
import { Plus, Trash2, Edit2, Mail, MessageSquare, Save, X } from 'lucide-react'

interface Template {
  id: string
  name: string
  type: 'email' | 'whatsapp'
  subject?: string
  body: string
}

const initialTemplates: Template[] = [
  {
    id: '1',
    name: 'Promemoria Incontro',
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
    name: 'Benvenuto Nuovo Membro',
    type: 'email',
    subject: 'Benvenuto/a nella famiglia Radianza! ✨',
    body: `Caro/a {nome},

Siamo felici di darti il benvenuto nella famiglia Radianza!

Il nostro gruppo spirituale si dedica alla meditazione, alla crescita interiore e alla condivisione di esperienze di luce.

Troverai nel portale:
- Il calendario degli incontri
- I contenuti multimediali (video, poesie, lettere)
- Il tuo profilo personale

Se hai domande, non esitare a contattarci.

Con amore e luce,
Il team Radianza`
  },
  {
    id: '3',
    name: 'Assenza Incontro',
    type: 'email',
    subject: 'Hai mancato il nostro incontro',
    body: `Caro/a {nome},

Abbiamo notato che non hai potuto partecipare all'incontro di {data_incontro}.

Se desideri, puoi trovare i materiali e le registrazioni nella sezione contenuti del portale.

Speriamo di rivederti presto!

In luce,
Radianza`
  }
]

export default function TemplatesClient() {
  const [templates, setTemplates] = useState<Template[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('radianza-templates')
      return saved ? JSON.parse(saved) : initialTemplates
    }
    return initialTemplates
  })
  const [showModal, setShowModal] = useState(false)
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    type: 'whatsapp' as 'email' | 'whatsapp',
    subject: '',
    body: ''
  })

  // Salva i template in localStorage quando cambiano
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('radianza-templates', JSON.stringify(templates))
    }
  }, [templates])

  const handleCreate = () => {
    const newTemplate: Template = {
      id: Date.now().toString(),
      name: formData.name,
      type: formData.type,
      subject: formData.type === 'email' ? formData.subject : undefined,
      body: formData.body
    }
    setTemplates([...templates, newTemplate])
    resetForm()
    alert('✅ Template creato!')
  }

  const handleUpdate = () => {
    if (!editingTemplate) return
    
    setTemplates(templates.map(t => 
      t.id === editingTemplate.id 
        ? { ...t, name: formData.name, type: formData.type, subject: formData.subject, body: formData.body }
        : t
    ))
    resetForm()
    alert('✅ Template aggiornato!')
  }

  const handleDelete = (id: string) => {
    if (!confirm('Sei sicuro di voler eliminare questo template?')) return
    setTemplates(templates.filter(t => t.id !== id))
    alert('✅ Template eliminato')
  }

  const startEdit = (template: Template) => {
    setEditingTemplate(template)
    setFormData({
      name: template.name,
      type: template.type,
      subject: template.subject || '',
      body: template.body
    })
    setShowModal(true)
  }

  const resetForm = () => {
    setFormData({ name: '', type: 'whatsapp', subject: '', body: '' })
    setEditingTemplate(null)
    setShowModal(false)
  }

  const variables = [
    '{nome}',
    '{email}',
    '{titolo_incontro}',
    '{descrizione_incontro}',
    '{data_incontro}',
    '{ora_incontro}'
  ]

  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-radianza-deep-blue">Template Messaggi</h1>
            <p className="text-radianza-deep-blue/60 mt-2">Gestisci template per email e WhatsApp</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-radianza-gold to-radianza-deep-blue text-white rounded-lg hover:shadow-lg transition-all"
          >
            <Plus className="w-5 h-5" />
            <span>Nuovo Template</span>
          </button>
        </div>

        {/* Variabili Disponibili */}
        <div className="mb-6 bg-gradient-to-r from-radianza-celestial/50 to-white/80 backdrop-blur-lg rounded-xl shadow-lg p-6 border border-radianza-gold/30">
          <h3 className="font-semibold text-radianza-deep-blue mb-3">Variabili Disponibili:</h3>
          <div className="flex flex-wrap gap-2">
            {variables.map(v => (
              <code key={v} className="px-3 py-1 bg-radianza-gold/20 text-radianza-deep-blue rounded-lg text-sm font-mono">
                {v}
              </code>
            ))}
          </div>
          <p className="text-xs text-radianza-deep-blue/60 mt-2">
            Inserisci queste variabili nei tuoi template - verranno sostituite automaticamente
          </p>
        </div>

        {/* Lista Template */}
        <div className="grid md:grid-cols-2 gap-6">
          {templates.map((template) => (
            <div
              key={template.id}
              className="bg-white/80 backdrop-blur-lg rounded-xl shadow-lg p-6 border border-radianza-gold/30 hover:shadow-xl transition-all"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center space-x-2">
                  {template.type === 'email' ? (
                    <Mail className="w-5 h-5 text-radianza-gold" />
                  ) : (
                    <MessageSquare className="w-5 h-5 text-radianza-gold" />
                  )}
                  <span className="px-2 py-1 bg-radianza-gold/20 text-radianza-deep-blue rounded text-xs font-medium uppercase">
                    {template.type}
                  </span>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => startEdit(template)}
                    className="p-2 text-radianza-sky-blue hover:bg-radianza-sky-blue/10 rounded-lg transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(template.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <h3 className="text-lg font-bold text-radianza-deep-blue mb-2">{template.name}</h3>
              {template.subject && (
                <p className="text-sm text-radianza-deep-blue/70 mb-2">
                  <strong>Oggetto:</strong> {template.subject}
                </p>
              )}
              <div className="mt-3 p-3 bg-radianza-celestial/20 rounded-lg">
                <pre className="text-xs text-radianza-deep-blue whitespace-pre-wrap line-clamp-6 font-sans">
                  {template.body}
                </pre>
              </div>
            </div>
          ))}
        </div>

        {/* Modal Crea/Modifica */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
            <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full p-8 my-8">
              <h2 className="text-2xl font-bold text-radianza-deep-blue mb-6">
                {editingTemplate ? 'Modifica Template' : 'Nuovo Template'}
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-radianza-deep-blue mb-2">Nome Template *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 border border-radianza-gold/30 rounded-lg focus:ring-2 focus:ring-radianza-gold outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-radianza-deep-blue mb-2">Tipo *</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                    className="w-full px-4 py-2 border border-radianza-gold/30 rounded-lg focus:ring-2 focus:ring-radianza-gold outline-none"
                  >
                    <option value="whatsapp">WhatsApp</option>
                    <option value="email">Email</option>
                  </select>
                </div>
                {formData.type === 'email' && (
                  <div>
                    <label className="block text-sm font-medium text-radianza-deep-blue mb-2">Oggetto Email *</label>
                    <input
                      type="text"
                      required={formData.type === 'email'}
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full px-4 py-2 border border-radianza-gold/30 rounded-lg focus:ring-2 focus:ring-radianza-gold outline-none"
                    />
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-radianza-deep-blue mb-2">Corpo Messaggio *</label>
                  <textarea
                    required
                    value={formData.body}
                    onChange={(e) => setFormData({ ...formData, body: e.target.value })}
                    rows={12}
                    className="w-full px-4 py-2 border border-radianza-gold/30 rounded-lg focus:ring-2 focus:ring-radianza-gold outline-none font-mono text-sm"
                    placeholder="Usa le variabili come {nome}, {email}, {titolo_incontro}..."
                  />
                </div>
                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 border border-radianza-gold/30 text-radianza-deep-blue rounded-lg hover:bg-radianza-gold/10 transition-colors"
                  >
                    <X className="w-5 h-5" />
                    <span>Annulla</span>
                  </button>
                  <button
                    onClick={editingTemplate ? handleUpdate : handleCreate}
                    disabled={!formData.name || !formData.body || (formData.type === 'email' && !formData.subject)}
                    className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-gradient-to-r from-radianza-gold to-radianza-deep-blue text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Save className="w-5 h-5" />
                    <span>{editingTemplate ? 'Aggiorna' : 'Crea'} Template</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
