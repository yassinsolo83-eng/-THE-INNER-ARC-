import Link from 'next/link'
import { notFound } from 'next/navigation'
import { SectionHeading, SiteShell } from '@/components/site'
import { Reveal } from '@/components/reveal'
import { HeroEntrance } from '@/components/hero-entrance'
import { getPartnerBySlug, partners } from '@/lib/partners'

export function generateStaticParams() { return partners.map((p) => ({ slug: p.slug })) }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const partner = await getPartnerBySlug((await params).slug)
  return { title: partner ? `${partner.name} — The Inner Arc` : 'Reader — The Inner Arc', description: partner?.specialty }
}

export default async function PartnerProfile({ params }: { params: Promise<{ slug: string }> }) {
  const partner = await getPartnerBySlug((await params).slug)
  if (!partner) notFound()

  return (
    <SiteShell>
      <main>
        <section className="mx-auto max-w-7xl px-6 py-20 lg:px-10 lg:py-28">
          <HeroEntrance>
            <Link href="/partners" className="group inline-flex items-center gap-2 text-sm text-accent transition-colors">
              <span className="transition-transform duration-300 group-hover:-translate-x-1">←</span> Back to our readers
            </Link>
          </HeroEntrance>

          <div className="mt-14 grid gap-12 lg:grid-cols-[0.7fr_1.3fr] lg:items-end">
            <Reveal animation="scale">
              <div className="aspect-[4/5] max-w-md overflow-hidden bg-muted">
                <img
                  src={partner.photo}
                  alt={`${partner.name}, tarot reader`}
                  className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                />
              </div>
            </Reveal>
            <div>
              <HeroEntrance delay={200}>
                <p className="text-xs uppercase tracking-[0.24em] text-accent">{partner.yearsExperience} years reading</p>
              </HeroEntrance>
              <HeroEntrance delay={350}>
                <h1 className="mt-5 font-serif text-6xl leading-none text-foreground md:text-8xl">{partner.name}</h1>
              </HeroEntrance>
              <HeroEntrance delay={500}>
                <p className="mt-7 max-w-xl text-xl leading-8 text-muted-foreground">{partner.specialty}</p>
              </HeroEntrance>
              <HeroEntrance delay={650}>
                <div className="mt-7 flex flex-wrap gap-2">
                  {partner.tags.map((tag) => (
                    <span key={tag} className="rounded-full border border-border px-4 py-2 text-xs text-muted-foreground transition-colors duration-300 hover:border-accent/50 hover:text-accent">{tag}</span>
                  ))}
                </div>
              </HeroEntrance>
            </div>
          </div>

          <div className="mt-24 grid gap-16 lg:grid-cols-[1.1fr_0.9fr]">
            <Reveal animation="fade-up">
              <div>
                <SectionHeading eyebrow="A little context" title="The work, in their words.">
                  <p>{partner.bio}</p>
                </SectionHeading>
                <div className="mt-16 border-t border-border pt-10">
                  <p className="text-xs uppercase tracking-[0.2em] text-accent">Approach to reading</p>
                  <p className="mt-5 max-w-2xl font-serif text-3xl leading-tight text-foreground">{partner.approach}</p>
                </div>
              </div>
            </Reveal>

            <Reveal animation="fade-left" delay={200}>
              <aside className="border border-border bg-card p-7 transition-all duration-500 hover:border-accent/30">
                <p className="text-xs uppercase tracking-[0.2em] text-accent">Read with {partner.name.split(' ')[0]}</p>
                <h2 className="mt-4 font-serif text-3xl text-foreground">Available formats</h2>
                <ul className="mt-7 divide-y divide-border">
                  {partner.readings.map((reading) => (
                    <li key={reading} className="py-4 text-sm text-muted-foreground transition-colors duration-300 hover:text-foreground">{reading}</li>
                  ))}
                </ul>
                <Link
                  href="#"
                  className="mt-8 inline-flex w-full justify-center rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/25 active:scale-95"
                >
                  Book a session with {partner.name.split(' ')[0]}
                </Link>
              </aside>
            </Reveal>
          </div>

          <Reveal animation="fade-up" delay={100}>
            <blockquote className="mx-auto mt-24 max-w-3xl border-t border-border pt-10 text-center">
              <p className="font-serif text-3xl leading-tight text-foreground">&ldquo;{partner.testimonial.quote}&rdquo;</p>
              <cite className="mt-5 block text-xs not-italic uppercase tracking-[0.18em] text-accent">{partner.testimonial.name}</cite>
            </blockquote>
          </Reveal>
        </section>
      </main>
    </SiteShell>
  )
}
