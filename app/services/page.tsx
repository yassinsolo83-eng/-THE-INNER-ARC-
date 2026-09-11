import Link from 'next/link'
import Image from 'next/image'
import { SiteShell } from '@/components/site'
import { Reveal } from '@/components/reveal'
import { HeroEntrance } from '@/components/hero-entrance'
import { getServices } from '@/lib/content'

export const metadata = { title: 'Readings — The Inner Arc', description: 'Explore thoughtful tarot readings for relationships, career, direction, and reflection.' }

export default async function Services() {
  const services = await getServices()

  return (
    <SiteShell>
      <main>
        <section className="mx-auto max-w-7xl px-6 py-24 lg:px-10 lg:py-32">
          <HeroEntrance>
            <Link href="/" className="group mb-10 inline-flex items-center gap-2 text-sm text-accent">
              <span className="transition-transform duration-300 group-hover:-translate-x-1">←</span> Home
            </Link>
          </HeroEntrance>
          <HeroEntrance delay={100}>
            <p className="text-xs uppercase tracking-[0.3em] text-accent">Choose your doorway</p>
          </HeroEntrance>
          <HeroEntrance delay={200}>
            <h1 className="mt-6 max-w-4xl font-serif text-6xl leading-none text-foreground md:text-8xl">A reading for the question underneath the question.</h1>
          </HeroEntrance>
          <HeroEntrance delay={350}>
            <p className="mt-8 max-w-xl text-lg leading-8 text-muted-foreground">Every session is a little different. Start with the theme that feels closest, and we&apos;ll make room for what emerges.</p>
          </HeroEntrance>

          <div className="mt-20 grid gap-6 md:grid-cols-2">
            {services.map((item, index) => (
              <Reveal key={item.title} animation="fade-up" delay={index * 120}>
                <article className="group border border-border overflow-hidden bg-card transition-all duration-500 hover:border-accent/40 hover:shadow-xl hover:shadow-accent/5">
                  <div className="relative aspect-[16/9] w-full overflow-hidden">
                    <Image src={item.image} alt={item.title} fill className="object-cover transition-transform duration-700 group-hover:scale-105" sizes="(max-width: 768px) 100vw, 50vw" />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent" />
                  </div>
                  <div className="p-8 md:p-10">
                    <span className="font-mono text-xs text-accent">0{index + 1}</span>
                    <p className="mt-4 text-xs uppercase tracking-[0.18em] text-accent">{item.category}</p>
                    <h2 className="mt-3 font-serif text-4xl text-foreground">{item.title}</h2>
                    <p className="mt-5 max-w-md text-sm leading-7 text-muted-foreground">{item.description}</p>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>

          <Reveal animation="fade-up" delay={500}>
            <div className="mt-20 border-t border-border pt-8">
              <p className="max-w-xl text-sm leading-7 text-muted-foreground">Not sure where to begin? Tell us what&apos;s on your mind and we&apos;ll point you toward a fitting format.</p>
              <Link href="/contact" className="mt-5 inline-flex rounded-full border border-accent px-6 py-3 text-sm text-accent transition-all duration-300 hover:bg-accent hover:text-background">Ask a question</Link>
            </div>
          </Reveal>
        </section>
      </main>
    </SiteShell>
  )
}
