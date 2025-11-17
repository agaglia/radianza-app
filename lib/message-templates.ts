/**
 * Message templates for common communications
 */

export interface MessageTemplate {
  id: string
  name: string
  title: string
  description: string
  subject: string
  body: string
  htmlBody?: string // HTML formatted version
  variables: string[] // e.g., ['{meetLink1}', '{meetLink2}', '{organizerName}']
}

export const MESSAGE_TEMPLATES: MessageTemplate[] = [
  {
    id: 'incontro-meet',
    name: 'Incontro con Link Meet',
    title: '📹 Incontro Radianza',
    description: 'Template per inviare un incontro con link Google Meet (modificabile)',
    subject: '📹 Incontro Radianza - Link di accesso',
    body: `Caro partecipante,

Ti comunichiamo che l'incontro di Radianza è programmato come segue:

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📅 DATA E ORA
{eventDateTime}

👨‍🏫 CONDUTTORE/A
{organizerName}

📚 ARGOMENTO
{topic}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔗 LINK PER L'ACCESSO
{meetLink1}

✅ NON è necessaria alcuna registrazione preventiva.
Puoi accedere direttamente dal link cliccando sopra.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Per eventuali problemi o domande:
📧 {replyToEmail}

A presto sull'incontro!

Radianza`,
    htmlBody: `<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <style>
      body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
      .container { max-width: 600px; margin: 0 auto; padding: 20px; }
      .header { text-align: center; color: #5a4a7d; margin-bottom: 30px; }
      .section { background-color: #f8f6fc; border-left: 4px solid #d4a574; padding: 20px; margin: 20px 0; border-radius: 4px; }
      .section-title { font-size: 14px; font-weight: bold; color: #5a4a7d; margin-bottom: 10px; text-transform: uppercase; letter-spacing: 1px; }
      .section-content { font-size: 16px; color: #333; }
      .divider { height: 2px; background: linear-gradient(to right, #d4a574, transparent); margin: 30px 0; }
      .link-button { display: inline-block; background-color: #d4a574; color: white; padding: 15px 30px; text-decoration: none; border-radius: 4px; margin: 20px 0; font-weight: bold; text-align: center; }
      .footer { color: #999; font-size: 12px; text-align: center; margin-top: 30px; border-top: 1px solid #eee; padding-top: 20px; }
      .emoji { margin-right: 8px; }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>📹 Incontro Radianza</h1>
      </div>

      <p>Caro partecipante,</p>
      <p>Ti comunichiamo che l'incontro di Radianza è programmato come segue:</p>

      <div class="section">
        <div class="section-title"><span class="emoji">📅</span>DATA E ORA</div>
        <div class="section-content">{eventDateTime}</div>
      </div>

      <div class="section">
        <div class="section-title"><span class="emoji">👨‍🏫</span>CONDUTTORE/A</div>
        <div class="section-content">{organizerName}</div>
      </div>

      <div class="section">
        <div class="section-title"><span class="emoji">📚</span>ARGOMENTO</div>
        <div class="section-content">{topic}</div>
      </div>

      <div class="divider"></div>

      <div style="text-align: center;">
        <div style="font-size: 14px; font-weight: bold; color: #5a4a7d; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 15px;">🔗 LINK PER L'ACCESSO</div>
        <a href="{meetLink1}" class="link-button">Accedi all'incontro</a>
      </div>

      <div class="section">
        <div style="margin: 0;">
          <strong>✅ NON è necessaria alcuna registrazione preventiva.</strong><br>
          Puoi accedere direttamente dal link cliccando sopra.
        </div>
      </div>

      <div class="divider"></div>

      <p style="font-size: 14px; color: #666;">
        Per eventuali problemi o domande:<br>
        📧 <a href="mailto:{replyToEmail}">{replyToEmail}</a>
      </p>

      <p style="font-size: 16px; font-weight: bold; color: #5a4a7d; text-align: center; margin-top: 30px;">
        A presto sull'incontro!<br>
        <span style="font-size: 18px;">✨ Radianza ✨</span>
      </p>

      <div class="footer">
        <p>Questo è un messaggio automatico da Radianza. Per eventuali domande, contattaci rispondendo a questa email.</p>
      </div>
    </div>
  </body>
</html>`,
    variables: ['{eventDateTime}', '{organizerName}', '{topic}', '{meetLink1}', '{replyToEmail}']
  },

  {
    id: 'annuncio-generale',
    name: 'Annuncio Generale',
    title: '📢 Annuncio',
    description: 'Template generico per annunci ai partecipanti',
    subject: '📢 Annuncio da Radianza',
    body: `Caro partecipante,

{message}

Per eventuali domande:
📧 {replyToEmail}

Cordiali saluti,
Radianza`,
    variables: ['{message}', '{replyToEmail}']
  }
]

/**
 * Replace template variables with actual values
 * @param template The message template
 * @param values Object with key-value pairs for replacement
 * @returns Processed message with values substituted (including HTML if available)
 */
export function processTemplate(template: MessageTemplate, values: Record<string, string>): {
  subject: string
  body: string
  html?: string
} {
  let subject = template.subject
  let body = template.body
  let html = template.htmlBody

  // Replace all variables
  for (const [key, value] of Object.entries(values)) {
    const placeholder = `{${key}}`
    subject = subject.replace(new RegExp(placeholder, 'g'), value)
    body = body.replace(new RegExp(placeholder, 'g'), value)
    if (html) {
      html = html.replace(new RegExp(placeholder, 'g'), value)
    }
  }

  return { subject, body, html }
}

/**
 * Get template by ID
 */
export function getTemplate(id: string): MessageTemplate | undefined {
  return MESSAGE_TEMPLATES.find(t => t.id === id)
}

/**
 * Get all available templates
 */
export function getAllTemplates(): MessageTemplate[] {
  return MESSAGE_TEMPLATES
}
