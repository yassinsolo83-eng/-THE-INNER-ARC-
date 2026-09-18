'use client'

import { useRouter } from 'next/navigation'
import { getSupabaseBrowserClient } from '@/lib/supabase/client'

export function MessagesList({ messages }: { messages: any[] }) {
  const router = useRouter()

  async function toggleRead(id: string, currentRead: boolean) {
    const supabase = getSupabaseBrowserClient()
    await supabase
      .from('contact_messages')
      .update({ is_read: !currentRead })
      .eq('id', id)
    router.refresh()
  }

  if (!messages.length) {
    return (
      <p className="mt-4 border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
        No messages yet.
      </p>
    )
  }

  return (
    <div className="mt-4 space-y-3">
      {messages.map((m: any) => (
        <div
          key={m.id}
          className={`border bg-card p-5 transition-colors ${
            m.is_read ? 'border-border' : 'border-accent/30'
          }`}
        >
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3">
                <p className="font-serif text-lg text-foreground">{m.name}</p>
                {!m.is_read && (
                  <span className="rounded-full bg-accent/20 px-2 py-0.5 text-[10px] text-accent">New</span>
                )}
              </div>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {m.email} · {new Date(m.created_at).toLocaleString()}
              </p>
            </div>
            <button
              type="button"
              onClick={() => toggleRead(m.id, m.is_read)}
              className="text-xs text-muted-foreground hover:text-accent"
            >
              {m.is_read ? 'Mark unread' : 'Mark read'}
            </button>
          </div>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">{m.message}</p>
        </div>
      ))}
    </div>
  )
}
