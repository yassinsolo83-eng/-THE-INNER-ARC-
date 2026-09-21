'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'

/**
 * Standalone keyhole intro. Fully self-contained — no dependency on the
 * site shell, navbar, or constellation, so nothing can interfere with it.
 *
 * How it works:
 *  - A tall track creates scroll distance.
 *  - A sticky stage fills the screen and holds the fixed background image.
 *  - A dark SVG layer with a keyhole hole sits on top; the hole GROWS from
 *    the exact centre of the screen as you scroll, so it feels like walking
 *    through the door — never drifting up.
 *  - When fully open, we route into the site.
 */
export function KeyholeIntroPage({
  image,
  enterHref = '/home',
}: {
  image: string
  enterHref?: string
}) {
  const router = useRouter()
  const holeRef = useRef<SVGPathElement>(null)
  const darkRef = useRef<SVGRectElement>(null)
  const hintRef = useRef<HTMLDivElement>(null)
  const [entered, setEntered] = useState(false)

  useEffect(() => {
    const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v))
    const smooth = (x: number) => x * x * (3 - 2 * x)

    // The keyhole path is drawn around 50,50 in a 100x100 box, so it scales
    // evenly from its own centre. We anchor growth to the true screen centre.
    const MIN = 3.2
    const MAX = 40

    const onScroll = () => {
      const track = document.getElementById('kh-track')
      const hole = holeRef.current
      if (!track || !hole) return

      const range = track.offsetHeight - window.innerHeight
      const p = clamp(window.scrollY / range, 0, 1)
      const op = clamp(p / 0.9, 0, 1)

      const s = MIN + (MAX - MIN) * smooth(op)
      // grow from screen centre (500,500 in the 1000 viewBox) around the
      // path centre (50,50) — perfectly centred, no upward drift
      hole.setAttribute('transform', `translate(500 500) scale(${s}) translate(-50 -50)`)

      if (darkRef.current) {
        const darkOp = op > 0.82 ? clamp(1 - (op - 0.82) / 0.18, 0, 1) : 1
        darkRef.current.setAttribute('fill-opacity', String(darkOp))
      }
      if (hintRef.current) hintRef.current.style.opacity = String(clamp(1 - op / 0.35, 0, 1))

      if (op >= 1 && !entered) {
        setEntered(true)
        router.push(enterHref)
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [entered, enterHref, router])

  return (
    <div id="kh-track" style={{ height: '300vh', position: 'relative', background: '#050813' }}>
      <div
        style={{
          position: 'sticky',
          top: 0,
          height: '100vh',
          overflow: 'hidden',
        }}
      >
        {/* Fixed background image — the site behind the door */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `url(${image})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />

        {/* Dark keyhole overlay */}
        <svg
          viewBox="0 0 1000 1000"
          preserveAspectRatio="xMidYMid slice"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
          aria-hidden="true"
        >
          <defs>
            <filter id="kh-soft">
              <feGaussianBlur stdDeviation="2" />
            </filter>
            <mask id="kh-mask">
              <rect width="1000" height="1000" fill="white" />
              <path
                ref={holeRef}
                fill="black"
                filter="url(#kh-soft)"
                transform="translate(500 500) scale(3.2) translate(-50 -50)"
                d="M50 12 C40 12 32 20 32 31 C32 39 36 45 43 48 L37 84 L63 84 L57 48 C64 45 68 39 68 31 C68 20 60 12 50 12 Z"
              />
            </mask>
          </defs>
          <rect
            ref={darkRef}
            width="1000"
            height="1000"
            fill="#050813"
            fillOpacity="1"
            mask="url(#kh-mask)"
          />
        </svg>

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
          }}
        >
          Scroll to enter ↓
        </div>
      </div>
    </div>
  )
}
