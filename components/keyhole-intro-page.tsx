'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'

/**
 * Standalone keyhole intro — zooms a soft keyhole cover toward the viewer
 * until it swallows the screen, then routes into the site.
 * Same logic as the approved demo.
 */
export function KeyholeIntroPage({
  image,
  enterHref = '/home',
}: {
  image: string
  enterHref?: string
}) {
  const router = useRouter()
  const coverRef = useRef<HTMLDivElement>(null)
  const hintRef = useRef<HTMLDivElement>(null)
  const [entered, setEntered] = useState(false)

  useEffect(() => {
    const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v))
    const smooth = (x: number) => x * x * (3 - 2 * x)

    const update = () => {
      const track = document.getElementById('kh-track')
      if (!track || !coverRef.current) return
      const range = track.offsetHeight - window.innerHeight
      // Guard against a zero/invalid range (before layout settles) which would
      // make op jump to 1 and redirect instantly on load.
      if (range <= 0) return
      const p = clamp(window.scrollY / range, 0, 1)
      const op = clamp(p / 0.9, 0, 1)

      // zoom the dark keyhole cover from screen-filling -> huge
      const s = 1 + smooth(op) * 11
      coverRef.current.style.transform = `scale(${s.toFixed(3)})`
      coverRef.current.style.opacity = op > 0.92 ? String(clamp(1 - (op - 0.92) / 0.08, 0, 1)) : '1'

      if (hintRef.current) hintRef.current.style.opacity = String(clamp(1 - op / 0.3, 0, 1))

      // Only enter once the user has genuinely scrolled to the very end.
      if (op >= 1 && window.scrollY > 50 && !entered) {
        setEntered(true)
        router.push(enterHref)
      }
    }

    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    update()
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [entered, enterHref, router])

  return (
    <div id="kh-track" style={{ height: '400vh', position: 'relative', background: '#050813' }}>
      <div style={{ position: 'sticky', top: 0, height: '100vh', overflow: 'hidden' }}>
        {/* Real site image behind the door */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `url(${image})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />

        {/* Dark keyhole cover that zooms toward the viewer */}
        <div
          ref={coverRef}
          style={{
            position: 'absolute',
            inset: 0,
            transformOrigin: 'center 42%',
            transform: 'scale(1)',
            willChange: 'transform',
            pointerEvents: 'none',
          }}
        >
          <svg viewBox="0 0 1000 1000" preserveAspectRatio="xMidYMid slice" style={{ width: '100%', height: '100%', display: 'block' }} aria-hidden="true">
            <defs>
              <filter id="kh-soft" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="6" />
              </filter>
              <mask id="kh-hole-mask">
                <rect width="1000" height="1000" fill="white" />
                <path
                  fill="black"
                  filter="url(#kh-soft)"
                  d="M500 380 C455 380 420 416 420 460 C420 492 438 519 466 532 C461 552 454 572 442 602 C436 616 436 625 452 625 L548 625 C564 625 564 616 558 602 C546 572 539 552 534 532 C562 519 580 492 580 460 C580 416 545 380 500 380 Z"
                />
              </mask>
            </defs>
            <rect width="1000" height="1000" fill="#050813" mask="url(#kh-hole-mask)" />
          </svg>
        </div>

        {/* Hint */}
        <div
          ref={hintRef}
          style={{
            position: 'absolute',
            bottom: '8%',
            left: '50%',
            transform: 'translateX(-50%)',
            color: '#B76E79',
            fontSize: 12,
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            fontWeight: 600,
          }}
        >
          Scroll to enter ↓
        </div>
      </div>
    </div>
  )
}
