'use client'

import Link from 'next/link'
import { useState } from 'react'
import type { Partner } from '@/lib/partners'

export function PartnerDirectory({ partners, filters }: { partners: Partner[]; filters: string[] }) {
  const [active, setActive] = useState(filters[0])
  const visible = active === filters[0] ? partners : partners.filter((p) => p.tags.includes(active))

  return (
    <>
      {/* Filter pills */}
      <div className="flex flex-wrap gap-2" aria-label="Filter readers">
        {filters.map((filter) => (
          <button
            key={filter}
            type="button"
            onClick={() => setActive(filter)}
            className={`rounded-full border px-4 py-2.5 text-xs transition-all duration-300 ${
              active === filter
                ? 'border-accent bg-accent text-background shadow-md shadow-accent/20'
                : 'border-border text-muted-foreground hover:border-accent hover:text-accent'
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Partner cards */}
      <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {visible.map((partner, i) => (
          <Link
            key={partner.slug}
            href={`/partners/${partner.slug}`}
            className="group border border-border bg-card p-5 transition-all duration-500 hover:-translate-y-1.5 hover:border-accent/40 hover:shadow-xl hover:shadow-accent/5"
            style={{
              animation: `fadeSlideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${i * 80}ms both`,
            }}
          >
            <div className="relative aspect-[4/3] overflow-hidden bg-muted">
              <img
                src={partner.photo}
                alt={`${partner.name}, tarot reader`}
                className="h-full w-full object-cover grayscale-[20%] transition-all duration-700 group-hover:scale-105 group-hover:grayscale-0"
              />
              {partner.featured && (
                <span className="absolute left-4 top-4 border border-accent bg-background/90 px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-accent backdrop-blur-sm">
                  Featured
                </span>
              )}
            </div>
            <div className="flex items-start justify-between gap-4 pt-5">
              <div>
                <h2 className="font-serif text-2xl text-foreground">{partner.name}</h2>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{partner.specialty}</p>
              </div>
              <span className="text-xl text-accent transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1">↗</span>
            </div>
            <p className="mt-5 text-xs uppercase tracking-[0.14em] text-accent">{partner.yearsExperience} years reading</p>
          </Link>
        ))}
      </div>

      {visible.length === 0 && (
        <p className="border border-dashed border-border py-12 text-center text-sm text-muted-foreground">
          No readers in this collection yet.
        </p>
      )}

      <style jsx>{`
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  )
}
