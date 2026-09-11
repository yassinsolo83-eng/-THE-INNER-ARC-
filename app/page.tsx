import Link from 'next/link'
import { ArrowLink, NewsletterForm, SectionHeading, SiteShell } from '@/components/site'
import { Reveal } from '@/components/reveal'
import { HeroEntrance } from '@/components/hero-entrance'
import { getServices, getTestimonials } from '@/lib/content'

export const metadata = { title: 'The Inner Arc — Tarot for the questions that matter', description: 'Thoughtful tarot readings for reflection, direction, and the questions that stay with you.' }

export default async function Home() {
  const services = await getServices()
  const testimonials = await getTestimonials()

  return (
    <SiteShell>
      <main>
        {/* ── Hero (fixed parallax) ────────────────────── */}
        <section
          className="relative flex min-h-[620px] items-center justify-center border-b border-border/60 bg-cover bg-center bg-fixed lg:min-h-[700px]"
          style={{ backgroundImage: 'url(/images/hero-cards-candles.jpg)' }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-background/70 to-background" />
          <div className="relative mx-auto max-w-7xl px-6 py-24 text-center lg:px-10">
            <div className="mx-auto max-w-3xl">
              <HeroEntrance delay={0}>
                <p className="mb-7 text-xs uppercase tracking-[0.3em] text-accent">A considered approach to tarot</p>
              </HeroEntrance>
              <HeroEntrance delay={200}>
                <h1 className="font-serif text-6xl leading-[0.96] tracking-tight text-foreground md:text-8xl text-balance">Make room for what you already know.</h1>
              </HeroEntrance>
              <HeroEntrance delay={400}>
                <p className="mx-auto mt-8 max-w-xl text-lg leading-8 text-muted-foreground">Private readings for moments of change, curiosity, and return. Not a prediction — a place to hear yourself more clearly.</p>
              </HeroEntrance>
              <HeroEntrance delay={600}>
                <div className="mt-10 flex flex-wrap items-center justify-center gap-6">
                  <Link href="/services" className="rounded-full bg-primary px-7 py-3.5 text-sm font-medium text-primary-foreground transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/25 active:scale-95">Explore readings</Link>
                  <ArrowLink href="/about-tarot">What is tarot?</ArrowLink>
                </div>
              </HeroEntrance>
            </div>
          </div>
        </section>

        {/* ── Mirror section ────────────────────────────── */}
        <section className="mx-auto max-w-7xl px-6 py-24 lg:px-10 lg:py-32">
          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
            <Reveal animation="fade-up">
              <SectionHeading eyebrow="A different kind of reading" title="A mirror, not a map.">
                Tarot gives shape to the questions we carry. Through symbol, story, and a little spaciousness, it can help you notice what has been asking to be seen.
              </SectionHeading>
            </Reveal>
            <Reveal animation="fade-left" delay={200}>
              <div className="lg:justify-self-end"><ArrowLink href="/about-tarot">Learn more about tarot</ArrowLink></div>
            </Reveal>
          </div>
        </section>

        {/* ── Reading room ──────────────────────────────── */}
        <section className="border-y border-border/60 bg-card">
          <div className="mx-auto max-w-7xl px-6 py-24 lg:px-10 lg:py-32">
            <Reveal animation="fade-up">
              <SectionHeading eyebrow="The reading room" title="Come as you are. Leave with a little more clarity." />
            </Reveal>
            <div className="mt-14 grid gap-px overflow-hidden border border-border bg-border md:grid-cols-2 lg:grid-cols-4">
              {services.map((item, index) => (
                <Reveal key={item.title} animation="fade-up" delay={index * 120}>
                  <div className="h-full bg-card p-7 transition-colors duration-500 hover:bg-accent/5">
                    <span className="font-mono text-xs text-accent">0{index + 1}</span>
                    <h3 className="mt-16 font-serif text-2xl text-foreground">{item.title}</h3>
                    <p className="mt-3 text-xs uppercase tracking-[0.16em] text-accent">{item.category}</p>
                    <p className="mt-5 text-sm leading-6 text-muted-foreground">{item.description}</p>
                  </div>
                </Reveal>
              ))}
            </div>
            <Reveal animation="fade-up" delay={500}>
              <div className="mt-8"><ArrowLink href="/services">View all readings</ArrowLink></div>
            </Reveal>
          </div>
        </section>

        {/* ── Kind words ────────────────────────────────── */}
        <section className="mx-auto max-w-7xl px-6 py-24 lg:px-10 lg:py-32">
          <div className="grid gap-12 lg:grid-cols-[0.7fr_1.3fr]">
            <Reveal animation="fade-up">
              <SectionHeading eyebrow="Kind words" title="A reading can become a new way of listening." />
            </Reveal>
            <div className="grid gap-6 md:grid-cols-2">
              {testimonials.map((t, i) => (
                <Reveal key={i} animation="fade-up" delay={i * 150}>
                  <figure className="border-l border-accent pl-6">
                    <blockquote className="font-serif text-2xl leading-9 text-foreground">&ldquo;{t.quote}&rdquo;</blockquote>
                    <figcaption className="mt-6 text-xs uppercase tracking-[0.18em] text-muted-foreground">— {t.name}, {t.context}</figcaption>
                  </figure>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── Newsletter CTA (fixed parallax like Nefertiti) */}
        <section
          className="relative min-h-[420px] bg-cover bg-center bg-fixed lg:min-h-[500px]"
          style={{ backgroundImage: 'url(/images/newsletter-cta.jpg)' }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/65 to-transparent" />
          <Reveal animation="fade-up">
            <div className="relative mx-auto flex min-h-[420px] max-w-7xl flex-col justify-center gap-8 px-6 py-20 lg:min-h-[500px] lg:flex-row lg:items-center lg:justify-between lg:px-10">
              <div className="max-w-lg">
                <p className="text-xs uppercase tracking-[0.25em] text-accent">Notes from the inner arc</p>
                <h2 className="mt-3 font-serif text-5xl leading-tight text-foreground lg:text-6xl">A little perspective, occasionally.</h2>
                <p className="mt-4 text-sm leading-7 text-muted-foreground">Join our mailing list for reflections, card readings, and the occasional question worth sitting with.</p>
              </div>
              <div className="w-full max-w-md">
                <NewsletterForm />
              </div>
            </div>
          </Reveal>
        </section>
      </main>
    </SiteShell>
  )
}
