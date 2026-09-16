'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

const READING_TYPES = [
  { key: 'birth_chart', name: 'Birth Chart Analysis', cost: 25, icon: '🌙', desc: 'A comprehensive natal chart covering your personality, planetary placements, and life themes.' },
  { key: 'zodiac_profile', name: 'Zodiac Profile', cost: 15, icon: '♈', desc: 'A detailed sun sign profile with personality traits, love, and career insights.' },
  { key: 'compatibility', name: 'Compatibility Report', cost: 30, icon: '💫', desc: 'Discover how your sign matches with every other sign in love and life.' },
  { key: 'yearly_forecast', name: 'Yearly Forecast', cost: 20, icon: '🔮', desc: 'A month-by-month outlook for love, career, health, and personal growth.' },
]

export function ReadingRequestForm({ coinBalance }: { coinBalance: number }) {
  const router = useRouter()
  const [selected, setSelected] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [submitted, setSubmitted] = useState(false)

  async function handleRequest() {
    if (!selected) return
    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/ai-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ report_type: selected }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to submit request')

      setSubmitted(true)
    } catch (err: any) {
      setError(err?.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const selectedType = READING_TYPES.find((t) => t.key === selected)

  if (submitted) {
    return (
      <div className="border border-border bg-card p-8 text-center">
        <span className="text-5xl">✨</span>
        <h2 className="mt-6 font-serif text-2xl text-foreground">Your reading has been requested</h2>
        <p className="mt-3 text-sm text-muted-foreground">
          One of our specialists is preparing your {selectedType?.name?.toLowerCase()}.
          This usually takes 5–10 minutes. You will find it in your dashboard once ready.
        </p>
        <button
          onClick={() => router.push('/dashboard')}
          className="mt-6 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-all hover:-translate-y-0.5 hover:shadow-lg"
        >
          Back to Dashboard
        </button>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Your balance: <span className="font-serif text-lg text-gold">{coinBalance} coins</span>
        </p>
      </div>

      <div className="grid gap-3">
        {READING_TYPES.map((type) => {
          const canAfford = coinBalance >= type.cost
          return (
            <button
              key={type.key}
              type="button"
              disabled={!canAfford}
              onClick={() => setSelected(selected === type.key ? null : type.key)}
              className={`group flex items-start gap-4 border p-5 text-left transition-all duration-300 ${
                selected === type.key
                  ? 'border-accent bg-accent/5'
                  : canAfford
                    ? 'border-border bg-card hover:border-accent/40'
                    : 'border-border bg-card opacity-50 cursor-not-allowed'
              }`}
            >
              <span className="text-3xl">{type.icon}</span>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className="font-serif text-xl text-foreground">{type.name}</p>
                  <span className="font-serif text-gold">{type.cost} coins</span>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">{type.desc}</p>
                {!canAfford && (
                  <p className="mt-1 text-xs text-red-400">Not enough coins</p>
                )}
              </div>
            </button>
          )
        })}
      </div>

      {error && <p className="mt-4 text-sm text-red-400">{error}</p>}

      {selected && (
        <button
          type="button"
          onClick={handleRequest}
          disabled={loading}
          className="mt-6 w-full rounded-full bg-primary py-3 text-sm font-medium text-primary-foreground transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/25 disabled:opacity-50"
        >
          {loading ? (
            <span className="inline-flex items-center gap-2">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
              Submitting...
            </span>
          ) : (
            `Request ${selectedType?.name} (${selectedType?.cost} coins)`
          )}
        </button>
      )}

      <p className="mt-4 text-center text-[11px] leading-5 text-muted-foreground">
        Readings are for entertainment and spiritual reflection purposes.
        They are not scientifically proven and should not replace professional advice.
      </p>
    </div>
  )
}
