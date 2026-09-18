import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { sendNewsletterBroadcast } from '@/lib/email'

export async function POST(request: Request) {
  try {
    const supabase = await createServerClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })

    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
    if (profile?.role !== 'admin') return NextResponse.json({ error: 'Not admin' }, { status: 403 })

    const { subject, content } = await request.json()
    if (!subject || !content) return NextResponse.json({ error: 'Subject and content required' }, { status: 400 })

    const { data: subscribers } = await supabase.from('newsletter_subscribers').select('email')
    if (!subscribers?.length) return NextResponse.json({ error: 'No subscribers' }, { status: 400 })

    const emails = subscribers.map((s: any) => s.email)
    await sendNewsletterBroadcast(emails, subject, content)

    return NextResponse.json({ ok: true, sent: emails.length })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Failed' }, { status: 500 })
  }
}
