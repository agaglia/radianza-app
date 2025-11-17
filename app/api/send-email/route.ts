import { NextResponse } from 'next/server'
import nodemailer from 'nodemailer'
import { google } from 'googleapis'
import { createClient } from '@/lib/supabase/server'

// Variabili globali per OAuth2
let oauth2Client: any = null

async function getOAuth2Client() {
  if (oauth2Client) return oauth2Client

  const oauth2 = google.auth.OAuth2

  oauth2Client = new oauth2({
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    redirectUri: process.env.GOOGLE_REDIRECT_URI || 'http://localhost:3000/api/auth/callback'
  })

  // Imposta il refresh token (se disponibile)
  oauth2Client.setCredentials({
    refresh_token: process.env.GOOGLE_REFRESH_TOKEN
  })

  return oauth2Client
}

async function getTransporter() {
  try {
    // Usa sempre OAuth2
    if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET || !process.env.GOOGLE_REFRESH_TOKEN) {
      throw new Error('OAuth2 non configurato: GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REFRESH_TOKEN sono obbligatori')
    }

    const oauth2Client = await getOAuth2Client()
    
    // Ottieni l'access token
    const { credentials } = await oauth2Client.refreshAccessToken()
    
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: process.env.GMAIL_USER,
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
        accessToken: credentials.access_token,
        expires: credentials.expiry_date
      }
    })

    console.log('📧 Uso OAuth2 di Google per:', process.env.GMAIL_USER)
    return transporter
  } catch (err: any) {
    console.error('❌ Errore OAuth2:', err.message)
    throw new Error(`Errore configurazione Gmail OAuth2: ${err.message}`)
  }
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
      from: {
        name: 'Radianza',
        address: process.env.GMAIL_USER || 'centri.isocu.test@gmail.com'
      },
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
    version: '3.0.0',
    provider: 'Gmail + OAuth2',
    configuration: {
      GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID ? '✅' : '❌',
      GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET ? '✅' : '❌',
      GOOGLE_REFRESH_TOKEN: process.env.GOOGLE_REFRESH_TOKEN ? '✅' : '❌',
      GMAIL_USER: process.env.GMAIL_USER ? '✅' : '❌',
      GMAIL_FROM: process.env.GMAIL_FROM ? '✅' : '❌'
    }
  })
}
