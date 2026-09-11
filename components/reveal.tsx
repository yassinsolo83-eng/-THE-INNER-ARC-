'use client'
import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'
type Animation = 'fade-up' | 'fade-down' | 'fade-left' | 'fade-right' | 'scale' | 'blur-up'
const transforms: Record<Animation, string> = { 'fade-up': 'translateY(48px)', 'fade-down': 'translateY(-48px)', 'fade-left': 'translateX(48px)', 'fade-right': 'translateX(-48px)', 'scale': 'scale(0.88)', 'blur-up': 'translateY(32px)' }
export function Reveal({ children, animation = 'fade-up', delay = 0, duration = 800, threshold = 0.12, className = '' }: { children: ReactNode; animation?: Animation; delay?: number; duration?: number; threshold?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null); const [v, setV] = useState(false)
  useEffect(() => { const el = ref.current; if (!el) return; const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setV(true); obs.unobserve(el) } }, { threshold, rootMargin: '0px 0px -40px 0px' }); obs.observe(el); return () => obs.disconnect() }, [threshold])
  const style: CSSProperties = { opacity: v ? 1 : 0, transform: v ? 'none' : transforms[animation], filter: animation === 'blur-up' && !v ? 'blur(6px)' : 'none', transition: `opacity ${duration}ms cubic-bezier(0.16,1,0.3,1) ${delay}ms, transform ${duration}ms cubic-bezier(0.16,1,0.3,1) ${delay}ms${animation === 'blur-up' ? `, filter ${duration}ms cubic-bezier(0.16,1,0.3,1) ${delay}ms` : ''}`, willChange: 'opacity, transform' }
  return <div ref={ref} className={className} style={style}>{children}</div>
}
