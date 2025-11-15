'use client'

import { useEffect, useState } from 'react'
import { Calendar, Users, Check, X, TrendingUp, Bell, Clock, MessageCircle } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

interface Profile {
  id: string
  email: string
  full_name: string | null
}

interface Attendance {
  id: string
  status: 'present' | 'absent'
  user_id: string
  created_at: string
  profiles: Profile
}

interface Meeting {
  id: string
  title: string
  description: string | null
  date: string
  attendance: Attendance[]
}

interface AllUser {
  id: string
  email: string
  full_name: string | null
}

export default function AttendanceClient({ 
  meetings: initialMeetings, 
  allUsers 
}: { 
  meetings: Meeting[]
  allUsers: AllUser[]
}) {
  const [meetings, setMeetings] = useState<Meeting[]>(initialMeetings)
  const [notification, setNotification] = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState<'all' | 'present' | 'absent' | 'pending'>('all')
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    // Sottoscrizione realtime per la tabella attendance
    const channel = supabase
      .channel('attendance-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'attendance'
        },
        (payload) => {
          console.log('Attendance change:', payload)
          
          // Mostra notifica
          if (payload.eventType === 'INSERT') {
            setNotification('Nuova risposta ricevuta!')
          } else if (payload.eventType === 'UPDATE') {
            setNotification('Risposta aggiornata!')
          } else if (payload.eventType === 'DELETE') {
            setNotification('Risposta rimossa!')
          }
          
          // Ricarica i dati
          router.refresh()
          
          // Nascondi notifica dopo 3 secondi
          setTimeout(() => setNotification(null), 3000)
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [supabase, router])

  // Aggiorna lo stato locale quando cambiano le props
  useEffect(() => {
    setMeetings(initialMeetings)
  }, [initialMeetings])
  const getAttendanceStats = (meeting: Meeting) => {
    const present = meeting.attendance.filter(a => a.status === 'present').length
    const absent = meeting.attendance.filter(a => a.status === 'absent').length
    const respondedUserIds = meeting.attendance.map(a => a.user_id)
    const pending = allUsers.filter(u => !respondedUserIds.includes(u.id)).length
    const total = allUsers.length
    const percentage = total > 0 ? Math.round((present / total) * 100) : 0
    
    return { present, absent, pending, total, percentage }
  }

  const isPastMeeting = (date: string) => new Date(date) < new Date()

  const getOverallStats = () => {
    const allAttendances = meetings.flatMap(m => m.attendance)
    const totalPresent = allAttendances.filter(a => a.status === 'present').length
    const totalAbsent = allAttendances.filter(a => a.status === 'absent').length
    const total = totalPresent + totalAbsent
    const avgPercentage = total > 0 ? Math.round((totalPresent / total) * 100) : 0
    
    return { totalPresent, totalAbsent, total, avgPercentage }
  }

  const generateWhatsAppMessage = (meeting: Meeting) => {
    const stats = getAttendanceStats(meeting)
    const meetingDate = new Date(meeting.date).toLocaleDateString('it-IT', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })

    let message = `*${meeting.title}*\n`
    message += `${meetingDate}\n\n`
    message += `*Riepilogo Presenze*\n`
    message += `Presenti: ${stats.present}/${stats.total}\n`
    message += `Assenti: ${stats.absent}/${stats.total}\n`
    message += `In attesa: ${stats.pending}/${stats.total}\n\n`

    // Presenti
    const presentUsers = allUsers.filter(u => 
      meeting.attendance.find(a => a.user_id === u.id && a.status === 'present')
    )
    if (presentUsers.length > 0) {
      message += `*Presenti (${presentUsers.length}):*\n`
      presentUsers.forEach(u => {
        message += `- ${u.full_name || u.email}\n`
      })
      message += '\n'
    }

    // Assenti
    const absentUsers = allUsers.filter(u => 
      meeting.attendance.find(a => a.user_id === u.id && a.status === 'absent')
    )
    if (absentUsers.length > 0) {
      message += `*Assenti (${absentUsers.length}):*\n`
      absentUsers.forEach(u => {
        message += `- ${u.full_name || u.email}\n`
      })
      message += '\n'
    }

    // In attesa
    const respondedUserIds = meeting.attendance.map(a => a.user_id)
    const pendingUsers = allUsers.filter(u => !respondedUserIds.includes(u.id))
    if (pendingUsers.length > 0) {
      message += `*In attesa di risposta (${pendingUsers.length}):*\n`
      pendingUsers.forEach(u => {
        message += `- ${u.full_name || u.email}\n`
      })
    }

    return encodeURIComponent(message)
  }

  const handleWhatsAppShare = (meeting: Meeting) => {
    const message = generateWhatsAppMessage(meeting)
    window.open(`https://wa.me/?text=${message}`, '_blank')
  }

  const overallStats = getOverallStats()

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        {/* Notifica realtime */}
        {notification && (
          <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top duration-300">
            <div className="bg-radianza-gold text-white px-6 py-3 rounded-lg shadow-lg flex items-center space-x-3">
              <Bell className="w-5 h-5 animate-pulse" />
              <span className="font-medium">{notification}</span>
            </div>
          </div>
        )}

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-radianza-deep-blue">Presenze Incontri</h1>
          <p className="text-radianza-deep-blue/60 mt-2">Monitora le presenze e assenze agli incontri in tempo reale</p>
        </div>

        {/* Statistiche generali */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <button
            onClick={() => setStatusFilter('present')}
            className={`bg-gradient-to-br from-green-50 to-white/80 backdrop-blur-lg rounded-xl shadow-lg p-6 border transition-all hover:scale-105 ${
              statusFilter === 'present' 
                ? 'border-green-500 ring-2 ring-green-500' 
                : 'border-green-300 hover:border-green-400'
            }`}
          >
            <div className="flex items-center space-x-3 mb-2">
              <Check className="w-5 h-5 text-green-600" />
              <div className="text-sm text-radianza-deep-blue/70">Presenze Totali</div>
            </div>
            <div className="text-3xl font-bold text-green-600">{overallStats.totalPresent}</div>
          </button>

          <button
            onClick={() => setStatusFilter('absent')}
            className={`bg-gradient-to-br from-red-50 to-white/80 backdrop-blur-lg rounded-xl shadow-lg p-6 border transition-all hover:scale-105 ${
              statusFilter === 'absent' 
                ? 'border-red-500 ring-2 ring-red-500' 
                : 'border-red-300 hover:border-red-400'
            }`}
          >
            <div className="flex items-center space-x-3 mb-2">
              <X className="w-5 h-5 text-red-600" />
              <div className="text-sm text-radianza-deep-blue/70">Assenze Totali</div>
            </div>
            <div className="text-3xl font-bold text-red-600">{overallStats.totalAbsent}</div>
          </button>

          <button
            onClick={() => setStatusFilter('pending')}
            className={`bg-gradient-to-br from-yellow-50 to-white/80 backdrop-blur-lg rounded-xl shadow-lg p-6 border transition-all hover:scale-105 ${
              statusFilter === 'pending' 
                ? 'border-yellow-500 ring-2 ring-yellow-500' 
                : 'border-yellow-300 hover:border-yellow-400'
            }`}
          >
            <div className="flex items-center space-x-3 mb-2">
              <Clock className="w-5 h-5 text-yellow-600" />
              <div className="text-sm text-radianza-deep-blue/70">In Attesa</div>
            </div>
            <div className="text-3xl font-bold text-yellow-600">{allUsers.length * meetings.length - overallStats.total}</div>
          </button>

          <button
            onClick={() => setStatusFilter('all')}
            className={`bg-gradient-to-br from-radianza-gold/20 to-white/80 backdrop-blur-lg rounded-xl shadow-lg p-6 border transition-all hover:scale-105 ${
              statusFilter === 'all' 
                ? 'border-radianza-gold ring-2 ring-radianza-gold' 
                : 'border-radianza-gold/30 hover:border-radianza-gold/50'
            }`}
          >
            <div className="flex items-center space-x-3 mb-2">
              <TrendingUp className="w-5 h-5 text-radianza-gold" />
              <div className="text-sm text-radianza-deep-blue/70">Media Presenze</div>
            </div>
            <div className="text-3xl font-bold text-radianza-deep-blue">{overallStats.avgPercentage}%</div>
          </button>
        </div>

        {/* Lista incontri con presenze */}
        <div className="space-y-6">
          {meetings.map((meeting) => {
            const stats = getAttendanceStats(meeting)
            const past = isPastMeeting(meeting.date)
            
            return (
              <div
                key={meeting.id}
                className={`bg-white/80 backdrop-blur-lg rounded-xl shadow-lg p-6 border transition-all ${
                  past 
                    ? 'border-radianza-deep-blue/20' 
                    : 'border-radianza-gold/30'
                }`}
              >
                <div className="flex justify-between items-start mb-6">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <Calendar className="w-5 h-5 text-radianza-gold" />
                      <span className="text-sm text-radianza-deep-blue/70">
                        {new Date(meeting.date).toLocaleDateString('it-IT', {
                          weekday: 'long',
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                      {past && (
                        <span className="px-2 py-1 bg-radianza-deep-blue/20 text-radianza-deep-blue rounded text-xs font-medium">
                          PASSATO
                        </span>
                      )}
                    </div>
                    <h3 className="text-xl font-bold text-radianza-deep-blue mb-1">
                      {meeting.title}
                    </h3>
                    {meeting.description && (
                      <p className="text-radianza-deep-blue/70 text-sm">{meeting.description}</p>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <div className="text-2xl font-bold text-radianza-deep-blue mb-1">
                        {stats.percentage}%
                      </div>
                      <div className="text-xs text-radianza-deep-blue/60">
                        {stats.present}/{stats.total} presenti
                      </div>
                    </div>
                    
                    <button
                      onClick={() => handleWhatsAppShare(meeting)}
                      className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-md"
                      title="Condividi su WhatsApp"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span className="text-sm font-medium">WhatsApp</span>
                    </button>
                  </div>
                </div>

                {/* Barra di progresso e statistiche */}
                <div className="mb-6">
                  <div className="flex items-center space-x-4 text-sm mb-2">
                    <div className="flex items-center space-x-1 text-green-600">
                      <Check className="w-4 h-4" />
                      <span>{stats.present} presenti</span>
                    </div>
                    <div className="flex items-center space-x-1 text-red-600">
                      <X className="w-4 h-4" />
                      <span>{stats.absent} assenti</span>
                    </div>
                    <div className="flex items-center space-x-1 text-yellow-600">
                      <Clock className="w-4 h-4" />
                      <span>{stats.pending} in attesa</span>
                    </div>
                  </div>
                  {stats.total > 0 && (
                    <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                      <div 
                        className="bg-gradient-to-r from-green-500 to-green-600 h-full transition-all duration-500"
                        style={{ width: `${stats.percentage}%` }}
                      />
                    </div>
                  )}
                </div>

                {/* Lista partecipanti */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {allUsers
                    .map((user) => {
                      const attendance = meeting.attendance.find(a => a.user_id === user.id)
                      const status = attendance?.status || 'pending'
                      return { user, status }
                    })
                    .filter(({ status }) => statusFilter === 'all' || status === statusFilter)
                    .map(({ user, status }) => (
                      <div
                        key={user.id}
                        className={`flex items-center justify-between p-3 rounded-lg border ${
                          status === 'present'
                            ? 'bg-green-50 border-green-200'
                            : status === 'absent'
                            ? 'bg-red-50 border-red-200'
                            : 'bg-yellow-50 border-yellow-200'
                        }`}
                      >
                        <div className="flex items-center space-x-2 flex-1 min-w-0">
                          {status === 'present' ? (
                            <Check className="w-4 h-4 text-green-600 flex-shrink-0" />
                          ) : status === 'absent' ? (
                            <X className="w-4 h-4 text-red-600 flex-shrink-0" />
                          ) : (
                            <Clock className="w-4 h-4 text-yellow-600 flex-shrink-0" />
                          )}
                          <div className="min-w-0">
                            <div className={`text-sm font-medium truncate ${
                              status === 'present' 
                                ? 'text-green-900' 
                                : status === 'absent'
                                ? 'text-red-900'
                                : 'text-yellow-900'
                            }`}>
                              {user.full_name || 'Senza nome'}
                            </div>
                            <div className={`text-xs truncate ${
                              status === 'present' 
                                ? 'text-green-600' 
                                : status === 'absent'
                                ? 'text-red-600'
                                : 'text-yellow-600'
                            }`}>
                              {user.email}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  }
                </div>
              </div>
            )
          })}
        </div>

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
