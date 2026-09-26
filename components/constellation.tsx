'use client'

import { useEffect, useRef } from 'react'

export function Constellation() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animId: number
    let stars: { x: number; y: number; r: number; alpha: number; speed: number; dir: number }[] = []

    const resize = () => {
      canvas.width = canvas.clientWidth || window.innerWidth
      // canvas is sized in CSS to the large viewport (h-lvh) so it still covers the
      // screen when the mobile address bar hides; match its pixel height to that
      canvas.height = canvas.clientHeight || window.innerHeight
      initStars()
    }

    const initStars = () => {
      const count = Math.floor((canvas.width * canvas.height) / 12000)
      stars = Array.from({ length: count }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 1.2 + 0.3,
        alpha: Math.random() * 0.6 + 0.1,
        speed: Math.random() * 0.008 + 0.003,
        dir: Math.random() > 0.5 ? 1 : -1,
      }))
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      for (const s of stars) {
        s.alpha += s.speed * s.dir
        if (s.alpha >= 0.7 || s.alpha <= 0.05) s.dir *= -1
        ctx.beginPath()
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(212, 165, 165, ${s.alpha})`
        ctx.fill()
      }
      animId = requestAnimationFrame(draw)
    }

    // On phones the address bar changes the window height while scrolling.
    // Only rebuild the star field when the width really changes (rotation, desktop resize),
    // otherwise the canvas is cleared and re-randomised mid-scroll, which looks like a flicker.
    let lastWidth = window.innerWidth
    const onResize = () => {
      if (window.innerWidth === lastWidth) return
      lastWidth = window.innerWidth
      resize()
    }

    // Pause the loop while the tab is in the background.
    const onVisibility = () => {
      cancelAnimationFrame(animId)
      if (!document.hidden) animId = requestAnimationFrame(draw)
    }

    resize()
    draw()
    window.addEventListener('resize', onResize)
    document.addEventListener('visibilitychange', onVisibility)
    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', onResize)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-0 h-lvh w-full"
      style={{ opacity: 0.6 }}
    />
  )
}
