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

    const { gmailUser, gmailPassword, gmailFrom } = await request.json()

    if (!gmailUser || !gmailPassword) {
      return NextResponse.json(
        { error: 'Email e password obbligatorie' },
        { status: 400 }
      )
    }

    // Salva in Supabase (tabella app_settings)
    const { error } = await supabase
      .from('app_settings')
      .upsert({
        key: 'gmail_config',
        value: {
          gmailUser,
          gmailPassword,
          gmailFrom: gmailFrom || gmailUser,
          updatedAt: new Date().toISOString()
        },
        updated_at: new Date().toISOString()
      }, { onConflict: 'key' })

    if (error) throw error

    console.log('✅ Gmail configurato in Supabase')
    return NextResponse.json({
      success: true,
      message: 'Configurazione salvata. Azioneeffetto immediato!'
    })
  } catch (error: any) {
    console.error('❌ Errore:', error)
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}
