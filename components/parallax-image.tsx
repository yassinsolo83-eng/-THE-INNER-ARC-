'use client'

import { useEffect, useRef, useState } from 'react'

export function ParallaxImage({ src, alt, className }: { src: string; alt: string; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const [offset, setOffset] = useState(0)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    let ticking = false
    const onScroll = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(() => {
        const rect = el.getBoundingClientRect()
        const progress = rect.top / window.innerHeight
        setOffset(progress * 40)
        ticking = false
      })
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div ref={ref} className="absolute inset-0 overflow-hidden">
      <img
        src={src}
        alt={alt}
        className={className}
        style={{
          transform: `translateY(${offset}px) scale(1.1)`,
          transition: 'transform 0.1s linear',
          willChange: 'transform',
        }}
      />
    </div>
  )
}
