'use client'
import { useEffect, useState, type ReactNode } from 'react'
export function HeroEntrance({ children, delay = 0 }: { children: ReactNode; delay?: number }) {
  const [r, setR] = useState(false)
  useEffect(() => { const t = setTimeout(() => setR(true), 50 + delay); return () => clearTimeout(t) }, [delay])
  return <div style={{ opacity: r ? 1 : 0, transform: r ? 'none' : 'translateY(30px)', filter: r ? 'none' : 'blur(4px)', transition: `opacity 1s cubic-bezier(0.16,1,0.3,1) ${delay}ms, transform 1s cubic-bezier(0.16,1,0.3,1) ${delay}ms, filter 1s cubic-bezier(0.16,1,0.3,1) ${delay}ms`, willChange: 'opacity, transform, filter' }}>{children}</div>
}
