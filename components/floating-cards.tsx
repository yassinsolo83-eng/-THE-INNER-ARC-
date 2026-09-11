'use client'

import { useEffect, useState } from 'react'

// Cards drawn from scratch (own artwork), navy/gold/cream to match the site.
const deck = [
  { src: '/images/cards/the-star.svg', alt: 'The Star' },
  { src: '/images/cards/the-moon.svg', alt: 'The Moon' },
  { src: '/images/cards/the-sun.svg', alt: 'The Sun' },
]

// Visual position for a card given its distance from the front (0 = front).
const positions = [
  { x: 0, y: 0, rotate: 0, scale: 1, z: 30, opacity: 1 },
  { x: 30, y: 18, rotate: 7, scale: 0.94, z: 20, opacity: 0.92 },
  { x: 60, y: 36, rotate: 14, scale: 0.88, z: 10, opacity: 0.8 },
]

export function FlippingDeck() {
  const [front, setFront] = useState(0)
  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setReduced(true)
      return
    }
    const interval = setInterval(() => setFront((f) => (f + 1) % deck.length), 3500)
    return () => clearInterval(interval)
  }, [])

  return (
    <div aria-hidden className="relative mx-auto h-[400px] w-[280px] sm:h-[440px] sm:w-[300px]">
      {deck.map((card, i) => {
        const dist = (i - front + deck.length) % deck.length
        const pos = positions[dist]
        return (
          <div
            key={i}
            className="absolute left-1/2 top-1/2"
            style={{
              transform: `translate(-50%, -50%) translate(${pos.x}px, ${pos.y}px) rotate(${pos.rotate}deg) scale(${pos.scale})`,
              zIndex: pos.z,
              opacity: pos.opacity,
              transition: reduced ? 'none' : 'transform 1s cubic-bezier(0.22,1,0.36,1), opacity 1s ease',
            }}
          >
            <div className="rounded-2xl shadow-[0_18px_45px_rgba(0,0,0,0.5)]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={card.src} alt={card.alt} className="h-[300px] w-[192px] sm:h-[340px] sm:w-[217px]" />
            </div>
          </div>
        )
      })}
    </div>
  )
}
