import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Sidebar from '@/app/components/Sidebar'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  
  // Usa getUser invece di getSession per maggiore sicurezza
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-radianza-celestial via-white to-radianza-light-gold/30">
      <Sidebar userEmail={user.email || ''} isAdmin={profile?.is_admin || false} />
      <main className="flex-1 ml-72 transition-all duration-300">
        {children}
      </main>
    </div>
  )
}
