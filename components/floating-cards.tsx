'use client'

import { useEffect, useState, useRef } from 'react'

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
  const [flipped, setFlipped] = useState<number | null>(null)
  const [reduced, setReduced] = useState(false)

  // Drag state
  const [dragging, setDragging] = useState(false)
  const [dragX, setDragX] = useState(0)
  const [dragY, setDragY] = useState(0)
  const [dragOpacity, setDragOpacity] = useState(1)
  const startRef = useRef({ x: 0, y: 0, time: 0 })
  const containerRef = useRef<HTMLDivElement>(null)

  // Auto-cycle only when not dragging and no card is flipped
  useEffect(() => {
    if (reduced || dragging || flipped !== null) return
    const cycle = setInterval(() => {
      setFront((f) => (f + 1) % deck.length)
    }, 5000)
    return () => clearInterval(cycle)
  }, [reduced, dragging, flipped])

  useEffect(() => {
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
      setReduced(true)
    }
  }, [])

  function handlePointerDown(e: React.PointerEvent, isFront: boolean) {
    if (!isFront) return
    startRef.current = { x: e.clientX, y: e.clientY, time: Date.now() }
    setDragging(true)
    setDragX(0)
    setDragY(0)
    setDragOpacity(1)
    ;(e.target as HTMLElement).setPointerCapture?.(e.pointerId)
  }

  function handlePointerMove(e: React.PointerEvent) {
    if (!dragging) return
    const dx = e.clientX - startRef.current.x
    const dy = e.clientY - startRef.current.y
    setDragX(dx)
    setDragY(dy * 0.3)
    // Fade as card moves away
    const dist = Math.abs(dx)
    setDragOpacity(Math.max(0, 1 - dist / 250))
  }

  function handlePointerUp(e: React.PointerEvent, index: number, isFront: boolean) {
    if (!dragging) return
    const dx = e.clientX - startRef.current.x
    const elapsed = Date.now() - startRef.current.time
    const absDx = Math.abs(dx)

    setDragging(false)
    setDragX(0)
    setDragY(0)
    setDragOpacity(1)

    // If it was a quick tap (not a swipe), flip the card
    if (absDx < 10 && elapsed < 300 && isFront) {
      setFlipped((cur) => (cur === index ? null : index))
      return
    }

    // If swiped far enough, move to next card
    if (absDx > 80) {
      setFlipped(null)
      setFront((f) => (f + 1) % deck.length)
    }
  }

  return (
    <div
      ref={containerRef}
      className="relative mx-auto h-[480px] w-[300px] max-w-full select-none overflow-hidden sm:h-[560px] sm:w-[380px]"
      style={{ touchAction: 'pan-y' }}
    >
      {/* Swipe hint */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-40 flex items-center gap-2 rounded-full bg-[#1a2454]/70 px-4 py-1.5 text-[10px] uppercase tracking-[0.15em] text-[#F5F1EB]/60 backdrop-blur-sm">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M15 19l-7-7 7-7"/></svg>
        Swipe or tap
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M9 5l7 7-7 7"/></svg>
      </div>

      {deck.map((card, i) => {
        const dist = (i - front + deck.length) % deck.length
        const pos = positions[dist]
        const isFront = dist === 0
        const isFlipped = flipped === i

        // Apply drag offset only to the front card
        const extraX = isFront && dragging ? dragX : 0
        const extraY = isFront && dragging ? dragY : 0
        const extraRotate = isFront && dragging ? dragX * 0.08 : 0
        const opacity = isFront && dragging ? dragOpacity : pos.opacity

        return (
          <div
            key={i}
            className="absolute left-1/2 top-1/2"
            style={{
              transform: `translate(-50%, -50%) translate(${pos.x + extraX}px, ${pos.y + extraY}px) rotate(${pos.rotate + extraRotate}deg) scale(${pos.scale})`,
              zIndex: pos.z,
              opacity,
              transition: dragging && isFront
                ? 'none'
                : reduced
                  ? 'none'
                  : 'transform 0.7s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.7s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          >
            <div
              role="button"
              tabIndex={isFront ? 0 : -1}
              aria-label={isFront ? `Swipe or tap to reveal ${card.name}` : undefined}
              onPointerDown={(e) => handlePointerDown(e, isFront)}
              onPointerMove={handlePointerMove}
              onPointerUp={(e) => handlePointerUp(e, i, isFront)}
              className="group block rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.55)] outline-none focus-visible:ring-2 focus-visible:ring-accent"
              style={{
                perspective: '1200px',
                cursor: isFront ? 'grab' : 'default',
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
                {/* Front face */}
                <div className="absolute inset-0 rounded-2xl" style={{ backfaceVisibility: 'hidden' }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={card.src} alt={card.alt} className="h-full w-full rounded-2xl pointer-events-none" draggable={false} />
                </div>
                {/* Back face */}
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
            </div>
          </div>
        )
      })}
    </div>
  )
}
