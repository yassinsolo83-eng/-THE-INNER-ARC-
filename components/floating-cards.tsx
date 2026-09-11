'use client'

import { useEffect, useState } from 'react'

// Cards drawn from scratch (own artwork), navy/gold/cream to match the site.
const deck = [
  { src: '/images/cards/the-star.svg', alt: 'The Star' },
  { src: '/images/cards/the-moon.svg', alt: 'The Moon' },
  { src: '/images/cards/the-sun.svg', alt: 'The Sun' },
]

// Resting position for each card by its distance from the front (0 = front).
// The stack fans down-right; every card shares the same easing so the whole
// group moves as one coordinated motion instead of three separate slides.
const positions = [
  { x: 0, y: 0, rotate: -3, scale: 1, z: 30, opacity: 1 },
  { x: 22, y: 20, rotate: 4, scale: 0.95, z: 20, opacity: 0.9 },
  { x: 44, y: 40, rotate: 11, scale: 0.9, z: 10, opacity: 0.78 },
]

export function FlippingDeck() {
  const [front, setFront] = useState(0)
  const [lifting, setLifting] = useState(false)
  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setReduced(true)
      return
    }
    let liftTimer: ReturnType<typeof setTimeout>
    const cycle = setInterval(() => {
      // Phase 1: lift the front card up and fade it slightly
      setLifting(true)
      // Phase 2: after the lift, advance the stack and drop it into the back
      liftTimer = setTimeout(() => {
        setFront((f) => (f + 1) % deck.length)
        setLifting(false)
      }, 600)
    }, 4200)
    return () => {
      clearInterval(cycle)
      clearTimeout(liftTimer)
    }
  }, [])

  return (
    <div aria-hidden className="relative mx-auto h-[440px] w-[300px] sm:h-[480px] sm:w-[330px]">
      {deck.map((card, i) => {
        const dist = (i - front + deck.length) % deck.length
        const pos = positions[dist]
        const isFront = dist === 0
        // When lifting, the front card floats up & fades before it wraps to back.
        const lift = isFront && lifting
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
            <div className="rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.55)]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={card.src} alt={card.alt} className="h-[340px] w-[217px] sm:h-[380px] sm:w-[242px]" />
            </div>
          </div>
        )
      })}
    </div>
  )
}
