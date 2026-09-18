'use client'

import { useState } from 'react'

export function BroadcastForm({ subscriberCount }: { subscriberCount: number }) {
  const [subject, setSubject] = useState('')
  const [content, setContent] = useState('')
  const [sending, setSending] = useState(false)
  const [result, setResult] = useState<string | null>(null)

  async function handleSend(e: React.FormEvent) {
    e.preventDefault()
    if (!subject.trim() || !content.trim()) return
    if (!confirm(`Send this email to ${subscriberCount} subscribers?`)) return

    setSending(true)
    setResult(null)

    try {
      const res = await fetch('/api/email/broadcast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject,
          content: `<h2 style="font-size: 24px; color: #F5F1EB; margin-bottom: 16px;">${subject}</h2><div style="font-size: 16px; line-height: 1.7; color: #a0a0b8;">${content.replace(/\n/g, '<br/>')}</div>`,
        }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setResult(`Sent to ${data.sent} subscribers`)
      setSubject('')
      setContent('')
    } catch (err: any) {
      setResult(`Failed: ${err?.message || 'Unknown error'}`)
    } finally {
      setSending(false)
    }
  }

  return (
    <form onSubmit={handleSend} className="mt-6 border border-border bg-card p-6">
      <p className="text-xs uppercase tracking-[0.2em] text-accent">Send to {subscriberCount} subscribers</p>

      <div className="mt-4">
        <label className="block text-xs text-muted-foreground">Subject *</label>
        <input
          type="text"
          required
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="e.g. This week's reflection"
          className="mt-1 w-full border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none"
        />
      </div>

      <div className="mt-4">
        <label className="block text-xs text-muted-foreground">Content *</label>
        <textarea
          required
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={6}
          placeholder="Write your newsletter content here..."
          className="mt-1 w-full resize-none border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none"
        />
      </div>

      {result && (
        <p className={`mt-4 text-sm ${result.startsWith('Sent') ? 'text-emerald-400' : 'text-red-400'}`}>
          {result}
        </p>
      )}

      <button
        type="submit"
        disabled={sending || subscriberCount === 0}
        className="mt-4 rounded-full bg-primary px-8 py-3 text-sm font-medium text-primary-foreground transition-all hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-50"
      >
        {sending ? 'Sending...' : `Send to ${subscriberCount} subscribers`}
      </button>
    </form>
  )
}
