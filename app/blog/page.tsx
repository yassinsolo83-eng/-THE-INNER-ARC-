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
      <main className="mx-auto max-w-7xl px-6 py-24 lg:px-10 lg:py-32">
        <HeroEntrance>
          <Link href="/" className="group mb-10 inline-flex items-center gap-2 text-sm text-accent">
            <span className="transition-transform duration-300 group-hover:-translate-x-1">←</span> Home
          </Link>
        </HeroEntrance>
        <HeroEntrance delay={100}>
          <p className="text-xs uppercase tracking-[0.3em] text-accent">The journal</p>
        </HeroEntrance>
        <HeroEntrance delay={200}>
          <h1 className="mt-6 max-w-3xl font-serif text-6xl leading-none text-foreground md:text-8xl">Notes for the in-between.</h1>
        </HeroEntrance>

        <div className="mt-20 grid gap-6 md:grid-cols-3">
          {allPosts.map((post, i) => (
            <Reveal key={post.slug} animation="fade-up" delay={i * 120}>
              <article className="group flex h-full flex-col border border-border bg-card overflow-hidden transition-all duration-500 hover:border-accent/40 hover:shadow-xl hover:shadow-accent/5">
                <div className="relative aspect-[4/3] w-full overflow-hidden">
                  <Image src={post.cover} alt={post.title} fill className="object-cover transition-transform duration-700 group-hover:scale-105" sizes="(max-width: 768px) 100vw, 33vw" />
                </div>
                <div className="flex flex-1 flex-col p-7">
                  <p className="text-xs uppercase tracking-[0.18em] text-accent">{post.date} · {post.read}</p>
                  <h2 className="mt-4 font-serif text-2xl leading-tight text-foreground">
                    <Link href={`/blog/${post.slug}`} className="transition-colors duration-300 hover:text-accent">{post.title}</Link>
                  </h2>
                  <p className="mt-4 flex-1 text-sm leading-6 text-muted-foreground">{post.excerpt}</p>
                  <Link href={`/blog/${post.slug}`} className="mt-7 inline-flex text-sm text-accent transition-all duration-300 hover:gap-1">Read essay →</Link>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </main>
    </SiteShell>
  )
}
