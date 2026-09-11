import { groq } from 'next-sanity'

/* ── Site Settings ─────────────────────────────────── */
export const siteSettingsQuery = groq`
  *[_type == "siteSettings"][0]{
    siteName,
    tagline,
    contactEmail,
    "logo": logo.asset->url
  }
`

/* ── Services ──────────────────────────────────────── */
export const servicesQuery = groq`
  *[_type == "service"] | order(order asc){
    title,
    "slug": slug.current,
    category,
    description,
    "image": image.asset->url
  }
`

/* ── Blog Posts ─────────────────────────────────────── */
export const postsQuery = groq`
  *[_type == "blogPost"] | order(publishedAt desc){
    title,
    "slug": slug.current,
    excerpt,
    "date": publishedAt,
    readTime,
    "cover": coverImage.asset->url,
    body
  }
`

export const postBySlugQuery = groq`
  *[_type == "blogPost" && slug.current == $slug][0]{
    title,
    "slug": slug.current,
    excerpt,
    "date": publishedAt,
    readTime,
    "cover": coverImage.asset->url,
    body
  }
`

/* ── Partners ──────────────────────────────────────── */
export const partnersQuery = groq`
  *[_type == "partner"] | order(featured desc, name asc){
    name,
    "slug": slug.current,
    "photo": photo.asset->url,
    specialty,
    tags,
    yearsExperience,
    featured,
    bio,
    approach,
    readings,
    testimonial
  }
`

export const partnerBySlugQuery = groq`
  *[_type == "partner" && slug.current == $slug][0]{
    name,
    "slug": slug.current,
    "photo": photo.asset->url,
    specialty,
    tags,
    yearsExperience,
    featured,
    bio,
    approach,
    readings,
    testimonial
  }
`

/* ── Testimonials ──────────────────────────────────── */
export const testimonialsQuery = groq`
  *[_type == "testimonial"] | order(_createdAt asc){
    quote,
    name,
    context
  }
`

/* ── About Page ────────────────────────────────────── */
export const aboutPageQuery = groq`
  *[_type == "aboutPage"][0]{
    heroTitle,
    heroSubtitle,
    "heroImage": heroImage.asset->url,
    sections[]{
      heading,
      body
    },
    sideQuote
  }
`
