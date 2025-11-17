import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import fs from 'fs'
import path from 'path'

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        { error: 'Non autorizzato' },
        { status: 401 }
      )
    }

    // Verifica che sia admin
    const { data: profile } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', user.id)
      .single()

    if (!profile?.is_admin) {
      return NextResponse.json(
        { error: 'Solo gli admin possono modificare le impostazioni' },
        { status: 403 }
      )
    }

    const { gmailUser, gmailPassword, gmailFrom } = await request.json()

    if (!gmailUser || !gmailPassword) {
      return NextResponse.json(
        { error: 'Email e password Gmail sono obbligatori' },
        { status: 400 }
      )
    }

    // Aggiorna .env.local (in sviluppo) o prepara per deployment
    const envPath = path.join(process.cwd(), '.env.local')
    
    let envContent = ''
    try {
      envContent = fs.readFileSync(envPath, 'utf8')
    } catch {
      // File non esiste ancora
      envContent = ''
    }

    // Aggiorna le variabili
    const lines = envContent.split('\n')
    let updated = false

    const updatedLines = lines.map(line => {
      if (line.startsWith('GMAIL_USER=')) {
        updated = true
        return `GMAIL_USER=${gmailUser}`
      }
      if (line.startsWith('GMAIL_PASSWORD=')) {
        updated = true
        return `GMAIL_PASSWORD=${gmailPassword}`
      }
      if (line.startsWith('GMAIL_FROM=')) {
        updated = true
        return `GMAIL_FROM=${gmailFrom || gmailUser}`
      }
      return line
    })

    // Se le variabili non esistevano, aggiungile
    if (!updatedLines.some(line => line.startsWith('GMAIL_USER='))) {
      updatedLines.push(`GMAIL_USER=${gmailUser}`)
    }
    if (!updatedLines.some(line => line.startsWith('GMAIL_PASSWORD='))) {
      updatedLines.push(`GMAIL_PASSWORD=${gmailPassword}`)
    }
    if (!updatedLines.some(line => line.startsWith('GMAIL_FROM='))) {
      updatedLines.push(`GMAIL_FROM=${gmailFrom || gmailUser}`)
    }

    // Salva il file
    fs.writeFileSync(envPath, updatedLines.join('\n'), 'utf8')

    console.log('✅ Impostazioni Gmail salvate')

    return NextResponse.json({
      success: true,
      message: 'Impostazioni Gmail salvate. Riavvia il server per applicare i cambiamenti.'
    })
  } catch (error: any) {
    console.error('❌ Errore salvataggio impostazioni:', error)
    return NextResponse.json(
      { error: error.message || 'Errore sconosciuto' },
      { status: 500 }
    )
  }
}
