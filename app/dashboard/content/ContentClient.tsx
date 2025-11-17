'use client'

import { useState } from 'react'
import { Music, Mail, FileText, BookOpen, Image as ImageIcon, Sparkles, Calendar, Filter, Wand2, X } from 'lucide-react'

interface Meeting {
  id: string
  title: string
  date: string
}

interface Content {
  id: string
  title: string
  description: string | null
  type: 'music' | 'letter' | 'text' | 'poem' | 'image' | 'mantra' | 'mediradiananza'
  url: string | null
  text_content: string | null
  created_at: string
  meetings: Meeting | null
}

const categories = [
  { id: 'all', name: 'Tutti', icon: Filter },
  { id: 'music', name: 'Musiche', icon: Music },
  { id: 'letter', name: 'Lettera dei Radianti', icon: Mail },
  { id: 'text', name: 'Testi', icon: FileText },
  { id: 'poem', name: 'Poesie', icon: BookOpen },
  { id: 'image', name: 'Immagini', icon: ImageIcon },
  { id: 'mantra', name: 'Mantra', icon: Sparkles },
  { id: 'mediradiananza', name: 'MediRadianza', icon: Wand2 }
]

export default function ContentClient({ contents }: { contents: Content[] }) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedMeeting, setSelectedMeeting] = useState<string>('all')
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  // Ordina i contenuti per data di incontro (più recenti prima)
  const sortedContents = [...contents].sort((a, b) => {
    const dateA = a.meetings?.date || a.created_at
    const dateB = b.meetings?.date || b.created_at
    return new Date(dateB).getTime() - new Date(dateA).getTime()
  })

  // Estrai tutti gli incontri unici dai contenuti
  const uniqueMeetings = Array.from(
    new Map(
      sortedContents
        .filter(c => c.meetings)
        .map(c => [c.meetings!.id, c.meetings!])
    ).values()
  ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  // Filtra per categoria
  const categoryFiltered = selectedCategory === 'all' 
    ? sortedContents 
    : sortedContents.filter(c => c.type === selectedCategory)

  // Filtra per incontro
  const filteredContents = selectedMeeting === 'all'
    ? categoryFiltered
    : categoryFiltered.filter(c => c.meetings?.id === selectedMeeting)

  // Raggruppa contenuti per incontro
  const contentsByMeeting = new Map<string, Content[]>()
  const contentsWithoutMeeting: Content[] = []

  filteredContents.forEach(content => {
    if (content.meetings) {
      const meetingKey = content.meetings.id
      if (!contentsByMeeting.has(meetingKey)) {
        contentsByMeeting.set(meetingKey, [])
      }
      contentsByMeeting.get(meetingKey)!.push(content)
    } else {
      contentsWithoutMeeting.push(content)
    }
  })

  const getCategoryName = (type: string) => {
    return categories.find(cat => cat.id === type)?.name || type
  }

  const getCategoryIcon = (type: string) => {
    const category = categories.find(cat => cat.id === type)
    const Icon = category?.icon || FileText
    return <Icon className="w-5 h-5" />
  }

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-radianza-deep-blue">Contenuti</h1>
          <p className="text-radianza-deep-blue/60 mt-2">
            Esplora i contenuti discussi negli incontri
          </p>
        </div>

        {/* Filtri per incontro */}
        <div className="mb-6">
          <h2 className="text-sm font-semibold text-radianza-deep-blue mb-3 flex items-center">
            <Calendar className="w-4 h-4 mr-2" />
            Filtra per Incontro
          </h2>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedMeeting('all')}
              className={`px-4 py-2 rounded-lg transition-all ${
                selectedMeeting === 'all'
                  ? 'bg-radianza-deep-blue text-white shadow-lg'
                  : 'bg-white/80 text-radianza-deep-blue border border-radianza-gold/30 hover:bg-radianza-gold/10'
              }`}
            >
              Tutti gli incontri
            </button>
            {uniqueMeetings.map((meeting) => (
              <button
                key={meeting.id}
                onClick={() => setSelectedMeeting(meeting.id)}
                className={`px-4 py-2 rounded-lg transition-all text-left ${
                  selectedMeeting === meeting.id
                    ? 'bg-radianza-deep-blue text-white shadow-lg'
                    : 'bg-white/80 text-radianza-deep-blue border border-radianza-gold/30 hover:bg-radianza-gold/10'
                }`}
              >
                <div className="font-medium">{meeting.title}</div>
                <div className="text-xs opacity-75">
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

        {/* Filtri per categoria */}
        <div className="mb-8">
          <h2 className="text-sm font-semibold text-radianza-deep-blue mb-3">Filtra per Categoria</h2>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => {
              const Icon = category.icon
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                    selectedCategory === category.id
                      ? 'bg-radianza-gold text-white shadow-lg'
                      : 'bg-white/80 text-radianza-deep-blue border border-radianza-gold/30 hover:bg-radianza-gold/10'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="font-medium">{category.name}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Contenuti raggruppati per incontro */}
        {filteredContents.length > 0 ? (
          <div className="space-y-12">
            {/* Contenuti con incontro */}
            {Array.from(contentsByMeeting.entries())
              .sort(([, contentsA], [, contentsB]) => {
                const dateA = contentsA[0].meetings!.date
                const dateB = contentsB[0].meetings!.date
                return new Date(dateB).getTime() - new Date(dateA).getTime()
              })
              .map(([meetingId, meetingContents]) => {
                const meeting = meetingContents[0].meetings!
                return (
                  <div key={meetingId} className="relative">
                    {/* Header incontro */}
                    <div className="mb-6 pb-4 border-b-2 border-radianza-gold/30">
                      <div className="flex items-start space-x-3">
                        <Calendar className="w-6 h-6 text-radianza-gold flex-shrink-0 mt-1" />
                        <div>
                          <h2 className="text-2xl font-bold text-radianza-deep-blue">{meeting.title}</h2>
                          <p className="text-radianza-deep-blue/60 mt-1">
                            {new Date(meeting.date).toLocaleDateString('it-IT', {
                              weekday: 'long',
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric'
                            })}
                          </p>
                          <p className="text-sm text-radianza-gold font-medium mt-2">
                            {meetingContents.length} {meetingContents.length === 1 ? 'contenuto' : 'contenuti'}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Griglia contenuti */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {meetingContents.map((content) => (
                        <ContentCard key={content.id} content={content} getCategoryIcon={getCategoryIcon} getCategoryName={getCategoryName} onImageClick={setSelectedImage} />
                      ))}
                    </div>
                  </div>
                )
              })}

            {/* Contenuti senza incontro */}
            {contentsWithoutMeeting.length > 0 && (
              <div className="relative">
                <div className="mb-6 pb-4 border-b-2 border-radianza-gold/30">
                  <div className="flex items-start space-x-3">
                    <FileText className="w-6 h-6 text-radianza-deep-blue/50 flex-shrink-0 mt-1" />
                    <div>
                      <h2 className="text-2xl font-bold text-radianza-deep-blue">Altri Contenuti</h2>
                      <p className="text-radianza-deep-blue/60 mt-1">
                        Contenuti non collegati a un incontro specifico
                      </p>
                    </div>
                  </div>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {contentsWithoutMeeting.map((content) => (
                    <ContentCard key={content.id} content={content} getCategoryIcon={getCategoryIcon} getCategoryName={getCategoryName} onImageClick={setSelectedImage} />
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-12 bg-white/60 rounded-2xl">
            <FileText className="w-12 h-12 text-radianza-deep-blue/40 mx-auto mb-4" />
            <p className="text-radianza-deep-blue/60">
              Nessun contenuto disponibile con i filtri selezionati
            </p>
          </div>
        )}
      </div>

      {/* Modal per immagini ingrandite */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div 
            className="max-w-4xl w-full max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedImage(null)}
              className="self-end mb-4 p-2 bg-white rounded-full hover:bg-radianza-gold/20 transition-colors"
            >
              <X className="w-6 h-6 text-radianza-deep-blue" />
            </button>
            <img
              src={selectedImage}
              alt="Immagine ingrandita"
              className="w-full h-full object-contain rounded-lg"
            />
          </div>
        </div>
      )}
    </div>
  )
}

// Componente per la card del contenuto
function ContentCard({ content, getCategoryIcon, getCategoryName, onImageClick }: { 
  content: Content, 
  getCategoryIcon: (type: string) => React.ReactNode,
  getCategoryName: (type: string) => string,
  onImageClick: (url: string) => void
}) {
  // Funzione per estrarre ID video YouTube da URL
  const extractYouTubeId = (url: string): string | null => {
    const regexes = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/,
      /youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
      /youtube\.com\/v\/([a-zA-Z0-9_-]{11})/
    ]
    for (const regex of regexes) {
      const match = url.match(regex)
      if (match) return match[1]
    }
    return null
  }

  const isYouTubeUrl = (url: string): boolean => {
    return /(?:youtube\.com|youtu\.be)/.test(url)
  }

  const youTubeId = content.type === 'music' && content.text_content?.startsWith('AUDIO_URL:')
    ? extractYouTubeId(content.text_content.replace('AUDIO_URL:', ''))
    : null

  return (
    <div className="bg-white/80 backdrop-blur-lg rounded-xl shadow-lg overflow-hidden border border-radianza-gold/30 hover:shadow-xl transition-all">
      {/* Immagine o Video */}
      {content.url && (content.type === 'image' || content.type === 'music') && (
        <div className="aspect-video bg-radianza-celestial relative">
          {content.type === 'image' ? (
            <img
              src={content.url}
              alt={content.title}
              className="w-full h-full object-cover cursor-pointer hover:opacity-90 transition-opacity"
              onClick={() => onImageClick(content.url!)}
            />
          ) : content.type === 'music' ? (
            <img
              src={content.url}
              alt={content.title}
              className="w-full h-full object-cover cursor-pointer hover:opacity-90 transition-opacity"
              onClick={() => onImageClick(content.url!)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Music className="w-16 h-16 text-radianza-gold" />
            </div>
          )}
        </div>
      )}

      <div className="p-6">
        {/* Categoria */}
        <div className="flex items-center space-x-2 mb-3">
          <div className="text-radianza-gold">
            {getCategoryIcon(content.type)}
          </div>
          <span className="text-xs font-semibold text-radianza-deep-blue/70 uppercase">
            {getCategoryName(content.type)}
          </span>
        </div>

        {/* Titolo */}
        <h3 className="text-xl font-bold text-radianza-deep-blue mb-2">
          {content.title}
        </h3>

        {/* Descrizione */}
        {content.description && (
          <p className="text-radianza-deep-blue/70 text-sm mb-3">
            {content.description}
          </p>
        )}

        {/* Testo contenuto */}
        {content.text_content && !content.text_content.startsWith('AUDIO_URL:') && (
          <div className="bg-radianza-celestial/50 rounded-lg p-4 mb-3">
            <p className="text-radianza-deep-blue text-sm whitespace-pre-wrap">
              {content.text_content}
            </p>
          </div>
        )}

        {/* Player audio/video YouTube */}
        {content.type === 'music' && content.text_content && (
          <div className="mb-3">
            {youTubeId ? (
              <div className="space-y-2">
                {/* Embedded YouTube */}
                <iframe
                  width="100%"
                  height="200"
                  src={`https://www.youtube.com/embed/${youTubeId}`}
                  title={content.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="rounded-lg"
                ></iframe>
                {/* Link diretto a YouTube */}
                <a
                  href={content.text_content.replace('AUDIO_URL:', '')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block text-sm text-radianza-sky-blue hover:underline"
                >
                  Ascolta su YouTube →
                </a>
              </div>
            ) : (
              <audio controls className="w-full">
                <source src={content.text_content.replace('AUDIO_URL:', '')} />
              </audio>
            )}
          </div>
        )}

        {/* Data creazione */}
        <p className="text-xs text-radianza-deep-blue/50 mt-3">
          Pubblicato il {new Date(content.created_at).toLocaleDateString('it-IT', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
          })}
        </p>
      </div>
    </div>
  )
}
