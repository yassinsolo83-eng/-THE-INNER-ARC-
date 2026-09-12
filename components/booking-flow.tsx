'use client'

import { useState, useEffect } from 'react'
import type { ServiceOffering, AvailableSlot } from '@/lib/partners'
import { getSupabaseBrowserClient } from '@/lib/supabase/client'
import { AvailabilityCalendar } from './availability-calendar'

type Step = 'service' | 'time' | 'confirm'

function StepIndicator({ current, steps }: { current: Step; steps: Step[] }) {
  return (
    <div className="flex items-center gap-2">
      {steps.map((s, i) => (
        <div key={s} className="flex items-center gap-2">
          <span
            className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-medium transition-colors ${
              s === current
                ? 'bg-accent text-background'
                : steps.indexOf(current) > i
                  ? 'bg-accent/20 text-accent'
                  : 'bg-muted text-muted-foreground'
            }`}
          >
            {steps.indexOf(current) > i ? '✓' : i + 1}
          </span>
          {i < steps.length - 1 && (
            <div
              className={`h-px w-8 transition-colors ${
                steps.indexOf(current) > i ? 'bg-accent/40' : 'bg-border'
              }`}
            />
          )}
        </div>
      ))}
    </div>
  )
}

export function BookingFlow({
  readerSlug,
  readerName,
  offerings,
}: {
  readerSlug: string
  readerName: string
  offerings: ServiceOffering[]
}) {
  const [step, setStep] = useState<Step>('service')
  const [selected, setSelected] = useState<ServiceOffering | null>(null)
  const [slots, setSlots] = useState<AvailableSlot[]>([])
  const [loadingSlots, setLoadingSlots] = useState(false)
  const [selectedSlot, setSelectedSlot] = useState<AvailableSlot | null>(null)
  const [focusQuestion, setFocusQuestion] = useState('')

  const steps: Step[] = ['service', 'time', 'confirm']

  // Fetch slots when service is selected
  useEffect(() => {
    if (!selected) return
    const serviceTypeId = selected.service_type_id
    let cancelled = false
    setLoadingSlots(true)
    setSlots([])
    setSelectedSlot(null)

    async function fetchSlots() {
      try {
        const supabase = getSupabaseBrowserClient()

        // Get reader ID from slug
        const { data: reader } = await supabase
          .from('reader_public_profiles')
          .select('id')
          .eq('slug', readerSlug)
          .single() as { data: { id: string } | null; error: unknown }

        if (!reader || cancelled) return

        const now = new Date().toISOString()
        const sevenDays = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()

        const { data } = await supabase
          .from('availability_slots')
          .select('id, start_at_utc, end_at_utc, service_type_id')
          .eq('reader_id', reader.id)
          .eq('service_type_id', serviceTypeId)
          .eq('status', 'open')
          .gte('start_at_utc', now)
          .lte('start_at_utc', sevenDays)
          .order('start_at_utc', { ascending: true })

        if (!cancelled) setSlots((data as AvailableSlot[]) || [])
      } catch {
        // Supabase not available — empty slots
      } finally {
        if (!cancelled) setLoadingSlots(false)
      }
    }
    fetchSlots()
    return () => { cancelled = true }
  }, [selected, readerSlug])

  function handleSelectService(offering: ServiceOffering) {
    setSelected(offering)
    setStep('time')
  }

  function handleSelectSlot(slot: AvailableSlot) {
    setSelectedSlot(slot)
  }

  function handleConfirmTime() {
    if (selectedSlot) setStep('confirm')
  }

  function handleBack() {
    if (step === 'time') { setStep('service'); setSelectedSlot(null) }
    if (step === 'confirm') setStep('time')
  }

  return (
    <div>
      <div className="mb-8">
        <StepIndicator current={step} steps={steps} />
      </div>

      {/* ── Step 1: Choose service ── */}
      {step === 'service' && (
        <div>
          <h2 className="font-serif text-2xl text-foreground">Choose your reading</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Select the type of session you&apos;d like with {readerName}.
          </p>
          <div className="mt-6 grid gap-3">
            {offerings.map((o) => (
              <button
                key={o.offering_id}
                type="button"
                onClick={() => handleSelectService(o)}
                className="group flex items-center justify-between border border-border bg-card p-5 text-left transition-all duration-300 hover:border-accent/40 hover:bg-accent/5"
              >
                <div>
                  <p className="font-serif text-xl text-foreground">{o.name_en}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {o.duration_minutes} minutes · {o.category_name_en}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-serif text-xl text-gold">
                    {o.price_egp.toLocaleString()} EGP
                  </p>
                  <span className="text-xs text-accent opacity-0 transition-opacity group-hover:opacity-100">
                    Select →
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── Step 2: Choose time ── */}
      {step === 'time' && selected && (
        <div>
          <button
            type="button"
            onClick={handleBack}
            className="mb-4 text-sm text-accent transition-colors hover:text-foreground"
          >
            ← Change reading type
          </button>
          <h2 className="font-serif text-2xl text-foreground">Pick a time</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            {selected.name_en} · {selected.duration_minutes} min ·{' '}
            {selected.price_egp.toLocaleString()} EGP
          </p>

          <div className="mt-6">
            {loadingSlots ? (
              <div className="flex items-center justify-center py-12">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-accent border-t-transparent" />
                <span className="ml-3 text-sm text-muted-foreground">Loading available times…</span>
              </div>
            ) : (
              <AvailabilityCalendar
                slots={slots}
                selectedSlotId={selectedSlot?.id ?? null}
                onSelectSlot={handleSelectSlot}
              />
            )}
          </div>

          {selectedSlot && (
            <button
              type="button"
              onClick={handleConfirmTime}
              className="mt-6 w-full rounded-full bg-primary py-3 text-sm font-medium text-primary-foreground transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/25"
            >
              Continue
            </button>
          )}
        </div>
      )}

      {/* ── Step 3: Confirm ── */}
      {step === 'confirm' && selected && selectedSlot && (
        <div>
          <button
            type="button"
            onClick={handleBack}
            className="mb-4 text-sm text-accent transition-colors hover:text-foreground"
          >
            ← Change time
          </button>
          <h2 className="font-serif text-2xl text-foreground">Confirm your booking</h2>

          <div className="mt-6 divide-y divide-border border border-border bg-card">
            <div className="flex items-center justify-between p-5">
              <span className="text-sm text-muted-foreground">Reader</span>
              <span className="text-sm text-foreground">{readerName}</span>
            </div>
            <div className="flex items-center justify-between p-5">
              <span className="text-sm text-muted-foreground">Reading</span>
              <span className="text-sm text-foreground">{selected.name_en}</span>
            </div>
            <div className="flex items-center justify-between p-5">
              <span className="text-sm text-muted-foreground">Duration</span>
              <span className="text-sm text-foreground">{selected.duration_minutes} min</span>
            </div>
            <div className="flex items-center justify-between p-5">
              <span className="text-sm text-muted-foreground">Date</span>
              <span className="text-sm text-foreground">
                {new Date(selectedSlot.start_at_utc).toLocaleDateString([], {
                  weekday: 'long',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
            </div>
            <div className="flex items-center justify-between p-5">
              <span className="text-sm text-muted-foreground">Time</span>
              <span className="text-sm text-foreground">
                {new Date(selectedSlot.start_at_utc).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            </div>
            <div className="flex items-center justify-between p-5">
              <span className="text-sm text-muted-foreground">Total</span>
              <span className="font-serif text-xl text-gold">
                {selected.price_egp.toLocaleString()} EGP
              </span>
            </div>
          </div>

          {/* Focus question (optional) */}
          <div className="mt-6">
            <label
              htmlFor="focus-question"
              className="block text-xs uppercase tracking-[0.2em] text-accent"
            >
              Focus question (optional)
            </label>
            <textarea
              id="focus-question"
              value={focusQuestion}
              onChange={(e) => setFocusQuestion(e.target.value)}
              placeholder="Is there something specific you'd like to explore?"
              rows={3}
              className="mt-2 w-full resize-none border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none"
            />
          </div>

          {/* Disclaimer */}
          <p className="mt-4 text-[11px] leading-5 text-muted-foreground">
            By proceeding you agree that this is an entertainment / spiritual service —
            not medical, legal, or financial advice. Readings are not scientifically proven
            and should not be used as a substitute for professional guidance.
          </p>

          {/* Payment button — disabled until Paymob is integrated */}
          <button
            type="button"
            disabled
            className="mt-6 w-full rounded-full bg-primary/50 py-3 text-sm font-medium text-primary-foreground/60 cursor-not-allowed"
            title="Payment integration coming soon"
          >
            Proceed to payment — coming soon
          </button>

          <p className="mt-3 text-center text-xs text-muted-foreground">
            100% prepaid · Secure payment via Paymob
          </p>
        </div>
      )}
    </div>
  )
}
