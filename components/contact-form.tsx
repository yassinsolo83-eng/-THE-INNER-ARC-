'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { getSupabaseBrowserClient } from '@/lib/supabase/client'

export function ContactForm() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function checkAuth() {
      const supabase = getSupabaseBrowserClient()
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      if (user) {
        setEmail(user.email || '')
        const { data: profile } = await supabase.from('profiles').select('full_name, first_name').eq('id', user.id).single()
        if (profile) setName(profile.full_name || profile.first_name || '')
      }
      setLoading(false)
    }
    checkAuth()
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSending(true)
    setError(null)

    try {
      const supabase = getSupabaseBrowserClient()
      const { error: dbError } = await supabase
        .from('contact_messages')
        .insert({ name, email, message })

      if (dbError) throw dbError
      fetch('/api/email/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email }),
      }).catch(() => {})
      setSent(true)
    } catch (err: any) {
      setError(err?.message || 'Failed to send. Please try again.')
    } finally {
      setSending(false)
    }
  }

  if (loading) return null

  if (!user) {
    return (
      <div className="py-12 text-center">
        <span className="text-3xl">🔒</span>
        <p className="mt-4 font-serif text-xl text-foreground">Sign in to send a message</p>
        <p className="mt-2 text-sm text-muted-foreground">
          Please sign in or create an account to contact us.
        </p>
        <Link
          href="/auth/login?redirect=/contact"
          className="mt-6 inline-flex rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-all hover:-translate-y-0.5 hover:shadow-lg"
        >
          Sign in
        </Link>
      </div>
    )
  }

  if (sent) {
    return (
      <div className="py-12 text-center">
        <span className="text-4xl">✨</span>
        <p className="mt-4 font-serif text-2xl text-foreground">Message sent</p>
        <p className="mt-2 text-sm text-muted-foreground">
          Thank you for reaching out. We will get back to you within 2-3 working days.
        </p>
      </div>
    )
  }

  return (
    <form className="space-y-8" onSubmit={handleSubmit}>
      <div className="grid gap-8 md:grid-cols-2">
        <div>
          <label htmlFor="contact-name" className="block text-sm text-muted-foreground">Your name</label>
          <input
            id="contact-name"
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-2 w-full border-b border-border bg-transparent pb-3 text-sm text-foreground outline-none transition-colors focus:border-accent"
          />
        </div>
        <div>
          <label htmlFor="contact-email" className="block text-sm text-muted-foreground">Email address</label>
          <input
            id="contact-email"
            type="email"
            required
            value={email}
            readOnly
            className="mt-2 w-full border-b border-border bg-transparent pb-3 text-sm text-foreground/60 outline-none"
          />
        </div>
      </div>
      <div>
        <label htmlFor="contact-message" className="block text-sm text-muted-foreground">What&apos;s on your mind?</label>
        <textarea
          id="contact-message"
          rows={4}
          required
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="mt-2 w-full resize-none border-b border-border bg-transparent pb-3 text-sm text-foreground outline-none transition-colors focus:border-accent"
        />
      </div>

      {error && <p className="text-sm text-red-400">{error}</p>}

      <button
        type="submit"
        disabled={sending}
        className="rounded-full bg-primary px-7 py-3.5 text-sm font-medium text-primary-foreground transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/25 disabled:opacity-50"
      >
        {sending ? 'Sending...' : 'Send your note'}
      </button>
    </form>
  )
}
