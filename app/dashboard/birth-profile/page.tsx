import Link from 'next/link'
import { redirect } from 'next/navigation'
import { SiteShell } from '@/components/site'
import { HeroEntrance } from '@/components/hero-entrance'
import { BirthProfileForm } from '@/components/birth-profile-form'
import { createServerClient } from '@/lib/supabase/server'

export const metadata = { title: 'Birth Profile — The Inner Arc' }

export default async function BirthProfilePage() {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: existing } = await supabase
    .from('client_birth_profiles')
    .select('birth_date, birth_time, birth_city, birth_country, zodiac_sign')
    .eq('client_id', user.id)
    .single()

  return (
    <SiteShell>
      <main className="mx-auto max-w-2xl px-6 py-20 lg:py-28">
        <HeroEntrance>
          <Link
            href="/dashboard"
            className="group inline-flex items-center gap-2 text-sm text-accent"
          >
            <span className="transition-transform duration-300 group-hover:-translate-x-1">←</span>{' '}
            Dashboard
          </Link>
          <p className="mt-8 text-xs uppercase tracking-[0.3em] text-accent">Your details</p>
          <h1 className="mt-4 font-serif text-5xl text-foreground">Birth Profile</h1>
          <p className="mt-4 max-w-lg text-muted-foreground">
            Your birth details are used for astrology, birth chart, and zodiac compatibility
            services. This information is stored securely and shared with readers only when
            you book an astrology-related session.
          </p>
        </HeroEntrance>

        <div className="mt-12 border border-border bg-card p-6 sm:p-8">
          <BirthProfileForm existing={existing} />
        </div>
      </main>
    </SiteShell>
  )
}
