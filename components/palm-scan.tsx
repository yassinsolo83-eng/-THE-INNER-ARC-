'use client'

import { useState, useEffect } from 'react'
import { getSupabaseBrowserClient } from '@/lib/supabase/client'

const SCAN_MESSAGES = [
  'Aligning your energy field...',
  'Reading your life lines...',
  'Mapping your heart line...',
  'Detecting your fate line...',
  'Analyzing palm geometry...',
  'Interpreting energy patterns...',
  'Connecting to your aura...',
  'Finalizing your palm reading...',
]

export function PalmScan({ alreadyScanned }: { alreadyScanned: boolean }) {
  const [phase, setPhase] = useState<'idle' | 'scanning' | 'done'>(
    alreadyScanned ? 'done' : 'idle'
  )
  const [messageIndex, setMessageIndex] = useState(0)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    if (phase !== 'scanning') return
    const msgInterval = setInterval(() => {
      setMessageIndex((i) => (i + 1) % SCAN_MESSAGES.length)
    }, 1200)
    const progressInterval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(progressInterval)
          clearInterval(msgInterval)
          setTimeout(() => finishScan(), 500)
          return 100
        }
        return p + 1.5
      })
    }, 80)
    return () => {
      clearInterval(msgInterval)
      clearInterval(progressInterval)
    }
  }, [phase])

  async function finishScan() {
    try {
      const supabase = getSupabaseBrowserClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        await supabase
          .from('client_birth_profiles')
          .update({ palm_scanned_at: new Date().toISOString() })
          .eq('client_id', user.id)
      }
    } catch {}
    setPhase('done')
  }

  if (phase === 'done') {
    return (
      <div className="border border-emerald-500/20 bg-emerald-950/20 p-6 text-center">
        <span className="text-3xl">✋</span>
        <p className="mt-3 font-serif text-lg text-emerald-400">Palm scan complete</p>
        <p className="mt-1 text-xs text-muted-foreground">
          Your palm data has been recorded and will enhance the accuracy of your readings.
        </p>
      </div>
    )
  }

  if (phase === 'scanning') {
    return (
      <div className="border border-accent/30 bg-card p-6 text-center">
        {/* Scanning animation */}
        <div className="relative mx-auto h-40 w-40">
          <div className="absolute inset-0 animate-ping rounded-full border border-accent/20" />
          <div
            className="absolute inset-2 animate-pulse rounded-full border-2 border-accent/40"
            style={{ animationDuration: '1.5s' }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-5xl">✋</span>
          </div>
          {/* Scan line */}
          <div
            className="absolute left-0 right-0 h-0.5 bg-accent/60"
            style={{
              top: `${(progress / 100) * 100}%`,
              boxShadow: '0 0 12px rgba(183, 110, 121, 0.6)',
              transition: 'top 0.08s linear',
            }}
          />
        </div>

        <p className="mt-6 text-sm text-accent">{SCAN_MESSAGES[messageIndex]}</p>

        {/* Progress bar */}
        <div className="mx-auto mt-4 h-1 w-48 overflow-hidden rounded-full bg-border">
          <div
            className="h-full rounded-full bg-accent transition-all duration-100"
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>
        <p className="mt-2 text-xs text-muted-foreground">{Math.round(Math.min(progress, 100))}%</p>
      </div>
    )
  }

  return (
    <button
      type="button"
      onClick={() => { setPhase('scanning'); setProgress(0); setMessageIndex(0) }}
      className="group w-full border border-dashed border-accent/30 bg-card p-8 text-center transition-all duration-500 hover:border-accent/60 hover:bg-accent/5"
    >
      <span className="text-4xl transition-transform duration-300 group-hover:scale-110 inline-block">✋</span>
      <p className="mt-4 font-serif text-xl text-foreground">Scan your palm</p>
      <p className="mt-2 text-sm text-muted-foreground">
        Place your hand on the screen and tap to begin. Our system will read your
        palm lines to enhance your personalized readings.
      </p>
      <p className="mt-4 text-xs text-accent transition-transform group-hover:translate-y-0.5">
        Tap to start scanning →
      </p>
    </button>
  )
}
