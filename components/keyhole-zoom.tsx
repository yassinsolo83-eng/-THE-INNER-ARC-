'use client'

import { useEffect, useRef } from 'react'

/**
 * The APPROVED zoom keyhole. A full-screen dark cover with a keyhole hole
 * punched out sits on top of the site. Scrolling zooms the cover toward the
 * viewer so the hole swallows the screen (opens); scrolling up shrinks it
 * back (closes).
 *
 * The artwork (SVG path, blur, colours) and the scroll math are unchanged
 * from the approved demo. Only the plumbing is optimised:
 * - one update per animation frame (requestAnimationFrame) instead of per scroll event
 * - DOM nodes looked up once, not on every scroll
 * - styles only written when the value actually changes
 *
 * Fires a one-time `keyhole:open` window event the first time it fully opens.
 */
export function KeyholeZoom() {
  const coverRef = useRef<HTMLDivElement>(null)
  const hintRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v))
    const smooth = (x: number) => x * x * (3 - 2 * x)

    const cover = coverRef.current
    const hint = hintRef.current
    const track = document.getElementById('kz-track')
    const copy = document.getElementById('kz-copy')
    const nav = document.querySelector('header') as HTMLElement | null
    if (!cover || !track) return

    if (nav) nav.style.transition = 'opacity .4s ease'

    let range = 0
    let frame = 0
    let lastP = -1
    let navOpen: boolean | null = null
    let announced = false

    const measure = () => {
      range = track.offsetHeight - window.innerHeight
    }

    const render = () => {
      frame = 0
      if (range <= 0) return
      const p = clamp(window.scrollY / range, 0, 1)
      if (p === lastP) return
      lastP = p
      const op = clamp(p / 0.9, 0, 1)

      // hole grows: scale 1 (small keyhole) -> 14 (swallows screen)
      const s = 1 + smooth(op) * 13
      cover.style.transform = `scale(${s.toFixed(3)})`
      cover.style.opacity = op > 0.93 ? String(clamp(1 - (op - 0.93) / 0.07, 0, 1)) : '1'

      if (hint) hint.style.opacity = String(clamp(1 - op / 0.3, 0, 1))

      // fade the hero copy in as the keyhole opens
      if (copy) {
        const copyOp = clamp((op - 0.35) / 0.4, 0, 1)
        copy.style.opacity = String(copyOp)
        copy.style.transform = `translate3d(0,${((1 - copyOp) * 20).toFixed(2)}px,0)`
      }

      // show the navbar only once the keyhole has opened
      const open = op >= 1
      if (nav && open !== navOpen) {
        navOpen = open
        nav.style.opacity = open ? '1' : '0'
        nav.style.pointerEvents = open ? 'auto' : 'none'
      }

      if (open && !announced) {
        announced = true
        window.dispatchEvent(new Event('keyhole:open'))
      }
    }

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(render)
    }

    // Only re-measure when the width changes. On mobile the address bar
    // showing/hiding fires resize with a new height on every scroll, which
    // would otherwise make the animation jump.
    let lastWidth = window.innerWidth
    const onResize = () => {
      if (window.innerWidth === lastWidth) return
      lastWidth = window.innerWidth
      measure()
      lastP = -1
      schedule()
    }

    measure()
    render()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', onResize)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', onResize)
      if (nav) {
        nav.style.opacity = ''
        nav.style.pointerEvents = ''
        nav.style.transition = ''
      }
    }
  }, [])

  return (
    <div ref={coverRef} className="kz-cover">
      <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <defs>
          <filter id="kz-soft"><feGaussianBlur stdDeviation="0.6" /></filter>
          <mask id="kz-hole">
            <rect width="100" height="100" fill="white" />
            <path
              filter="url(#kz-soft)"
              fill="black"
              d="M50 33 C45.5 33 42 36.6 42 41 C42 44.2 43.8 46.9 46.6 48.2 C46.1 50.2 45.4 52.2 44.2 55.2 C43.6 56.6 43.6 57.5 45.2 57.5 L54.8 57.5 C56.4 57.5 56.4 56.6 55.8 55.2 C54.6 52.2 53.9 50.2 53.4 48.2 C56.2 46.9 58 44.2 58 41 C58 36.6 54.5 33 50 33 Z"
            />
          </mask>
        </defs>
        <rect width="100" height="100" fill="#050813" mask="url(#kz-hole)" />
      </svg>
      <div ref={hintRef} className="kz-hint">Scroll to enter ↓</div>
    </div>
  )
}
