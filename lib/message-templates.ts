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
 * @returns Processed message with values substituted
 */
export function processTemplate(template: MessageTemplate, values: Record<string, string>): {
  subject: string
  body: string
} {
  let subject = template.subject
  let body = template.body

  // Replace all variables
  for (const [key, value] of Object.entries(values)) {
    const placeholder = `{${key}}`
    subject = subject.replace(new RegExp(placeholder, 'g'), value)
    body = body.replace(new RegExp(placeholder, 'g'), value)
  }

  return { subject, body }
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
