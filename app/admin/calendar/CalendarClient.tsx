'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Plus, Trash2, Calendar as CalendarIcon, Users, Check, X, ChevronLeft, ChevronRight } from 'lucide-react'
import { generateMeetLink } from '@/lib/meet-generator'

interface Meeting {
  id: string
  title: string
  description: string | null
  date: string
  meet_link?: string
  created_at: string
  attendance: Array<{
    id: string
    status: 'present' | 'absent'
    user_id: string
  }>
}

export default function CalendarClient({ meetings, userId }: { meetings: Meeting[], userId: string }) {
  const [showModal, setShowModal] = useState(false)
  const [newMeeting, setNewMeeting] = useState({
    title: '',
    description: '',
    date: '',
    time: ''
  })
  const [view, setView] = useState<'month' | 'list' | 'stats'>('month')
  const [currentDate, setCurrentDate] = useState(new Date())
  
  const router = useRouter()
  const supabase = createClient()

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const dateTime = `${newMeeting.date}T${newMeeting.time}:00`
      const meetLink = generateMeetLink()
      
      const { error } = await supabase
        .from('meetings')
        .insert({
          title: newMeeting.title,
          description: newMeeting.description || null,
          date: dateTime,
          meet_link: meetLink,
          created_by: userId
        })

      if (error) throw error

      alert('✅ Incontro creato con successo!\nLink Meet: ' + meetLink)
      setShowModal(false)
      setNewMeeting({ title: '', description: '', date: '', time: '' })
      router.refresh()
    } catch (error: any) {
      alert('❌ Errore: ' + error.message)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Sei sicuro di voler eliminare questo incontro?')) return

    try {
      const { error } = await supabase
        .from('meetings')
        .delete()
        .eq('id', id)

      if (error) throw error

      alert('✅ Incontro eliminato')
      router.refresh()
    } catch (error: any) {
      alert('❌ Errore: ' + error.message)
    }
  }

  const getAttendanceStats = (meeting: Meeting) => {
    const present = meeting.attendance.filter(a => a.status === 'present').length
    const absent = meeting.attendance.filter(a => a.status === 'absent').length
    const total = present + absent
    return { present, absent, total, percentage: total > 0 ? Math.round((present / total) * 100) : 0 }
  }

  const isPastMeeting = (date: string) => new Date(date) < new Date()

  // Funzioni per il calendario mensile
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay() // 0 = Domenica
    
    return { daysInMonth, startingDayOfWeek, year, month }
  }

  const getMeetingsForDay = (day: number) => {
    const { year, month } = getDaysInMonth(currentDate)
    const dayDate = new Date(year, month, day)
    
    return meetings.filter(meeting => {
      const meetingDate = new Date(meeting.date)
      return (
        meetingDate.getDate() === day &&
        meetingDate.getMonth() === month &&
        meetingDate.getFullYear() === year
      )
    })
  }

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
  }

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
  }

  const goToToday = () => {
    setCurrentDate(new Date())
  }

  const renderMonthView = () => {
    const { daysInMonth, startingDayOfWeek, year, month } = getDaysInMonth(currentDate)
    const days = []
    const today = new Date()
    const isCurrentMonth = today.getMonth() === month && today.getFullYear() === year
    
    // Giorni della settimana
    const weekDays = ['Dom', 'Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab']
    
    // Celle vuote prima del primo giorno del mese
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(<div key={`empty-${i}`} className="min-h-24 bg-gray-50/50 rounded-lg" />)
    }
    
    // Giorni del mese
    for (let day = 1; day <= daysInMonth; day++) {
      const dayMeetings = getMeetingsForDay(day)
      const isToday = isCurrentMonth && today.getDate() === day
      
      days.push(
        <div
          key={day}
          className={`min-h-24 p-2 rounded-lg border transition-all ${
            isToday 
              ? 'bg-radianza-gold/10 border-radianza-gold shadow-md' 
              : 'bg-white/80 border-radianza-gold/20 hover:border-radianza-gold/40'
          }`}
        >
          <div className={`text-sm font-semibold mb-1 ${
            isToday ? 'text-radianza-gold' : 'text-radianza-deep-blue'
          }`}>
            {day}
            {isToday && <span className="ml-1 text-xs">(Oggi)</span>}
          </div>
          <div className="space-y-1">
            {dayMeetings.map(meeting => {
              const stats = getAttendanceStats(meeting)
              const past = isPastMeeting(meeting.date)
              
              return (
                <div
                  key={meeting.id}
                  className={`text-xs p-1.5 rounded cursor-pointer transition-all ${
                    past
                      ? 'bg-radianza-deep-blue/10 text-radianza-deep-blue/60'
                      : 'bg-radianza-celestial text-radianza-deep-blue hover:shadow-sm'
                  }`}
                  onClick={() => {
                    const time = new Date(meeting.date).toLocaleTimeString('it-IT', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })
                    alert(`${meeting.title}\n${time}\n\n${meeting.description || 'Nessuna descrizione'}\n\nPresenze: ${stats.present}/${stats.total} (${stats.percentage}%)`)
                  }}
                >
                  <div className="font-medium truncate">{meeting.title}</div>
                  <div className="text-[10px] opacity-75">
                    {new Date(meeting.date).toLocaleTimeString('it-IT', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                  {stats.total > 0 && (
                    <div className="text-[10px] opacity-75">
                      👥 {stats.present}/{stats.total}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )
    }
    
    return (
      <div>
        <div className="grid grid-cols-7 gap-2 mb-2">
          {weekDays.map(day => (
            <div
              key={day}
              className="text-center text-sm font-semibold text-radianza-deep-blue py-2"
            >
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-2">
          {days}
        </div>
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-radianza-deep-blue">Calendario Incontri</h1>
            <p className="text-radianza-deep-blue/60 mt-2">Gestisci e monitora gli incontri di meditazione</p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() => setView('month')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                view === 'month'
                  ? 'bg-radianza-gold text-white'
                  : 'border border-radianza-gold/30 text-radianza-deep-blue hover:bg-radianza-gold/10'
              }`}
            >
              Mese
            </button>
            <button
              onClick={() => setView('list')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                view === 'list'
                  ? 'bg-radianza-gold text-white'
                  : 'border border-radianza-gold/30 text-radianza-deep-blue hover:bg-radianza-gold/10'
              }`}
            >
              Lista
            </button>
            <button
              onClick={() => setView('stats')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                view === 'stats'
                  ? 'bg-radianza-gold text-white'
                  : 'border border-radianza-gold/30 text-radianza-deep-blue hover:bg-radianza-gold/10'
              }`}
            >
              Statistiche
            </button>
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-radianza-gold to-radianza-deep-blue text-white rounded-lg hover:shadow-lg transition-all"
            >
              <Plus className="w-5 h-5" />
              <span>Nuovo Incontro</span>
            </button>
          </div>
        </div>

        {view === 'month' ? (
          <div>
            <div className="flex items-center justify-between mb-6 bg-white/80 backdrop-blur-lg rounded-xl shadow-lg p-4 border border-radianza-gold/30">
              <button
                onClick={goToPreviousMonth}
                className="p-2 hover:bg-radianza-gold/10 rounded-lg transition-colors"
              >
                <ChevronLeft className="w-6 h-6 text-radianza-deep-blue" />
              </button>
              <div className="text-center">
                <h2 className="text-2xl font-bold text-radianza-deep-blue">
                  {currentDate.toLocaleDateString('it-IT', { month: 'long', year: 'numeric' })}
                </h2>
                <button
                  onClick={goToToday}
                  className="text-sm text-radianza-gold hover:underline mt-1"
                >
                  Oggi
                </button>
              </div>
              <button
                onClick={goToNextMonth}
                className="p-2 hover:bg-radianza-gold/10 rounded-lg transition-colors"
              >
                <ChevronRight className="w-6 h-6 text-radianza-deep-blue" />
              </button>
            </div>
            {renderMonthView()}
          </div>
        ) : view === 'list' ? (
          <div className="space-y-4">
            {meetings.map((meeting) => {
              const stats = getAttendanceStats(meeting)
              const past = isPastMeeting(meeting.date)
              
              return (
                <div
                  key={meeting.id}
                  className={`bg-white/80 backdrop-blur-lg rounded-xl shadow-lg p-6 border transition-all ${
                    past 
                      ? 'border-radianza-deep-blue/20 opacity-75' 
                      : 'border-radianza-gold/30 hover:shadow-xl'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-3">
                        <CalendarIcon className="w-5 h-5 text-radianza-gold" />
                        {past && (
                          <span className="px-2 py-1 bg-radianza-deep-blue/20 text-radianza-deep-blue rounded text-xs font-medium">
                            PASSATO
                          </span>
                        )}
                        <span className="text-sm text-radianza-deep-blue/70">
                          {new Date(meeting.date).toLocaleDateString('it-IT', {
                            weekday: 'long',
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric'
                          })}
                          {' alle '}
                          {new Date(meeting.date).toLocaleTimeString('it-IT', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-radianza-deep-blue mb-2">
                        {meeting.title}
                      </h3>
                      {meeting.description && (
                        <p className="text-radianza-deep-blue/70 mb-4">{meeting.description}</p>
                      )}
                      <div className="flex items-center space-x-4 text-sm">
                        <div className="flex items-center space-x-2">
                          <Users className="w-4 h-4 text-radianza-gold" />
                          <span className="text-radianza-deep-blue">
                            {stats.total} {stats.total === 1 ? 'risposta' : 'risposte'}
                          </span>
                        </div>
                        {stats.total > 0 && (
                          <>
                            <div className="flex items-center space-x-1 text-green-600">
                              <Check className="w-4 h-4" />
                              <span>{stats.present} presenti</span>
                            </div>
                            <div className="flex items-center space-x-1 text-red-600">
                              <X className="w-4 h-4" />
                              <span>{stats.absent} assenti</span>
                            </div>
                            <div className="px-3 py-1 bg-radianza-gold/20 text-radianza-deep-blue rounded-full font-medium">
                              {stats.percentage}% partecipazione
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => handleDelete(meeting.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors ml-4"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              )
            })}

            {meetings.length === 0 && (
              <div className="text-center py-12 bg-white/60 rounded-2xl">
                <p className="text-radianza-deep-blue/60">Nessun incontro pianificato</p>
              </div>
            )}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-radianza-celestial/50 to-white/80 backdrop-blur-lg rounded-xl shadow-lg p-6 border border-radianza-gold/30">
              <div className="text-4xl font-bold text-radianza-deep-blue mb-2">
                {meetings.length}
              </div>
              <div className="text-radianza-deep-blue/70">Incontri Totali</div>
            </div>
            <div className="bg-gradient-to-br from-radianza-celestial/50 to-white/80 backdrop-blur-lg rounded-xl shadow-lg p-6 border border-radianza-gold/30">
              <div className="text-4xl font-bold text-radianza-deep-blue mb-2">
                {meetings.filter(m => !isPastMeeting(m.date)).length}
              </div>
              <div className="text-radianza-deep-blue/70">Incontri Futuri</div>
            </div>
            <div className="bg-gradient-to-br from-radianza-celestial/50 to-white/80 backdrop-blur-lg rounded-xl shadow-lg p-6 border border-radianza-gold/30">
              <div className="text-4xl font-bold text-radianza-deep-blue mb-2">
                {Math.round(
                  meetings.reduce((acc, m) => acc + getAttendanceStats(m).percentage, 0) / (meetings.length || 1)
                )}%
              </div>
              <div className="text-radianza-deep-blue/70">Partecipazione Media</div>
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-8">
            <h2 className="text-2xl font-bold text-radianza-deep-blue mb-6">Crea Nuovo Incontro</h2>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-radianza-deep-blue mb-2">Titolo *</label>
                <input
                  type="text"
                  required
                  value={newMeeting.title}
                  onChange={(e) => setNewMeeting({ ...newMeeting, title: e.target.value })}
                  className="w-full px-4 py-2 border border-radianza-gold/30 rounded-lg focus:ring-2 focus:ring-radianza-gold outline-none"
                  placeholder="Es: Meditazione della Luna Piena"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-radianza-deep-blue mb-2">Descrizione</label>
                <textarea
                  value={newMeeting.description}
                  onChange={(e) => setNewMeeting({ ...newMeeting, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 border border-radianza-gold/30 rounded-lg focus:ring-2 focus:ring-radianza-gold outline-none"
                  placeholder="Descrizione dell'incontro..."
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-radianza-deep-blue mb-2">Data *</label>
                  <input
                    type="date"
                    required
                    value={newMeeting.date}
                    onChange={(e) => setNewMeeting({ ...newMeeting, date: e.target.value })}
                    className="w-full px-4 py-2 border border-radianza-gold/30 rounded-lg focus:ring-2 focus:ring-radianza-gold outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-radianza-deep-blue mb-2">Ora *</label>
                  <input
                    type="time"
                    required
                    value={newMeeting.time}
                    onChange={(e) => setNewMeeting({ ...newMeeting, time: e.target.value })}
                    className="w-full px-4 py-2 border border-radianza-gold/30 rounded-lg focus:ring-2 focus:ring-radianza-gold outline-none"
                  />
                </div>
              </div>
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
                  Crea Incontro
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
