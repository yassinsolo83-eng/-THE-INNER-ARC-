'use client'

import { useState } from 'react'
import { useKeyhole } from '@/hooks/useKeyhole'

// Keyhole path — a classic keyhole shape (circle + tapered stem)
const KEYHOLE_PATH =
  'M50 8 C38 8 28 18 28 32 C28 42 34 50 42 54 L34 88 L66 88 L58 54 C66 50 72 42 72 32 C72 18 62 8 50 8 Z'

export function KeyholeHero({ children }: { children: React.ReactNode }) {
  const [introDone, setIntroDone] = useState(false)
  useKeyhole({ setIntroDone })

  return (
    <div id="kh-track" className="kh-track">
      <div className="kh-stage">
        {/* The hero content, revealed through the keyhole */}
        <div className={`kh-hero-content ${introDone ? 'kh-text-in' : 'kh-text-out'}`}>
          {children}
        </div>

        {/* Keyhole overlay */}
        <div className={`kh-overlay ${introDone ? 'kh-open' : ''}`}>
          <svg className="kh-svg" preserveAspectRatio="xMidYMid slice" viewBox="0 0 1000 1000" aria-hidden="true">
            <defs>
              <mask id="kh-mask">
                <rect width="1000" height="1000" fill="white" />
                <path
                  id="kh-hole"
                  fill="black"
                  transform="translate(500 460) scale(11) translate(-50 -50)"
                  d={KEYHOLE_PATH}
                />
              </mask>
            </defs>
            <rect id="kh-dark" width="1000" height="1000" fill="#050813" fillOpacity="1" mask="url(#kh-mask)" />
            <path
              id="kh-ring"
              fill="none"
              stroke="#B76E79"
              strokeWidth="0.8"
              transform="translate(500 460) scale(11) translate(-50 -50)"
              d={KEYHOLE_PATH}
            />
          </svg>
          <div id="kh-hint" className="kh-hint">Scroll to enter <span>↓</span></div>
        </div>
      </div>
    </div>
  )
}
