'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Plus, Trash2, FileText, Image, Music, Mail, Book, Sparkles, Calendar } from 'lucide-react'

interface Meeting {
  id: string
  title: string
  date: string
}

interface Content {
  id: string
  title: string
  description: string | null
  type: 'music' | 'letter' | 'text' | 'poem' | 'image' | 'mantra'
  url: string | null
  text_content: string | null
  meeting_id: string | null
  created_at: string
  meetings?: Meeting
}

export default function ContentClient({ contents, userId, meetings }: { contents: Content[], userId: string, meetings: Meeting[] }) {
  const [showModal, setShowModal] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [newContent, setNewContent] = useState({
    title: '',
    description: '',
    type: 'text' as 'music' | 'letter' | 'text' | 'poem' | 'image' | 'mantra',
    url: '',
    text_content: '',
    meeting_id: ''
  })
  
  const router = useRouter()
  const supabase = createClient()

  const categories = [
    { id: 'all', name: 'Tutti', icon: <FileText className="w-4 h-4" /> },
    { id: 'music', name: 'Musiche', icon: <Music className="w-4 h-4" /> },
    { id: 'letter', name: 'Lettera dei Radianti', icon: <Mail className="w-4 h-4" /> },
    { id: 'text', name: 'Testi', icon: <FileText className="w-4 h-4" /> },
    { id: 'poem', name: 'Poesie', icon: <Book className="w-4 h-4" /> },
    { id: 'image', name: 'Immagini', icon: <Image className="w-4 h-4" /> },
    { id: 'mantra', name: 'Mantra', icon: <Sparkles className="w-4 h-4" /> }
  ]

  const getIcon = (type: string) => {
    const category = categories.find(c => c.id === type)
    return category?.icon || <FileText className="w-5 h-5" />
  }

  const getCategoryName = (type: string) => {
    const category = categories.find(c => c.id === type)
    return category?.name || type
  }

  const filteredContents = selectedCategory === 'all' 
    ? contents 
    : contents.filter(c => c.type === selectedCategory)

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const { error } = await supabase
        .from('content')
        .insert({
          title: newContent.title,
          description: newContent.description || null,
          type: newContent.type,
          url: newContent.url || null,
          text_content: newContent.text_content || null,
          meeting_id: newContent.meeting_id || null,
          created_by: userId
        })

      if (error) throw error

      alert('✅ Contenuto creato con successo!')
      setShowModal(false)
      setNewContent({ title: '', description: '', type: 'text', url: '', text_content: '', meeting_id: '' })
      router.refresh()
    } catch (error: any) {
      alert('❌ Errore: ' + error.message)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Sei sicuro di voler eliminare questo contenuto?')) return

    try {
      const { error } = await supabase
        .from('content')
        .delete()
        .eq('id', id)

      if (error) throw error

      alert('✅ Contenuto eliminato')
      router.refresh()
    } catch (error: any) {
      alert('❌ Errore: ' + error.message)
    }
  }

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-radianza-deep-blue">Gestione Contenuti</h1>
            <p className="text-radianza-deep-blue/60 mt-2">Organizza contenuti per categorie e incontri</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-radianza-gold to-radianza-deep-blue text-white rounded-lg hover:shadow-lg transition-all"
          >
            <Plus className="w-5 h-5" />
            <span>Nuovo Contenuto</span>
          </button>
        </div>

        {/* Filtri per categoria */}
        <div className="flex flex-wrap gap-2 mb-6">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                selectedCategory === category.id
                  ? 'bg-radianza-gold text-white shadow-md'
                  : 'bg-white/80 text-radianza-deep-blue border border-radianza-gold/30 hover:bg-radianza-gold/10'
              }`}
            >
              {category.icon}
              <span className="text-sm font-medium">{category.name}</span>
            </button>
          ))}
        </div>

        <div className="space-y-4">
          {filteredContents.map((content) => (
            <div
              key={content.id}
              className="bg-white/80 backdrop-blur-lg rounded-xl shadow-lg p-6 border border-radianza-gold/30 hover:shadow-xl transition-all"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-3">
                    <span className="text-radianza-gold">{getIcon(content.type)}</span>
                    <span className="px-2 py-1 bg-radianza-gold/20 text-radianza-deep-blue rounded text-xs font-medium">
                      {getCategoryName(content.type)}
                    </span>
                    {content.meetings && (
                      <span className="flex items-center space-x-1 px-2 py-1 bg-radianza-celestial text-radianza-deep-blue rounded text-xs">
                        <Calendar className="w-3 h-3" />
                        <span>{content.meetings.title}</span>
                      </span>
                    )}
                    <span className="text-xs text-radianza-deep-blue/50">
                      {new Date(content.created_at).toLocaleDateString('it-IT')}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-radianza-deep-blue mb-2">
                    {content.title}
                  </h3>
                  {content.description && (
                    <p className="text-radianza-deep-blue/70 mb-3">{content.description}</p>
                  )}
                  {content.url && (
                    <a href={content.url} target="_blank" rel="noopener noreferrer" className="text-sm text-radianza-sky-blue hover:underline">
                      Visualizza media →
                    </a>
                  )}
                  {content.text_content && (
                    <div className="mt-3 p-4 bg-radianza-celestial/30 rounded-lg">
                      <p className="text-sm text-radianza-deep-blue whitespace-pre-wrap line-clamp-3">
                        {content.text_content}
                      </p>
                    </div>
                  )}
                </div>
                <button
                  onClick={() => handleDelete(content.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors ml-4"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredContents.length === 0 && (
          <div className="text-center py-12 bg-white/60 rounded-2xl">
            <p className="text-radianza-deep-blue/60">
              {selectedCategory === 'all' 
                ? 'Nessun contenuto disponibile' 
                : `Nessun contenuto nella categoria ${getCategoryName(selectedCategory)}`}
            </p>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-8 my-8">
            <h2 className="text-2xl font-bold text-radianza-deep-blue mb-6">Crea Nuovo Contenuto</h2>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-radianza-deep-blue mb-2">Titolo *</label>
                <input
                  type="text"
                  required
                  value={newContent.title}
                  onChange={(e) => setNewContent({ ...newContent, title: e.target.value })}
                  className="w-full px-4 py-2 border border-radianza-gold/30 rounded-lg focus:ring-2 focus:ring-radianza-gold outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-radianza-deep-blue mb-2">Tipo *</label>
                <select
                  required
                  value={newContent.type}
                  onChange={(e) => setNewContent({ ...newContent, type: e.target.value as any })}
                  className="w-full px-4 py-2 border border-radianza-gold/30 rounded-lg focus:ring-2 focus:ring-radianza-gold outline-none"
                >
                  <option value="music">Musiche</option>
                  <option value="letter">Lettera dei Radianti</option>
                  <option value="text">Testi</option>
                  <option value="poem">Poesie</option>
                  <option value="image">Immagini</option>
                  <option value="mantra">Mantra</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-radianza-deep-blue mb-2">
                  Incontro di riferimento
                </label>
                <select
                  value={newContent.meeting_id}
                  onChange={(e) => setNewContent({ ...newContent, meeting_id: e.target.value })}
                  className="w-full px-4 py-2 border border-radianza-gold/30 rounded-lg focus:ring-2 focus:ring-radianza-gold outline-none"
                >
                  <option value="">Nessun incontro</option>
                  {meetings.map((meeting) => (
                    <option key={meeting.id} value={meeting.id}>
                      {meeting.title} - {new Date(meeting.date).toLocaleDateString('it-IT')}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-radianza-deep-blue mb-2">Descrizione</label>
                <textarea
                  value={newContent.description}
                  onChange={(e) => setNewContent({ ...newContent, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 border border-radianza-gold/30 rounded-lg focus:ring-2 focus:ring-radianza-gold outline-none"
                />
              </div>
              {(newContent.type === 'image' || newContent.type === 'music') && (
                <div>
                  <label className="block text-sm font-medium text-radianza-deep-blue mb-2">
                    URL {newContent.type === 'image' ? 'Immagine' : 'Musica'}
                  </label>
                  <input
                    type="url"
                    value={newContent.url}
                    onChange={(e) => setNewContent({ ...newContent, url: e.target.value })}
                    className="w-full px-4 py-2 border border-radianza-gold/30 rounded-lg focus:ring-2 focus:ring-radianza-gold outline-none"
                    placeholder="https://..."
                  />
                </div>
              )}
              {(newContent.type === 'text' || newContent.type === 'poem' || newContent.type === 'letter' || newContent.type === 'mantra') && (
                <div>
                  <label className="block text-sm font-medium text-radianza-deep-blue mb-2">Contenuto Testuale</label>
                  <textarea
                    value={newContent.text_content}
                    onChange={(e) => setNewContent({ ...newContent, text_content: e.target.value })}
                    rows={8}
                    className="w-full px-4 py-2 border border-radianza-gold/30 rounded-lg focus:ring-2 focus:ring-radianza-gold outline-none font-mono text-sm"
                    placeholder="Inserisci il contenuto..."
                  />
                </div>
              )}
              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2 border border-radianza-gold/30 text-radianza-deep-blue rounded-lg hover:bg-radianza-gold/10 transition-colors"
                >
                  Annulla
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-radianza-gold to-radianza-deep-blue text-white rounded-lg hover:shadow-lg transition-all"
                >
                  Crea Contenuto
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
