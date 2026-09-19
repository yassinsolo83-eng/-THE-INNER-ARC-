'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getSupabaseBrowserClient } from '@/lib/supabase/client'

/* ─── helpers ─── */
function getZodiacFromDate(date: string) {
  const d = new Date(date)
  const m = d.getMonth() + 1, day = d.getDate()
  if ((m===3&&day>=21)||(m===4&&day<=19)) return {sign:'Aries',symbol:'♈',element:'Fire'}
  if ((m===4&&day>=20)||(m===5&&day<=20)) return {sign:'Taurus',symbol:'♉',element:'Earth'}
  if ((m===5&&day>=21)||(m===6&&day<=20)) return {sign:'Gemini',symbol:'♊',element:'Air'}
  if ((m===6&&day>=21)||(m===7&&day<=22)) return {sign:'Cancer',symbol:'♋',element:'Water'}
  if ((m===7&&day>=23)||(m===8&&day<=22)) return {sign:'Leo',symbol:'♌',element:'Fire'}
  if ((m===8&&day>=23)||(m===9&&day<=22)) return {sign:'Virgo',symbol:'♍',element:'Earth'}
  if ((m===9&&day>=23)||(m===10&&day<=22)) return {sign:'Libra',symbol:'♎',element:'Air'}
  if ((m===10&&day>=23)||(m===11&&day<=21)) return {sign:'Scorpio',symbol:'♏',element:'Water'}
  if ((m===11&&day>=22)||(m===12&&day<=21)) return {sign:'Sagittarius',symbol:'♐',element:'Fire'}
  if ((m===12&&day>=22)||(m===1&&day<=19)) return {sign:'Capricorn',symbol:'♑',element:'Earth'}
  if ((m===1&&day>=20)||(m===2&&day<=18)) return {sign:'Aquarius',symbol:'♒',element:'Air'}
  return {sign:'Pisces',symbol:'♓',element:'Water'}
}

const SCAN_MSGS = [
  'Aligning your energy field...',
  'Reading your life lines...',
  'Mapping your heart line...',
  'Detecting your fate line...',
  'Analyzing palm geometry...',
  'Connecting to your aura...',
]

/* ─── main ─── */
const TOTAL_STEPS = 9

