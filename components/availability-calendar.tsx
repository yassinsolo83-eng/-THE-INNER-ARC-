'use client'

import { useState, useMemo } from 'react'
import type { AvailableSlot } from '@/lib/partners'

function formatTime(utcString: string) {
  return new Date(utcString).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  })
}

function formatDate(date: Date) {
  return date.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' })
}

export function AvailabilityCalendar({
  slots,
  selectedSlotId,
  onSelectSlot,
}: {
  slots: AvailableSlot[]
  selectedSlotId: string | null
  onSelectSlot: (slot: AvailableSlot) => void
}) {
  // Group slots by day (in user's local timezone)
  const grouped = useMemo(() => {
    const days = new Map<string, AvailableSlot[]>()
    for (const slot of slots) {
      const d = new Date(slot.start_at_utc)
      const key = d.toLocaleDateString()
      if (!days.has(key)) days.set(key, [])
      days.get(key)!.push(slot)
    }
    return Array.from(days.entries()).map(([dateKey, daySlots]) => ({
      dateKey,
      date: new Date(daySlots[0].start_at_utc),
      slots: daySlots.sort(
        (a, b) => new Date(a.start_at_utc).getTime() - new Date(b.start_at_utc).getTime()
      ),
    }))
  }, [slots])

  const [activeDay, setActiveDay] = useState(grouped[0]?.dateKey ?? '')

  if (slots.length === 0) {
    return (
      <div className="border border-dashed border-border py-10 text-center">
        <p className="text-sm text-muted-foreground">
          No available times in the next 7 days for this service.
        </p>
      </div>
    )
  }

  const activeDaySlots = grouped.find((g) => g.dateKey === activeDay)?.slots ?? []

  return (
    <div>
      {/* Day tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {grouped.map((g) => (
          <button
            key={g.dateKey}
            type="button"
            onClick={() => setActiveDay(g.dateKey)}
            className={`flex-shrink-0 rounded-lg border px-4 py-2.5 text-xs transition-all duration-200 ${
              activeDay === g.dateKey
                ? 'border-accent bg-accent/10 text-accent'
                : 'border-border text-muted-foreground hover:border-accent/40 hover:text-foreground'
            }`}
          >
            {formatDate(g.date)}
            <span className="ml-1.5 text-[10px] opacity-60">({g.slots.length})</span>
          </button>
        ))}
      </div>

      {/* Time slots grid */}
      <div className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-4">
        {activeDaySlots.map((slot) => (
          <button
            key={slot.id}
            type="button"
            onClick={() => onSelectSlot(slot)}
            className={`rounded-lg border px-3 py-2.5 text-sm transition-all duration-200 ${
              selectedSlotId === slot.id
                ? 'border-accent bg-accent text-background shadow-md shadow-accent/20'
                : 'border-border text-foreground hover:border-accent/50 hover:bg-accent/5'
            }`}
          >
            {formatTime(slot.start_at_utc)}
          </button>
        ))}
      </div>
    </div>
  )
}
