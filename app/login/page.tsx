'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      router.push('/dashboard')
      router.refresh()
    } catch (error: any) {
      setError(error.message || 'Errore durante il login')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-radianza-sky-blue/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-radianza-gold/20 rounded-full blur-3xl"></div>
      </div>

      <div className="w-full max-w-md relative">
        <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl p-8 border border-radianza-gold/30">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center mb-4 px-8 py-6 bg-gradient-to-br from-radianza-deep-blue via-radianza-sky-blue to-radianza-gold rounded-2xl shadow-lg">
              <h1 className="text-5xl font-bold text-white tracking-wider">
                RADIANZA
              </h1>
            </div>
            <p className="text-radianza-deep-blue/70 mt-2">Gruppo Spirituale</p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-radianza-deep-blue mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 border border-radianza-gold/30 rounded-lg focus:ring-2 focus:ring-radianza-gold focus:border-transparent outline-none transition-all bg-white/50"
                placeholder="tua@email.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-radianza-deep-blue mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 border border-radianza-gold/30 rounded-lg focus:ring-2 focus:ring-radianza-gold focus:border-transparent outline-none transition-all bg-white/50"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-radianza-gold to-radianza-deep-blue text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02]"
            >
              {loading ? 'Accesso in corso...' : 'Accedi'}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-radianza-deep-blue/60">
            Accesso riservato ai membri del gruppo Radianza
          </div>
        </div>
      </div>
    </div>
  )
}
