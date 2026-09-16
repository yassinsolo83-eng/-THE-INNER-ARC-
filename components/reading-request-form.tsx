'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

const READING_TYPES = [
  { key: 'birth_chart', name: 'Birth Chart Analysis', cost: 25, icon: '🌙', desc: 'A comprehensive natal chart covering your personality, planetary placements, and life themes.' },
  { key: 'zodiac_profile', name: 'Zodiac Profile', cost: 15, icon: '♈', desc: 'A detailed sun sign profile with personality traits, love, and career insights.' },
  { key: 'compatibility', name: 'Compatibility Report', cost: 30, icon: '💫', desc: 'Discover how your sign matches with another person in love and life.' },
  { key: 'yearly_forecast', name: 'Yearly Forecast', cost: 20, icon: '🔮', desc: 'A month-by-month outlook for love, career, health, and personal growth.' },
]

const GENDER_OPTIONS = [
  { value: 'female', label: 'Female' },
  { value: 'male', label: 'Male' },
  { value: 'other', label: 'Prefer not to say' },
]

export function ReadingRequestForm({ coinBalance }: { coinBalance: number }) {
  const router = useRouter()
  const [selected, setSelected] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [submitted, setSubmitted] = useState(false)

  // Extra fields
  const [question, setQuestion] = useState('')
  const [gender, setGender] = useState('')

  // Compatibility fields
  const [partnerName, setPartnerName] = useState('')
  const [partnerBirthDate, setPartnerBirthDate] = useState('')
  const [partnerSign, setPartnerSign] = useState('')

  const isCompatibility = selected === 'compatibility'

  async function handleRequest() {
    if (!selected) return
    if (!question.trim()) { setError('Please describe what you would like to know'); return }
    if (!gender) { setError('Please select your gender'); return }
    if (isCompatibility && !partnerBirthDate) { setError('Please enter the other person\'s birth date'); return }

    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/ai-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          report_type: selected,
          question,
          gender,
          partner: isCompatibility ? {
            name: partnerName,
            birth_date: partnerBirthDate,
            sign: partnerSign,
          } : undefined,
        }),
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

      {/* Reading type selection */}
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

      {/* Extra fields — show after selecting a type */}
      {selected && (
        <div className="mt-6 space-y-5 border border-border bg-card p-6">
          {/* Gender */}
          <div>
            <label className="block text-xs uppercase tracking-[0.2em] text-accent">Your gender *</label>
            <div className="mt-2 flex gap-3">
              {GENDER_OPTIONS.map((g) => (
                <button
                  key={g.value}
                  type="button"
                  onClick={() => setGender(g.value)}
                  className={`rounded-full border px-4 py-2 text-sm transition-all ${
                    gender === g.value
                      ? 'border-accent bg-accent/10 text-accent'
                      : 'border-border text-muted-foreground hover:border-accent/40'
                  }`}
                >
                  {g.label}
                </button>
              ))}
            </div>
          </div>

          {/* Question */}
          <div>
            <label className="block text-xs uppercase tracking-[0.2em] text-accent">
              What would you like to know? *
            </label>
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              rows={3}
              placeholder="e.g. I want to understand my career path better, or I'm curious about my love life..."
              className="mt-2 w-full resize-none border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none"
            />
          </div>

          {/* Compatibility — partner details */}
          {isCompatibility && (
            <div className="space-y-4 border-t border-border pt-5">
              <p className="text-xs uppercase tracking-[0.2em] text-accent">The other person</p>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs text-muted-foreground">Their name (optional)</label>
                  <input
                    type="text"
                    value={partnerName}
                    onChange={(e) => setPartnerName(e.target.value)}
                    placeholder="e.g. Sarah"
                    className="mt-1 w-full border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs text-muted-foreground">Their birth date *</label>
                  <input
                    type="date"
                    required
                    value={partnerBirthDate}
                    onChange={(e) => setPartnerBirthDate(e.target.value)}
                    className="mt-1 w-full border border-border bg-background px-4 py-2.5 text-sm text-foreground focus:border-accent focus:outline-none"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs text-muted-foreground">Their zodiac sign (if known)</label>
                  <input
                    type="text"
                    value={partnerSign}
                    onChange={(e) => setPartnerSign(e.target.value)}
                    placeholder="e.g. Leo"
                    className="mt-1 w-full border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      )}

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
