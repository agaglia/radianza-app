import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Sidebar from '@/app/components/Sidebar'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (!profile?.is_admin) {
    redirect('/dashboard')
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-radianza-celestial via-white to-radianza-light-gold/30">
      <Sidebar userEmail={user.email || ''} isAdmin={true} />
      <main className="flex-1 ml-72 transition-all duration-300">
        {children}
      </main>
    </div>
  )
}
