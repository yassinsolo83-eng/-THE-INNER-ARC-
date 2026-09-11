/* ── Services ──────────────────────────────────────── */
export const servicesQuery = `
  *[_type == "service"] | order(order asc){
    title,
    "slug": slug.current,
    category,
    description,
    "image": image.asset->url
  }
`

/* ── Blog Posts ─────────────────────────────────────── */
export const postsQuery = `
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

export const postBySlugQuery = `
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
export const partnersQuery = `
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

export const partnerBySlugQuery = `
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
export const testimonialsQuery = `
  *[_type == "testimonial"] | order(_createdAt asc){
    quote,
    name,
    context
  }
`
