import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import ContentClient from './ContentClient'

export default async function UserContentPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Ottieni i contenuti con informazioni sugli incontri
  const { data: contents } = await supabase
    .from('content')
    .select(`
      *,
      meetings:meeting_id (
        id,
        title,
        date
      )
    `)
    .order('created_at', { ascending: false })

  return <ContentClient contents={contents || []} />
}
