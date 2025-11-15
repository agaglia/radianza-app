'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { User, Mail, Lock, Save, Shield } from 'lucide-react'

interface Profile {
  id: string
  email: string
  full_name: string | null
  is_admin: boolean
}

interface UserData {
  id: string
  email?: string
}

export default function ProfileClient({ user, profile }: { user: UserData, profile: Profile | null }) {
  const [fullName, setFullName] = useState(profile?.full_name || '')
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [saving, setSaving] = useState(false)
  
  const router = useRouter()
  const supabase = createClient()

  const handleUpdateProfile = async () => {
    if (!fullName.trim()) {
      alert('⚠️ Inserisci un nome valido')
      return
    }

    setSaving(true)
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ full_name: fullName })
        .eq('id', user.id)

      if (error) throw error

      alert('✅ Profilo aggiornato con successo!')
      router.refresh()
    } catch (error: any) {
      alert('❌ Errore: ' + error.message)
    } finally {
      setSaving(false)
    }
  }

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      alert('⚠️ Compila tutti i campi della password')
      return
    }

    if (newPassword !== confirmPassword) {
      alert('⚠️ Le password non corrispondono')
      return
    }

    if (newPassword.length < 6) {
      alert('⚠️ La password deve essere di almeno 6 caratteri')
      return
    }

    setSaving(true)
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      })

      if (error) throw error

      alert('✅ Password aggiornata con successo!')
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
    } catch (error: any) {
      alert('❌ Errore: ' + error.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="p-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-radianza-deep-blue">Il Mio Profilo</h1>
          <p className="text-radianza-deep-blue/60 mt-2">Gestisci le tue informazioni personali</p>
        </div>

        <div className="space-y-6">
          {/* Informazioni Account */}
          <div className="bg-white/80 backdrop-blur-lg rounded-xl shadow-lg p-6 border border-radianza-gold/30">
            <div className="flex items-center space-x-2 mb-4">
              <User className="w-5 h-5 text-radianza-gold" />
              <h2 className="text-xl font-bold text-radianza-deep-blue">Informazioni Account</h2>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-radianza-deep-blue mb-2">Nome Completo</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Inserisci il tuo nome"
                  className="w-full px-4 py-2 border border-radianza-gold/30 rounded-lg focus:ring-2 focus:ring-radianza-gold outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-radianza-deep-blue mb-2">Email</label>
                <div className="flex items-center space-x-2 px-4 py-2 bg-radianza-celestial/30 rounded-lg border border-radianza-gold/20">
                  <Mail className="w-5 h-5 text-radianza-deep-blue/60" />
                  <span className="text-radianza-deep-blue">{user.email}</span>
                </div>
                <p className="text-xs text-radianza-deep-blue/60 mt-1">
                  L'email non può essere modificata
                </p>
              </div>
              {profile?.is_admin && (
                <div className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-radianza-gold/20 to-radianza-deep-blue/20 rounded-lg border border-radianza-gold/30">
                  <Shield className="w-5 h-5 text-radianza-gold" />
                  <span className="text-radianza-deep-blue font-medium">Amministratore</span>
                </div>
              )}
              <button
                onClick={handleUpdateProfile}
                disabled={saving}
                className="flex items-center space-x-2 px-6 py-2 bg-gradient-to-r from-radianza-gold to-radianza-deep-blue text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50"
              >
                <Save className="w-5 h-5" />
                <span>{saving ? 'Salvando...' : 'Salva Modifiche'}</span>
              </button>
            </div>
          </div>

          {/* Cambio Password */}
          <div className="bg-white/80 backdrop-blur-lg rounded-xl shadow-lg p-6 border border-radianza-gold/30">
            <div className="flex items-center space-x-2 mb-4">
              <Lock className="w-5 h-5 text-radianza-gold" />
              <h2 className="text-xl font-bold text-radianza-deep-blue">Cambia Password</h2>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-radianza-deep-blue mb-2">Password Attuale</label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-radianza-gold/30 rounded-lg focus:ring-2 focus:ring-radianza-gold outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-radianza-deep-blue mb-2">Nuova Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-radianza-gold/30 rounded-lg focus:ring-2 focus:ring-radianza-gold outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-radianza-deep-blue mb-2">Conferma Nuova Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-radianza-gold/30 rounded-lg focus:ring-2 focus:ring-radianza-gold outline-none"
                />
              </div>
              <button
                onClick={handleChangePassword}
                disabled={saving}
                className="flex items-center space-x-2 px-6 py-2 bg-radianza-deep-blue text-white rounded-lg hover:bg-radianza-deep-blue/90 transition-all disabled:opacity-50"
              >
                <Lock className="w-5 h-5" />
                <span>{saving ? 'Aggiornando...' : 'Aggiorna Password'}</span>
              </button>
            </div>
          </div>

          {/* Note Sicurezza */}
          <div className="bg-radianza-celestial/30 border border-radianza-gold/20 rounded-lg p-4">
            <p className="text-sm text-radianza-deep-blue">
              <strong>Sicurezza:</strong> Scegli una password complessa con almeno 6 caratteri. 
              Non condividere mai le tue credenziali con nessuno.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
