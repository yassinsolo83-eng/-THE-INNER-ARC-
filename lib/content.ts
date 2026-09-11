import { sanityFetch } from '@/sanity/lib/fetch'
import { servicesQuery, postsQuery, postBySlugQuery, testimonialsQuery } from '@/sanity/lib/queries'

/* ── Static fallback data ──────────────────────────── */

export const serviceItems = [
  { title: 'The Open Road', category: 'Life & direction', description: 'A spacious, 60-minute reading for the crossroads, patterns, and possibilities asking for your attention.', image: '/images/service-open-road.jpg' },
  { title: 'Two of Us', category: 'Love & relationships', description: 'A compassionate look at the dynamics, desires, and honest conversations shaping a connection.', image: '/images/services-card-linen.jpg' },
  { title: 'The Next Chapter', category: 'Career & purpose', description: 'Find language for your ambitions and clarity around the choices that move your work forward.', image: '/images/services-fan-cards-black.jpg' },
  { title: 'A Quiet Question', category: 'Written reading', description: 'A considered, asynchronous reading delivered to your inbox when you need a little perspective.', image: '/images/section-candle-tall.jpg' },
]

export const posts = [
  { slug: 'tarot-as-a-language-of-attention', title: 'Tarot as a language of attention', excerpt: 'What changes when we treat the cards less like a forecast and more like a conversation?', date: 'May 14, 2026', read: '6 min read', cover: '/images/blog-tarot-attention.jpg' },
  { slug: 'the-art-of-asking-better-questions', title: 'The art of asking better questions', excerpt: 'The quality of a reading often begins with the quality of the question we bring to it.', date: 'April 28, 2026', read: '4 min read', cover: '/images/blog-death-card-rocks.jpg' },
  { slug: 'a-small-guide-to-the-major-arcana', title: 'A small guide to the Major Arcana', excerpt: 'Twenty-two archetypes, and the many ways they can meet us in an ordinary life.', date: 'April 02, 2026', read: '8 min read', cover: '/images/blog-hand-fairylights.jpg' },
]

export const testimonials = [
  { quote: 'I left with fewer answers, in the best possible way — and a much better question.', name: 'M.', context: 'written reading' },
  { quote: 'It felt grounded, generous, and strangely practical. I could feel my next step.', name: 'A.', context: 'The Open Road' },
]

/* ── Sanity-first fetchers with static fallback ────── */

export async function getServices() {
  const data = await sanityFetch<typeof serviceItems>(servicesQuery)
  return data?.length ? data : serviceItems
}

export async function getPosts() {
  const data = await sanityFetch<any[]>(postsQuery)
  if (!data?.length) return posts
  return data.map((p) => ({
    slug: p.slug,
    title: p.title,
    excerpt: p.excerpt,
    date: p.date ? new Date(p.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : '',
    read: p.readTime || '',
    cover: p.cover || '',
    body: p.body || null,
  }))
}

export async function getPostBySlug(slug: string) {
  const data = await sanityFetch<any>(postBySlugQuery, { slug })
  if (data) return {
    slug: data.slug,
    title: data.title,
    excerpt: data.excerpt,
    date: data.date ? new Date(data.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : '',
    read: data.readTime || '',
    cover: data.cover || '',
    body: data.body || null,
  }
  return posts.find((p) => p.slug === slug) || null
}

export async function getTestimonials() {
  const data = await sanityFetch<typeof testimonials>(testimonialsQuery)
  return data?.length ? data : testimonials
}
