import { createServerClient } from '@/lib/supabase/server'
import { MessagesList } from '@/components/admin/messages-list'

export default async function AdminMessagesPage() {
  const supabase = await createServerClient()

  const { data: messages } = await supabase
    .from('contact_messages')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(50)

  const { data: subscribers } = await supabase
    .from('newsletter_subscribers')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div>
      <h1 className="font-serif text-3xl text-foreground">Messages & Subscribers</h1>

      {/* Contact Messages */}
      <div className="mt-8">
        <h2 className="flex items-center gap-3 text-xs uppercase tracking-[0.2em] text-accent">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-accent/20 text-xs text-accent">
            {messages?.length || 0}
          </span>
          Contact Messages
        </h2>
        <MessagesList messages={messages || []} />
      </div>

      {/* Newsletter Subscribers */}
      <div className="mt-12">
        <h2 className="flex items-center gap-3 text-xs uppercase tracking-[0.2em] text-accent">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-accent/20 text-xs text-accent">
            {subscribers?.length || 0}
          </span>
          Newsletter Subscribers
        </h2>
        {!subscribers?.length ? (
          <p className="mt-4 border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
            No subscribers yet.
          </p>
        ) : (
          <div className="mt-4 divide-y divide-border border border-border">
            {subscribers.map((s: any) => (
              <div key={s.id} className="flex items-center justify-between p-4">
                <p className="text-sm text-foreground">{s.email}</p>
                <p className="text-xs text-muted-foreground">{new Date(s.created_at).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
