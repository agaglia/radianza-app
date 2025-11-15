import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import AttendanceClient from './AttendanceClient'

export default async function AttendancePage() {
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
        user_id,
        created_at,
        profiles (
          id,
          email,
          full_name
        )
      )
    `)
    .order('date', { ascending: false })

  // Ottieni tutti gli utenti per mostrare chi è in attesa
  const { data: allUsers } = await supabase
    .from('profiles')
    .select('id, email, full_name')
    .order('full_name')

  return <AttendanceClient meetings={meetings || []} allUsers={allUsers || []} />
}
