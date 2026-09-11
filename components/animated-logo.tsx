'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'

// Total path length of the underline used for the draw/erase animation.
const LINE_LENGTH = 300

export function AnimatedLogo({ variant = 'cream' }: { variant?: 'cream' | 'navy' }) {
  const pathname = usePathname()
  const lineRef = useRef<SVGLineElement>(null)
  const [glow, setGlow] = useState(false)

  const textColor = variant === 'cream' ? '#F5F1EB' : '#0F1229'
  const lineColor = '#B76E79'

  const runAnimation = () => {
    const line = lineRef.current
    if (!line) return

    // If the user prefers reduced motion, keep the line static.
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      line.style.strokeDashoffset = '0'
      return
    }

    setGlow(false)
    // Phase 1: erase — line disappears from right to left (0 -> full offset)
    line.style.transition = 'none'
    line.style.strokeDashoffset = '0'
    // force reflow so the next transition starts cleanly
    void line.getBoundingClientRect()
    line.style.transition = 'stroke-dashoffset 1.2s ease-in'
    line.style.strokeDashoffset = String(LINE_LENGTH)

    // Phase 2: redraw — line draws itself back left to right
    const drawTimer = setTimeout(() => {
      line.style.transition = 'stroke-dashoffset 1.4s cubic-bezier(0.22, 1, 0.36, 1)'
      line.style.strokeDashoffset = '0'
    }, 1250)

    // Phase 3: glow pulse once it settles
    const glowTimer = setTimeout(() => setGlow(true), 2650)
    const glowOffTimer = setTimeout(() => setGlow(false), 3200)

    return () => {
      clearTimeout(drawTimer)
      clearTimeout(glowTimer)
      clearTimeout(glowOffTimer)
    }
  }

  // Run on every route change (navigation between pages)
  useEffect(() => {
    const cleanup = runAnimation()
    return cleanup
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  // Run automatically every 40 seconds
  useEffect(() => {
    const interval = setInterval(() => { runAnimation() }, 40000)
    return () => clearInterval(interval)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Link href="/" aria-label="The Inner Arc home" className="inline-flex">
      <svg
        width="210"
        height="45"
        viewBox="0 0 420 90"
        xmlns="http://www.w3.org/2000/svg"
        className="h-11 w-auto"
        role="img"
        aria-label="The Inner Arc"
      >
        <text
          x="210"
          y="52"
          textAnchor="middle"
          fontFamily="'Cormorant Garamond', 'Playfair Display', Georgia, serif"
          fontSize="34"
          letterSpacing="8"
          fill={textColor}
        >
          THE INNER ARC
        </text>
        <line
          ref={lineRef}
          x1="60"
          y1="70"
          x2="360"
          y2="70"
          stroke={lineColor}
          strokeWidth="1.5"
          strokeDasharray={LINE_LENGTH}
          strokeDashoffset="0"
          style={{
            filter: glow ? `drop-shadow(0 0 4px ${lineColor}) drop-shadow(0 0 8px ${lineColor})` : 'none',
            transition: 'filter 0.5s ease',
          }}
        />
      </svg>
    </Link>
  )
}
