'use client'

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'

type Animation = 'fade-up' | 'fade-down' | 'fade-left' | 'fade-right' | 'scale' | 'blur-up'

const transforms: Record<Animation, string> = {
  'fade-up': 'translateY(48px)',
  'fade-down': 'translateY(-48px)',
  'fade-left': 'translateX(48px)',
  'fade-right': 'translateX(-48px)',
  'scale': 'scale(0.88)',
  'blur-up': 'translateY(32px)',
}

export function Reveal({
  children,
  animation = 'fade-up',
  delay = 0,
  duration = 800,
  threshold = 0.12,
  className = '',
  as: Tag = 'div',
}: {
  children: ReactNode
  animation?: Animation
  delay?: number
  duration?: number
  threshold?: number
  className?: string
  as?: any
}) {
  const ref = useRef<HTMLElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.unobserve(el) } },
      { threshold, rootMargin: '0px 0px -40px 0px' },
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [threshold])

  const hidden: CSSProperties = {
    opacity: 0,
    transform: transforms[animation],
    filter: animation === 'blur-up' ? 'blur(6px)' : undefined,
  }

  const shown: CSSProperties = {
    opacity: 1,
    transform: 'none',
    filter: 'none',
  }

  const style: CSSProperties = {
    ...(visible ? shown : hidden),
    transition: [
      `opacity ${duration}ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`,
      `transform ${duration}ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`,
      animation === 'blur-up' ? `filter ${duration}ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms` : '',
    ].filter(Boolean).join(', '),
    willChange: 'opacity, transform',
  }

  return <Tag ref={ref} className={className} style={style}>{children}</Tag>
}

/* Stagger wrapper — auto-delays children */
export function RevealGroup({
  children,
  animation = 'fade-up',
  stagger = 100,
  duration = 800,
  className = '',
}: {
  children: ReactNode[]
  animation?: Animation
  stagger?: number
  duration?: number
  className?: string
}) {
  return (
    <div className={className}>
      {children.map((child, i) => (
        <Reveal key={i} animation={animation} delay={i * stagger} duration={duration}>
          {child}
        </Reveal>
      ))}
    </div>
  )
}
