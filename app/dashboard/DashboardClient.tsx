'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  Calendar, 
  FileText, 
  Check,
  X,
  Clock,
  ChevronRight,
  AlertCircle
} from 'lucide-react'

interface UserAttendance {
  id: string
  status: 'present' | 'absent'
  user_id: string
}

interface Content {
  id: string
  title: string
  description: string | null
  type: string
  url: string | null
  text_content: string | null
  created_at: string
}

interface Meeting {
  id: string
  title: string
  description: string | null
  date: string
  userAttendance: UserAttendance | null
}

interface Profile {
  id: string
  email: string
  full_name: string | null
  is_admin: boolean
}

interface User {
  id: string
  email?: string
}

export default function DashboardClient({ 
  user, 
  profile, 
  contents,
  upcomingMeetings,
  userId
}: { 
  user: User
  profile: Profile | null
  contents: Content[]
  upcomingMeetings: Meeting[]
  userId: string
}) {
  const [loading, setLoading] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  const handleAttendance = async (meetingId: string, status: 'present' | 'absent') => {
    setLoading(meetingId)
    
    try {
      const meeting = upcomingMeetings.find(m => m.id === meetingId)
      
      if (meeting?.userAttendance) {
        const { error } = await supabase
          .from('attendance')
          .update({ status, updated_at: new Date().toISOString() })
          .eq('id', meeting.userAttendance.id)

        if (error) throw error
      } else {
        const { error } = await supabase
          .from('attendance')
          .insert({
            user_id: userId,
            meeting_id: meetingId,
            status
          })

        if (error) throw error
      }

      router.refresh()
    } catch (error: any) {
      alert('❌ Errore: ' + error.message)
    } finally {
      setLoading(null)
    }
  }

  const pendingMeetings = upcomingMeetings.filter(m => !m.userAttendance)

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-radianza-deep-blue">Dashboard</h1>
          <p className="text-radianza-deep-blue/60 mt-2">
            Benvenuto, {profile?.full_name || user.email}
          </p>
        </div>

        {/* Prossimi incontri in evidenza */}
        {pendingMeetings.length > 0 && (
          <div className="mb-8 bg-gradient-to-r from-radianza-gold/20 to-radianza-celestial border-l-4 border-radianza-gold rounded-lg p-6 shadow-lg">
            <div className="flex items-start space-x-3">
              <AlertCircle className="w-6 h-6 text-radianza-gold flex-shrink-0 mt-1" />
              <div className="flex-1">
                <h2 className="text-xl font-bold text-radianza-deep-blue mb-2">
                  Conferma la tua presenza!
                </h2>
                <p className="text-radianza-deep-blue/70 mb-4">
                  Hai {pendingMeetings.length} {pendingMeetings.length === 1 ? 'incontro' : 'incontri'} in attesa di conferma
                </p>

                <div className="space-y-4">
                  {pendingMeetings.slice(0, 2).map((meeting) => (
                    <div
                      key={meeting.id}
                      className="bg-white/80 backdrop-blur-lg rounded-xl p-4 border border-radianza-gold/30"
                    >
                      <div className="flex items-center space-x-2 mb-2">
                        <Calendar className="w-4 h-4 text-radianza-gold" />
                        <span className="text-sm text-radianza-deep-blue/70">
                          {new Date(meeting.date).toLocaleDateString('it-IT', {
                            weekday: 'long',
                            day: 'numeric',
                            month: 'long',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                      <h3 className="font-bold text-radianza-deep-blue mb-3">
                        {meeting.title}
                      </h3>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleAttendance(meeting.id, 'present')}
                          disabled={loading === meeting.id}
                          className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                        >
                          <Check className="w-4 h-4" />
                          <span>Presente</span>
                        </button>
                        <button
                          onClick={() => handleAttendance(meeting.id, 'absent')}
                          disabled={loading === meeting.id}
                          className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                        >
                          <X className="w-4 h-4" />
                          <span>Assente</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {pendingMeetings.length > 2 && (
                  <Link
                    href="/dashboard/calendar"
                    className="inline-flex items-center space-x-2 text-radianza-deep-blue hover:text-radianza-gold transition-colors mt-4"
                  >
                    <span className="font-medium">Vedi tutti gli incontri</span>
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Statistiche rapide */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/80 backdrop-blur-lg rounded-xl shadow-lg p-6 border border-radianza-gold/30">
            <div className="flex items-center space-x-3">
              <Calendar className="w-8 h-8 text-radianza-gold" />
              <div>
                <div className="text-2xl font-bold text-radianza-deep-blue">
                  {upcomingMeetings.length}
                </div>
                <div className="text-sm text-radianza-deep-blue/70">Prossimi incontri</div>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-lg rounded-xl shadow-lg p-6 border border-radianza-gold/30">
            <div className="flex items-center space-x-3">
              <Check className="w-8 h-8 text-green-600" />
              <div>
                <div className="text-2xl font-bold text-radianza-deep-blue">
                  {upcomingMeetings.filter(m => m.userAttendance?.status === 'present').length}
                </div>
                <div className="text-sm text-radianza-deep-blue/70">Confermati</div>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-lg rounded-xl shadow-lg p-6 border border-radianza-gold/30">
            <div className="flex items-center space-x-3">
              <FileText className="w-8 h-8 text-radianza-deep-blue" />
              <div>
                <div className="text-2xl font-bold text-radianza-deep-blue">
                  {contents.length}
                </div>
                <div className="text-sm text-radianza-deep-blue/70">Contenuti disponibili</div>
              </div>
            </div>
          </div>
        </div>

        {/* Link alle sezioni principali */}
        <div className="grid md:grid-cols-2 gap-6">
          <Link
            href="/dashboard/calendar"
            className="bg-gradient-to-br from-radianza-celestial to-white/80 backdrop-blur-lg rounded-xl shadow-lg p-6 border border-radianza-gold/30 hover:shadow-xl transition-all group"
          >
            <Calendar className="w-12 h-12 text-radianza-gold mb-4" />
            <h3 className="text-xl font-bold text-radianza-deep-blue mb-2 group-hover:text-radianza-gold transition-colors">
              Calendario Completo
            </h3>
            <p className="text-radianza-deep-blue/70">
              Visualizza tutti gli incontri e gestisci le tue presenze
            </p>
          </Link>

          {profile?.is_admin && (
            <Link
              href="/admin"
              className="bg-gradient-to-br from-radianza-gold/20 to-white/80 backdrop-blur-lg rounded-xl shadow-lg p-6 border border-radianza-gold/30 hover:shadow-xl transition-all group"
            >
              <FileText className="w-12 h-12 text-radianza-deep-blue mb-4" />
              <h3 className="text-xl font-bold text-radianza-deep-blue mb-2 group-hover:text-radianza-gold transition-colors">
                Amministrazione
              </h3>
              <p className="text-radianza-deep-blue/70">
                Gestisci utenti, contenuti e monitora le presenze
              </p>
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
