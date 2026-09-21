'use client'

import { useState } from 'react'
import { useKeyhole } from '@/hooks/useKeyhole'

const KEYHOLE_PATH =
  'M50 8 C38 8 28 18 28 32 C28 42 34 50 42 54 L34 88 L66 88 L58 54 C66 50 72 42 72 32 C72 18 62 8 50 8 Z'

export function KeyholeHero({ image }: { image: string }) {
  const [introDone, setIntroDone] = useState(false)
  useKeyhole({ setIntroDone })

  return (
    <div id="kh-track" className="kh-track">
      <div className="kh-stage">
        {/* Background image fills the sticky stage (which fills the screen) */}
        <div
          className="kh-bg"
          style={{ backgroundImage: `url(${image})` }}
        />

        {/* Keyhole overlay */}
        <div className={`kh-overlay ${introDone ? 'kh-open' : ''}`}>
          <svg className="kh-svg" preserveAspectRatio="xMidYMid slice" viewBox="0 0 1000 1000" aria-hidden="true">
            <defs>
              <filter id="kh-soft"><feGaussianBlur stdDeviation="2.5" /></filter>
              <mask id="kh-mask">
                <rect width="1000" height="1000" fill="white" />
                <path
                  id="kh-hole"
                  fill="black"
                  filter="url(#kh-soft)"
                  transform="translate(500 460) scale(3.6) translate(-50 -32)"
                  d={KEYHOLE_PATH}
                />
              </mask>
            </defs>
            <rect id="kh-dark" width="1000" height="1000" fill="#070b1e" fillOpacity="1" mask="url(#kh-mask)" />
          </svg>
          <div id="kh-hint" className="kh-hint">Scroll to enter <span>↓</span></div>
        </div>
      </div>
    </div>
  )
}
