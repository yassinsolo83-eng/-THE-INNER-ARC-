import { sanityFetch } from '@/sanity/lib/fetch'
import { partnersQuery, partnerBySlugQuery } from '@/sanity/lib/queries'

export type Partner = {
  name: string
  slug: string
  photo: string
  specialty: string
  tags: string[]
  yearsExperience: number
  featured: boolean
  bio: string
  approach: string
  readings: string[]
  testimonial: { quote: string; name: string }
}

export const partnerFilters = ['All readers', 'Love & relationships', 'Career & purpose', 'Life & direction', 'Shadow work']

/* ── Static fallback data ──────────────────────────── */

export const partners: Partner[] = [
  { name: 'Mara Ellison', slug: 'mara-ellison', photo: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=700&q=85', specialty: 'Love, timing, and the honest conversation', tags: ['Love & relationships', 'Life & direction'], yearsExperience: 12, featured: true, bio: 'Mara reads for the places where feeling and choice meet. Her sessions are warm, direct, and quietly practical — a space to name what you already know, then look at it from a new angle.', approach: 'I see tarot as a mirror with a little more vocabulary. We make room for the image, the feeling, and the small next step that becomes visible when the noise settles.', readings: ['Two of Us', 'The Open Road', 'A Quiet Question'], testimonial: { quote: 'Mara helped me ask a kinder, clearer question. I left with both perspective and a plan.', name: 'Eleanor R.' } },
  { name: 'Jon Bell', slug: 'jon-bell', photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=700&q=85', specialty: 'Career transitions and creative purpose', tags: ['Career & purpose', 'Life & direction'], yearsExperience: 9, featured: true, bio: 'Jon brings a grounded, curious energy to readings about work and direction. He is especially drawn to the threshold moments: the offer, the departure, the idea that keeps returning.', approach: 'The cards do not make the decision for us. They help us see the decision we are making from a wider, less defended place.', readings: ['The Next Chapter', 'The Open Road'], testimonial: { quote: 'A generous reading that made a complicated career choice feel possible to hold.', name: 'Mina T.' } },
  { name: 'Priya Shah', slug: 'priya-shah', photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=700&q=85', specialty: 'Inner patterns and shadow work', tags: ['Shadow work', 'Life & direction'], yearsExperience: 15, featured: false, bio: 'Priya creates a spacious container for the questions beneath the question. Her practice blends tarot with reflective prompts and a deep respect for the wisdom of the nervous system.', approach: 'Nothing in a spread is an instruction. It is an invitation to become more honest with the parts of ourselves asking to be included.', readings: ['A Quiet Question', 'The Open Road'], testimonial: { quote: 'Priya held the reading with so much care. I felt met, not interpreted.', name: 'Sofia K.' } },
  { name: 'Theo Martin', slug: 'theo-martin', photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=700&q=85', specialty: 'Relationships, boundaries, and new beginnings', tags: ['Love & relationships', 'Shadow work'], yearsExperience: 7, featured: false, bio: 'Theo reads with an easy, conversational style. His work is for anyone looking to understand a dynamic more clearly and return to their own center within it.', approach: 'I want a reading to leave you more in conversation with yourself — less certain perhaps, but more available to what is true.', readings: ['Two of Us', 'A Quiet Question'], testimonial: { quote: 'The reading gave language to something I had been circling for months.', name: 'Cal M.' } },
  { name: 'Nia Okafor', slug: 'nia-okafor', photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=700&q=85', specialty: 'Life direction and fresh perspective', tags: ['Life & direction', 'Career & purpose'], yearsExperience: 10, featured: false, bio: 'Nia offers clear-eyed, encouraging readings for periods of change. She is interested in the practical poetry of a life: what is ending, what is beginning, and what wants tending now.', approach: 'A card can be a question, a permission slip, or a pause. We follow the thread that gives you more room to move.', readings: ['The Open Road', 'The Next Chapter'], testimonial: { quote: 'Nia made the future feel less like a test and more like a relationship I could participate in.', name: 'Daniel W.' } },
]

export function getPartner(slug: string) { return partners.find((p) => p.slug === slug) }

/* ── Sanity-first fetchers with static fallback ────── */

export async function getPartners(): Promise<Partner[]> {
  const data = await sanityFetch<Partner[]>(partnersQuery)
  return data?.length ? data : partners
}

export async function getPartnerBySlug(slug: string): Promise<Partner | null> {
  const data = await sanityFetch<Partner>(partnerBySlugQuery, { slug })
  return data || getPartner(slug) || null
}
