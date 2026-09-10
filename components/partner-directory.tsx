'use client'

import Link from 'next/link'
import { useState } from 'react'
import type { Partner } from '@/lib/partners'

export function PartnerDirectory({ partners, filters }: { partners: Partner[]; filters: string[] }) {
  const [active, setActive] = useState(filters[0])
  const visible = active === filters[0] ? partners : partners.filter((partner) => partner.tags.includes(active))
  return <>
    <div className="flex flex-wrap gap-2" aria-label="Filter readers">{filters.map((filter) => <button key={filter} type="button" onClick={() => setActive(filter)} className={`rounded-full border px-4 py-2 text-xs transition-colors ${active === filter ? 'border-accent bg-accent text-background' : 'border-border text-muted-foreground hover:border-accent hover:text-accent'}`}>{filter}</button>)}</div>
    <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">{visible.map((partner) => <Link key={partner.slug} href={`/partners/${partner.slug}`} className="group border border-border bg-card p-5 transition-transform hover:-translate-y-1"><div className="relative aspect-[4/3] overflow-hidden bg-muted"><img src={partner.photo} alt={`${partner.name}, tarot reader`} className="h-full w-full object-cover grayscale-[20%] transition-transform duration-500 group-hover:scale-105" />{partner.featured && <span className="absolute left-4 top-4 border border-accent bg-background/90 px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-accent">Featured</span>}</div><div className="flex items-start justify-between gap-4 pt-5"><div><h2 className="font-serif text-2xl text-foreground">{partner.name}</h2><p className="mt-2 text-sm leading-6 text-muted-foreground">{partner.specialty}</p></div><span className="text-xl text-accent transition-transform group-hover:translate-x-1">↗</span></div><p className="mt-5 text-xs uppercase tracking-[0.14em] text-accent">{partner.yearsExperience} years reading</p></Link>)}</div>{visible.length === 0 && <p className="border border-dashed border-border py-12 text-center text-sm text-muted-foreground">No readers in this collection yet.</p>}</>
}
