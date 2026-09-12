import { sanityFetch } from '@/sanity/lib/fetch'
import { partnersQuery, partnerBySlugQuery } from '@/sanity/lib/queries'
import { createServerClient } from '@/lib/supabase/server'

// ── Types ──────────────────────────────────────────────────────────

/** Sanity-sourced content (bio, photo, story). */
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

/** Live Supabase data merged onto a partner card. */
export type PartnerLiveData = {
  rating_avg: number
  rating_count: number
  is_accepting_bookings: boolean
  tier: string
}

/** A bookable service offering for a specific reader. */
export type ServiceOffering = {
  offering_id: string
  service_type_id: string
  name_ar: string
  name_en: string
  duration_minutes: number
  price_egp: number
  category_key: string
  category_name_ar: string
  category_name_en: string
}

/** A bookable time slot. */
export type AvailableSlot = {
  id: string
  start_at_utc: string
  end_at_utc: string
  service_type_id: string
}

// ── Filters ────────────────────────────────────────────────────────

export const partnerFilters = [
  'All readers',
  'Love & relationships',
  'Career & purpose',
  'Life & direction',
  'Shadow work',
]

// ── Mock/fallback data (keeps the site working without Supabase) ──

export const partners: Partner[] = [
  { name: 'Mara Ellison', slug: 'mara-ellison', photo: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=700&q=85', specialty: 'Love, timing, and the honest conversation', tags: ['Love & relationships', 'Life & direction'], yearsExperience: 12, featured: true, bio: 'Mara reads for the places where feeling and choice meet. Her sessions are warm, direct, and quietly practical.', approach: 'I see tarot as a mirror with a little more vocabulary.', readings: ['Two of Us', 'The Open Road', 'A Quiet Question'], testimonial: { quote: 'Mara helped me ask a kinder, clearer question.', name: 'Eleanor R.' } },
  { name: 'Jon Bell', slug: 'jon-bell', photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=700&q=85', specialty: 'Career transitions and creative purpose', tags: ['Career & purpose', 'Life & direction'], yearsExperience: 9, featured: true, bio: 'Jon brings a grounded, curious energy to readings about work and direction.', approach: 'The cards help us see the decision from a wider place.', readings: ['The Next Chapter', 'The Open Road'], testimonial: { quote: 'A generous reading that made a complicated choice feel possible.', name: 'Mina T.' } },
  { name: 'Priya Shah', slug: 'priya-shah', photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=700&q=85', specialty: 'Inner patterns and shadow work', tags: ['Shadow work', 'Life & direction'], yearsExperience: 15, featured: false, bio: 'Priya creates a spacious container for the questions beneath the question.', approach: 'Nothing in a spread is an instruction. It is an invitation.', readings: ['A Quiet Question', 'The Open Road'], testimonial: { quote: 'Priya held the reading with so much care.', name: 'Sofia K.' } },
  { name: 'Theo Martin', slug: 'theo-martin', photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=700&q=85', specialty: 'Relationships, boundaries, and new beginnings', tags: ['Love & relationships', 'Shadow work'], yearsExperience: 7, featured: false, bio: 'Theo reads with an easy, conversational style.', approach: 'I want a reading to leave you more in conversation with yourself.', readings: ['Two of Us', 'A Quiet Question'], testimonial: { quote: 'The reading gave language to something I had been circling.', name: 'Cal M.' } },
  { name: 'Nia Okafor', slug: 'nia-okafor', photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=700&q=85', specialty: 'Life direction and fresh perspective', tags: ['Life & direction', 'Career & purpose'], yearsExperience: 10, featured: false, bio: 'Nia offers clear-eyed, encouraging readings for periods of change.', approach: 'A card can be a question, a permission slip, or a pause.', readings: ['The Open Road', 'The Next Chapter'], testimonial: { quote: 'Nia made the future feel less like a test.', name: 'Daniel W.' } },
]

export function getPartner(slug: string) {
  return partners.find((p) => p.slug === slug)
}

// ── Sanity fetchers (unchanged) ────────────────────────────────────

export async function getPartners(): Promise<Partner[]> {
  const d = await sanityFetch<Partner[]>(partnersQuery)
  return d?.length ? d : partners
}

export async function getPartnerBySlug(slug: string): Promise<Partner | null> {
  const d = await sanityFetch<Partner>(partnerBySlugQuery, { slug })
  return d || getPartner(slug) || null
}

// ── Supabase live data fetchers ────────────────────────────────────

/** Fetch live data (ratings, availability status) for all approved readers. */
export async function getLiveDataForAllReaders(): Promise<Record<string, PartnerLiveData>> {
  try {
    const supabase = createServerClient()
    const { data, error } = await supabase
      .from('reader_public_profiles')
      .select('slug, rating_avg, rating_count, is_accepting_bookings, tier')

    if (error || !data) return {}

    const map: Record<string, PartnerLiveData> = {}
    for (const r of data) {
      if (r.slug) {
        map[r.slug] = {
          rating_avg: Number(r.rating_avg) || 0,
          rating_count: r.rating_count || 0,
          is_accepting_bookings: r.is_accepting_bookings ?? false,
          tier: r.tier || 'new',
        }
      }
    }
    return map
  } catch {
    // Supabase not configured yet — return empty, site still works.
    return {}
  }
}

/** Fetch live data for one reader by slug. */
export async function getLiveDataForReader(slug: string): Promise<PartnerLiveData | null> {
  try {
    const supabase = createServerClient()
    const { data, error } = await supabase
      .from('reader_public_profiles')
      .select('slug, rating_avg, rating_count, is_accepting_bookings, tier')
      .eq('slug', slug)
      .single()

    if (error || !data) return null
    return {
      rating_avg: Number(data.rating_avg) || 0,
      rating_count: data.rating_count || 0,
      is_accepting_bookings: data.is_accepting_bookings ?? false,
      tier: data.tier || 'new',
    }
  } catch {
    return null
  }
}

/** Fetch the bookable service offerings for one reader (public view). */
export async function getOfferingsForReader(readerSlug: string): Promise<ServiceOffering[]> {
  try {
    const supabase = createServerClient()
    const { data, error } = await supabase
      .from('service_offerings_public')
      .select('*')
      .eq('reader_slug', readerSlug)

    if (error || !data) return []
    return data as ServiceOffering[]
  } catch {
    return []
  }
}

/** Fetch open slots for a reader + service type in the next 7 days. */
export async function getAvailableSlots(
  readerSlug: string,
  serviceTypeId: string
): Promise<AvailableSlot[]> {
  try {
    const supabase = createServerClient()

    // First get reader UUID from slug
    const { data: reader } = await supabase
      .from('reader_public_profiles')
      .select('id')
      .eq('slug', readerSlug)
      .single()

    if (!reader) return []

    const now = new Date().toISOString()
    const sevenDays = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()

    const { data, error } = await supabase
      .from('availability_slots')
      .select('id, start_at_utc, end_at_utc, service_type_id')
      .eq('reader_id', reader.id)
      .eq('service_type_id', serviceTypeId)
      .eq('status', 'open')
      .gte('start_at_utc', now)
      .lte('start_at_utc', sevenDays)
      .order('start_at_utc', { ascending: true })

    if (error || !data) return []
    return data as AvailableSlot[]
  } catch {
    return []
  }
}
