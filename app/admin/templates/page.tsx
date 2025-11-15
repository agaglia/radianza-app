import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import TemplatesClient from './TemplatesClient'

export default async function TemplatesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (!profile?.is_admin) redirect('/dashboard')

  return <TemplatesClient />
}
