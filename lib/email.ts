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
 * Get email reply-to from Supabase settings
 */
async function getReplyToEmail(): Promise<string | undefined> {
  try {
    const response = await fetch('/api/email-config')
    const data = await response.json()
    return data.replyToEmail
  } catch (error) {
    console.warn('Could not get reply-to email from settings:', error)
    return undefined
  }
}

/**
 * Send email to one or more recipients
 * @param options Email options including recipients, subject, and message
 * @returns Promise with success status
 */
export async function sendEmail(options: EmailOptions): Promise<EmailResponse> {
  try {
    const recipients = Array.isArray(options.to) ? options.to : [options.to]

    // Se non è specificato il replyTo, recuperalo dalle impostazioni
    const replyTo = options.replyTo || (await getReplyToEmail())

    const body: any = {
      recipients,
      subject: options.subject,
      message: options.message,
      html: options.html
    }

    if (replyTo) {
      body.replyTo = replyTo
    }

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
