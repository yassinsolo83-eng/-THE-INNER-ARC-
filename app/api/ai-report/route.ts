import { NextResponse } from 'next/server'
import { createServerClient, createServiceClient } from '@/lib/supabase/server'

const COIN_COST: Record<string, number> = {
  birth_chart: 25,
  zodiac_profile: 15,
  compatibility: 30,
  yearly_forecast: 20,
}

export async function POST(request: Request) {
  try {
    const supabase = await createServerClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const body = await request.json()
    const { report_type } = body

    if (!report_type || !COIN_COST[report_type]) {
      return NextResponse.json({ error: 'Invalid report type' }, { status: 400 })
    }

    const coinCost = COIN_COST[report_type]
    const admin = createServiceClient()

    // Get birth profile
    const { data: birth, error: birthError } = await admin
      .from('client_birth_profiles')
      .select('*')
      .eq('client_id', user.id)
      .single()

    if (birthError || !birth) {
      return NextResponse.json(
        { error: 'Please add your birth details first' },
        { status: 400 }
      )
    }

    // Check coin balance
    const { data: wallet } = await admin
      .from('coin_wallets')
      .select('balance')
      .eq('client_id', user.id)
      .single()

    if (!wallet || wallet.balance < coinCost) {
      return NextResponse.json(
        { error: `Insufficient coins. This report costs ${coinCost} coins.` },
        { status: 400 }
      )
    }

    // Create the report row as pending (waiting for admin to write it)
    const { data: report, error: reportError } = await admin
      .from('ai_reports')
      .insert({
        client_id: user.id,
        report_type,
        input_data: birth,
        coins_charged: coinCost,
        generation_status: 'pending',
      })
      .select('id')
      .single()

    if (reportError || !report) {
      return NextResponse.json({ error: 'Failed to create request' }, { status: 500 })
    }

    // Charge coins
    const { error: coinError } = await admin.rpc('spend_coins', {
      _client_id: user.id,
      _amount: coinCost,
      _booking_id: null,
      _desc: `${report_type.replace(/_/g, ' ')} reading`,
    })

    if (coinError) {
      await admin.from('ai_reports').update({ generation_status: 'failed', error_message: 'Coin deduction failed' }).eq('id', report.id)
      return NextResponse.json({ error: 'Failed to charge coins' }, { status: 400 })
    }

    return NextResponse.json({
      id: report.id,
      status: 'pending',
      message: 'Your reading request has been submitted. One of our specialists will prepare it shortly.',
    })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Server error' }, { status: 500 })
  }
}
