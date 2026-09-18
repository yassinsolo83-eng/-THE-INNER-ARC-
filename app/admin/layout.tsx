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
          <nav className="flex items-center gap-4 overflow-x-auto">
            <Link href="/admin" className="flex-shrink-0 font-serif text-lg text-foreground">
              Admin
            </Link>
            <Link href="/admin/readings" className="flex-shrink-0 text-sm text-muted-foreground transition-colors hover:text-accent">
              Readings
            </Link>
            <Link href="/admin/promos" className="flex-shrink-0 text-sm text-muted-foreground transition-colors hover:text-accent">
              Promos
            </Link>
            <Link href="/admin/messages" className="flex-shrink-0 text-sm text-muted-foreground transition-colors hover:text-accent">
              Messages
            </Link>
            <Link href="/admin/settings" className="flex-shrink-0 text-sm text-muted-foreground transition-colors hover:text-accent">
              Settings
            </Link>
          </nav>
          <Link href="/dashboard" className="flex-shrink-0 text-xs text-muted-foreground hover:text-accent">
            ← Site
          </Link>
        </div>
      </div>
      <div className="mx-auto max-w-7xl px-6 py-8">
        {children}
      </div>
    </div>
  )
}
