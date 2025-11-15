'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Calendar, Check, X, Info, CheckCircle, Clock } from 'lucide-react'

interface UserAttendance {
  id: string
  status: 'present' | 'absent'
  user_id: string
}

interface Meeting {
  id: string
  title: string
  description: string | null
  date: string
  userAttendance: UserAttendance | null
}

export default function UserCalendarClient({ meetings, userId }: { meetings: Meeting[], userId: string }) {
  const [loading, setLoading] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  const handleAttendance = async (meetingId: string, status: 'present' | 'absent') => {
    setLoading(meetingId)
    
    try {
      const meeting = meetings.find(m => m.id === meetingId)
      
      if (meeting?.userAttendance) {
        // Update esistente
        const { error } = await supabase
          .from('attendance')
          .update({ status, updated_at: new Date().toISOString() })
          .eq('id', meeting.userAttendance.id)

        if (error) throw error
      } else {
        // Insert nuovo
        const { error } = await supabase
          .from('attendance')
          .insert({
            user_id: userId,
            meeting_id: meetingId,
            status
          })

        if (error) throw error
      }

      // Mostra messaggio di successo
      setSuccessMessage(status === 'present' ? '✓ Presenza confermata!' : '✓ Assenza registrata')
      setTimeout(() => setSuccessMessage(null), 3000)

      router.refresh()
    } catch (error: any) {
      alert('❌ Errore: ' + error.message)
    } finally {
      setLoading(null)
    }
  }

  const handleRemoveAttendance = async (meetingId: string) => {
    setLoading(meetingId)
    
    try {
      const meeting = meetings.find(m => m.id === meetingId)
      
      if (meeting?.userAttendance) {
        console.log('🗑️ Eliminazione attendance:', meeting.userAttendance.id)
        
        // Elimina il record di attendance
        const { error } = await supabase
          .from('attendance')
          .delete()
          .eq('id', meeting.userAttendance.id)

        if (error) {
          console.error('❌ Errore eliminazione:', error)
          throw error
        }

        console.log('✅ Attendance eliminata con successo')
        setSuccessMessage('✓ Risposta rimossa')
        setTimeout(() => setSuccessMessage(null), 3000)

        router.refresh()
      } else {
        console.log('⚠️ Nessuna attendance da eliminare per questo incontro')
      }
    } catch (error: any) {
      console.error('💥 Errore completo:', error)
      alert('❌ Errore durante la rimozione: ' + error.message + '\n\nHai eseguito la query SQL su Supabase per permettere agli utenti di eliminare la propria presenza?')
    } finally {
      setLoading(null)
    }
  }

  const isPastMeeting = (date: string) => new Date(date) < new Date()

  const futureMeetings = meetings.filter(m => !isPastMeeting(m.date))
  const pastMeetings = meetings.filter(m => isPastMeeting(m.date))

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        {/* Messaggio di successo */}
        {successMessage && (
          <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top duration-300">
            <div className="bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg flex items-center space-x-3">
              <CheckCircle className="w-5 h-5" />
              <span className="font-medium">{successMessage}</span>
            </div>
          </div>
        )}

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-radianza-deep-blue">Calendario Incontri</h1>
          <p className="text-radianza-deep-blue/60 mt-2">Segna la tua presenza o assenza agli incontri</p>
        </div>

        {/* Info box */}
        <div className="mb-6 bg-radianza-celestial/30 border border-radianza-gold/30 rounded-xl p-4 flex items-start space-x-3">
          <Info className="w-5 h-5 text-radianza-gold flex-shrink-0 mt-0.5" />
          <div className="text-sm text-radianza-deep-blue">
            <p className="font-medium mb-1">Come funziona?</p>
            <p className="text-radianza-deep-blue/70">
              Per ogni incontro puoi segnare se sarai presente o assente. Puoi sempre cambiare la tua risposta.
            </p>
          </div>
        </div>

        {/* Incontri futuri */}
        {futureMeetings.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-bold text-radianza-deep-blue mb-4">Prossimi Incontri</h2>
            <div className="space-y-4">
              {futureMeetings.map((meeting) => (
                <div
                  key={meeting.id}
                  className="bg-white/80 backdrop-blur-lg rounded-xl shadow-lg p-6 border border-radianza-gold/30 hover:shadow-xl transition-all"
                >
                  <div className="flex items-center space-x-2 mb-3">
                    <Calendar className="w-5 h-5 text-radianza-gold" />
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

                  <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-radianza-gold/20">
                    <span className="text-sm text-radianza-deep-blue/70 font-medium">
                      Parteciperai?
                    </span>
                    <button
                      onClick={() => handleAttendance(meeting.id, 'present')}
                      disabled={loading === meeting.id}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                        meeting.userAttendance?.status === 'present'
                          ? 'bg-green-600 text-white shadow-md'
                          : 'bg-green-50 text-green-700 border border-green-300 hover:bg-green-100'
                      } disabled:opacity-50`}
                    >
                      <Check className="w-4 h-4" />
                      <span>Presente</span>
                    </button>
                    <button
                      onClick={() => handleAttendance(meeting.id, 'absent')}
                      disabled={loading === meeting.id}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                        meeting.userAttendance?.status === 'absent'
                          ? 'bg-red-600 text-white shadow-md'
                          : 'bg-red-50 text-red-700 border border-red-300 hover:bg-red-100'
                      } disabled:opacity-50`}
                    >
                      <X className="w-4 h-4" />
                      <span>Assente</span>
                    </button>
                    <button
                      onClick={() => handleRemoveAttendance(meeting.id)}
                      disabled={loading === meeting.id || !meeting.userAttendance}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                        !meeting.userAttendance
                          ? 'bg-yellow-600 text-white shadow-md'
                          : 'bg-yellow-50 text-yellow-700 border border-yellow-300 hover:bg-yellow-100'
                      } disabled:opacity-50`}
                    >
                      <Clock className="w-4 h-4" />
                      <span>In Attesa</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Incontri passati */}
        {pastMeetings.length > 0 && (
          <div>
            <h2 className="text-xl font-bold text-radianza-deep-blue mb-4">Incontri Passati</h2>
            <div className="space-y-4">
              {pastMeetings.map((meeting) => (
                <div
                  key={meeting.id}
                  className="bg-white/60 backdrop-blur-lg rounded-xl shadow p-6 border border-radianza-deep-blue/20 opacity-75"
                >
                  <div className="flex items-center space-x-2 mb-3">
                    <Calendar className="w-5 h-5 text-radianza-deep-blue/50" />
                    <span className="text-sm text-radianza-deep-blue/50">
                      {new Date(meeting.date).toLocaleDateString('it-IT', {
                        weekday: 'long',
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </span>
                  </div>
                  
                  <h3 className="text-lg font-bold text-radianza-deep-blue/70 mb-2">
                    {meeting.title}
                  </h3>

                  {meeting.userAttendance && (
                    <div className="flex items-center space-x-2 pt-3 border-t border-radianza-deep-blue/10">
                      {meeting.userAttendance.status === 'present' ? (
                        <div className="flex items-center space-x-2 text-green-600">
                          <Check className="w-4 h-4" />
                          <span className="text-sm font-medium">Hai partecipato</span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2 text-red-600">
                          <X className="w-4 h-4" />
                          <span className="text-sm font-medium">Eri assente</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {meetings.length === 0 && (
          <div className="text-center py-12 bg-white/60 rounded-2xl">
            <Calendar className="w-12 h-12 text-radianza-deep-blue/40 mx-auto mb-4" />
            <p className="text-radianza-deep-blue/60">Nessun incontro disponibile</p>
          </div>
        )}
      </div>
    </div>
  )
}
