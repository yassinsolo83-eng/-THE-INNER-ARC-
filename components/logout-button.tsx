'use client'

import { useRouter } from 'next/navigation'
import { getSupabaseBrowserClient } from '@/lib/supabase/client'

export function LogoutButton() {
  const router = useRouter()

  async function handleLogout() {
    const supabase = getSupabaseBrowserClient()
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      className="rounded-full border border-border px-5 py-2.5 text-xs text-muted-foreground transition-all duration-300 hover:border-red-400/50 hover:text-red-400"
    >
      Sign out
    </button>
  )
}
