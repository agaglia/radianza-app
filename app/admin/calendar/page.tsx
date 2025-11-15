import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import CalendarClient from './CalendarClient'

export default async function CalendarPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (!profile?.is_admin) redirect('/dashboard')

  const { data: meetings } = await supabase
    .from('meetings')
    .select(`
      *,
      attendance (
        id,
        status,
        user_id
      )
    `)
    .order('date', { ascending: true })

  return <CalendarClient meetings={meetings || []} userId={user.id} />
}
