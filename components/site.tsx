'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { usePathname } from 'next/navigation'

const navItems = [
  { href: '/about-tarot', label: 'About tarot' },
  { href: '/services', label: 'Readings' },
  { href: '/partners', label: 'Our readers' },
  { href: '/blog', label: 'Journal' },
  { href: '/contact', label: 'Contact' },
]

export function Logo() {
  return (
    <Link href="/" aria-label="The Inner Arc home">
      <Image src="/images/logo-cream-on-dark.svg" alt="The Inner Arc" width={200} height={40} className="h-8 w-auto" priority />
    </Link>
  )
}

export function Navbar() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-10">
        <Logo />
        <nav className="hidden items-center gap-8 md:flex" aria-label="Main navigation">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
            return <Link key={item.href} href={item.href} className={`text-sm transition-colors hover:text-accent ${isActive ? 'text-accent border-b border-accent pb-0.5' : 'text-muted-foreground'}`}>{item.label}</Link>
          })}
        </nav>
        <Link href="/services" className="hidden rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-transform hover:-translate-y-0.5 md:inline-flex">Find your reading</Link>
        <button type="button" aria-expanded={open} aria-label="Toggle navigation" onClick={() => setOpen(!open)} className="text-accent md:hidden">
          <span className="block h-px w-6 bg-current" /><span className="mt-2 block h-px w-6 bg-current" />
        </button>
      </div>
      {open && <nav className="border-t border-border/60 px-6 py-5 md:hidden" aria-label="Mobile navigation"><div className="flex flex-col gap-5">{navItems.map((item) => {
        const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
        return <Link onClick={() => setOpen(false)} key={item.href} href={item.href} className={`text-sm ${isActive ? 'text-accent font-medium' : 'text-muted-foreground'}`}>{item.label}</Link>
      })}<Link onClick={() => setOpen(false)} href="/services" className="text-sm font-medium text-accent">Find your reading →</Link></div></nav>}
    </header>
  )
}

export function Footer() {
  return <footer className="border-t border-border/60 bg-card"><div className="mx-auto flex max-w-7xl flex-col gap-10 px-6 py-12 lg:flex-row lg:items-end lg:justify-between lg:px-10"><div><Logo /><p className="mt-4 max-w-xs text-sm leading-6 text-muted-foreground">A thoughtful space for reflection, symbolism, and the questions that stay with you.</p></div><div className="flex flex-wrap gap-x-6 gap-y-3 text-sm text-muted-foreground">{navItems.map((item) => <Link key={item.href} href={item.href} className="hover:text-accent">{item.label}</Link>)}<span>© 2026 The Inner Arc</span></div></div></footer>
}

export function SiteShell({ children }: { children: React.ReactNode }) { return <><Navbar />{children}<Footer /></> }

export function SectionHeading({ eyebrow, title, children, align = 'left' }: { eyebrow?: string; title: string; children?: React.ReactNode; align?: 'left' | 'center' }) {
  return <div className={`${align === 'center' ? 'mx-auto text-center' : ''} max-w-2xl`}><div className="mb-5 flex items-center gap-3 text-xs uppercase tracking-[0.24em] text-accent"><span className="h-px w-8 bg-accent" />{eyebrow || 'The inner arc'}</div><h2 className="font-serif text-4xl leading-tight tracking-tight text-foreground md:text-5xl text-balance">{title}</h2>{children && <div className="mt-5 text-base leading-7 text-muted-foreground">{children}</div>}</div>
}

export function ArrowLink({ href, children }: { href: string; children: React.ReactNode }) { return <Link href={href} className="group inline-flex items-center gap-3 text-sm font-medium text-accent">{children}<span className="transition-transform group-hover:translate-x-1">→</span></Link> }

export function NewsletterForm() { return <form className="flex w-full max-w-md flex-col gap-3 sm:flex-row" onSubmit={(event) => event.preventDefault()}><label className="sr-only" htmlFor="newsletter-email">Email address</label><input id="newsletter-email" type="email" required placeholder="Your email address" className="min-w-0 flex-1 rounded-full border border-border bg-background px-5 py-3 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-accent" /><button className="rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-transform hover:-translate-y-0.5">Join the list</button></form> }
