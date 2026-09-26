'use client'
import { useEffect, useState, type ReactNode } from 'react'

export function HeroEntrance({ children, delay = 0 }: { children: ReactNode; delay?: number }) {
  const [shown, setShown] = useState(false)
  const [done, setDone] = useState(false)
  useEffect(() => { const t = setTimeout(() => setShown(true), 50 + delay); return () => clearTimeout(t) }, [delay])
  const ease = 'cubic-bezier(0.16,1,0.3,1)'
  return (
    <div
      onTransitionEnd={(e) => { if (shown && e.target === e.currentTarget) setDone(true) }}
      style={{
        opacity: shown ? 1 : 0,
        transform: shown ? 'none' : 'translate3d(0,30px,0)',
        filter: shown ? 'none' : 'blur(4px)',
        transition: `opacity 1s ${ease} ${delay}ms, transform 1s ${ease} ${delay}ms, filter 1s ${ease} ${delay}ms`,
        willChange: done ? 'auto' : 'opacity, transform, filter',
      }}
    >
      {children}
    </div>
  )
}
