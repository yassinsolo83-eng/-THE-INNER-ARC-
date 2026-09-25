'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ArrowLink, NewsletterForm, SectionHeading, Footer } from '@/components/site'
import { Reveal } from '@/components/reveal'
import { Constellation } from '@/components/constellation'
import { KeyholeZoom } from '@/components/keyhole-zoom'

export function HomeClient({ services, testimonials }: { services: any[]; testimonials: any[] }) {
  return (
    <>
      <Constellation />

      <main>
        {/* ── KEYHOLE INTRO — zoom to enter, scroll up to close ── */}
        <div id="kz-track" className="kz-track">
          <div className="kz-stage">
            {/* hero video, revealed through the keyhole */}
            <video
              className="kz-bg"
              src="/hero-video.mp4"
              poster="/images/hero-cards-candles.jpg"
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
            />
            {/* text over the video — fades in as the keyhole opens */}
            <div id="kz-copy" className="kz-copy">
              <p className="text-xs uppercase tracking-[0.3em] text-accent">A considered approach to tarot</p>
              <h1 className="mt-4 font-serif text-5xl leading-[0.98] tracking-tight text-white md:text-7xl">Make room for what you already know.</h1>
              <p className="mt-6 max-w-xl text-lg leading-8 text-white/80">Private readings for moments of change, curiosity, and return.</p>
              <div className="mt-8 flex flex-wrap items-center gap-6">
                <Link href="/quiz" className="rounded-full bg-primary px-7 py-3.5 text-sm font-medium text-primary-foreground transition-all hover:-translate-y-0.5 hover:shadow-lg">Explore readings</Link>
              </div>
            </div>
            {/* dark cover with the keyhole punched out (zooms with scroll) */}
            <KeyholeZoom />
          </div>
        </div>

        {/* ── Mirror ────────────────────────────────────── */}
        <section className="relative z-10 mx-auto max-w-7xl px-6 py-10 lg:px-10 lg:py-14">
          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
            <Reveal animation="fade-up"><SectionHeading shimmer eyebrow="A different kind of reading" title="A mirror, not a map.">Tarot gives shape to the questions we carry. Through symbol, story, and a little spaciousness, it can help you notice what has been asking to be seen.</SectionHeading></Reveal>
            <Reveal animation="fade-left" delay={200}><div className="lg:justify-self-end"><ArrowLink href="/about-tarot">Learn more about tarot</ArrowLink></div></Reveal>
          </div>
        </section>

        {/* ── Reading room (glow cards) ─────────────────── */}
        <section className="relative z-10 bg-card">
          <div className="mx-auto max-w-7xl px-6 py-24 lg:px-10 lg:py-32">
            <Reveal animation="fade-up"><SectionHeading eyebrow="The reading room" title="Come as you are. Leave with a little more clarity." /></Reveal>
            <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
              {services.map((item, index) => (
                <Reveal key={item.title} animation="fade-up" delay={index * 120}>
                  <Link href="/services" className="glow-card group block overflow-hidden border border-border bg-card transition-all duration-500">
                    <div className="relative aspect-[16/10] w-full overflow-hidden">
                      <Image src={item.image} alt={item.title} fill className="object-cover transition-transform duration-700 group-hover:scale-105" sizes="(max-width: 768px) 50vw, 25vw" />
                      <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                      <span className="absolute bottom-3 left-4 font-mono text-xs text-accent">0{index + 1}</span>
                    </div>
                    <div className="p-5">
                      <h3 className="font-serif text-2xl text-foreground">{item.title}</h3>
                      <p className="mt-2 text-xs uppercase tracking-[0.16em] text-accent">{item.category}</p>
                      <p className="mt-3 text-sm leading-6 text-muted-foreground">{item.description}</p>
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>
            <Reveal animation="fade-up" delay={500}><div className="mt-8"><ArrowLink href="/services">View all readings</ArrowLink></div></Reveal>
          </div>
        </section>

        {/* ── Kind words ────────────────────────────────── */}
        <section className="relative z-10 mx-auto max-w-7xl px-6 py-24 lg:px-10 lg:py-32">
          <div className="grid gap-12 lg:grid-cols-[0.7fr_1.3fr]">
            <Reveal animation="fade-up"><SectionHeading shimmer eyebrow="Kind words" title="A reading can become a new way of listening." /></Reveal>
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

        {/* ── Newsletter CTA ────────────────────────────── */}
        <section className="relative z-10 min-h-[420px] bg-cover bg-center lg:min-h-[500px]" style={{ backgroundImage: 'url(/images/newsletter-cta.jpg)' }}>
          <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/65 to-transparent" />
          <Reveal animation="fade-up">
            <div className="relative mx-auto flex min-h-[420px] max-w-7xl flex-col justify-center gap-8 px-6 py-20 lg:min-h-[500px] lg:flex-row lg:items-center lg:justify-between lg:px-10">
              <div className="max-w-lg">
                <p className="text-xs uppercase tracking-[0.25em] text-accent">Notes from the inner arc</p>
                <h2 className="shimmer mt-3 font-serif text-5xl leading-tight lg:text-6xl">A little perspective, occasionally.</h2>
                <p className="mt-4 text-sm leading-7 text-muted-foreground">Join our mailing list for reflections, card readings, and the occasional question worth sitting with.</p>
              </div>
              <div className="w-full max-w-md"><NewsletterForm /></div>
            </div>
          </Reveal>
        </section>

        <div className="relative z-10"><Footer /></div>
      </main>
    </>
  )
}
