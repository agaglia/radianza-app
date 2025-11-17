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
 * Convert plain text email to richly formatted HTML
 */
function textToHTML(text: string, subject: string): string {
  // Escape HTML special characters
  let html = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')

  // Convert line breaks to paragraphs
  const paragraphs = html.split('\n\n').map(p => p.trim()).filter(p => p)
  const paragraphHTML = paragraphs.map(p => 
    `<p style="margin: 15px 0; font-size: 15px; line-height: 1.6;">${p.replace(/\n/g, '<br>')}</p>`
  ).join('')

  return `<!DOCTYPE html>
<html lang="it">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
  <style>
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      line-height: 1.6;
      color: #333;
      margin: 0;
      padding: 0;
      background-color: #f5f5f5;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
      padding: 40px 20px;
    }
    .header {
      text-align: center;
      margin-bottom: 30px;
      border-bottom: 3px solid #d4a574;
      padding-bottom: 20px;
    }
    .header h1 {
      color: #5a4a7d;
      margin: 0;
      font-size: 24px;
    }
    .content {
      margin: 20px 0;
    }
    .divider {
      height: 1px;
      background-color: #d4a574;
      margin: 30px 0;
    }
    .footer {
      text-align: center;
      color: #999;
      font-size: 12px;
      margin-top: 30px;
      padding-top: 20px;
      border-top: 1px solid #eee;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>✨ Radianza ✨</h1>
    </div>
    
    <div class="content">
      ${paragraphHTML}
    </div>
    
    <div class="divider"></div>
    
    <div class="footer">
      <p>Questo è un messaggio automatico da Radianza.</p>
    </div>
  </div>
</body>
</html>`
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
    // Se HTML non è già formattato (meno di 500 chars), convertilo automaticamente
    let emailHtml = html
    if (!emailHtml || emailHtml.length < 500) {
      emailHtml = textToHTML(message, subject)
    }
    const emailText = message

    console.log('📧 [SERVER] Invio email a:', recipients)
    console.log('❓ [SERVER] ReplyTo ricevuto dal client:', clientReplyTo)
    console.log('📝 [SERVER] HTML disponibile:', !!html)
    console.log('📄 [SERVER] HTML length:', emailHtml.length)

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
      html: emailHtml,
      text: emailText  // Add plain text fallback
    }

    // Aggiungi reply-to se disponibile
    if (finalReplyTo) {
      emailConfig.replyTo = finalReplyTo
      console.log('↩️  [SERVER] Reply-To configurato in Resend:', finalReplyTo)
    } else {
      console.log('⚠️  [SERVER] Nessun reply-to disponibile')
    }

    console.log('📤 [SERVER] Configurazione email finale:', JSON.stringify(emailConfig, null, 2))
    console.log('📄 [SERVER] HTML length:', emailHtml.length)
    console.log('📄 [SERVER] HTML preview (first 200 chars):', emailHtml.substring(0, 200))

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
