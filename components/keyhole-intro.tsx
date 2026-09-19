'use client'

import { useState, useEffect } from 'react'

export function KeyholeIntro() {
  const [phase, setPhase] = useState<'keyhole' | 'expanding' | 'done'>('keyhole')

  useEffect(() => {
    // Check if already shown this session
    if (typeof window !== 'undefined' && sessionStorage.getItem('intro-shown')) {
      setPhase('done')
      return
    }

    const t1 = setTimeout(() => setPhase('expanding'), 2200)
    const t2 = setTimeout(() => {
      setPhase('done')
      sessionStorage.setItem('intro-shown', '1')
    }, 3200)

    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [])

  if (phase === 'done') return null

  return (
    <div
      className="fixed inset-0 z-[9999] pointer-events-none"
      style={{ transition: 'opacity 0.6s ease', opacity: phase === 'expanding' ? 0 : 1 }}
    >
      {/* Dark overlay with keyhole cutout */}
      <div className="absolute inset-0" style={{
        background: '#070b1e',
        maskImage: phase === 'keyhole'
          ? `radial-gradient(ellipse 80px 100px at 50% 38%, transparent 99%, black 100%),
             linear-gradient(to bottom, transparent 38%, black 38%, black 42%, transparent 42%),
             radial-gradient(ellipse 40px 80px at 50% 58%, transparent 99%, black 100%)`
          : 'none',
        WebkitMaskImage: phase === 'keyhole'
          ? `radial-gradient(ellipse 80px 100px at 50% 38%, transparent 99%, black 100%),
             linear-gradient(to bottom, transparent 38%, black 38%, black 42%, transparent 42%),
             radial-gradient(ellipse 40px 80px at 50% 58%, transparent 99%, black 100%)`
          : 'none',
        maskComposite: 'intersect',
        WebkitMaskComposite: 'source-in',
      }}>
        {/* Simple overlay approach instead */}
      </div>

      {/* Simpler approach: SVG keyhole mask */}
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 1000 1000" preserveAspectRatio="none">
        <defs>
          <mask id="keyhole-mask">
            <rect width="1000" height="1000" fill="white" />
            <g className={phase === 'keyhole' ? 'keyhole-shape' : 'keyhole-shape keyhole-expand'}>
              {/* Circle top */}
              <circle cx="500" cy="380" r="70" fill="black" />
              {/* Trapezoid bottom */}
              <polygon points="465,420 535,420 555,600 445,600" fill="black" />
            </g>
          </mask>
        </defs>
        <rect
          width="1000" height="1000"
          fill="#070b1e"
          mask="url(#keyhole-mask)"
          className={phase === 'expanding' ? 'keyhole-fade' : ''}
        />
      </svg>

      {/* Glow effect around keyhole */}
      {phase === 'keyhole' && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className="h-[300px] w-[140px] rounded-full opacity-20"
            style={{
              background: 'radial-gradient(ellipse, rgba(183,110,121,0.4) 0%, transparent 70%)',
              animation: 'pulse 2s ease-in-out infinite',
            }}
          />
        </div>
      )}

      <style jsx>{`
        .keyhole-expand circle {
          animation: expandCircle 1s ease-in-out forwards;
        }
        .keyhole-expand polygon {
          animation: expandPoly 1s ease-in-out forwards;
        }
        .keyhole-fade {
          animation: fadeOverlay 1s ease-out forwards;
        }
        @keyframes expandCircle {
          to { r: 800; cy: 500; }
        }
        @keyframes expandPoly {
          to { opacity: 0; }
        }
        @keyframes fadeOverlay {
          to { opacity: 0; }
        }
      `}</style>
    </div>
  )
}
