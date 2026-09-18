import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { sendReadingReadyEmail } from '@/lib/email'

export async function POST(request: Request) {
  try {
    const supabase = await createServerClient()
    const { data: { user } } = await supabase.auth.getUser()

    // Verify admin
    if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
    if (profile?.role !== 'admin') return NextResponse.json({ error: 'Not admin' }, { status: 403 })

    const { reportId, clientId, readingType } = await request.json()

    // Get client info
    const { data: client } = await supabase.from('profiles').select('first_name, full_name').eq('id', clientId).single()
    const { data: authUser } = await supabase.from('profiles').select('id').eq('id', clientId).single()

    // Get client email from auth.users via a workaround (query the client's email)
    // We need service role for this
    const { createServiceClient } = await import('@/lib/supabase/server')
    const admin = createServiceClient()
    const { data: userData } = await admin.auth.admin.getUserById(clientId)

    if (!userData?.user?.email) {
      return NextResponse.json({ error: 'Client email not found' }, { status: 400 })
    }

    const name = client?.first_name || client?.full_name?.split(' ')[0] || 'there'
    await sendReadingReadyEmail(userData.user.email, name, readingType, reportId)

    return NextResponse.json({ ok: true })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Failed' }, { status: 500 })
  }
}
