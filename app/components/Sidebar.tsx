'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import {
  LayoutDashboard,
  Users,
  FileText,
  Calendar,
  MessageSquare,
  Settings,
  UserCircle,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Mail,
  Bell,
  ClipboardCheck
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

interface SidebarProps {
  userEmail: string
  isAdmin: boolean
}

export default function Sidebar({ userEmail, isAdmin }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  const menuSections = [
    {
      title: 'Zona Personale',
      items: [
        { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, adminOnly: false },
        { name: 'Profilo', href: '/dashboard/profile', icon: UserCircle, adminOnly: false },
        { name: 'Calendario', href: '/dashboard/calendar', icon: Calendar, adminOnly: false },
        { name: 'Contenuti', href: '/dashboard/content', icon: FileText, adminOnly: false },
      ]
    },
    {
      title: 'Gestione',
      items: [
        { name: 'Utenti', href: '/admin/users', icon: Users, adminOnly: true },
        { name: 'Contenuti', href: '/admin/content', icon: FileText, adminOnly: true },
        { name: 'Gestione Calendario', href: '/admin/calendar', icon: Calendar, adminOnly: true },
        { name: 'Presenze Incontri', href: '/admin/attendance', icon: ClipboardCheck, adminOnly: true },
      ]
    },
    {
      title: 'Comunicazioni',
      items: [
        { name: 'Messaggi', href: '/admin/messages', icon: MessageSquare, adminOnly: true },
        { name: 'Template', href: '/admin/templates', icon: Mail, adminOnly: true },
        { name: 'Notifiche', href: '/admin/notifications', icon: Bell, adminOnly: true },
      ]
    },
    {
      title: 'Sistema',
      items: [
        { name: 'Impostazioni', href: '/admin/settings', icon: Settings, adminOnly: true },
      ]
    }
  ]

  return (
    <div
      className={`${
        collapsed ? 'w-20' : 'w-72'
      } bg-white/80 backdrop-blur-lg border-r border-radianza-gold/30 min-h-screen transition-all duration-300 flex flex-col fixed left-0 top-0 z-40`}
    >
      {/* Header */}
      <div className="p-4 border-b border-radianza-gold/30">
        <div className="flex items-center justify-between">
          {!collapsed && (
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-radianza-gold to-radianza-deep-blue rounded-full flex items-center justify-center shadow-lg">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold bg-gradient-to-r from-radianza-gold via-radianza-deep-blue to-radianza-sky-blue bg-clip-text text-transparent">
                  RADIANZA
                </h1>
                <p className="text-xs text-radianza-deep-blue/60">Gruppo Spirituale</p>
              </div>
            </div>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-2 hover:bg-radianza-gold/20 rounded-lg transition-colors"
          >
            {collapsed ? (
              <ChevronRight className="w-5 h-5 text-radianza-deep-blue" />
            ) : (
              <ChevronLeft className="w-5 h-5 text-radianza-deep-blue" />
            )}
          </button>
        </div>
      </div>

      {/* Menu */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-6">
        {menuSections.map((section) => {
          const visibleItems = section.items.filter(item => !item.adminOnly || isAdmin)
          if (visibleItems.length === 0) return null

          return (
            <div key={section.title}>
              {!collapsed && (
                <h3 className="text-xs font-semibold text-radianza-deep-blue/50 uppercase mb-2 px-3">
                  {section.title}
                </h3>
              )}
              <div className="space-y-1">
                {visibleItems.map((item) => {
                  const Icon = item.icon
                  const isActive = pathname === item.href

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all ${
                        isActive
                          ? 'bg-gradient-to-r from-radianza-gold to-radianza-deep-blue text-white shadow-lg'
                          : 'text-radianza-deep-blue/70 hover:bg-radianza-gold/10 hover:text-radianza-deep-blue'
                      }`}
                    >
                      <Icon className="w-5 h-5 flex-shrink-0" />
                      {!collapsed && <span className="font-medium">{item.name}</span>}
                    </Link>
                  )
                })}
              </div>
            </div>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-radianza-gold/30">
        {!collapsed && (
          <div className="mb-3 px-3">
            <p className="text-xs text-radianza-deep-blue/50">Connesso come</p>
            <p className="text-sm font-medium text-radianza-deep-blue truncate">{userEmail}</p>
            {isAdmin && (
              <span className="inline-block mt-1 text-xs bg-radianza-gold/20 text-radianza-deep-blue px-2 py-0.5 rounded">
                Amministratore
              </span>
            )}
          </div>
        )}
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center space-x-2 px-3 py-2.5 bg-radianza-deep-blue/10 text-radianza-deep-blue rounded-lg hover:bg-radianza-deep-blue hover:text-white transition-colors"
        >
          <LogOut className="w-5 h-5" />
          {!collapsed && <span className="font-medium">Esci</span>}
        </button>
      </div>
    </div>
  )
}
