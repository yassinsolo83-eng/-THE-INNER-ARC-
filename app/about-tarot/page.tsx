import Image from 'next/image'
import Link from 'next/link'
import { ArrowLink, SiteShell } from '@/components/site'
import { Reveal } from '@/components/reveal'
import { HeroEntrance } from '@/components/hero-entrance'

export const metadata = { title: 'About tarot — The Inner Arc', description: 'A grounded, editorial introduction to tarot, its history, and how readings work.' }

export default function AboutTarot() {
  return (
    <SiteShell>
      <main className="mx-auto max-w-7xl px-6 py-24 lg:px-10 lg:py-32">
        <HeroEntrance>
          <Link href="/" className="group mb-10 inline-flex items-center gap-2 text-sm text-accent">
            <span className="transition-transform duration-300 group-hover:-translate-x-1">←</span> Home
          </Link>
        </HeroEntrance>

        <div className="max-w-3xl">
          <HeroEntrance delay={100}>
            <p className="text-xs uppercase tracking-[0.3em] text-accent">An introduction</p>
          </HeroEntrance>
          <HeroEntrance delay={250}>
            <h1 className="mt-6 font-serif text-6xl leading-none text-foreground md:text-8xl">The cards are not the answer. They are an invitation.</h1>
          </HeroEntrance>
          <HeroEntrance delay={400}>
            <p className="mt-8 max-w-xl text-lg leading-8 text-muted-foreground">Tarot is a visual language for paying attention — to your instincts, your patterns, and the possibility just beyond the obvious.</p>
          </HeroEntrance>
        </div>

        <Reveal animation="scale" delay={300}>
          <div className="relative mt-16 aspect-[21/9] w-full overflow-hidden rounded-sm">
            <Image src="/images/about-tarot-sun-card.jpg" alt="Tarot cards arranged on a dark surface" fill className="object-cover" sizes="(max-width: 1280px) 100vw, 1280px" priority />
          </div>
        </Reveal>

        <div className="mt-24 grid gap-16 lg:grid-cols-[1fr_0.35fr]">
          <article className="max-w-2xl space-y-14 text-base leading-8 text-muted-foreground">
            <Reveal animation="fade-up">
              <section>
                <h2 className="font-serif text-3xl text-foreground">A brief history</h2>
                <p className="mt-5">Tarot began as a card game in fifteenth-century Europe before gathering the symbolic and esoteric meanings we recognize today. Its history is layered, imperfect, and full of reinvention — much like the people who turn to it.</p>
                <p className="mt-5">At The Inner Arc, we hold that history with curiosity rather than certainty. A reading is not a claim to supernatural authority. It is a ritual of reflection, made richer by imagery and another person&apos;s careful attention.</p>
              </section>
            </Reveal>

            <Reveal animation="scale">
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-sm">
                <Image src="/images/about-tarot-black-gold-cards.jpg" alt="Black and gold illustrated tarot cards" fill className="object-cover" sizes="(max-width: 672px) 100vw, 672px" />
              </div>
            </Reveal>

            <Reveal animation="fade-up">
              <section>
                <h2 className="font-serif text-3xl text-foreground">How a reading works</h2>
                <p className="mt-5">You arrive with a question, a feeling, or simply a sense that something is shifting. Your reader draws cards and uses their symbols as prompts for a conversation — connecting the visual story of the deck with the context you bring.</p>
                <p className="mt-5">There is room for surprise, but no pressure to accept a meaning that does not resonate. The most useful reading is the one that returns you to your own agency.</p>
              </section>
            </Reveal>

            <Reveal animation="fade-up">
              <section>
                <h2 className="font-serif text-3xl text-foreground">A grounded practice</h2>
                <p className="mt-5">Our readers work with care, clear boundaries, and respect for your lived experience. Tarot can support reflection, but it cannot replace professional medical, legal, or financial advice. You remain the author of your choices.</p>
              </section>
            </Reveal>
          </article>

          <Reveal animation="fade-left" delay={300}>
            <aside className="self-start border-t border-accent pt-6 lg:sticky lg:top-32">
              <p className="font-serif text-3xl leading-tight text-foreground">&ldquo;The question is where the reading begins.&rdquo;</p>
              <div className="mt-8"><ArrowLink href="/services">Find a reading</ArrowLink></div>
            </aside>
          </Reveal>
        </div>
      </main>
    </SiteShell>
  )
}
