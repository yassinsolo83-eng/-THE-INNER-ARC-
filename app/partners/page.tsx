import Link from 'next/link'
import { PartnerDirectory } from '@/components/partner-directory'
import { SectionHeading, SiteShell } from '@/components/site'
import { Reveal } from '@/components/reveal'
import { HeroEntrance } from '@/components/hero-entrance'
import { getPartners } from '@/lib/partners'
import { partnerFilters } from '@/lib/partners'

export const metadata = { title: 'Our Readers — The Inner Arc', description: 'Meet the independent tarot readers in The Inner Arc community.' }

export default async function PartnersPage() {
  const allPartners = await getPartners()

  return (
    <SiteShell>
      <main>
        <section className="mx-auto max-w-7xl px-6 py-24 lg:px-10 lg:py-32">
          <HeroEntrance>
            <SectionHeading eyebrow="Our readers" title="People who listen well.">
              <p>Our directory is a gathering of vetted, independent readers — thoughtful people with different practices, perspectives, and ways of making space for a question.</p>
            </SectionHeading>
          </HeroEntrance>

          <Reveal animation="fade-up" delay={300}>
            <div className="mt-16">
              <PartnerDirectory partners={allPartners} filters={partnerFilters} />
            </div>
          </Reveal>

          <Reveal animation="fade-up" delay={200}>
            <div className="mt-24 grid gap-8 border-t border-border pt-12 md:grid-cols-[1fr_auto] md:items-end">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-accent">Become a partner</p>
                <h2 className="mt-4 max-w-xl font-serif text-4xl text-foreground">Make room for the questions that find you.</h2>
                <p className="mt-4 max-w-lg text-sm leading-7 text-muted-foreground">Join a calm, considered directory that helps the right people discover your work — with visibility, booking tools, and a community of fellow readers.</p>
              </div>
              <Link href="/partners/apply" className="inline-flex rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/25">Apply to join</Link>
            </div>
          </Reveal>
        </section>
      </main>
    </SiteShell>
  )
}
