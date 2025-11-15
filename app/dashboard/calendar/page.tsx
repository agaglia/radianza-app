import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import UserCalendarClient from './UserCalendarClient'

export default async function UserCalendarPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

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
    .order('date', { ascending: false })

  // Filtra solo l'attendance dell'utente corrente
  const meetingsWithUserAttendance = meetings?.map(meeting => ({
    ...meeting,
    userAttendance: meeting.attendance?.find((a: any) => a.user_id === user.id) || null,
    attendance: undefined // Rimuovi l'array completo per sicurezza
  }))

  return <UserCalendarClient meetings={meetingsWithUserAttendance || []} userId={user.id} />
}
