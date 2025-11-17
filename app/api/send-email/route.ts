import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import { createClient } from '@/lib/supabase/server'

let resendClient: Resend | null = null

function getResendClient() {
  if (!process.env.RESEND_API_KEY) {
    throw new Error('RESEND_API_KEY non configurata')
  }
  
  if (!resendClient) {
    resendClient = new Resend(process.env.RESEND_API_KEY)
  }
  
  return resendClient
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

    const resend = getResendClient()

    // Prepara il contenuto HTML
    const emailHtml = html || message.replace(/\n/g, '<br>')

    console.log('📧 Invio email a:', recipients)

    // Invia email con Resend
    const data = await resend.emails.send({
      from: 'Radianza <onboarding@resend.dev>',
      to: recipients,
      subject: subject,
      html: emailHtml
    })

    if (data.error) {
      throw new Error(data.error.message)
    }

    console.log('✅ Email inviata:', data.data?.id)

    return NextResponse.json({
      success: true,
      message: `Email inviata a ${recipients.length} destinatari`,
      recipients: recipients.length,
      messageId: data.data?.id
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
    version: '4.0.0',
    provider: 'Resend',
    configuration: {
      RESEND_API_KEY: process.env.RESEND_API_KEY ? '✅' : '❌'
    }
  })
}
