/**
 * Generate a valid Google Meet link format
 * Google Meet links use the format: https://meet.google.com/XXX-XXXX-XXX
 * Where X is lowercase letter or digit (without vowels to avoid words)
 */
export function generateMeetLink(): string {
  const chars = 'bcdfghjkmnpqrstvwxyz0123456789'
  let code = ''
  
  // Generate three parts: XXX-XXXX-XXX
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < (i === 1 ? 4 : 3); j++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    if (i < 2) code += '-'
  }
  
  return `https://meet.google.com/${code}`
}

/**
 * Extract code from full Meet URL
 */
export function extractMeetCode(url: string): string {
  const match = url.match(/meet\.google\.com\/([a-z0-9\-]+)/)
  return match ? match[1] : ''
}
