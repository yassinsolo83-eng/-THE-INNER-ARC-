'use client'

import { useEffect } from 'react'

type Setters = {
  setIntroDone: (v: boolean) => void
}

/**
 * Scroll-driven keyhole intro.
 * The keyhole grows as the user scrolls through #kh-track,
 * finishing at 75% of the track (last 25% holds the revealed hero).
 */
export function useKeyhole({ setIntroDone }: Setters) {
  useEffect(() => {
    const hole = document.getElementById('kh-hole')
    const ring = document.getElementById('kh-ring')
    const darkRect = document.getElementById('kh-dark')
    const hint = document.getElementById('kh-hint')

    const isMobile = window.innerWidth <= 860
    const MIN = isMobile ? 4 : 5 // full keyhole visible within screen
    const MAX = 46
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
      if (darkRect) darkRect.setAttribute('fill-opacity', String(darkOp))

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
