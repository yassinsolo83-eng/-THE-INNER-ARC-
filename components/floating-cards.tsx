'use client'

import { useEffect, useState } from 'react'

// Cards drawn from scratch (own artwork), navy/gold/cream to match the site.
// Each card can be flipped on tap/click to reveal its meaning on the back.
const deck = [
  {
    src: '/images/cards/the-star.svg',
    alt: 'The Star',
    name: 'The Star',
    numeral: 'XVII',
    keyword: 'Hope & Renewal',
    line: 'A moment to trust the quiet return of light.',
  },
  {
    src: '/images/cards/the-moon.svg',
    alt: 'The Moon',
    name: 'The Moon',
    numeral: 'XVIII',
    keyword: 'Intuition & Mystery',
    line: 'What feels unclear is asking to be felt, not solved.',
  },
  {
    src: '/images/cards/the-sun.svg',
    alt: 'The Sun',
    name: 'The Sun',
    numeral: 'XIX',
    keyword: 'Joy & Clarity',
    line: 'Warmth after the questioning. Let yourself arrive.',
  },
]

const positions = [
  { x: 0, y: 0, rotate: -3, scale: 1, z: 30, opacity: 1 },
  { x: 22, y: 20, rotate: 4, scale: 0.95, z: 20, opacity: 0.9 },
  { x: 44, y: 40, rotate: 11, scale: 0.9, z: 10, opacity: 0.78 },
]

export function FlippingDeck() {
  const [front, setFront] = useState(0)
  const [lifting, setLifting] = useState(false)
  const [flipped, setFlipped] = useState<number | null>(null)
  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setReduced(true)
      return
    }
    let liftTimer: ReturnType<typeof setTimeout>
    const cycle = setInterval(() => {
      // Pause the auto-rotation while the user is reading a flipped card.
      if (flipped !== null) return
      setLifting(true)
      liftTimer = setTimeout(() => {
        setFront((f) => (f + 1) % deck.length)
        setLifting(false)
      }, 600)
    }, 4200)
    return () => {
      clearInterval(cycle)
      clearTimeout(liftTimer)
    }
  }, [flipped])

  const handleActivate = (index: number, isFront: boolean) => {
    // Only the front card responds, to keep the interaction clear.
    if (!isFront) return
    setFlipped((cur) => (cur === index ? null : index))
  }

  return (
    <div className="relative mx-auto h-[480px] w-[300px] max-w-full overflow-hidden sm:h-[560px] sm:w-[380px]">
      {deck.map((card, i) => {
        const dist = (i - front + deck.length) % deck.length
        const pos = positions[dist]
        const isFront = dist === 0
        const lift = isFront && lifting
        const isFlipped = flipped === i
        return (
          <div
            key={i}
            className="absolute left-1/2 top-1/2"
            style={{
              transform: `translate(-50%, -50%) translate(${pos.x}px, ${lift ? pos.y - 40 : pos.y}px) rotate(${pos.rotate}deg) scale(${lift ? 1.03 : pos.scale})`,
              zIndex: lift ? 40 : pos.z,
              opacity: lift ? 0 : pos.opacity,
              transition: reduced
                ? 'none'
                : 'transform 1.1s cubic-bezier(0.4, 0, 0.2, 1), opacity 1.1s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          >
            {/* Flip wrapper */}
            <button
              type="button"
              aria-hidden={!isFront}
              tabIndex={isFront ? 0 : -1}
              aria-label={isFront ? `Reveal the meaning of ${card.name}` : undefined}
              onClick={() => handleActivate(i, isFront)}
              className="group block rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.55)] outline-none focus-visible:ring-2 focus-visible:ring-accent"
              style={{
                perspective: '1200px',
                cursor: isFront ? 'pointer' : 'default',
              }}
            >
              <div
                className="relative h-[360px] w-[229px] sm:h-[430px] sm:w-[274px]"
                style={{
                  transformStyle: 'preserve-3d',
                  transition: 'transform 0.7s cubic-bezier(0.4, 0, 0.2, 1)',
                  transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
                }}
              >
                {/* Front face — artwork */}
                <div className="absolute inset-0 rounded-2xl" style={{ backfaceVisibility: 'hidden' }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={card.src} alt={card.alt} className="h-full w-full rounded-2xl" />
                  {isFront && !isFlipped && (
                    <span className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-[#1a2454]/85 px-3 py-1 text-[10px] uppercase tracking-[0.15em] text-[#F5F1EB] opacity-0 transition-opacity group-hover:opacity-100">
                      Tap to reveal
                    </span>
                  )}
                </div>
                {/* Back face — meaning */}
                <div
                  className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl border-4 border-[#C9A24B] bg-[#1a2454] px-6 text-center"
                  style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
                >
                  <span className="font-serif text-sm tracking-[0.3em] text-[#C9A24B]">{card.numeral}</span>
                  <h3 className="mt-3 font-serif text-3xl text-[#F5F1EB]">{card.name}</h3>
                  <div className="my-4 h-px w-12 bg-[#C9A24B]/60" />
                  <p className="font-serif text-lg text-[#C9A24B]">{card.keyword}</p>
                  <p className="mt-4 text-sm leading-6 text-[#F5F1EB]/80">{card.line}</p>
                </div>
              </div>
            </button>
          </div>
        )
      })}
    </div>
  )
}
