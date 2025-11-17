import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 })
    }

    // Verifica admin
    const { data: profile } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', user.id)
      .single()

    if (!profile?.is_admin) {
      return NextResponse.json({ error: 'Solo admin' }, { status: 403 })
    }

    const { gmailUser, gmailFrom } = await request.json()

    if (!gmailUser) {
      return NextResponse.json(
        { error: 'Email Gmail obbligatoria' },
        { status: 400 }
      )
    }

    // Salva SOLO in Supabase (tabella app_settings)
    // OAuth2 non richiede password - usa il refresh token da .env
    const { error } = await supabase
      .from('app_settings')
      .upsert(
        {
          key: 'gmail_config',
          value: {
            gmailUser,
            gmailFrom: gmailFrom || gmailUser,
            authMethod: 'OAuth2',
            updatedAt: new Date().toISOString()
          },
          updated_at: new Date().toISOString()
        },
        { onConflict: 'key' }
      )

    if (error) throw error

    console.log('✅ Gmail configurato in Supabase')
    return NextResponse.json({
      success: true,
      message: 'Configurazione salvata con successo!'
    })
  } catch (error: any) {
    console.error('❌ Errore:', error)
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}
