'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'

/**
 * Keyhole intro — full-screen dark cover with a keyhole punched out.
 * Scrolling grows the hole until it swallows the screen, then routes in.
 * Exact logic from the approved demo.
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
      if (range <= 0) return
      const p = clamp(window.scrollY / range, 0, 1)
      const op = clamp(p / 0.9, 0, 1)

      // hole grows: scale 1 (small keyhole) -> 14 (swallows screen)
      const s = 1 + smooth(op) * 13
      coverRef.current.style.transform = `scale(${s.toFixed(3)})`
      coverRef.current.style.opacity = op > 0.93 ? String(clamp(1 - (op - 0.93) / 0.07, 0, 1)) : '1'

      if (hintRef.current) hintRef.current.style.opacity = String(clamp(1 - op / 0.3, 0, 1))

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
        {/* Real site image, filling the screen behind the door */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `url(${image})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />

        {/* Full-screen dark cover with the keyhole punched out */}
        <div
          ref={coverRef}
          style={{
            position: 'absolute',
            inset: 0,
            transformOrigin: '50% 44%',
            willChange: 'transform, opacity',
          }}
        >
          <svg
            viewBox="0 0 100 100"
            preserveAspectRatio="xMidYMid slice"
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', display: 'block' }}
            aria-hidden="true"
          >
            <defs>
              <filter id="kh-soft">
                <feGaussianBlur stdDeviation="0.6" />
              </filter>
              <mask id="kh-hole-mask">
                <rect width="100" height="100" fill="white" />
                <path
                  filter="url(#kh-soft)"
                  fill="black"
                  d="M50 33 C45.5 33 42 36.6 42 41 C42 44.2 43.8 46.9 46.6 48.2 C46.1 50.2 45.4 52.2 44.2 55.2 C43.6 56.6 43.6 57.5 45.2 57.5 L54.8 57.5 C56.4 57.5 56.4 56.6 55.8 55.2 C54.6 52.2 53.9 50.2 53.4 48.2 C56.2 46.9 58 44.2 58 41 C58 36.6 54.5 33 50 33 Z"
                />
              </mask>
            </defs>
            <rect width="100" height="100" fill="#050813" mask="url(#kh-hole-mask)" />
          </svg>
        </div>

        {/* Hint */}
        <div
          ref={hintRef}
          style={{
            position: 'absolute',
            bottom: '7%',
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
