import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

/**
 * GET email configuration from Supabase
 * Returns replyToEmail and other email settings
 */
export async function GET() {
  try {
    const supabase = await createClient()

    const { data: emailConfig, error } = await supabase
      .from('app_settings')
      .select('value')
      .eq('key', 'email_config')
      .single()

    if (error) {
      console.warn('Email config not found:', error)
      return NextResponse.json(
        {
          replyToEmail: undefined,
          provider: 'Resend'
        },
        { status: 200 }
      )
    }

    const config = emailConfig?.value || {}

    return NextResponse.json({
      replyToEmail: config.replyToEmail,
      emailFrom: config.emailFrom,
      provider: config.provider || 'Resend'
    })
  } catch (error: any) {
    console.error('Error fetching email config:', error)
    return NextResponse.json(
      {
        replyToEmail: undefined,
        provider: 'Resend'
      },
      { status: 200 }
    )
  }
}
