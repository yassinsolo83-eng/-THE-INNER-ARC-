import { NextResponse } from 'next/server'
import { createServerClient, createServiceClient } from '@/lib/supabase/server'

const COIN_COST: Record<string, number> = {
  birth_chart: 25,
  zodiac_profile: 15,
  compatibility: 30,
  yearly_forecast: 20,
}

function buildPrompt(reportType: string, birthData: any): string {
  const base = `You are a professional astrologer generating a detailed, personalized reading.
The client's birth details:
- Date of birth: ${birthData.birth_date}
- Time of birth: ${birthData.birth_time || 'Unknown'}
- Place of birth: ${birthData.birth_city}, ${birthData.birth_country}
- Sun sign: ${birthData.zodiac_sign || 'Not provided'}

Important: This is for entertainment and spiritual reflection purposes. Do not make medical, legal, or financial predictions. Be warm, insightful, and encouraging.
Write in both English and Arabic (Arabic section after English, clearly separated).`

  switch (reportType) {
    case 'birth_chart':
      return `${base}\n\nGenerate a comprehensive natal birth chart analysis. Cover:\n1. Sun sign personality traits\n2. Moon sign (estimate from date if time unknown)\n3. Rising sign (if birth time provided)\n4. Key planetary placements and their meanings\n5. Life themes and patterns\n6. Strengths and growth areas\n7. Career and relationship tendencies\n\nMake it personal, detailed (at least 800 words per language), and insightful.`
    case 'zodiac_profile':
      return `${base}\n\nGenerate a detailed zodiac sun sign profile. Cover personality traits, strengths, weaknesses, love compatibility, career tendencies, and this year's outlook. At least 500 words per language.`
    case 'compatibility':
      return `${base}\n\nGenerate a zodiac compatibility report for this person. Discuss their best and most challenging matches across all signs, with specific advice for each pairing. At least 600 words per language.`
    case 'yearly_forecast':
      return `${base}\n\nGenerate a detailed yearly forecast for the current year. Cover love, career, health, finances, and personal growth month by month. At least 800 words per language.`
    default:
      return `${base}\n\nGenerate a general astrological reading based on the provided birth details. Be detailed and personal.`
  }
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

    // Use service client for DB mutations (bypasses RLS)
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

    // Create the report row (pending)
    const { data: report, error: reportError } = await admin
      .from('ai_reports')
      .insert({
        client_id: user.id,
        report_type,
        input_data: birth,
        coins_charged: coinCost,
        generation_status: 'generating',
      })
      .select('id')
      .single()

    if (reportError || !report) {
      return NextResponse.json({ error: 'Failed to create report' }, { status: 500 })
    }

    // Charge coins via the function
    const { error: coinError } = await admin.rpc('spend_coins', {
      _client_id: user.id,
      _amount: coinCost,
      _booking_id: null,
      _desc: `AI ${report_type.replace(/_/g, ' ')} report`,
    })

    if (coinError) {
      // Rollback report
      await admin.from('ai_reports').update({ generation_status: 'failed', error_message: 'Coin deduction failed' }).eq('id', report.id)
      return NextResponse.json({ error: 'Failed to charge coins' }, { status: 400 })
    }

    // Call Claude API to generate the report
    try {
      const aiResponse = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': process.env.ANTHROPIC_API_KEY || '',
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-6',
          max_tokens: 4000,
          messages: [
            { role: 'user', content: buildPrompt(report_type, birth) },
          ],
        }),
      })

      const aiData = await aiResponse.json()
      const content = aiData.content
        ?.map((block: any) => (block.type === 'text' ? block.text : ''))
        .filter(Boolean)
        .join('\n') || ''

      if (!content) throw new Error('Empty AI response')

      // Split English and Arabic sections
      const arabicSplit = content.indexOf('---')
      const contentEn = arabicSplit > 0 ? content.substring(0, arabicSplit).trim() : content
      const contentAr = arabicSplit > 0 ? content.substring(arabicSplit + 3).trim() : ''

      await admin.from('ai_reports').update({
        content_en: contentEn,
        content_ar: contentAr || null,
        model_used: 'claude-sonnet-4-6',
        generation_status: 'completed',
        generated_at: new Date().toISOString(),
      }).eq('id', report.id)

      return NextResponse.json({
        id: report.id,
        status: 'completed',
        content_en: contentEn,
        content_ar: contentAr,
      })
    } catch (aiError: any) {
      await admin.from('ai_reports').update({
        generation_status: 'failed',
        error_message: aiError?.message || 'AI generation failed',
      }).eq('id', report.id)

      // Refund coins on AI failure
      await admin.rpc('refund_coins', {
        _client_id: user.id,
        _amount: coinCost,
        _booking_id: null,
      })

      return NextResponse.json(
        { error: 'Report generation failed. Your coins have been refunded.' },
        { status: 500 }
      )
    }
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Server error' }, { status: 500 })
  }
}
