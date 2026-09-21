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
      const p = clamp(window.scrollY / range, 0, 1)
      const op = clamp(p / 0.9, 0, 1)

      // zoom the dark keyhole cover from small -> huge
      const s = 0.12 + smooth(op) * 9
      coverRef.current.style.transform = `translate(-50%, -50%) scale(${s.toFixed(3)})`
      coverRef.current.style.opacity = op > 0.92 ? String(clamp(1 - (op - 0.92) / 0.08, 0, 1)) : '1'

      if (hintRef.current) hintRef.current.style.opacity = String(clamp(1 - op / 0.3, 0, 1))

      if (op >= 1 && !entered) {
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
            left: '50%',
            top: '50%',
            width: '300vmax',
            height: '300vmax',
            transformOrigin: 'center center',
            transform: 'translate(-50%, -50%) scale(0.12)',
            willChange: 'transform',
            pointerEvents: 'none',
          }}
        >
          <svg viewBox="0 0 1000 1000" preserveAspectRatio="xMidYMid meet" style={{ width: '100%', height: '100%', display: 'block' }} aria-hidden="true">
            <defs>
              <filter id="kh-soft" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="6" />
              </filter>
              <mask id="kh-hole-mask">
                <rect width="1000" height="1000" fill="white" />
                <path
                  fill="black"
                  filter="url(#kh-soft)"
                  d="M500 210 C388 210 300 300 300 410 C300 490 345 558 415 590 C405 640 388 690 360 760 C345 795 345 815 380 815 L620 815 C655 815 655 795 640 760 C612 690 595 640 585 590 C655 558 700 490 700 410 C700 300 612 210 500 210 Z"
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
