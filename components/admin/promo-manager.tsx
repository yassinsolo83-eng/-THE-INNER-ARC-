'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { getSupabaseBrowserClient } from '@/lib/supabase/client'

const PROMO_TYPES = [
  { key: 'free_coins', label: 'Free Coins', desc: 'Give X coins for free' },
  { key: 'free_reading', label: 'Free Reading', desc: 'Next reading is free (coins refunded)' },
  { key: 'percentage_off', label: 'Percentage Off', desc: 'X% discount on next booking' },
  { key: 'bonus_coins', label: 'Bonus Coins', desc: 'Extra coins on next purchase' },
]

export function PromoManager({ initialPromos }: { initialPromos: any[] }) {
  const router = useRouter()
  const [showCreate, setShowCreate] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Create form state
  const [code, setCode] = useState('')
  const [type, setType] = useState('free_coins')
  const [value, setValue] = useState('')
  const [maxRedemptions, setMaxRedemptions] = useState('')
  const [validUntil, setValidUntil] = useState('')
  const [descEn, setDescEn] = useState('')
  const [descAr, setDescAr] = useState('')

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const supabase = getSupabaseBrowserClient()
      const { data: { user } } = await supabase.auth.getUser()

      const { error: dbError } = await supabase.from('promo_codes').insert({
        code: code.toUpperCase().trim(),
        type,
        value: parseFloat(value),
        max_redemptions: maxRedemptions ? parseInt(maxRedemptions) : null,
        valid_until: validUntil || null,
        description_en: descEn || null,
        description_ar: descAr || null,
        created_by: user?.id,
      })

      if (dbError) throw dbError

      // Reset form
      setCode('')
      setValue('')
      setMaxRedemptions('')
      setValidUntil('')
      setDescEn('')
      setDescAr('')
      setShowCreate(false)
      router.refresh()
    } catch (err: any) {
      setError(err?.message || 'Failed to create promo code')
    } finally {
      setLoading(false)
    }
  }

  async function toggleActive(promoId: string, currentActive: boolean) {
    const supabase = getSupabaseBrowserClient()
    await supabase
      .from('promo_codes')
      .update({ is_active: !currentActive })
      .eq('id', promoId)
    router.refresh()
  }

  return (
    <div>
      {/* Create button */}
      <button
        type="button"
        onClick={() => setShowCreate(!showCreate)}
        className="rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/25"
      >
        {showCreate ? 'Cancel' : '+ New Promo Code'}
      </button>

      {/* Create form */}
      {showCreate && (
        <form onSubmit={handleCreate} className="mt-6 border border-border bg-card p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs uppercase tracking-[0.2em] text-accent">Code *</label>
              <input
                type="text"
                required
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="e.g. WELCOME50"
                className="mt-2 w-full border border-border bg-background px-4 py-3 text-sm uppercase text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-[0.2em] text-accent">Type *</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="mt-2 w-full border border-border bg-background px-4 py-3 text-sm text-foreground focus:border-accent focus:outline-none"
              >
                {PROMO_TYPES.map((t) => (
                  <option key={t.key} value={t.key}>{t.label} — {t.desc}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-[0.2em] text-accent">
                Value * <span className="normal-case text-muted-foreground">
                  ({type === 'percentage_off' ? '%' : 'coins'})
                </span>
              </label>
              <input
                type="number"
                required
                min="1"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder={type === 'percentage_off' ? 'e.g. 20' : 'e.g. 50'}
                className="mt-2 w-full border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-[0.2em] text-accent">
                Max uses <span className="normal-case text-muted-foreground">(empty = unlimited)</span>
              </label>
              <input
                type="number"
                min="1"
                value={maxRedemptions}
                onChange={(e) => setMaxRedemptions(e.target.value)}
                placeholder="Unlimited"
                className="mt-2 w-full border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-[0.2em] text-accent">
                Expires <span className="normal-case text-muted-foreground">(empty = never)</span>
              </label>
              <input
                type="datetime-local"
                value={validUntil}
                onChange={(e) => setValidUntil(e.target.value)}
                className="mt-2 w-full border border-border bg-background px-4 py-3 text-sm text-foreground focus:border-accent focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-[0.2em] text-accent">Description (EN)</label>
              <input
                type="text"
                value={descEn}
                onChange={(e) => setDescEn(e.target.value)}
                placeholder="Welcome! 50 free coins on us."
                className="mt-2 w-full border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs uppercase tracking-[0.2em] text-accent">Description (AR)</label>
              <input
                type="text"
                dir="rtl"
                value={descAr}
                onChange={(e) => setDescAr(e.target.value)}
                placeholder="Arabic description…"
                className="mt-2 w-full border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none"
              />
            </div>
          </div>

          {error && <p className="mt-4 text-sm text-red-400">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="mt-6 rounded-full bg-primary px-8 py-3 text-sm font-medium text-primary-foreground transition-all hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Create Promo Code'}
          </button>
        </form>
      )}

      {/* Promos list */}
      <div className="mt-8 divide-y divide-border border border-border">
        {initialPromos.length === 0 ? (
          <p className="p-6 text-center text-sm text-muted-foreground">No promo codes yet.</p>
        ) : (
          initialPromos.map((promo: any) => (
            <div key={promo.id} className="flex items-center justify-between p-5">
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-lg font-bold text-foreground">{promo.code}</span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] uppercase ${
                      promo.is_active
                        ? 'bg-emerald-950/60 text-emerald-400'
                        : 'bg-red-950/60 text-red-400'
                    }`}
                  >
                    {promo.is_active ? 'Active' : 'Inactive'}
                  </span>
                  <span className="rounded-full border border-border px-2 py-0.5 text-[10px] text-muted-foreground">
                    {promo.type.replace(/_/g, ' ')}
                  </span>
                </div>
                <div className="mt-1 flex items-center gap-4 text-xs text-muted-foreground">
                  <span>
                    Value: <span className="text-gold">{promo.value} {promo.type === 'percentage_off' ? '%' : 'coins'}</span>
                  </span>
                  <span>
                    Used: {promo.times_redeemed}{promo.max_redemptions ? ` / ${promo.max_redemptions}` : ''}
                  </span>
                  {promo.valid_until && (
                    <span>Expires: {new Date(promo.valid_until).toLocaleDateString()}</span>
                  )}
                </div>
                {promo.description_en && (
                  <p className="mt-1 text-xs text-muted-foreground">{promo.description_en}</p>
                )}
              </div>
              <button
                type="button"
                onClick={() => toggleActive(promo.id, promo.is_active)}
                className={`rounded-full border px-4 py-2 text-xs transition-all ${
                  promo.is_active
                    ? 'border-red-400/30 text-red-400 hover:bg-red-400/10'
                    : 'border-emerald-400/30 text-emerald-400 hover:bg-emerald-400/10'
                }`}
              >
                {promo.is_active ? 'Deactivate' : 'Activate'}
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
