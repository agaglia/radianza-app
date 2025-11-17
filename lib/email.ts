/**
 * Email utility functions for sending emails via Resend API
 */

export interface EmailOptions {
  to: string | string[]
  subject: string
  message: string
  html?: string
  replyTo?: string
}

export interface EmailResponse {
  success: boolean
  message?: string
  error?: string
  recipients?: number
}

/**
 * Send email to one or more recipients
 * @param options Email options including recipients, subject, and message
 * @returns Promise with success status
 */
export async function sendEmail(options: EmailOptions): Promise<EmailResponse> {
  try {
    const recipients = Array.isArray(options.to) ? options.to : [options.to]

    console.log('📨 [CLIENT] Preparazione email:', { recipients, subject: options.subject })

    const body: any = {
      recipients,
      subject: options.subject,
      message: options.message,
      html: options.html
    }

    // Se il client passa un replyTo specifico, usalo
    // Altrimenti il server lo recupererà da Supabase
    if (options.replyTo) {
      body.replyTo = options.replyTo
      console.log('✅ [CLIENT] ReplyTo passato al server:', options.replyTo)
    } else {
      console.log('ℹ️  [CLIENT] Nessun replyTo specificato - il server lo recupererà da Supabase')
    }

    console.log('📤 [CLIENT] Body inviato all\'API:', JSON.stringify(body, null, 2))

    const response = await fetch('/api/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    })

    const data = await response.json()

    if (!response.ok) {
      return {
        success: false,
        error: data.error || 'Errore nell\'invio email'
      }
    }

    return {
      success: true,
      message: data.message,
      recipients: data.recipients
    }
  } catch (error: any) {
    console.error('Email send error:', error)
    return {
      success: false,
      error: error.message || 'Errore sconosciuto'
    }
  }
}

/**
 * Send welcome email to new users
 */
export async function sendWelcomeEmail(email: string, name?: string): Promise<EmailResponse> {
  const userName = name || email.split('@')[0]
  
  return sendEmail({
    to: email,
    subject: 'Benvenuto in Radianza! 🌟',
    message: `Ciao ${userName}!\n\nBenvenuto nella comunità Radianza. Il tuo account è stato creato con successo.\n\nPuoi accedere al tuo account e iniziare a esplorare i contenuti disponibili.`,
    html: `
      <h2>Benvenuto in Radianza! 🌟</h2>
      <p>Ciao <strong>${userName}</strong>!</p>
      <p>Benvenuto nella comunità Radianza. Il tuo account è stato creato con successo.</p>
      <p>Puoi accedere al tuo account e iniziare a esplorare i contenuti disponibili.</p>
    `
  })
}

/**
 * Send notification email
 */
export async function sendNotificationEmail(
  email: string,
  title: string,
  message: string
): Promise<EmailResponse> {
  return sendEmail({
    to: email,
    subject: `Notifica: ${title}`,
    message: message,
    html: `
      <h3>${title}</h3>
      <p>${message.replace(/\n/g, '<br>')}</p>
    `
  })
}

/**
 * Send announcement to multiple recipients
 */
export async function sendAnnouncement(
  recipients: string[],
  title: string,
  content: string
): Promise<EmailResponse> {
  return sendEmail({
    to: recipients,
    subject: `📢 ${title}`,
    message: content,
    html: `
      <h2>📢 ${title}</h2>
      <div>${content.replace(/\n/g, '<br>')}</div>
    `
  })
}
