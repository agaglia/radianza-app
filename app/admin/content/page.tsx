import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import ContentClient from './ContentClient'

export default async function ContentPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (!profile?.is_admin) redirect('/dashboard')

  const { data: contents } = await supabase
    .from('content')
    .select('*, meetings(*)')
    .order('created_at', { ascending: false })

  const { data: meetings } = await supabase
    .from('meetings')
    .select('id, title, date')
    .order('date', { ascending: false })

  return <ContentClient contents={contents || []} userId={user.id} meetings={meetings || []} />
}
