import { Suspense } from 'react'
import { SiteShell } from '@/components/site'
import { HeroEntrance } from '@/components/hero-entrance'
import { AuthForm } from '@/components/auth-form'

export const metadata = { title: 'Sign In — The Inner Arc' }

export default function LoginPage() {
  return (
    <SiteShell>
      <main className="mx-auto max-w-2xl px-6 py-24 lg:py-32">
        <HeroEntrance>
          <div className="text-center">
            <p className="text-xs uppercase tracking-[0.3em] text-accent">Welcome back</p>
            <h1 className="mt-4 font-serif text-5xl text-foreground">Sign in</h1>
            <p className="mt-4 text-muted-foreground">Access your readings, reports, and coin balance.</p>
          </div>
        </HeroEntrance>
        <div className="mt-12">
          <Suspense fallback={<div className="text-center text-sm text-muted-foreground">Loading...</div>}>
            <AuthForm mode="login" />
          </Suspense>
        </div>
      </main>
    </SiteShell>
  )
}
