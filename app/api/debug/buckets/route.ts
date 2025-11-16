import { NextResponse } from 'next/server'

export async function GET() {
  const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
  const SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!SUPABASE_URL || !SERVICE_ROLE) {
    return NextResponse.json({ ok: false, message: 'Missing SUPABASE URL or SERVICE_ROLE key in server env.' }, { status: 500 })
  }

  try {
    const res = await fetch(`${SUPABASE_URL.replace(/\/$/, '')}/storage/v1/admin/buckets`, {
      headers: {
        'Authorization': `Bearer ${SERVICE_ROLE}`,
        'Content-Type': 'application/json'
      }
    })

    const data = await res.json()
    return NextResponse.json({ ok: true, buckets: data }, { status: res.status })
  } catch (err: any) {
    return NextResponse.json({ ok: false, message: err.message || String(err) }, { status: 500 })
  }
}
