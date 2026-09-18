import { NextResponse } from 'next/server'
import { sendContactConfirmation } from '@/lib/email'

export async function POST(request: Request) {
  try {
    const { name, email } = await request.json()
    if (!name || !email) return NextResponse.json({ error: 'Missing data' }, { status: 400 })
    await sendContactConfirmation(email, name)
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}
