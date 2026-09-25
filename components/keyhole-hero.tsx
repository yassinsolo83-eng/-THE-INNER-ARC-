'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useKeyhole } from '@/hooks/useKeyhole'

// Classic keyhole shape (circle head + flaring stem), drawn around 50,50
const KH = 'M50 8 C38 8 28 18 28 32 C28 42 34 50 42 54 L34 88 L66 88 L58 54 C66 50 72 42 72 32 C72 18 62 8 50 8 Z'

export function KeyholeHero({ image }: { image: string }) {
  const [introDone, setIntroDone] = useState(false)
  useKeyhole({ setIntroDone })

  return (
    <div id="kh-track" className="kh-track">
      <div className="kh-stage">
        {/* Hero (the site behind the door) */}
        <section className="kh-hero" style={{ backgroundImage: `url(${image})` }}>
          <div className="kh-hero-shade" />
          <div className={`kh-hero-content ${introDone ? 'kh-text-in' : 'kh-text-out'}`}>
            <p className="text-xs uppercase tracking-[0.3em] text-accent">A considered approach to tarot</p>
            <h1 className="mt-4 font-serif text-5xl leading-[0.98] text-foreground md:text-7xl">
              Make room for what you already know.
            </h1>
            <p className="mt-6 max-w-xl text-lg text-muted-foreground">
              Private readings for moments of change, curiosity, and return.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="/quiz" className="rounded-full bg-primary px-7 py-3.5 text-sm font-medium text-primary-foreground transition-all hover:-translate-y-0.5 hover:shadow-lg">
                Explore readings
              </Link>
            </div>
          </div>
        </section>

        {/* Frosted glass — blurs the hero while the keyhole is closed */}
        <div id="kh-frost" className={`kh-frost ${introDone ? 'kh-open' : ''}`} />

        {/* Keyhole overlay */}
        <div className={`kh-overlay ${introDone ? 'kh-open' : ''}`}>
          <svg className="kh-svg" preserveAspectRatio="xMidYMid slice" viewBox="0 0 1000 1000" aria-hidden="true">
            <defs>
              <mask id="kh-mask">
                <rect width="1000" height="1000" fill="white" />
                <path id="kh-hole" fill="black" transform="translate(500 500) scale(3.6) translate(-50 -50)" d={KH} />
              </mask>
            </defs>
            <rect id="kh-dark" width="1000" height="1000" fill="#070b1e" fillOpacity="0.9" mask="url(#kh-mask)" />
            <path id="kh-ring" fill="none" stroke="#B76E79" strokeWidth="1.2" transform="translate(500 500) scale(3.6) translate(-50 -50)" d={KH} />
          </svg>
          <div id="kh-hint" className="kh-hint">Scroll to enter <span>↓</span></div>
        </div>
      </div>
    </div>
  )
}
