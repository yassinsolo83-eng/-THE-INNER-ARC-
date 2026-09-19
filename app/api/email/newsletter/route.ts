import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { sendNewsletterWelcome } from '@/lib/email'

export async function POST(request: Request) {
  try {
    const { email } = await request.json()
    if (!email) return NextResponse.json({ error: 'Missing email' }, { status: 400 })

    // Save to Supabase using service client (bypasses RLS)
    const admin = createServiceClient()
    await admin
      .from('newsletter_subscribers')
      .upsert({ email }, { onConflict: 'email' })

    // Send welcome email
    await sendNewsletterWelcome(email)

    return NextResponse.json({ ok: true })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Failed' }, { status: 500 })
  }
}
