import Link from 'next/link'
import { createServerClient } from '@/lib/supabase/server'

export default async function AdminPage() {
  const supabase = await createServerClient()

  const [usersRes, promosRes] = await Promise.all([
    supabase.from('profiles').select('id', { count: 'exact', head: true }),
    supabase.from('promo_codes').select('id', { count: 'exact', head: true }),
  ])

  return (
    <div>
      <h1 className="font-serif text-3xl text-foreground">Admin Overview</h1>
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <div className="border border-border bg-card p-6">
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Total users</p>
          <p className="mt-2 font-serif text-4xl text-foreground">{usersRes.count ?? 0}</p>
        </div>
        <div className="border border-border bg-card p-6">
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Promo codes</p>
          <p className="mt-2 font-serif text-4xl text-foreground">{promosRes.count ?? 0}</p>
          <Link href="/admin/promos" className="mt-2 inline-block text-xs text-accent hover:underline">
            Manage →
          </Link>
        </div>
        <div className="border border-border bg-card p-6">
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Platform</p>
          <p className="mt-2 font-serif text-lg text-foreground">The Inner Arc</p>
          <p className="mt-1 text-xs text-muted-foreground">Admin panel v1</p>
        </div>
      </div>
    </div>
  )
}
