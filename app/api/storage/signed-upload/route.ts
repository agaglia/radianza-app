import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(req: Request) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json({ ok: false, message: 'Missing file' }, { status: 400 })
    }

    const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
    const SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!SUPABASE_URL || !SERVICE_ROLE) {
      return NextResponse.json({ ok: false, message: 'Missing server env' }, { status: 500 })
    }

    const supabase = createClient(SUPABASE_URL, SERVICE_ROLE, {
      auth: { persistSession: false }
    })

    // Generate unique filename
    const fileExt = file.name.split('.').pop()
    const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${fileExt}`

    // Upload file using Service Role Key (server-side)
    const buffer = await file.arrayBuffer()
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('content-images')
      .upload(fileName, buffer, {
        contentType: file.type,
        upsert: false
      })

    if (uploadError) {
      return NextResponse.json({ ok: false, message: uploadError.message }, { status: 500 })
    }

    // Generate signed download URL (valid for 1 hour)
    const { data: signedData, error: signedError } = await supabase.storage
      .from('content-images')
      .createSignedUrl(fileName, 3600)

    if (signedError) {
      return NextResponse.json({ ok: false, message: signedError.message }, { status: 500 })
    }

    return NextResponse.json({ ok: true, fileName, signedUrl: signedData.signedUrl })
  } catch (err: any) {
    return NextResponse.json({ ok: false, message: err.message || String(err) }, { status: 500 })
  }
}
