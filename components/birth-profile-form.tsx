'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { getSupabaseBrowserClient } from '@/lib/supabase/client'

const ZODIAC_SIGNS = [
  'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
  'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces',
]

function getZodiacFromDate(date: string): string {
  const d = new Date(date)
  const month = d.getMonth() + 1
  const day = d.getDate()
  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return 'Aries'
  if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return 'Taurus'
  if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return 'Gemini'
  if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return 'Cancer'
  if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return 'Leo'
  if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return 'Virgo'
  if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return 'Libra'
  if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return 'Scorpio'
  if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return 'Sagittarius'
  if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return 'Capricorn'
  if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return 'Aquarius'
  return 'Pisces'
}

type BirthData = {
  birth_date: string
  birth_time: string
  birth_city: string
  birth_country: string
  zodiac_sign: string
}

export function BirthProfileForm({ existing }: { existing?: BirthData | null }) {
  const router = useRouter()
  const [form, setForm] = useState<BirthData>({
    birth_date: existing?.birth_date || '',
    birth_time: existing?.birth_time || '',
    birth_city: existing?.birth_city || '',
    birth_country: existing?.birth_country || '',
    zodiac_sign: existing?.zodiac_sign || '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  function handleDateChange(date: string) {
    const zodiac = date ? getZodiacFromDate(date) : ''
    setForm((f) => ({ ...f, birth_date: date, zodiac_sign: zodiac }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(false)

    try {
      const supabase = getSupabaseBrowserClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not logged in')

      const payload = {
        client_id: user.id,
        birth_date: form.birth_date,
        birth_time: form.birth_time || null,
        birth_city: form.birth_city,
        birth_country: form.birth_country,
        zodiac_sign: form.zodiac_sign,
      }

      const { error: dbError } = await supabase
        .from('client_birth_profiles')
        .upsert(payload, { onConflict: 'client_id' })

      if (dbError) throw dbError
      setSuccess(true)
      router.refresh()
    } catch (err: any) {
      setError(err?.message || 'Failed to save')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label className="block text-xs uppercase tracking-[0.2em] text-accent">
            Birth date *
          </label>
          <input
            type="date"
            required
            value={form.birth_date}
            onChange={(e) => handleDateChange(e.target.value)}
            className="mt-2 w-full border border-border bg-background px-4 py-3 text-sm text-foreground focus:border-accent focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs uppercase tracking-[0.2em] text-accent">
            Birth time <span className="normal-case text-muted-foreground">(if known)</span>
          </label>
          <input
            type="time"
            value={form.birth_time}
            onChange={(e) => setForm((f) => ({ ...f, birth_time: e.target.value }))}
            className="mt-2 w-full border border-border bg-background px-4 py-3 text-sm text-foreground focus:border-accent focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs uppercase tracking-[0.2em] text-accent">
            Birth city *
          </label>
          <input
            type="text"
            required
            value={form.birth_city}
            onChange={(e) => setForm((f) => ({ ...f, birth_city: e.target.value }))}
            placeholder="e.g. Cairo"
            className="mt-2 w-full border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs uppercase tracking-[0.2em] text-accent">
            Birth country *
          </label>
          <input
            type="text"
            required
            value={form.birth_country}
            onChange={(e) => setForm((f) => ({ ...f, birth_country: e.target.value }))}
            placeholder="e.g. Egypt"
            className="mt-2 w-full border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none"
          />
        </div>
      </div>

      {form.zodiac_sign && (
        <div className="flex items-center gap-3 border border-border bg-card p-4">
          <span className="text-2xl">♈</span>
          <div>
            <p className="text-xs text-muted-foreground">Your sun sign</p>
            <p className="font-serif text-xl text-gold">{form.zodiac_sign}</p>
          </div>
        </div>
      )}

      {error && <p className="text-sm text-red-400">{error}</p>}
      {success && <p className="text-sm text-emerald-400">Birth profile saved successfully.</p>}

      <button
        type="submit"
        disabled={loading}
        className="rounded-full bg-primary px-8 py-3 text-sm font-medium text-primary-foreground transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/25 disabled:opacity-50"
      >
        {loading ? 'Saving...' : existing ? 'Update profile' : 'Save profile'}
      </button>
    </form>
  )
}
