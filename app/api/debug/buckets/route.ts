import { NextResponse } from 'next/server'

export async function GET() {
  const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
  const SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!SUPABASE_URL || !SERVICE_ROLE) {
    return NextResponse.json({ ok: false, message: 'Missing SUPABASE URL or SERVICE_ROLE key in server env.' }, { status: 500 })
  }

  try {
    const requestUrl = `${SUPABASE_URL.replace(/\/$/, '')}/storage/v1/admin/buckets`
    const res = await fetch(requestUrl, {
      headers: {
        'Authorization': `Bearer ${SERVICE_ROLE}`,
        'Content-Type': 'application/json'
      }
    })

    const text = await res.text()
    let parsed: any = null
    try {
      parsed = JSON.parse(text)
    } catch (e) {
      parsed = text
    }

    if (!res.ok) {
      return NextResponse.json({ ok: false, requestUrl, status: res.status, body: parsed }, { status: 200 })
    }

    return NextResponse.json({ ok: true, requestUrl, status: res.status, buckets: parsed }, { status: 200 })
  } catch (err: any) {
    return NextResponse.json({ ok: false, message: err.message || String(err) }, { status: 500 })
  }
}
