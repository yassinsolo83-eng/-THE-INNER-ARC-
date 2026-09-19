'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { Constellation } from './constellation'
import { AnimatedLogo } from './animated-logo'
import { getSupabaseBrowserClient } from '@/lib/supabase/client'

const navItems = [
  { href: '/about-tarot', label: 'About tarot' },
  { href: '/services', label: 'Readings' },
  { href: '/partners', label: 'Our readers' },
  { href: '/blog', label: 'Journal' },
  { href: '/contact', label: 'Contact' },
  { href: '/terms', label: 'Terms' },
  { href: '/privacy', label: 'Privacy' },
]

function ScrollToTop() {
  const pathname = usePathname()
  const [showButton, setShowButton] = useState(false)

  // Scroll to top on route change
  useEffect(() => { window.scrollTo({ top: 0, left: 0, behavior: 'instant' }) }, [pathname])

  // Show/hide the button based on scroll position
  useEffect(() => {
    function onScroll() { setShowButton(window.scrollY > 500) }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label="Back to top"
      className={`fixed bottom-6 right-6 z-50 flex h-12 w-12 items-center justify-center rounded-full border border-accent/30 bg-background/90 text-accent shadow-lg shadow-accent/10 backdrop-blur-md transition-all duration-500 hover:-translate-y-1 hover:border-accent hover:shadow-xl hover:shadow-accent/20 active:scale-90 ${
        showButton
          ? 'translate-y-0 opacity-100'
          : 'pointer-events-none translate-y-4 opacity-0'
      }`}
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 19V5" />
        <path d="M5 12l7-7 7 7" />
      </svg>
    </button>
  )
}

export function Logo() {
  return <AnimatedLogo variant="cream" />
}

export function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [user, setUser] = useState<any>(null)
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    const supabase = getSupabaseBrowserClient()
    supabase.auth.getUser().then(({ data }: { data: any }) => setUser(data.user))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event: any, session: any) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => { setOpen(false) }, [pathname])

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 border-b border-border/60 transition-all duration-500"
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
              <Link key={item.href} href={item.href} className={`relative text-sm transition-colors duration-300 hover:text-accent ${isActive ? 'text-accent' : 'text-muted-foreground'}`}>
                {item.label}
                {isActive && <span className="absolute -bottom-1 left-0 h-px w-full bg-accent" style={{ animation: 'expandWidth 0.3s ease-out forwards' }} />}
              </Link>
            )
          })}
        </nav>
        <Link href="/services" className="hidden rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/25 md:inline-flex">Find your reading</Link>
        {user ? (
          <div className="hidden items-center gap-2 md:flex">
            <Link href="/dashboard" className="rounded-full border border-accent px-5 py-2.5 text-sm text-accent transition-all duration-300 hover:bg-accent hover:text-background">Dashboard</Link>
            <button type="button" onClick={() => { const s = getSupabaseBrowserClient(); s.auth.signOut().then(() => { window.location.href = '/' }) }} className="rounded-full border border-border px-4 py-2.5 text-xs text-muted-foreground transition-all duration-300 hover:border-red-400/50 hover:text-red-400">Sign out</button>
          </div>
        ) : (
          <Link href="/auth/login" className="hidden rounded-full border border-border px-5 py-2.5 text-sm text-muted-foreground transition-all duration-300 hover:border-accent hover:text-accent md:inline-flex">Sign in</Link>
        )}
        <button type="button" aria-expanded={open} aria-label="Toggle navigation" onClick={() => setOpen(!open)} className="relative flex h-8 w-8 flex-col items-center justify-center gap-[6px] text-accent md:hidden">
          <span className="block h-px w-6 bg-current transition-all duration-300" style={{ transform: open ? 'rotate(45deg) translate(2.5px, 2.5px)' : 'none' }} />
          <span className="block h-px w-6 bg-current transition-all duration-300" style={{ transform: open ? 'rotate(-45deg) translate(2.5px, -2.5px)' : 'none' }} />
        </button>
      </div>
      <div className="overflow-hidden bg-background transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] md:hidden" style={{ maxHeight: open ? '500px' : '0', opacity: open ? 1 : 0 }}>
        <nav className="border-t border-border/60 px-6 py-6" aria-label="Mobile navigation">
          <div className="flex flex-col gap-1">
            {navItems.map((item, i) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
              return (
                <Link key={item.href} href={item.href} onClick={() => setOpen(false)}
                  className={`rounded-lg px-3 py-3 text-base transition-all duration-300 ${isActive ? 'bg-accent/10 text-accent font-medium' : 'text-muted-foreground hover:bg-accent/5 hover:text-foreground'}`}
                  style={{ transform: open ? 'none' : 'translateX(-20px)', opacity: open ? 1 : 0, transition: `all 0.4s cubic-bezier(0.16, 1, 0.3, 1) ${i * 60}ms` }}
                >{item.label}</Link>
              )
            })}
            <Link href="/services" onClick={() => setOpen(false)} className="mt-3 rounded-full bg-primary px-6 py-3.5 text-center text-sm font-medium text-primary-foreground" style={{ opacity: open ? 1 : 0, transition: `opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1) ${navItems.length * 60}ms` }}>Find your reading</Link>
            {user ? (
              <>
                <Link href="/dashboard" onClick={() => setOpen(false)} className="mt-2 rounded-full border border-accent px-6 py-3.5 text-center text-sm text-accent" style={{ opacity: open ? 1 : 0, transition: `opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1) ${(navItems.length + 1) * 60}ms` }}>Dashboard</Link>
                <button type="button" onClick={() => { setOpen(false); const s = getSupabaseBrowserClient(); s.auth.signOut().then(() => { window.location.href = '/' }) }} className="mt-2 rounded-full border border-border px-6 py-3.5 text-center text-xs text-muted-foreground hover:border-red-400/50 hover:text-red-400" style={{ opacity: open ? 1 : 0, transition: `opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1) ${(navItems.length + 2) * 60}ms` }}>Sign out</button>
              </>
            ) : (
              <Link href="/auth/login" onClick={() => setOpen(false)} className="mt-2 rounded-full border border-border px-6 py-3.5 text-center text-sm text-muted-foreground" style={{ opacity: open ? 1 : 0, transition: `opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1) ${(navItems.length + 1) * 60}ms` }}>Sign in</Link>
            )}
          </div>
        </nav>
      </div>
    </header>
  )
}

