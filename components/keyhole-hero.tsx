'use client'

import { useEffect, useRef, useState } from 'react'

/**
 * Keyhole intro that ZOOMS the dark keyhole layer toward the viewer
 * until it clears the screen — revealing the site behind it.
 * Simpler and reliable: one SVG that scales up with scroll.
 */
export function KeyholeHero({ image }: { image: string }) {
  const overlayRef = useRef<HTMLDivElement>(null)
  const hintRef = useRef<HTMLDivElement>(null)
  const [done, setDone] = useState(false)

  useEffect(() => {
    const track = document.getElementById('kh-track')
    const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v))
    const smooth = (x: number) => x * x * (3 - 2 * x)

    const update = () => {
      if (!track || !overlayRef.current) return
      const rect = track.getBoundingClientRect()
      const range = track.offsetHeight - window.innerHeight
      const p = clamp(-rect.top / range, 0, 1)
      const op = clamp(p / 0.85, 0, 1)

      // scale the whole dark keyhole layer up massively as we scroll in
      const scale = 1 + smooth(op) * 22
      overlayRef.current.style.transform = `scale(${scale})`
      overlayRef.current.style.opacity = op > 0.9 ? String(clamp(1 - (op - 0.9) / 0.1, 0, 1)) : '1'

      if (hintRef.current) hintRef.current.style.opacity = String(clamp(1 - op / 0.35, 0, 1))
      setDone(op >= 1)
    }

    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    update()
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [])

  return (
    <div id="kh-track" className="kh-track">
      <div className="kh-stage">
        {/* Site image sits behind, filling the screen */}
        <div className="kh-bg" style={{ backgroundImage: `url(${image})` }} />

        {/* Dark keyhole layer that zooms toward the viewer */}
        <div ref={overlayRef} className={`kh-zoom ${done ? 'kh-open' : ''}`}>
          <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
            <defs>
              <mask id="kh-mask">
                <rect width="100" height="100" fill="white" />
                {/* keyhole hole (transparent center) */}
                <path fill="black" d="M50 30 C44 30 39 35 39 41 C39 45 41 48 44 50 L41 62 L59 62 L56 50 C59 48 61 45 61 41 C61 35 56 30 50 30 Z" />
              </mask>
            </defs>
            <rect width="100" height="100" fill="#070b1e" mask="url(#kh-mask)" />
          </svg>
        </div>

        <div ref={hintRef} className="kh-hint">Scroll to enter <span>↓</span></div>
      </div>
    </div>
  )
}
