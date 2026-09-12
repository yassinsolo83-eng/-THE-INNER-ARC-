import Link from 'next/link'
import { PartnerDirectory } from '@/components/partner-directory'
import { SectionHeading, SiteShell } from '@/components/site'
import { Reveal } from '@/components/reveal'
import { HeroEntrance } from '@/components/hero-entrance'
import { getPartners, partnerFilters, getLiveDataForAllReaders } from '@/lib/partners'

export const metadata = { title: 'Our Readers — The Inner Arc', description: 'Meet the independent tarot readers in The Inner Arc community.' }

export default async function PartnersPage() {
  const [allPartners, liveData] = await Promise.all([
    getPartners(),
    getLiveDataForAllReaders(),
  ])

  return (
    <SiteShell>
      <main>
        {/* ── Hero ──────────────────────────────────────── */}
        <section
          className="relative flex min-h-[400px] items-end bg-cover bg-center bg-fixed lg:min-h-[480px]"
          style={{ backgroundImage: 'url(/images/service-open-road.jpg)' }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/30" />
          <div className="relative mx-auto w-full max-w-7xl px-6 pb-16 lg:px-10">
            <Link href="/" className="group mb-8 inline-flex items-center gap-2 text-sm text-accent"><span className="transition-transform duration-300 group-hover:-translate-x-1">←</span> Home</Link>
            <HeroEntrance>
              <SectionHeading eyebrow="Our readers" title="People who listen well.">
                <p>Our directory is a gathering of vetted, independent readers — thoughtful people with different practices, perspectives, and ways of making space for a question.</p>
              </SectionHeading>
            </HeroEntrance>
          </div>
        </section>

        {/* ── Directory ─────────────────────────────────── */}
        <section className="mx-auto max-w-7xl px-6 py-24 lg:px-10 lg:py-32">
          <Reveal animation="fade-up">
            <PartnerDirectory partners={allPartners} filters={partnerFilters} liveData={liveData} />
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
