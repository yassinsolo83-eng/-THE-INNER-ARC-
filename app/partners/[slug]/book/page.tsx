import Link from 'next/link'
import { notFound } from 'next/navigation'
import { SiteShell } from '@/components/site'
import { HeroEntrance } from '@/components/hero-entrance'
import { Reveal } from '@/components/reveal'
import { BookingFlow } from '@/components/booking-flow'
import {
  getPartnerBySlug,
  getLiveDataForReader,
  getOfferingsForReader,
} from '@/lib/partners'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const partner = await getPartnerBySlug((await params).slug)
  return {
    title: partner ? `Book with ${partner.name.split(' ')[0]} — The Inner Arc` : 'Book — The Inner Arc',
  }
}

export default async function BookingPage({ params }: { params: Promise<{ slug: string }> }) {
  const slug = (await params).slug
  const partner = await getPartnerBySlug(slug)
  if (!partner) notFound()

  const [live, offerings] = await Promise.all([
    getLiveDataForReader(slug),
    getOfferingsForReader(slug),
  ])

  // Can't book if reader isn't accepting or has no offerings
  if (!live?.is_accepting_bookings || offerings.length === 0) {
    return (
      <SiteShell>
        <main className="mx-auto max-w-2xl px-6 py-28 text-center">
          <h1 className="font-serif text-4xl text-foreground">Not available</h1>
          <p className="mt-4 text-muted-foreground">
            {partner.name.split(' ')[0]} is not accepting bookings right now.
          </p>
          <Link
            href={`/partners/${slug}`}
            className="mt-8 inline-flex rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground"
          >
            Back to profile
          </Link>
        </main>
      </SiteShell>
    )
  }

  const firstName = partner.name.split(' ')[0]

  return (
    <SiteShell>
      <main className="mx-auto max-w-2xl px-6 py-20 lg:py-28">
        <HeroEntrance>
          <Link
            href={`/partners/${slug}`}
            className="group inline-flex items-center gap-2 text-sm text-accent transition-colors"
          >
            <span className="transition-transform duration-300 group-hover:-translate-x-1">←</span>{' '}
            Back to {firstName}&apos;s profile
          </Link>
        </HeroEntrance>

        <HeroEntrance delay={200}>
          <div className="mt-10 flex items-center gap-5">
            <div className="h-16 w-16 overflow-hidden rounded-full bg-muted">
              <img
                src={partner.photo}
                alt={firstName}
                className="h-full w-full object-cover"
              />
            </div>
            <div>
              <h1 className="font-serif text-3xl text-foreground">Book with {firstName}</h1>
              <p className="mt-1 text-sm text-muted-foreground">{partner.specialty}</p>
            </div>
          </div>
        </HeroEntrance>

        <Reveal animation="fade-up" delay={300}>
          <div className="mt-10 border border-border bg-card p-6 sm:p-8">
            <BookingFlow
              readerSlug={slug}
              readerName={firstName}
              offerings={offerings}
            />
          </div>
        </Reveal>
      </main>
    </SiteShell>
  )
}
