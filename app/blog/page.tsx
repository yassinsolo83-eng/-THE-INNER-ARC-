import Link from 'next/link'
import Image from 'next/image'
import { SiteShell } from '@/components/site'
import { Reveal } from '@/components/reveal'
import { HeroEntrance } from '@/components/hero-entrance'
import { getPosts } from '@/lib/content'

export const metadata = { title: 'Journal — The Inner Arc', description: 'Essays and reflections on tarot, attention, and the questions we live with.' }

export default async function Blog() {
  const allPosts = await getPosts()

  return (
    <SiteShell>
      <main>
        {/* ── Hero ──────────────────────────────────────── */}
        <section
          className="relative flex min-h-[400px] items-end bg-cover bg-center bg-fixed lg:min-h-[480px]"
          style={{ backgroundImage: 'url(/images/blog-hand-fairylights.jpg)' }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/30" />
          <div className="relative mx-auto w-full max-w-7xl px-6 pb-16 lg:px-10">
            <Link href="/" className="group mb-8 inline-flex items-center gap-2 text-sm text-accent"><span className="transition-transform duration-300 group-hover:-translate-x-1">←</span> Home</Link>
            <HeroEntrance><p className="text-xs uppercase tracking-[0.3em] text-accent">The journal</p></HeroEntrance>
            <HeroEntrance delay={150}><h1 className="mt-4 max-w-3xl font-serif text-5xl leading-none text-foreground md:text-7xl">Notes for the in-between.</h1></HeroEntrance>
          </div>
        </section>

        {/* ── Posts ─────────────────────────────────────── */}
        <section className="mx-auto max-w-7xl px-6 py-24 lg:px-10 lg:py-32">
          <div className="grid gap-6 md:grid-cols-3">
            {allPosts.map((post, i) => (
              <Reveal key={post.slug} animation="fade-up" delay={i * 120}>
                <article className="group flex h-full flex-col border border-border bg-card overflow-hidden transition-all duration-500 hover:border-accent/40 hover:shadow-xl hover:shadow-accent/5">
                  <div className="relative aspect-[4/3] w-full overflow-hidden">
                    <Image src={post.cover} alt={post.title} fill className="object-cover transition-transform duration-700 group-hover:scale-105" sizes="(max-width: 768px) 100vw, 33vw" />
                  </div>
                  <div className="flex flex-1 flex-col p-7">
                    <p className="text-xs uppercase tracking-[0.18em] text-accent">{post.date} · {post.read}</p>
                    <h2 className="mt-4 font-serif text-2xl leading-tight text-foreground"><Link href={`/blog/${post.slug}`} className="transition-colors duration-300 hover:text-accent">{post.title}</Link></h2>
                    <p className="mt-4 flex-1 text-sm leading-6 text-muted-foreground">{post.excerpt}</p>
                    <Link href={`/blog/${post.slug}`} className="mt-7 inline-flex text-sm text-accent">Read essay →</Link>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </section>
      </main>
    </SiteShell>
  )
}
