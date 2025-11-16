import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
  const SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!SUPABASE_URL || !SERVICE_ROLE) {
    return NextResponse.json({ ok: false, message: 'Missing SUPABASE URL or SERVICE_ROLE key in server env.' }, { status: 500 })
  }

  const url = new URL(req.url)
  const name = url.searchParams.get('name') || 'content-images'
  const base = SUPABASE_URL.replace(/\/$/, '')
  const candidates = ['/storage/v1/admin/buckets', '/storage/v1/buckets']
  const results: any[] = []

  for (const path of candidates) {
    const requestUrl = `${base}${path}`
    try {
      const res = await fetch(requestUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${SERVICE_ROLE}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, public: true })
      })

      const text = await res.text()
      let parsed: any = null
      try { parsed = JSON.parse(text) } catch (e) { parsed = text }
      results.push({ path, requestUrl, status: res.status, body: parsed })
      if (res.ok) {
        return NextResponse.json({ ok: true, tried: results }, { status: 200 })
      }
    } catch (e: any) {
      results.push({ path, requestUrl, error: e.message || String(e) })
    }
  }

  return NextResponse.json({ ok: false, tried: results }, { status: 200 })
}
