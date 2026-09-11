'use client'

import Link from 'next/link'
import { useState, useEffect, useRef } from 'react'
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
      <img src="/logo-cream-on-dark.svg" alt="The Inner Arc" className="h-8 w-auto" />
    </Link>
  )
}

export function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close menu on route change
  useEffect(() => { setOpen(false) }, [pathname])

  return (
    <header
      className="sticky top-0 z-50 border-b border-border/60 transition-all duration-500"
      style={{
        background: scrolled ? 'rgba(15, 18, 41, 0.95)' : 'rgba(15, 18, 41, 0.7)',
        backdropFilter: 'blur(20px) saturate(180%)',
        WebkitBackdropFilter: 'blur(20px) saturate(180%)',
      }}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-10">
        <Logo />
        <nav className="hidden items-center gap-8 md:flex" aria-label="Main navigation">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative text-sm transition-colors duration-300 hover:text-accent ${isActive ? 'text-accent' : 'text-muted-foreground'}`}
              >
                {item.label}
                {isActive && <span className="absolute -bottom-1 left-0 h-px w-full bg-accent" style={{ animation: 'expandWidth 0.3s ease-out forwards' }} />}
              </Link>
            )
          })}
        </nav>
        <Link
          href="/services"
          className="hidden rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/25 md:inline-flex"
        >
          Find your reading
        </Link>
        {/* Mobile hamburger with animation */}
        <button
          type="button"
          aria-expanded={open}
          aria-label="Toggle navigation"
          onClick={() => setOpen(!open)}
          className="relative flex h-8 w-8 flex-col items-center justify-center gap-[6px] text-accent md:hidden"
        >
          <span
            className="block h-px w-6 bg-current transition-all duration-300"
            style={{ transform: open ? 'rotate(45deg) translate(2.5px, 2.5px)' : 'none' }}
          />
          <span
            className="block h-px w-6 bg-current transition-all duration-300"
            style={{ transform: open ? 'rotate(-45deg) translate(2.5px, -2.5px)' : 'none', opacity: open ? 1 : 1 }}
          />
        </button>
      </div>
      {/* Mobile menu with smooth slide */}
      <div
        className="overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] md:hidden"
        style={{ maxHeight: open ? '400px' : '0', opacity: open ? 1 : 0 }}
      >
        <nav className="border-t border-border/60 px-6 py-6" aria-label="Mobile navigation">
          <div className="flex flex-col gap-1">
            {navItems.map((item, i) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={`rounded-lg px-3 py-3 text-base transition-all duration-300 ${isActive ? 'bg-accent/10 text-accent font-medium' : 'text-muted-foreground hover:bg-accent/5 hover:text-foreground'}`}
                  style={{
                    transform: open ? 'none' : 'translateX(-20px)',
                    opacity: open ? 1 : 0,
                    transition: `all 0.4s cubic-bezier(0.16, 1, 0.3, 1) ${i * 60}ms`,
                  }}
                >
                  {item.label}
                </Link>
              )
            })}
            <Link
              href="/services"
              onClick={() => setOpen(false)}
              className="mt-3 rounded-full bg-primary px-6 py-3.5 text-center text-sm font-medium text-primary-foreground transition-transform hover:-translate-y-0.5"
              style={{
                opacity: open ? 1 : 0,
                transition: `opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1) ${navItems.length * 60}ms`,
              }}
            >
              Find your reading
            </Link>
          </div>
        </nav>
      </div>
    </header>
  )
}

export function Footer() {
  return (
    <footer className="border-t border-border/60 bg-card">
      <div className="mx-auto flex max-w-7xl flex-col gap-10 px-6 py-12 lg:flex-row lg:items-end lg:justify-between lg:px-10">
        <div>
          <Logo />
          <p className="mt-4 max-w-xs text-sm leading-6 text-muted-foreground">
            A thoughtful space for reflection, symbolism, and the questions that stay with you.
          </p>
        </div>
        <div className="flex flex-wrap gap-x-6 gap-y-3 text-sm text-muted-foreground">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="transition-colors duration-300 hover:text-accent">{item.label}</Link>
          ))}
          <span>© 2026 The Inner Arc</span>
        </div>
      </div>
    </footer>
  )
}

export function SiteShell({ children }: { children: React.ReactNode }) {
  return <><Navbar />{children}<Footer /></>
}

export function SectionHeading({ eyebrow, title, children, align = 'left' }: { eyebrow?: string; title: string; children?: React.ReactNode; align?: 'left' | 'center' }) {
  return (
    <div className={`${align === 'center' ? 'mx-auto text-center' : ''} max-w-2xl`}>
      <div className="mb-5 flex items-center gap-3 text-xs uppercase tracking-[0.24em] text-accent">
        <span className="h-px w-8 bg-accent" />
        {eyebrow || 'The inner arc'}
      </div>
      <h2 className="font-serif text-4xl leading-tight tracking-tight text-foreground md:text-5xl text-balance">{title}</h2>
      {children && <div className="mt-5 text-base leading-7 text-muted-foreground">{children}</div>}
    </div>
  )
}

export function ArrowLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="group inline-flex items-center gap-3 text-sm font-medium text-accent">
      {children}
      <span className="transition-transform duration-300 group-hover:translate-x-1.5">→</span>
    </Link>
  )
}

export function NewsletterForm() {
  return (
    <form className="flex w-full max-w-md flex-col gap-3 sm:flex-row" onSubmit={(e) => e.preventDefault()}>
      <label className="sr-only" htmlFor="newsletter-email">Email address</label>
      <input
        id="newsletter-email"
        type="email"
        required
        placeholder="Your email address"
        className="min-w-0 flex-1 rounded-full border border-border bg-background px-5 py-3 text-sm text-foreground outline-none transition-all duration-300 placeholder:text-muted-foreground focus:border-accent focus:shadow-[0_0_0_3px_rgba(212,165,165,0.1)]"
      />
      <button className="rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/25 active:scale-95">
        Join the list
      </button>
    </form>
  )
}
