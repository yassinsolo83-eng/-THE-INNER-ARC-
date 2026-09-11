'use client'

import { useEffect, useState } from 'react'

const stroke = '#D4AF6A'

function CardFrame({ children }: { children: React.ReactNode }) {
  return (
    <svg viewBox="0 0 200 300" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-full w-full drop-shadow-[0_10px_30px_rgba(0,0,0,0.45)]">
      <rect x="6" y="6" width="188" height="288" rx="14" fill="#12162E" stroke={stroke} strokeWidth="1.5" />
      <rect x="16" y="16" width="168" height="268" rx="9" stroke={stroke} strokeWidth="0.7" fill="none" />
      {children}
    </svg>
  )
}

function MoonCard() {
  return (
    <CardFrame>
      <text x="100" y="46" textAnchor="middle" fontFamily="serif" fontSize="12" letterSpacing="2" fill={stroke}>XVIII</text>
      <circle cx="100" cy="125" r="32" stroke={stroke} strokeWidth="1.2" fill="none" />
      <circle cx="88" cy="120" r="26" stroke={stroke} strokeWidth="1" fill="none" />
      <circle cx="70" cy="175" r="1.8" fill={stroke} /><circle cx="132" cy="183" r="1.4" fill={stroke} />
      <circle cx="85" cy="200" r="1" fill={stroke} /><circle cx="120" cy="165" r="1.4" fill={stroke} />
      <path d="M45 240 Q72 227 100 240 Q128 253 155 240" stroke={stroke} strokeWidth="0.9" fill="none" />
      <path d="M45 253 Q72 240 100 253 Q128 266 155 253" stroke={stroke} strokeWidth="0.7" fill="none" />
      <text x="100" y="282" textAnchor="middle" fontFamily="serif" fontSize="10" letterSpacing="2.5" fill={stroke}>THE MOON</text>
    </CardFrame>
  )
}

function StarCard() {
  return (
    <CardFrame>
      <text x="100" y="46" textAnchor="middle" fontFamily="serif" fontSize="12" letterSpacing="2" fill={stroke}>XVII</text>
      <polygon points="100,70 107,104 141,104 114,126 123,161 100,142 77,161 86,126 59,104 93,104" stroke={stroke} strokeWidth="1.1" fill="none" />
      <circle cx="62" cy="76" r="2.5" stroke={stroke} strokeWidth="0.7" fill="none" />
      <circle cx="140" cy="82" r="2" stroke={stroke} strokeWidth="0.7" fill="none" />
      <circle cx="66" cy="154" r="1.6" stroke={stroke} strokeWidth="0.7" fill="none" />
      <circle cx="138" cy="150" r="1.6" stroke={stroke} strokeWidth="0.7" fill="none" />
      <path d="M50 215 Q78 202 100 215 Q125 228 150 215" stroke={stroke} strokeWidth="0.9" fill="none" />
      <path d="M55 231 Q82 219 108 231 Q132 241 148 231" stroke={stroke} strokeWidth="0.7" fill="none" />
      <text x="100" y="282" textAnchor="middle" fontFamily="serif" fontSize="10" letterSpacing="2.5" fill={stroke}>THE STAR</text>
    </CardFrame>
  )
}

function SunCard() {
  return (
    <CardFrame>
      <text x="100" y="46" textAnchor="middle" fontFamily="serif" fontSize="12" letterSpacing="2" fill={stroke}>XIX</text>
      <circle cx="100" cy="125" r="30" stroke={stroke} strokeWidth="1.2" fill="none" />
      <circle cx="100" cy="125" r="15" stroke={stroke} strokeWidth="0.9" fill="none" />
      {Array.from({ length: 12 }).map((_, i) => {
        const angle = (i * 30 * Math.PI) / 180
        return <line key={i} x1={100 + Math.cos(angle) * 34} y1={125 + Math.sin(angle) * 34} x2={100 + Math.cos(angle) * 44} y2={125 + Math.sin(angle) * 44} stroke={stroke} strokeWidth="0.8" />
      })}
      <path d="M55 215 Q82 205 108 215 Q132 225 150 215" stroke={stroke} strokeWidth="0.8" fill="none" />
      <text x="100" y="282" textAnchor="middle" fontFamily="serif" fontSize="10" letterSpacing="2.5" fill={stroke}>THE SUN</text>
    </CardFrame>
  )
}

const deck = [<StarCard key="star" />, <MoonCard key="moon" />, <SunCard key="sun" />]

// Visual position for a card given its distance from the front (0 = front).
const positions = [
  { x: 0, y: 0, rotate: 0, scale: 1, z: 30, opacity: 1 },
  { x: 26, y: 16, rotate: 6, scale: 0.94, z: 20, opacity: 0.85 },
  { x: 52, y: 32, rotate: 12, scale: 0.88, z: 10, opacity: 0.7 },
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
    <div aria-hidden className="relative mx-auto h-[340px] w-[240px] sm:h-[380px] sm:w-[260px]">
      {deck.map((card, i) => {
        const dist = (i - front + deck.length) % deck.length
        const pos = positions[dist]
        return (
          <div
            key={i}
            className="absolute left-1/2 top-1/2 h-[300px] w-[200px]"
            style={{
              transform: `translate(-50%, -50%) translate(${pos.x}px, ${pos.y}px) rotate(${pos.rotate}deg) scale(${pos.scale})`,
              zIndex: pos.z,
              opacity: pos.opacity,
              transition: reduced ? 'none' : 'transform 1s cubic-bezier(0.22,1,0.36,1), opacity 1s ease',
            }}
          >
            {card}
          </div>
        )
      })}
    </div>
  )
}
