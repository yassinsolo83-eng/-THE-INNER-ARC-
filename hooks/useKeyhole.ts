'use client'

import { useEffect } from 'react'

type Setters = {
  setIntroDone: (v: boolean) => void
}

/**
 * Drives the scroll-based keyhole intro (Nefertiti method):
 *  - the keyhole grows as the user scrolls through #kh-track (opens)
 *  - scrolling back up shrinks it (closes)
 *  - finishes opening at 75% of the track, holding the hero for the last 25%
 */
export function useKeyhole({ setIntroDone }: Setters) {
  useEffect(() => {
    const hole = document.getElementById('kh-hole')
    const ring = document.getElementById('kh-ring')
    const darkRect = document.getElementById('kh-dark')
    const hint = document.getElementById('kh-hint')
    const frost = document.getElementById('kh-frost')

    const isMobile = window.innerWidth <= 860
    const MIN = isMobile ? 5.5 : 3.6
    const MAX = 42
    const CY = 500
    const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v))
    const smooth = (x: number) => x * x * (3 - 2 * x)

    const updateKeyhole = () => {
      const track = document.getElementById('kh-track')
      if (!track || !hole || !ring) return
      const rect = track.getBoundingClientRect()
      const range = track.offsetHeight - window.innerHeight
      const p = clamp(-rect.top / range, 0, 1)

      const OPEN_AT = 0.75
      const op = clamp(p / OPEN_AT, 0, 1)

      const s = MIN + (MAX - MIN) * smooth(op)
      const tf = `translate(500 ${CY}) scale(${s}) translate(-50 -50)`
      hole.setAttribute('transform', tf)
      ring.setAttribute('transform', tf)

      const darkOp = op > 0.92 ? clamp(1 - (op - 0.92) / 0.08, 0, 1) : 1
      if (darkRect) darkRect.setAttribute('fill-opacity', String(0.9 * darkOp * (1 - op * 0.5)))

      if (frost) {
        const blur = (1 - op) * 28
        frost.style.setProperty('--kh-blur', `${blur.toFixed(1)}px`)
        frost.style.setProperty('--kh-frost-op', String(darkOp))
      }

      const uiOp = clamp(1 - op / 0.45, 0, 1)
      ring.setAttribute('opacity', String(uiOp))
      if (hint) hint.style.opacity = String(uiOp)

      setIntroDone(op >= 1)
    }

    const onScroll = () => updateKeyhole()

    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', updateKeyhole)
    updateKeyhole()

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', updateKeyhole)
    }
  }, [setIntroDone])
}