export function Footer() {
  const [whatsapp, setWhatsapp] = useState('')
  const [contactEmail, setContactEmail] = useState('')

  useEffect(() => {
    async function loadSettings() {
      try {
        const supabase = getSupabaseBrowserClient()
        const { data } = await supabase.from('platform_settings').select('key, value')
        for (const row of data || []) {
          if (row.key === 'whatsapp_number') setWhatsapp(row.value)
          if (row.key === 'contact_email') setContactEmail(row.value)
        }
      } catch {}
    }
    loadSettings()
  }, [])

  return (
    <footer className="border-t border-border/60 bg-card">
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-10">
        <div className="flex flex-col gap-10 lg:flex-row lg:justify-between">
          <div>
            <Logo />
            <p className="mt-4 max-w-xs text-sm leading-6 text-muted-foreground">
              A thoughtful space for reflection, symbolism, and the questions that stay with you.
            </p>
            <div className="mt-4 flex flex-wrap gap-4">
              {whatsapp && (
                <a
                  href={`https://wa.me/${whatsapp.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative inline-flex items-center gap-2 rounded-full border border-[#25D366]/30 bg-[#25D366]/10 px-4 py-2 text-sm text-[#25D366] transition-all hover:bg-[#25D366]/20"
                >
                  <span className="absolute -left-1 -top-1 h-3 w-3 animate-ping rounded-full bg-[#25D366]/40" />
                  <span className="relative h-2 w-2 rounded-full bg-[#25D366]" />
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                  WhatsApp
                </a>
              )}
              {contactEmail && (
                <a
                  href={`mailto:${contactEmail}`}
                  className="text-sm text-muted-foreground transition-colors hover:text-accent"
                >
                  {contactEmail}
                </a>
              )}
            </div>
          </div>
          <div className="flex flex-col gap-6 sm:flex-row sm:gap-12">
            <div className="flex flex-col gap-3 text-sm text-muted-foreground">
              {navItems.map((item) => (
                <Link key={item.href} href={item.href} className="transition-colors duration-300 hover:text-accent">
                  {item.label}
                </Link>
              ))}
            </div>
            <div className="flex flex-col gap-3 text-sm text-muted-foreground">
              <Link href="/terms" className="transition-colors duration-300 hover:text-accent">Terms of Service</Link>
              <Link href="/privacy" className="transition-colors duration-300 hover:text-accent">Privacy Policy</Link>
            </div>
          </div>
        </div>
        <div className="mt-10 border-t border-border/40 pt-6 text-center text-xs text-muted-foreground">
          © 2026 The Inner Arc. All rights reserved.
        </div>
      </div>
    </footer>
  )
}

export function SiteShell({ children }: { children: React.ReactNode }) {
  return <>
    <ScrollToTop />
    <Constellation />
    <div className="relative z-10 pt-[72px]">
      <Navbar />
      {children}
      <Footer />
    </div>
  </>
}

export function SectionHeading({ eyebrow, title, children, align = 'left' }: { eyebrow?: string; title: string; children?: React.ReactNode; align?: 'left' | 'center' }) {
  return (
    <div className={`${align === 'center' ? 'mx-auto text-center' : ''} max-w-2xl`}>
      <div className="mb-5 flex items-center gap-3 text-xs uppercase tracking-[0.24em] text-accent">
        <span className="glow-line h-px w-8" />
        {eyebrow || 'The inner arc'}
      </div>
      <h2 className="shimmer-text font-serif text-4xl leading-tight tracking-tight md:text-5xl text-balance">{title}</h2>
      {children && <div className="mt-5 text-base leading-7 text-muted-foreground">{children}</div>}
    </div>
  )
}

export function ArrowLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (<Link href={href} className="group inline-flex items-center gap-3 text-sm font-medium text-accent">{children}<span className="transition-transform duration-300 group-hover:translate-x-1.5">→</span></Link>)
}

export function NewsletterForm() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('loading')
    try {
      const res = await fetch('/api/email/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      if (!res.ok) throw new Error()
      setStatus('done')
      setEmail('')
    } catch {
      setStatus('error')
    }
  }

  if (status === 'done') {
    return (
      <p className="rounded-full border border-emerald-500/30 bg-emerald-950/30 px-6 py-3 text-center text-sm text-emerald-400">
        You are on the list ✓
      </p>
    )
  }

  return (
    <form className="flex w-full max-w-md flex-col gap-3 sm:flex-row" onSubmit={handleSubmit}>
      <label className="sr-only" htmlFor="newsletter-email">Email address</label>
      <input
        id="newsletter-email"
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Your email address"
        className="min-w-0 flex-1 rounded-full border border-border bg-background px-5 py-3 text-sm text-foreground outline-none transition-all duration-300 placeholder:text-muted-foreground focus:border-accent focus:shadow-[0_0_0_3px_rgba(212,165,165,0.1)]"
      />
      <button
        disabled={status === 'loading'}
        className="rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/25 active:scale-95 disabled:opacity-50"
      >
        {status === 'loading' ? '...' : 'Join the list'}
      </button>
      {status === 'error' && <p className="text-xs text-red-400">Something went wrong</p>}
    </form>
  )
}
