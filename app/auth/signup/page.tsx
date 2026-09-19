import { Suspense } from 'react'
import { SiteShell } from '@/components/site'
import { HeroEntrance } from '@/components/hero-entrance'
import { AuthForm } from '@/components/auth-form'

export const metadata = { title: 'Create Account — The Inner Arc' }

export default function SignupPage() {
  return (
    <SiteShell>
      <main className="mx-auto max-w-2xl px-6 py-24 lg:py-32">
        <HeroEntrance>
          <div className="text-center">
            <p className="text-xs uppercase tracking-[0.3em] text-accent">Begin your journey</p>
            <h1 className="mt-4 font-serif text-5xl text-foreground">Create an account</h1>
            <p className="mt-4 text-muted-foreground">Join The Inner Arc to book readings, earn coins, and explore your chart.</p>
          </div>
        </HeroEntrance>
        <div className="mt-12">
          <Suspense fallback={<div className="text-center text-sm text-muted-foreground">Loading...</div>}>
            <AuthForm mode="signup" />
          </Suspense>
        </div>
      </main>
    </SiteShell>
  )
}
