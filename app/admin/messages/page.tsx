import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import MessagesClient from './MessagesClient'

export default async function MessagesPage() {
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
    .select('*')
    .order('date', { ascending: false })

  const { data: users } = await supabase
    .from('profiles')
    .select('id, full_name, email')
    .order('full_name')

  return <MessagesClient meetings={meetings || []} users={users || []} />
}
