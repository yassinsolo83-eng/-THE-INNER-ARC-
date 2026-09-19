'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { getSupabaseBrowserClient } from '@/lib/supabase/client'

export function WhatsAppFooter({ number }: { number: string }) {
  const [user, setUser] = useState<any>(null)
  const [birthData, setBirthData] = useState<any>(null)
  const [userName, setUserName] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [formName, setFormName] = useState('')
  const [formBirthDate, setFormBirthDate] = useState('')
  const [formQuestion, setFormQuestion] = useState('')
  const [loading, setLoading] = useState(true)

  const cleanNumber = number.replace(/[^0-9]/g, '')

  useEffect(() => {
    async function load() {
      try {
        const supabase = getSupabaseBrowserClient()
        const { data: { user } } = await supabase.auth.getUser()
        setUser(user)

        if (user) {
          const { data: profile } = await supabase.from('profiles').select('first_name, full_name').eq('id', user.id).single()
          setUserName(profile?.first_name || profile?.full_name?.split(' ')[0] || '')

          const { data: birth } = await supabase.from('client_birth_profiles').select('*').eq('client_id', user.id).single()
          if (birth) setBirthData(birth)
        }
      } catch {}
      setLoading(false)
    }
    load()
  }, [])

  function buildLoggedInMessage() {
    let msg = `Hello, I'm ${userName} from The Inner Arc.\n\n`
    if (birthData) {
      msg += `My details:\n`
      msg += `- Name: ${userName}\n`
      msg += `- Birth date: ${birthData.birth_date || 'Not set'}\n`
      msg += `- Birth time: ${birthData.birth_time || 'Unknown'}\n`
      msg += `- Birth place: ${birthData.birth_city || '?'}, ${birthData.birth_country || '?'}\n`
      msg += `- Zodiac sign: ${birthData.zodiac_sign || 'Not set'}\n`
      if (birthData.gender) msg += `- Gender: ${birthData.gender}\n`
      if (birthData.relationship_status) msg += `- Status: ${birthData.relationship_status.replace(/_/g, ' ')}\n`
    }
    msg += `\nI would like to inquire about: `
    return encodeURIComponent(msg)
  }

  function buildGuestMessage() {
    let msg = `Hello, I'm contacting you from The Inner Arc.\n\n`
    msg += `My details:\n`
    msg += `- Name: ${formName}\n`
    if (formBirthDate) msg += `- Birth date: ${formBirthDate}\n`
    if (formQuestion) msg += `\nMy question: ${formQuestion}\n`
    return encodeURIComponent(msg)
  }

  function handleGuestSubmit(e: React.FormEvent) {
    e.preventDefault()
    const url = `https://wa.me/${cleanNumber}?text=${buildGuestMessage()}`
    window.open(url, '_blank')
    setShowForm(false)
  }

  if (loading) return null

  // Logged in: direct WhatsApp with pre-filled data
  if (user) {
    return (
      <a
        href={`https://wa.me/${cleanNumber}?text=${buildLoggedInMessage()}`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 rounded-full border border-[#25D366]/30 bg-[#25D366]/10 px-4 py-2 text-sm text-[#25D366] transition-all hover:bg-[#25D366]/20"
      >
        <span className="relative flex h-2.5 w-2.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#25D366] opacity-50" />
          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#25D366]" />
        </span>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
        WhatsApp
      </a>
    )
  }

  // Not logged in: show form or button to open form
  if (showForm) {
    return (
      <div className="w-full max-w-sm">
        <form onSubmit={handleGuestSubmit} className="space-y-3 rounded-lg border border-border bg-background p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-accent">Your details</p>
          <input
            type="text"
            required
            value={formName}
            onChange={(e) => setFormName(e.target.value)}
            placeholder="Your name *"
            className="w-full border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none"
          />
          <input
            type="date"
            value={formBirthDate}
            onChange={(e) => setFormBirthDate(e.target.value)}
            className="w-full border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-accent focus:outline-none"
          />
          <textarea
            value={formQuestion}
            onChange={(e) => setFormQuestion(e.target.value)}
            placeholder="What would you like to ask?"
            rows={2}
            className="w-full resize-none border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none"
          />
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={!formName.trim()}
              className="flex-1 rounded-full bg-[#25D366] px-4 py-2 text-sm font-medium text-white transition-all hover:bg-[#20bd5a] disabled:opacity-50"
            >
              Open WhatsApp
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="rounded-full border border-border px-3 py-2 text-xs text-muted-foreground hover:text-accent"
            >
              Cancel
            </button>
          </div>
          <Link href="/auth/signup" className="block text-center text-xs text-accent hover:underline">
            Or create an account for a better experience →
          </Link>
        </form>
      </div>
    )
  }

  return (
    <button
      type="button"
      onClick={() => setShowForm(true)}
      className="inline-flex items-center gap-2 rounded-full border border-[#25D366]/30 bg-[#25D366]/10 px-4 py-2 text-sm text-[#25D366] transition-all hover:bg-[#25D366]/20"
    >
      <span className="relative flex h-2.5 w-2.5">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#25D366] opacity-50" />
        <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#25D366]" />
      </span>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
      WhatsApp
    </button>
  )
}
