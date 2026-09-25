import { getServices, getTestimonials } from '@/lib/content'
import { HomeClient } from '@/components/home-client'

export const metadata = { title: 'The Inner Arc — Tarot for the questions that matter', description: 'Thoughtful tarot readings for reflection, direction, and the questions that stay with you.' }

export default async function Home() {
  const services = await getServices()
  const testimonials = await getTestimonials()
  return <HomeClient services={services} testimonials={testimonials} />
}
