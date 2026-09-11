import Link from 'next/link'
import { SiteShell } from '@/components/site'
import { ContactForm } from '@/components/contact-form'
import { Reveal } from '@/components/reveal'
import { HeroEntrance } from '@/components/hero-entrance'

export const metadata = { title: 'Contact — The Inner Arc', description: 'Get in touch with The Inner Arc about readings, questions, and collaborations.' }

export default function Contact() {
  return (
    <SiteShell>
      <main>
        {/* ── Hero ──────────────────────────────────────── */}
        <section
          className="relative flex min-h-[350px] items-end bg-cover bg-center bg-fixed lg:min-h-[420px]"
          style={{ backgroundImage: 'url(/images/newsletter-cta.jpg)' }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/30" />
          <div className="relative mx-auto w-full max-w-7xl px-6 pb-16 lg:px-10">
            <Link href="/" className="group mb-8 inline-flex items-center gap-2 text-sm text-accent"><span className="transition-transform duration-300 group-hover:-translate-x-1">←</span> Home</Link>
            <HeroEntrance><p className="text-xs uppercase tracking-[0.3em] text-accent">Say hello</p></HeroEntrance>
            <HeroEntrance delay={150}><h1 className="mt-4 max-w-3xl font-serif text-5xl leading-none text-foreground md:text-7xl">Start with a question.</h1></HeroEntrance>
          </div>
        </section>

        {/* ── Form ──────────────────────────────────────── */}
        <section className="mx-auto max-w-7xl px-6 py-24 lg:px-10 lg:py-32">
          <div className="grid gap-20 lg:grid-cols-[0.8fr_1.2fr]">
            <Reveal animation="fade-up">
              <div>
                <p className="mt-8 max-w-md text-lg leading-8 text-muted-foreground">Whether you know exactly what you&apos;re looking for or only know that something is shifting, we&apos;d love to hear from you.</p>
                <div className="mt-12 border-t border-border pt-5 text-sm leading-7 text-muted-foreground">
                  <p>hello@theinnerarc.co</p>
                  <p>Replies within 2–3 working days.</p>
                </div>
              </div>
            </Reveal>
            <Reveal animation="fade-left" delay={200}><ContactForm /></Reveal>
          </div>
        </section>
      </main>
    </SiteShell>
  )
}
