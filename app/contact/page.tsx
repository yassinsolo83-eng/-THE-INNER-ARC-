import Link from 'next/link'
import { SiteShell } from '@/components/site'
import { ContactForm } from '@/components/contact-form'
import { Reveal } from '@/components/reveal'
import { HeroEntrance } from '@/components/hero-entrance'

export const metadata = { title: 'Contact — The Inner Arc', description: 'Get in touch with The Inner Arc about readings, questions, and collaborations.' }

export default function Contact() {
  return (
    <SiteShell>
      <main className="mx-auto max-w-7xl px-6 py-24 lg:px-10 lg:py-32">
        <HeroEntrance>
          <Link href="/" className="group mb-10 inline-flex items-center gap-2 text-sm text-accent">
            <span className="transition-transform duration-300 group-hover:-translate-x-1">←</span> Home
          </Link>
        </HeroEntrance>
        <div className="grid gap-20 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <HeroEntrance delay={100}>
              <p className="text-xs uppercase tracking-[0.3em] text-accent">Say hello</p>
            </HeroEntrance>
            <HeroEntrance delay={200}>
              <h1 className="mt-6 font-serif text-6xl leading-none text-foreground md:text-8xl">Start with a question.</h1>
            </HeroEntrance>
            <HeroEntrance delay={350}>
              <p className="mt-8 max-w-md text-lg leading-8 text-muted-foreground">Whether you know exactly what you&apos;re looking for or only know that something is shifting, we&apos;d love to hear from you.</p>
            </HeroEntrance>
            <Reveal animation="fade-up" delay={450}>
              <div className="mt-12 border-t border-border pt-5 text-sm leading-7 text-muted-foreground">
                <p>hello@theinnerarc.co</p>
                <p>Replies within 2–3 working days.</p>
              </div>
            </Reveal>
          </div>
          <Reveal animation="fade-left" delay={300}>
            <ContactForm />
          </Reveal>
        </div>
      </main>
    </SiteShell>
  )
}
