'use client'

import { useEffect, useState, type ReactNode } from 'react'

export function HeroEntrance({ children, delay = 0 }: { children: ReactNode; delay?: number }) {
  const [ready, setReady] = useState(false)
  useEffect(() => {
    const t = setTimeout(() => setReady(true), 50 + delay)
    return () => clearTimeout(t)
  }, [delay])

  return (
    <div
      style={{
        opacity: ready ? 1 : 0,
        transform: ready ? 'none' : 'translateY(30px)',
        filter: ready ? 'none' : 'blur(4px)',
        transition: `opacity 1s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms, transform 1s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms, filter 1s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`,
        willChange: 'opacity, transform, filter',
      }}
    >
      {children}
    </div>
  )
}

export function HeroStagger({ items, className }: { items: ReactNode[]; className?: string }) {
  return (
    <div className={className}>
      {items.map((item, i) => (
        <HeroEntrance key={i} delay={i * 180}>{item}</HeroEntrance>
      ))}
    </div>
  )
}
