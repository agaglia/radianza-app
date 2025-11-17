import { NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

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

    // Verifica API key
    if (!process.env.RESEND_API_KEY) {
      console.error('❌ RESEND_API_KEY non configurato')
      return NextResponse.json(
        { success: false, error: 'Servizio email non configurato' },
        { status: 500 }
      )
    }

    // Prepara il contenuto HTML (usa html se fornito, altrimenti converti message)
    const emailHtml = html || message.replace(/\n/g, '<br>')

    // Email From address (di solito deve essere un dominio verified su Resend)
    const fromEmail = process.env.EMAIL_FROM || 'noreply@radianza.org'

    console.log('📧 Invio email con Resend a:', recipients, 'da:', fromEmail)

    // Invia email a tutti i destinatari
    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to: recipients,
      subject: subject,
      html: emailHtml
    })

    if (error) {
      console.error('❌ Errore Resend:', error)
      return NextResponse.json(
        { success: false, error: error.message || 'Errore nell\'invio email' },
        { status: 500 }
      )
    }

    console.log('✅ Email inviata con successo:', data)

    return NextResponse.json({
      success: true,
      message: `Email inviata con successo a ${recipients.length} destinatari`,
      recipients: recipients.length,
      data: data
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
    provider: 'Resend',
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
      RESEND_API_KEY: process.env.RESEND_API_KEY ? '✅ Configurato' : '❌ Non configurato',
      EMAIL_FROM: process.env.EMAIL_FROM || 'noreply@radianza.org'
    }
  })
}
