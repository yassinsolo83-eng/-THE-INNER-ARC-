import Link from 'next/link'
import { PartnerApplicationForm } from '@/components/partner-application-form'
import { SectionHeading, SiteShell } from '@/components/site'

export const metadata = { title: 'Become a Partner — The Inner Arc', description: 'Apply to join The Inner Arc directory of independent tarot readers.' }
export default function PartnerApplyPage() { return <SiteShell><main><section className="mx-auto max-w-7xl px-6 py-24 lg:px-10 lg:py-32"><Link href="/partners" className="text-sm text-accent">← Back to our readers</Link><div className="mt-14 grid gap-16 lg:grid-cols-[0.8fr_1.2fr]"><div><SectionHeading eyebrow="Become a partner" title="Bring your way of seeing to the circle."><p>We&apos;re building a thoughtful directory of independent readers who believe tarot can be a practice of attention, not prediction. Tell us a little about your work.</p></SectionHeading></div><div className="border border-border bg-card p-6 sm:p-10"><PartnerApplicationForm /></div></div></section></main></SiteShell> }
