import Link from 'next/link'
import { redirect } from 'next/navigation'
import { SiteShell } from '@/components/site'
import { HeroEntrance } from '@/components/hero-entrance'
import { ReadingRequestForm } from '@/components/reading-request-form'
import { createServerClient } from '@/lib/supabase/server'

export const metadata = { title: 'Personal Reading — The Inner Arc' }

export default async function ReadingPage() {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const [birthRes, walletRes] = await Promise.all([
    supabase.from('client_birth_profiles').select('*').eq('client_id', user.id).single(),
    supabase.from('coin_wallets').select('balance').eq('client_id', user.id).single(),
  ])

  const hasBirth = !!birthRes.data
  const coinBalance = walletRes.data?.balance ?? 0

  return (
    <SiteShell>
      <main className="mx-auto max-w-2xl px-6 py-20 lg:py-28">
        <HeroEntrance>
          <Link href="/dashboard" className="group inline-flex items-center gap-2 text-sm text-accent">
            <span className="transition-transform duration-300 group-hover:-translate-x-1">←</span> Dashboard
          </Link>
          <p className="mt-8 text-xs uppercase tracking-[0.3em] text-accent">Personal insight</p>
          <h1 className="mt-4 font-serif text-5xl text-foreground">Personal Reading</h1>
          <p className="mt-4 text-muted-foreground">
            Request a personalized astrological report prepared by one of our specialists
            based on your birth details. Your reading will be delivered in English and Arabic.
          </p>
        </HeroEntrance>

        <div className="mt-12">
          {!hasBirth ? (
            <div className="border border-border bg-card p-8 text-center">
              <span className="text-4xl">♈</span>
              <h2 className="mt-4 font-serif text-2xl text-foreground">Birth details required</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                You need to add your birth date, time, and location before requesting a reading.
              </p>
              <Link
                href="/dashboard/birth-profile"
                className="mt-6 inline-flex rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground"
              >
                Add birth details
              </Link>
            </div>
          ) : (
            <ReadingRequestForm coinBalance={coinBalance} />
          )}
        </div>
      </main>
    </SiteShell>
  )
}
