'use client'
import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'

type Animation = 'fade-up' | 'fade-down' | 'fade-left' | 'fade-right' | 'scale' | 'blur-up'

const transforms: Record<Animation, string> = {
  'fade-up': 'translate3d(0,48px,0)',
  'fade-down': 'translate3d(0,-48px,0)',
  'fade-left': 'translate3d(48px,0,0)',
  'fade-right': 'translate3d(-48px,0,0)',
  'scale': 'scale(0.88)',
  'blur-up': 'translate3d(0,32px,0)',
}

// Sideways slides push content past the screen edge on phones, so they fall back to fade-up there.
const MOBILE_QUERY = '(max-width: 767px)'

export function Reveal({ children, animation = 'fade-up', delay = 0, duration = 800, threshold = 0.12, className = '' }: { children: ReactNode; animation?: Animation; delay?: number; duration?: number; threshold?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  const [done, setDone] = useState(false)
  const [effective, setEffective] = useState<Animation>(animation)

  useEffect(() => {
    const horizontal = animation === 'fade-left' || animation === 'fade-right'
    setEffective(horizontal && window.matchMedia(MOBILE_QUERY).matches ? 'fade-up' : animation)
  }, [animation])

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setVisible(true); obs.unobserve(el) }
    }, { threshold, rootMargin: '0px 0px -40px 0px' })
    obs.observe(el)
    return () => obs.disconnect()
  }, [threshold])

  const ease = 'cubic-bezier(0.16,1,0.3,1)'
  const style: CSSProperties = {
    opacity: visible ? 1 : 0,
    transform: visible ? 'none' : transforms[effective],
    filter: effective === 'blur-up' && !visible ? 'blur(6px)' : 'none',
    transition: `opacity ${duration}ms ${ease} ${delay}ms, transform ${duration}ms ${ease} ${delay}ms${effective === 'blur-up' ? `, filter ${duration}ms ${ease} ${delay}ms` : ''}`,
    // keep the GPU layer only while animating; dozens of permanent layers slow scrolling on phones
    willChange: done ? 'auto' : 'opacity, transform',
  }

  return (
    <div ref={ref} className={className} style={style} onTransitionEnd={(e) => { if (visible && e.target === e.currentTarget) setDone(true) }}>
      {children}
    </div>
  )
}
