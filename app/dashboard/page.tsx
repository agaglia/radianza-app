import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import DashboardClient from './DashboardClient'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Ottieni il profilo utente
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  // Ottieni i contenuti
  const { data: contents } = await supabase
    .from('content')
    .select('*')
    .order('created_at', { ascending: false })

  // Ottieni le riunioni con l'attendance dell'utente
  const { data: meetings } = await supabase
    .from('meetings')
    .select(`
      *,
      attendance!left (
        id,
        status,
        user_id
      )
    `)
    .order('date', { ascending: true })

  // Filtra solo l'attendance dell'utente corrente e separa prossimi incontri
  const now = new Date()
  const meetingsWithUserAttendance = meetings?.map(meeting => ({
    ...meeting,
    userAttendance: meeting.attendance?.find((a: any) => a.user_id === user.id) || null,
    attendance: undefined
  }))

  const upcomingMeetings = meetingsWithUserAttendance?.filter(m => new Date(m.date) >= now) || []

  return (
    <DashboardClient 
      user={user} 
      profile={profile} 
      contents={contents || []}
      upcomingMeetings={upcomingMeetings}
      userId={user.id}
    />
  )
}
