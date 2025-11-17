import { NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

// Configura il transporter di Nodemailer con Gmail
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASSWORD
  }
})

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

    // Verifica credenziali Gmail
    if (!process.env.GMAIL_USER || !process.env.GMAIL_PASSWORD) {
      console.error('❌ GMAIL_USER o GMAIL_PASSWORD non configurato')
      return NextResponse.json(
        { success: false, error: 'Servizio email non configurato' },
        { status: 500 }
      )
    }

    // Prepara il contenuto HTML
    const emailHtml = html || message.replace(/\n/g, '<br>')
    const fromEmail = process.env.GMAIL_FROM || process.env.GMAIL_USER

    console.log('📧 Invio email con Gmail a:', recipients)

    // Invia email
    const info = await transporter.sendMail({
      from: fromEmail,
      to: recipients.join(', '),
      subject: subject,
      html: emailHtml,
      text: message
    })

    console.log('✅ Email inviata con successo:', info.messageId)

    return NextResponse.json({
      success: true,
      message: `Email inviata con successo a ${recipients.length} destinatari`,
      recipients: recipients.length,
      messageId: info.messageId
    })

  } catch (error: any) {
    console.error('❌ Errore invio email:', error)
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
