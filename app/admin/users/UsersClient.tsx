'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Plus, Shield, Trash2, Mail, Key, Edit2 } from 'lucide-react'

interface Profile {
  id: string
  email: string
  full_name: string | null
  is_admin: boolean
  created_at: string
}

export default function UsersClient({ users, currentUserId }: { users: Profile[], currentUserId: string }) {
  const [showModal, setShowModal] = useState(false)
  const [editingUser, setEditingUser] = useState<Profile | null>(null)
  const [newUser, setNewUser] = useState({
    email: '',
    password: '',
    full_name: '',
    is_admin: false
  })
  
  const router = useRouter()
  const supabase = createClient()

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: newUser.email,
        password: newUser.password,
        options: {
          data: { full_name: newUser.full_name },
          emailRedirectTo: `${window.location.origin}/dashboard`
        }
      })

      if (authError) throw authError

      if (authData.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: authData.user.id,
            email: newUser.email,
            full_name: newUser.full_name,
            is_admin: newUser.is_admin
          })

        if (profileError) throw profileError

        alert('✅ Utente creato con successo!')
        setShowModal(false)
        setNewUser({ email: '', password: '', full_name: '', is_admin: false })
        router.refresh()
      }
    } catch (error: any) {
      alert('❌ Errore: ' + error.message)
    }
  }

  const handleDelete = async (userId: string) => {
    if (userId === currentUserId) {
      alert('❌ Non puoi eliminare il tuo stesso account!')
      return
    }

    if (!confirm('Sei sicuro di voler eliminare questo utente?')) return

    try {
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', userId)

      if (error) throw error

      alert('✅ Utente eliminato')
      router.refresh()
    } catch (error: any) {
      alert('❌ Errore: ' + error.message)
    }
  }

  const startEdit = (user: Profile) => {
    setEditingUser(user)
    setNewUser({
      email: user.email,
      password: '',
      full_name: user.full_name || '',
      is_admin: user.is_admin
    })
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setEditingUser(null)
    setNewUser({ email: '', password: '', full_name: '', is_admin: false })
  }

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!editingUser) return

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: newUser.full_name,
          is_admin: newUser.is_admin
        })
        .eq('id', editingUser.id)

      if (error) throw error

      alert('✅ Utente aggiornato con successo!')
      closeModal()
      router.refresh()
    } catch (error: any) {
      alert('❌ Errore: ' + error.message)
    }
  }

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-radianza-deep-blue">Gestione Utenti</h1>
            <p className="text-radianza-deep-blue/60 mt-2">Crea e gestisci gli utenti del gruppo</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-radianza-gold to-radianza-deep-blue text-white rounded-lg hover:shadow-lg transition-all"
          >
            <Plus className="w-5 h-5" />
            <span>Nuovo Utente</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {users.map((user) => (
            <div
              key={user.id}
              className="bg-white/80 backdrop-blur-lg rounded-xl shadow-lg p-6 border border-radianza-gold/30 hover:shadow-xl transition-all"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-radianza-deep-blue mb-1">
                    {user.full_name || 'Senza nome'}
                  </h3>
                  <div className="flex items-center space-x-2 text-sm text-radianza-deep-blue/70">
                    <Mail className="w-4 h-4" />
                    <span className="truncate">{user.email}</span>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => startEdit(user)}
                    className="p-2 text-radianza-deep-blue hover:bg-radianza-gold/10 rounded-lg transition-colors"
                  >
                    <Edit2 className="w-5 h-5" />
                  </button>
                  {user.id !== currentUserId && (
                    <button
                      onClick={() => handleDelete(user.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-radianza-gold/20">
                <div className="text-xs text-radianza-deep-blue/50">
                  Creato il {new Date(user.created_at).toLocaleDateString('it-IT')}
                </div>
                {user.is_admin && (
                  <span className="inline-flex items-center px-2 py-1 bg-radianza-gold/20 text-radianza-deep-blue rounded text-xs font-medium">
                    <Shield className="w-3 h-3 mr-1" />
                    Admin
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        {users.length === 0 && (
          <div className="text-center py-12 bg-white/60 rounded-2xl">
            <p className="text-radianza-deep-blue/60">Nessun utente trovato</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8">
            <h2 className="text-2xl font-bold text-radianza-deep-blue mb-6">
              {editingUser ? 'Modifica Utente' : 'Crea Nuovo Utente'}
            </h2>
            <form onSubmit={editingUser ? handleUpdate : handleCreate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-radianza-deep-blue mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  required
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  disabled={!!editingUser}
                  className="w-full px-4 py-2 border border-radianza-gold/30 rounded-lg focus:ring-2 focus:ring-radianza-gold outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
                  placeholder="email@esempio.com"
                />
              </div>
              {!editingUser && (
                <div>
                  <label className="block text-sm font-medium text-radianza-deep-blue mb-2">
                    Password * (minimo 6 caratteri)
                  </label>
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={newUser.password}
                    onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                    className="w-full px-4 py-2 border border-radianza-gold/30 rounded-lg focus:ring-2 focus:ring-radianza-gold outline-none"
                    placeholder="••••••••"
                  />
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-radianza-deep-blue mb-2">
                  Nome Completo
                </label>
                <input
                  type="text"
                  value={newUser.full_name}
                  onChange={(e) => setNewUser({ ...newUser, full_name: e.target.value })}
                  className="w-full px-4 py-2 border border-radianza-gold/30 rounded-lg focus:ring-2 focus:ring-radianza-gold outline-none"
                  placeholder="Mario Rossi"
                />
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="is_admin"
                  checked={newUser.is_admin}
                  onChange={(e) => setNewUser({ ...newUser, is_admin: e.target.checked })}
                  className="w-4 h-4 text-radianza-gold focus:ring-radianza-gold border-radianza-gold/30 rounded"
                />
                <label htmlFor="is_admin" className="ml-2 text-sm text-radianza-deep-blue">
                  Amministratore
                </label>
              </div>
              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 px-4 py-2 border border-radianza-gold/30 text-radianza-deep-blue rounded-lg hover:bg-radianza-gold/10 transition-colors"
                >
                  Annulla
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-radianza-gold to-radianza-deep-blue text-white rounded-lg hover:shadow-lg transition-all"
                >
                  {editingUser ? 'Salva Modifiche' : 'Crea Utente'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
