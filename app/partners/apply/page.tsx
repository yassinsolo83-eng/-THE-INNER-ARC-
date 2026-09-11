import Link from 'next/link'
import { PartnerApplicationForm } from '@/components/partner-application-form'
import { SectionHeading, SiteShell } from '@/components/site'
import { Reveal } from '@/components/reveal'
import { HeroEntrance } from '@/components/hero-entrance'

export const metadata = { title: 'Become a Partner — The Inner Arc', description: 'Apply to join The Inner Arc directory of independent tarot readers.' }

export default function PartnerApplyPage() {
  return (
    <SiteShell>
      <main>
        <section className="mx-auto max-w-7xl px-6 py-24 lg:px-10 lg:py-32">
          <HeroEntrance>
            <Link href="/partners" className="group inline-flex items-center gap-2 text-sm text-accent">
              <span className="transition-transform duration-300 group-hover:-translate-x-1">←</span> Back to our readers
            </Link>
          </HeroEntrance>
          <div className="mt-14 grid gap-16 lg:grid-cols-[0.8fr_1.2fr]">
            <Reveal animation="fade-up" delay={150}>
              <SectionHeading eyebrow="Become a partner" title="Bring your way of seeing to the circle.">
                <p>We&apos;re building a thoughtful directory of independent readers who believe tarot can be a practice of attention, not prediction. Tell us a little about your work.</p>
              </SectionHeading>
            </Reveal>
            <Reveal animation="fade-left" delay={300}>
              <div className="border border-border bg-card p-6 transition-all duration-500 hover:border-accent/30 sm:p-10">
                <PartnerApplicationForm />
              </div>
            </Reveal>
          </div>
        </section>
      </main>
    </SiteShell>
  )
}