export function QuizFlow({ userId, existing }: { userId: string; existing: any }) {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [dir, setDir] = useState(1) // 1=forward, -1=back
  const [animating, setAnimating] = useState(false)

  // Data
  const [gender, setGender] = useState(existing?.gender || '')
  const [birthDate, setBirthDate] = useState(existing?.birth_date || '')
  const [birthTime, setBirthTime] = useState(existing?.birth_time || '')
  const [birthCity, setBirthCity] = useState(existing?.birth_city || '')
  const [birthCountry, setBirthCountry] = useState(existing?.birth_country || '')
  const [relationship, setRelationship] = useState(existing?.relationship_status || '')
  const [focus, setFocus] = useState('')
  const [color, setColor] = useState(existing?.favorite_color || '')

  // Palm scan
  const [scanning, setScanning] = useState(false)
  const [scanProgress, setScanProgress] = useState(0)
  const [scanMsg, setScanMsg] = useState(0)
  const [scanDone, setScanDone] = useState(!!existing?.palm_scanned_at)

  // Saving
  const [saving, setSaving] = useState(false)

  const zodiac = birthDate ? getZodiacFromDate(birthDate) : null
  const progress = Math.round((step / (TOTAL_STEPS - 1)) * 100)

  function goNext() {
    if (animating) return
    setDir(1)
    setAnimating(true)
    setTimeout(() => { setStep((s) => s + 1); setAnimating(false) }, 300)
  }

  function goBack() {
    if (animating || step === 0) return
    setDir(-1)
    setAnimating(true)
    setTimeout(() => { setStep((s) => s - 1); setAnimating(false) }, 300)
  }

  // Palm scan effect
  useEffect(() => {
    if (!scanning) return
    const msgInt = setInterval(() => setScanMsg((i) => (i + 1) % SCAN_MSGS.length), 1200)
    const progInt = setInterval(() => {
      setScanProgress((p) => {
        if (p >= 100) {
          clearInterval(progInt)
          clearInterval(msgInt)
          setTimeout(() => { setScanning(false); setScanDone(true) }, 500)
          return 100
        }
        return p + 1.5
      })
    }, 80)
    return () => { clearInterval(msgInt); clearInterval(progInt) }
  }, [scanning])

  // Save all data
  async function handleFinish() {
    setSaving(true)
    try {
      const supabase = getSupabaseBrowserClient()
      await supabase.from('client_birth_profiles').upsert({
        client_id: userId,
        birth_date: birthDate,
        birth_time: birthTime || null,
        birth_city: birthCity,
        birth_country: birthCountry,
        zodiac_sign: zodiac?.sign || '',
        gender: gender || null,
        favorite_color: color || null,
        relationship_status: relationship || null,
        palm_scanned_at: scanDone ? new Date().toISOString() : null,
      }, { onConflict: 'client_id' })

      localStorage.setItem('quiz-completed', '1')
      router.push('/dashboard')
    } catch {
      alert('Failed to save. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  /* ─── render ─── */
  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      {/* Stars background */}
      <div className="pointer-events-none absolute inset-0 z-0">
        {Array.from({ length: 40 }).map((_, i) => (
          <div
            key={i}
            className="absolute h-0.5 w-0.5 rounded-full bg-accent/30"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animation: 'pulse 3s infinite',
            }}
          />
        ))}
      </div>

      {/* Progress bar */}
      <div className="fixed left-0 right-0 top-0 z-50 h-1 bg-border">
        <div
          className="h-full bg-accent transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Back button */}
      {step > 0 && step < TOTAL_STEPS - 1 && (
        <button
          onClick={goBack}
          className="fixed left-6 top-6 z-50 text-sm text-muted-foreground transition-colors hover:text-accent"
        >
          ← Back
        </button>
      )}

      {/* Step counter */}
      <div className="fixed right-6 top-6 z-50 text-xs text-muted-foreground">
        {step + 1} / {TOTAL_STEPS}
      </div>

      {/* Content */}
      <div className="relative z-10 flex min-h-screen items-center justify-center px-6">
        <div
          key={step}
          className="w-full max-w-lg quiz-step-enter"
        >
          {/* Step 0: Welcome */}
          {step === 0 && (
            <StepCard>
              <p className="text-xs uppercase tracking-[0.3em] text-accent">The Inner Arc</p>
              <h1 className="mt-6 font-serif text-4xl text-foreground leading-tight">
                Let the stars reveal<br />what you already know
              </h1>
              <p className="mt-4 text-muted-foreground">
                Answer a few questions and we will prepare a personalized reading based on your birth chart.
              </p>
              <button onClick={goNext} className="btn-primary mt-8">
                Begin your journey →
              </button>
            </StepCard>
          )}

          {/* Step 1: Gender */}
          {step === 1 && (
            <StepCard>
              <StepQuestion emoji="👤" text="How do you identify?" />
              <div className="mt-8 grid gap-3">
                {[
                  { v: 'female', label: 'Female', icon: '♀' },
                  { v: 'male', label: 'Male', icon: '♂' },
                  { v: 'other', label: 'Prefer not to say', icon: '⚪' },
                ].map((o) => (
                  <OptionButton
                    key={o.v}
                    selected={gender === o.v}
                    onClick={() => { setGender(o.v); setTimeout(goNext, 300) }}
                  >
                    <span className="text-lg">{o.icon}</span> {o.label}
                  </OptionButton>
                ))}
              </div>
            </StepCard>
          )}

          {/* Step 2: Birth date */}
          {step === 2 && (
            <StepCard>
              <StepQuestion emoji="🎂" text="When were you born?" />
              <input
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                className="input-field mt-8"
              />
              {birthDate && (
                <button onClick={goNext} className="btn-primary mt-6">Continue</button>
              )}
            </StepCard>
          )}

          {/* Step 3: Birth time */}
          {step === 3 && (
            <StepCard>
              <StepQuestion emoji="⏰" text="Do you know your birth time?" />
              <p className="mt-2 text-sm text-muted-foreground">This helps us create a more accurate chart</p>
              <input
                type="time"
                value={birthTime}
                onChange={(e) => setBirthTime(e.target.value)}
                className="input-field mt-8"
              />
              <div className="mt-6 flex gap-3">
                <button onClick={goNext} className="btn-primary flex-1">
                  {birthTime ? 'Continue' : 'Skip for now'}
                </button>
              </div>
            </StepCard>
          )}

          {/* Step 4: Birth place */}
          {step === 4 && (
            <StepCard>
              <StepQuestion emoji="📍" text="Where were you born?" />
              <div className="mt-8 space-y-4">
                <input
                  type="text"
                  value={birthCity}
                  onChange={(e) => setBirthCity(e.target.value)}
                  placeholder="City"
                  className="input-field"
                />
                <input
                  type="text"
                  value={birthCountry}
                  onChange={(e) => setBirthCountry(e.target.value)}
                  placeholder="Country"
                  className="input-field"
                />
              </div>
              {birthCity && birthCountry && (
                <button onClick={goNext} className="btn-primary mt-6">Continue</button>
              )}
            </StepCard>
          )}

          {/* Step 5: Relationship */}
          {step === 5 && (
            <StepCard>
              <StepQuestion emoji="💕" text="What is your relationship status?" />
              <div className="mt-8 grid gap-3">
                {[
                  { v: 'single', label: 'Single' },
                  { v: 'in_relationship', label: 'In a relationship' },
                  { v: 'married', label: 'Married' },
                  { v: 'complicated', label: "It's complicated" },
                ].map((o) => (
                  <OptionButton
                    key={o.v}
                    selected={relationship === o.v}
                    onClick={() => { setRelationship(o.v); setTimeout(goNext, 300) }}
                  >
                    {o.label}
                  </OptionButton>
                ))}
              </div>
            </StepCard>
          )}

          {/* Step 6: Focus */}
          {step === 6 && (
            <StepCard>
              <StepQuestion emoji="🎯" text="What do you want to explore?" />
              <div className="mt-8 grid grid-cols-2 gap-3">
                {[
                  { v: 'love', label: 'Love & Relationships', icon: '❤️' },
                  { v: 'career', label: 'Career & Money', icon: '💼' },
                  { v: 'health', label: 'Health & Wellness', icon: '🌿' },
                  { v: 'future', label: 'Future & Destiny', icon: '🔮' },
                ].map((o) => (
                  <OptionButton
                    key={o.v}
                    selected={focus === o.v}
                    onClick={() => { setFocus(o.v); setTimeout(goNext, 300) }}
                    className="flex-col py-6"
                  >
                    <span className="text-2xl">{o.icon}</span>
                    <span className="mt-2 text-xs">{o.label}</span>
                  </OptionButton>
                ))}
              </div>
            </StepCard>
          )}

          {/* Step 7: Color */}
          {step === 7 && (
            <StepCard>
              <StepQuestion emoji="🎨" text="Pick the color that speaks to you" />
              <p className="mt-2 text-sm text-muted-foreground">Colors carry energy. Yours will influence your reading.</p>
              <div className="mt-8 flex flex-wrap justify-center gap-4">
                {[
                  { v: 'red', c: '#DC2626' },
                  { v: 'blue', c: '#2563EB' },
                  { v: 'green', c: '#16A34A' },
                  { v: 'purple', c: '#9333EA' },
                  { v: 'gold', c: '#C9A24B' },
                  { v: 'pink', c: '#EC4899' },
                  { v: 'white', c: '#F5F1EB' },
                  { v: 'black', c: '#1a1a2e' },
                ].map((o) => (
                  <button
                    key={o.v}
                    type="button"
                    onClick={() => { setColor(o.v); setTimeout(goNext, 400) }}
                    className={`h-14 w-14 rounded-full border-2 transition-all duration-300 hover:scale-110 ${
                      color === o.v
                        ? 'border-accent scale-110 shadow-lg'
                        : 'border-transparent'
                    }`}
                    style={{ backgroundColor: o.c, boxShadow: color === o.v ? `0 0 20px ${o.c}40` : 'none' }}
                  />
                ))}
              </div>
            </StepCard>
          )}

          {/* Step 8: Palm Scan */}
          {step === 8 && (
            <StepCard>
              {scanDone ? (
                <div className="text-center">
                  <span className="text-5xl">✋</span>
                  <h2 className="mt-6 font-serif text-2xl text-emerald-400">Palm scan complete</h2>
                  <p className="mt-3 text-sm text-muted-foreground">
                    Your palm data has been recorded and will enhance your readings.
                  </p>
                  <button onClick={handleFinish} disabled={saving} className="btn-primary mt-8">
                    {saving ? 'Preparing your profile...' : 'See my results ✨'}
                  </button>
                </div>
              ) : scanning ? (
                <div className="text-center">
                  <div className="relative mx-auto h-44 w-44">
                    <div className="absolute inset-0 animate-ping rounded-full border border-accent/20" />
                    <div className="absolute inset-2 animate-pulse rounded-full border-2 border-accent/40" style={{ animationDuration: '1.5s' }} />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-6xl">✋</span>
                    </div>
                    <div
                      className="absolute left-0 right-0 h-0.5 bg-accent/60"
                      style={{
                        top: `${(scanProgress / 100) * 100}%`,
                        boxShadow: '0 0 12px rgba(183, 110, 121, 0.6)',
                        transition: 'top 0.08s linear',
                      }}
                    />
                  </div>
                  <p className="mt-6 text-sm text-accent">{SCAN_MSGS[scanMsg]}</p>
                  <div className="mx-auto mt-4 h-1 w-48 overflow-hidden rounded-full bg-border">
                    <div className="h-full rounded-full bg-accent transition-all duration-100" style={{ width: `${Math.min(scanProgress, 100)}%` }} />
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">{Math.round(Math.min(scanProgress, 100))}%</p>
                </div>
              ) : (
                <div className="text-center">
                  <StepQuestion emoji="✋" text="Place your hand on the screen" />
                  <p className="mt-2 text-sm text-muted-foreground">
                    Our system will read your palm lines to enhance your personalized readings.
                  </p>
                  <button
                    onClick={() => { setScanning(true); setScanProgress(0); setScanMsg(0) }}
                    className="btn-primary mt-8"
                  >
                    Start palm scan
                  </button>
                  <button
                    onClick={handleFinish}
                    disabled={saving}
                    className="mt-4 block w-full text-center text-xs text-muted-foreground hover:text-accent"
                  >
                    Skip and see results
                  </button>
                </div>
              )}
            </StepCard>
          )}
        </div>
      </div>

      {/* Inline styles for quiz */}
      <style jsx global>{`
        .btn-primary {
          display: inline-block;
          width: 100%;
          text-align: center;
          border-radius: 9999px;
          background: linear-gradient(135deg, #B76E79 0%, #C9A24B 100%);
          color: #0F1229;
          padding: 16px 28px;
          font-size: 15px;
          font-weight: 600;
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          cursor: pointer;
          border: none;
          letter-spacing: 0.02em;
        }
        .btn-primary:hover { transform: translateY(-3px); box-shadow: 0 12px 32px rgba(183,110,121,0.4); }
        .btn-primary:active { transform: translateY(-1px); }
        .btn-primary:disabled { opacity: 0.5; transform: none; box-shadow: none; }
        .input-field {
          width: 100%;
          border: 1px solid rgba(255,255,255,0.08);
          background: rgba(255,255,255,0.03);
          padding: 16px 18px;
          font-size: 16px;
          color: #F5F1EB;
          outline: none;
          transition: all 0.3s ease;
          border-radius: 0;
          backdrop-filter: blur(4px);
        }
        .input-field:focus { border-color: #B76E79; box-shadow: 0 0 0 3px rgba(183,110,121,0.1); }
        @keyframes floatIn {
          from { opacity: 0; transform: translateY(30px) scale(0.97); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        .quiz-step-enter {
          animation: floatIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </div>
  )
}

/* ─── sub-components ─── */
function StepCard({ children }: { children: React.ReactNode }) {
  return <div className="mx-auto max-w-md text-center">{children}</div>
}

function StepQuestion({ emoji, text }: { emoji: string; text: string }) {
  return (
    <>
      <span className="text-4xl">{emoji}</span>
      <h2 className="mt-4 font-serif text-2xl text-foreground">{text}</h2>
    </>
  )
}

function OptionButton({
  children, selected, onClick, className = '',
}: {
  children: React.ReactNode
  selected: boolean
  onClick: () => void
  className?: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center justify-center gap-3 border px-5 py-4 text-sm transition-all duration-300 ${
        selected
          ? 'border-accent bg-accent/10 text-accent scale-[1.02]'
          : 'border-border text-muted-foreground hover:border-accent/40 hover:text-foreground'
      } ${className}`}
    >
      {children}
    </button>
  )
}
