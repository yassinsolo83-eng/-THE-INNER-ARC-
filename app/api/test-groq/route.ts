import { NextResponse } from 'next/server'

export async function GET() {
  const key = process.env.GROQ_API_KEY

  if (!key) {
    return NextResponse.json({ error: 'GROQ_API_KEY is not set' })
  }

  try {
    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${key}`,
      },
      body: JSON.stringify({
        model: 'meta-llama/llama-4-scout-17b-16e-instruct',
        max_tokens: 50,
        messages: [{ role: 'user', content: 'Say hello in one sentence.' }],
      }),
    })

    const data = await res.json()

    if (!res.ok) {
      return NextResponse.json({ error: 'Groq API error', status: res.status, details: data })
    }

    return NextResponse.json({
      success: true,
      response: data.choices?.[0]?.message?.content,
    })
  } catch (err: any) {
    return NextResponse.json({ error: 'Fetch failed', message: err?.message })
  }
}
