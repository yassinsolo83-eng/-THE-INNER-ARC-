import Link from 'next/link'
import Image from 'next/image'
import { SiteShell } from '@/components/site'
import { Reveal } from '@/components/reveal'
import { HeroEntrance } from '@/components/hero-entrance'
import { getServices } from '@/lib/content'
import { createServerClient } from '@/lib/supabase/server'

export const metadata = {
  title: 'Readings — The Inner Arc',
  description:
    'Explore thoughtful tarot readings for relationships, career, direction, and reflection.',
}

type LiveServiceInfo = {
  name_en: string
  duration_minutes: number
  min_price: number
  reader_count: number
  category_key: string
}

async function getLiveServiceInfo(): Promise<Record<string, LiveServiceInfo>> {
  try {
    const supabase = createServerClient()
    const { data, error } = await supabase
      .from('service_offerings_public')
      .select(
        'name_en, duration_minutes, price_egp, category_key, category_name_en, reader_slug'
      )

    if (error || !data || data.length === 0) return {}

    // Group by service name, collect min price + how many readers offer it
    const map: Record<string, LiveServiceInfo> = {}
    for (const row of data) {
      const key = row.name_en
      if (!map[key]) {
        map[key] = {
          name_en: row.name_en,
          duration_minutes: row.duration_minutes,
          min_price: Number(row.price_egp),
          reader_count: 1,
          category_key: row.category_key,
        }
      } else {
        map[key].min_price = Math.min(map[key].min_price, Number(row.price_egp))
        map[key].reader_count++
      }
    }
    return map
  } catch {
    return {}
  }
}

export default async function Services() {
  const [services, liveInfo] = await Promise.all([
    getServices(),
    getLiveServiceInfo(),
  ])

  // Try to match Sanity service titles to live Supabase data
  function findLiveMatch(title: string): LiveServiceInfo | null {
    // Direct match
    if (liveInfo[title]) return liveInfo[title]
    // Fuzzy: check if any live service name contains the Sanity title or vice versa
    for (const [key, info] of Object.entries(liveInfo)) {
      if (
        key.toLowerCase().includes(title.toLowerCase()) ||
        title.toLowerCase().includes(key.toLowerCase())
      ) {
        return info
      }
    }
    return null
  }

  return (
    <SiteShell>
      <main>
        {/* ── Hero ──────────────────────────────────────── */}
        <section
          className="relative flex min-h-[400px] items-end bg-cover bg-center bg-fixed lg:min-h-[480px]"
          style={{ backgroundImage: 'url(/images/services-fan-cards-black.jpg)' }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/30" />
          <div className="relative mx-auto w-full max-w-7xl px-6 pb-16 lg:px-10">
            <Link
              href="/"
              className="group mb-8 inline-flex items-center gap-2 text-sm text-accent"
            >
              <span className="transition-transform duration-300 group-hover:-translate-x-1">
                ←
              </span>{' '}
              Home
            </Link>
            <HeroEntrance>
              <p className="text-xs uppercase tracking-[0.3em] text-accent">
                Choose your doorway
              </p>
            </HeroEntrance>
            <HeroEntrance delay={150}>
              <h1 className="mt-4 max-w-4xl font-serif text-5xl leading-none text-foreground md:text-7xl">
                A reading for the question underneath the question.
              </h1>
            </HeroEntrance>
            <HeroEntrance delay={300}>
              <p className="mt-6 max-w-xl text-lg leading-8 text-muted-foreground">
                Every session is a little different. Start with the theme that feels
                closest, and we&apos;ll make room for what emerges.
              </p>
            </HeroEntrance>
          </div>
        </section>

        {/* ── Cards ─────────────────────────────────────── */}
        <section className="mx-auto max-w-7xl px-6 py-24 lg:px-10 lg:py-32">
          <div className="grid gap-6 md:grid-cols-2">
            {services.map((item, index) => {
              const live = findLiveMatch(item.title)
              return (
                <Reveal key={item.title} animation="fade-up" delay={index * 120}>
                  <article className="group border border-border overflow-hidden bg-card transition-all duration-500 hover:border-accent/40 hover:shadow-xl hover:shadow-accent/5">
                    <div className="relative aspect-[16/9] w-full overflow-hidden">
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent" />
                    </div>
                    <div className="p-8 md:p-10">
                      <span className="font-mono text-xs text-accent">0{index + 1}</span>
                      <p className="mt-4 text-xs uppercase tracking-[0.18em] text-accent">
                        {item.category}
                      </p>
                      <h2 className="mt-3 font-serif text-4xl text-foreground">
                        {item.title}
                      </h2>
                      <p className="mt-5 max-w-md text-sm leading-7 text-muted-foreground">
                        {item.description}
                      </p>

                      {/* Live pricing + duration from Supabase */}
                      {live && (
                        <div className="mt-5 flex flex-wrap items-center gap-4">
                          <span className="font-serif text-lg text-gold">
                            From {live.min_price.toLocaleString()} EGP
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {live.duration_minutes} min
                          </span>
                          <span className="text-xs text-muted-foreground">
                            · {live.reader_count}{' '}
                            {live.reader_count === 1 ? 'reader' : 'readers'} available
                          </span>
                        </div>
                      )}

                      {/* CTA */}
                      <div className="mt-6 flex flex-wrap gap-3">
                        <Link
                          href="/partners"
                          className="inline-flex rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/25 active:scale-95"
                        >
                          Find a reader for this
                        </Link>
                        <Link
                          href="/partners"
                          className="inline-flex rounded-full border border-border px-6 py-3 text-sm text-muted-foreground transition-all duration-300 hover:border-accent hover:text-accent"
                        >
                          Browse all readers
                        </Link>
                      </div>
                    </div>
                  </article>
                </Reveal>
              )
            })}
          </div>

          {/* Bottom CTA */}
          <Reveal animation="fade-up" delay={500}>
            <div className="mt-20 border-t border-border pt-8">
              <p className="max-w-xl text-sm leading-7 text-muted-foreground">
                Not sure where to begin? Tell us what&apos;s on your mind and we&apos;ll
                point you toward a fitting format.
              </p>
              <Link
                href="/contact"
                className="mt-5 inline-flex rounded-full border border-accent px-6 py-3 text-sm text-accent transition-all duration-300 hover:bg-accent hover:text-background"
              >
                Ask a question
              </Link>
            </div>
          </Reveal>
        </section>
      </main>
    </SiteShell>
  )
}
