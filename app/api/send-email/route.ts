import { NextResponse } from 'next/server'
import nodemailer from 'nodemailer'
import { createClient } from '@/lib/supabase/server'

// Creiamo il transporter in modo dinamico
let transporter: nodemailer.Transporter | null = null

async function getTransporter() {
  if (transporter) return transporter

  // Prova a leggere da Supabase prima
  try {
    const supabase = await createClient()
    const { data: setting } = await supabase
      .from('app_settings')
      .select('value')
      .eq('key', 'gmail_config')
      .single()

    if (setting?.value) {
      const { gmailUser, gmailPassword } = setting.value
      if (gmailUser && gmailPassword) {
        console.log('📧 Uso credenziali Gmail da Supabase')
        return nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: gmailUser,
            pass: gmailPassword
          }
        })
      }
    }
  } catch (err) {
    console.log('⚠️ Supabase non disponibile, provo .env')
  }

  // Fallback a .env
  if (process.env.GMAIL_USER && process.env.GMAIL_PASSWORD) {
    console.log('📧 Uso credenziali Gmail da .env.local')
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASSWORD
      }
    })
  }

  throw new Error('Credenziali Gmail non configurate')
}

export async function POST(request: Request) {
  try {
    const { recipients, subject, message, html } = await request.json()

    // Validazione input
    if (!recipients || !Array.isArray(recipients) || recipients.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Destinatari non validi' },
        { status: 400 }
      )
    }

    if (!subject || !message) {
      return NextResponse.json(
        { success: false, error: 'Oggetto e messaggio sono obbligatori' },
        { status: 400 }
      )
    }

    // Ottieni il transporter
    const transporter = await getTransporter()

    // Prepara il contenuto HTML
    const emailHtml = html || message.replace(/\n/g, '<br>')

    // Leggi fromEmail da Supabase o .env
    let fromEmail = process.env.GMAIL_FROM || process.env.GMAIL_USER
    try {
      const supabase = await createClient()
      const { data: setting } = await supabase
        .from('app_settings')
        .select('value')
        .eq('key', 'gmail_config')
        .single()
      if (setting?.value?.gmailFrom) {
        fromEmail = setting.value.gmailFrom
      }
    } catch (err) {
      // Usa il fallback
    }

    console.log('📧 Invio email a:', recipients)

    // Invia email
    const info = await transporter.sendMail({
      from: fromEmail,
      to: recipients.join(', '),
      subject: subject,
      html: emailHtml,
      text: message
    })

    console.log('✅ Email inviata:', info.messageId)

    return NextResponse.json({
      success: true,
      message: `Email inviata a ${recipients.length} destinatari`,
      recipients: recipients.length,
      messageId: info.messageId
    })

  } catch (error: any) {
    console.error('❌ Errore email:', error.message)
    return NextResponse.json(
      { success: false, error: error.message || 'Errore sconosciuto' },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'API Email Radianza',
    version: '2.0.0',
    provider: 'Gmail + Nodemailer',
    endpoints: {
      POST: {
        description: 'Invia email a destinatari multipli',
        body: {
          recipients: ['email1@example.com', 'email2@example.com'],
          subject: 'Oggetto email',
          message: 'Messaggio in plain text',
          html: '(opzionale) Messaggio in HTML'
        },
        required: ['recipients', 'subject', 'message']
      }
    },
    environment: {
      GMAIL_USER: process.env.GMAIL_USER ? '✅ Configurato' : '❌ Non configurato',
      GMAIL_PASSWORD: process.env.GMAIL_PASSWORD ? '✅ Configurato' : '❌ Non configurato',
      GMAIL_FROM: process.env.GMAIL_FROM || '❌ Non configurato'
    }
  })
}
