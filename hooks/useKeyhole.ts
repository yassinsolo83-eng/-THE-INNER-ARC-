'use client'

import { useEffect } from 'react'

type Setters = {
  setIntroDone: (v: boolean) => void
}

export function useKeyhole({ setIntroDone }: Setters) {
  useEffect(() => {
    const hole = document.getElementById('kh-hole')
    const hint = document.getElementById('kh-hint')

    const isMobile = window.innerWidth <= 860
    const MIN = isMobile ? 5.5 : 3.6
    const MAX = 44
    // Grow from the CIRCLE's centre (y≈32 in the path), not the path's bbox centre.
    // This keeps the opening visually anchored so it feels like moving INTO it.
    const ORIGIN_X = 50
    const ORIGIN_Y = 32
    const CY = 460
    const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v))
    const smooth = (x: number) => x * x * (3 - 2 * x)

    const updateKeyhole = () => {
      const track = document.getElementById('kh-track')
      if (!track || !hole) return
      const rect = track.getBoundingClientRect()
      const range = track.offsetHeight - window.innerHeight
      const p = clamp(-rect.top / range, 0, 1)

      const OPEN_AT = 0.85
      const op = clamp(p / OPEN_AT, 0, 1)

      const s = MIN + (MAX - MIN) * smooth(op)
      const tf = `translate(500 ${CY}) scale(${s}) translate(${-ORIGIN_X} ${-ORIGIN_Y})`
      hole.setAttribute('transform', tf)

      // Fade the dark surround out over the last part of the open so the
      // hero image behind blends smoothly into the real page (no black gap).
      const darkRect = document.getElementById('kh-dark')
      if (darkRect) {
        const darkOp = op > 0.8 ? clamp(1 - (op - 0.8) / 0.2, 0, 1) : 1
        darkRect.setAttribute('fill-opacity', String(darkOp))
      }

      const uiOp = clamp(1 - op / 0.4, 0, 1)
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
