import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createServerClient } from '@/lib/supabase/server'

export const metadata = { title: 'Admin — The Inner Arc' }

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') {
    redirect('/dashboard')
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <nav className="flex items-center gap-6">
            <Link href="/admin" className="font-serif text-lg text-foreground">
              Admin Panel
            </Link>
            <Link href="/admin/promos" className="text-sm text-muted-foreground transition-colors hover:text-accent">
              Promo Codes
            </Link>
            <Link href="/admin/readings" className="text-sm text-muted-foreground transition-colors hover:text-accent">
              Readings
            </Link>
          </nav>
          <Link href="/dashboard" className="text-xs text-muted-foreground hover:text-accent">
            ← Back to site
          </Link>
        </div>
      </div>
      <div className="mx-auto max-w-7xl px-6 py-8">
        {children}
      </div>
    </div>
  )
}
