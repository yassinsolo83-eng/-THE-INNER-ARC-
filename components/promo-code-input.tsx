'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export function PromoCodeInput() {
  const router = useRouter()
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<{ message_en: string; coins_credited: number } | null>(null)

  async function handleRedeem(e: React.FormEvent) {
    e.preventDefault()
    if (!code.trim()) return
    setLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const res = await fetch('/api/promo/redeem', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: code.trim() }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to apply code')

      setSuccess(data)
      setCode('')
      router.refresh()
    } catch (err: any) {
      setError(err?.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="border border-border bg-card p-5">
      <div className="flex items-center gap-3 mb-3">
        <span className="text-xl">🎁</span>
        <p className="text-xs uppercase tracking-[0.2em] text-accent">Have a promo code?</p>
      </div>

      {success ? (
        <div className="rounded-lg bg-emerald-950/40 border border-emerald-500/20 p-4">
          <p className="text-sm text-emerald-400">{success.message_en}</p>
          {success.coins_credited > 0 && (
            <p className="mt-1 text-xs text-emerald-400/70">
              +{success.coins_credited} coins added to your balance
            </p>
          )}
        </div>
      ) : (
        <form onSubmit={handleRedeem} className="flex gap-2">
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            placeholder="Enter code"
            className="flex-1 border border-border bg-background px-4 py-2.5 text-sm uppercase text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none"
          />
          <button
            type="submit"
            disabled={loading || !code.trim()}
            className="rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-all hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-50 disabled:hover:translate-y-0"
          >
            {loading ? '...' : 'Apply'}
          </button>
        </form>
      )}

      {error && <p className="mt-2 text-xs text-red-400">{error}</p>}
    </div>
  )
}
