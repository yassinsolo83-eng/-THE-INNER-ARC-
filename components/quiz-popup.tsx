'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function QuizPopup() {
  const pathname = usePathname()
  const [show, setShow] = useState(false)

  useEffect(() => {
    // Only on homepage
    if (pathname !== '/') return

    if (typeof window !== 'undefined') {
      if (sessionStorage.getItem('quiz-popup-dismissed')) return
      if (localStorage.getItem('quiz-completed')) return
    }

    const timer = setTimeout(() => setShow(true), 3000)
    return () => clearTimeout(timer)
  }, [pathname])

  function dismiss() {
    setShow(false)
    sessionStorage.setItem('quiz-popup-dismissed', '1')
  }

  if (!show) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={dismiss}
        style={{ animation: 'fadeIn 0.4s ease' }}
      />

      {/* Modal */}
      <div
        className="relative w-full max-w-sm overflow-hidden border border-accent/20 bg-card shadow-2xl shadow-accent/10"
        style={{ animation: 'scaleIn 0.5s cubic-bezier(0.16, 1, 0.3, 1)' }}
      >
        {/* Glow top */}
        <div className="absolute -top-20 left-1/2 h-40 w-40 -translate-x-1/2 rounded-full bg-accent/10 blur-3xl" />

        <div className="relative px-8 py-10 text-center">
          <button
            onClick={dismiss}
            className="absolute right-4 top-4 text-muted-foreground hover:text-foreground"
          >
            ✕
          </button>

          <span className="text-5xl">✨</span>
          <h2 className="mt-6 font-serif text-2xl text-foreground">
            Discover what the stars<br />say about you
          </h2>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            Take our 2-minute birth chart quiz and get personalized
            insights into your love life, career, and destiny.
          </p>

          <Link
            href="/quiz"
            onClick={dismiss}
            className="mt-8 inline-block w-full rounded-full bg-primary py-3.5 text-center text-sm font-semibold text-primary-foreground transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/25"
          >
            Start your free reading
          </Link>

          <button
            onClick={dismiss}
            className="mt-4 block w-full text-center text-xs text-muted-foreground transition-colors hover:text-accent"
          >
            Maybe later
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes scaleIn { from { opacity: 0; transform: scale(0.9) translateY(20px); } to { opacity: 1; transform: scale(1) translateY(0); } }
      `}</style>
    </div>
  )
}
