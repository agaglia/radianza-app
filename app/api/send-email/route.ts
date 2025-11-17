import { NextResponse } from 'next/server'
import nodemailer from 'nodemailer'
import { google } from 'googleapis'
import { createClient } from '@/lib/supabase/server'

async function getTransporter() {
  try {
    // Valida le credenziali OAuth2
    if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET || !process.env.GOOGLE_REFRESH_TOKEN) {
      throw new Error('OAuth2 non configurato: mancano GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET o GOOGLE_REFRESH_TOKEN')
    }

    if (!process.env.GMAIL_USER) {
      throw new Error('GMAIL_USER non configurato')
    }

    console.log('🔑 Configurazione OAuth2...')

    // Crea il client OAuth2
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI || 'http://localhost:3000/api/auth/callback'
    )

    // Imposta le credenziali con il refresh token
    oauth2Client.setCredentials({
      refresh_token: process.env.GOOGLE_REFRESH_TOKEN
    })

    console.log('🔄 Richiedo access token dal refresh token...')

    // Ottieni il nuovo access token
    const { credentials } = await oauth2Client.refreshAccessToken()

    if (!credentials.access_token) {
      throw new Error('Access token non ottenuto')
    }

    console.log('✅ Access token generato correttamente')
    console.log('📧 User email:', process.env.GMAIL_USER)

    // Crea il transporter con OAuth2 usando il servizio Gmail
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
    } as any)

    console.log('✅ Transporter configurato con OAuth2')
    return transporter
  } catch (err: any) {
    console.error('❌ Errore nel setup OAuth2:', err.message)
    throw err
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
    console.error('❌ Stack completo:', error.stack)
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
