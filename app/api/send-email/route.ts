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

/**
 * Get reply-to email from Supabase settings
 */
async function getReplyToFromSettings(): Promise<string | undefined> {
  try {
    console.log('🔍 [SERVER] Recuperando reply-to da Supabase...')
    const supabase = await createClient()

    const { data: emailConfig, error } = await supabase
      .from('app_settings')
      .select('value')
      .eq('key', 'email_config')
      .single()

    if (error) {
      console.warn('⚠️  [SERVER] Email config non trovato:', error)
      return undefined
    }

    const replyTo = emailConfig?.value?.replyToEmail
    console.log('✅ [SERVER] Reply-To da Supabase:', replyTo)
    return replyTo
  } catch (error: any) {
    console.error('❌ [SERVER] Errore nel recupero reply-to:', error)
    return undefined
  }
}

export async function POST(request: Request) {
  try {
    const { recipients, subject, message, html, replyTo: clientReplyTo } = await request.json()

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

    console.log('📧 [SERVER] Invio email a:', recipients)
    console.log('❓ [SERVER] ReplyTo ricevuto dal client:', clientReplyTo)

    // Se il client non passa il replyTo, recuperalo da Supabase
    let finalReplyTo = clientReplyTo
    if (!finalReplyTo) {
      finalReplyTo = await getReplyToFromSettings()
    }

    // Invia email con Resend
    const emailConfig: any = {
      from: 'Radianza <onboarding@resend.dev>',
      to: recipients,
      subject: subject,
      html: emailHtml
    }

    // Aggiungi reply-to se disponibile
    if (finalReplyTo) {
      emailConfig.replyTo = finalReplyTo
      console.log('↩️  [SERVER] Reply-To configurato in Resend:', finalReplyTo)
    } else {
      console.log('⚠️  [SERVER] Nessun reply-to disponibile')
    }

    console.log('📤 [SERVER] Configurazione email finale:', JSON.stringify(emailConfig, null, 2))

    const data = await resend.emails.send(emailConfig)

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
