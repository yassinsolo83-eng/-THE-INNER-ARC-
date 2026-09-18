import Link from 'next/link'
import { SiteShell } from '@/components/site'

export const metadata = { title: 'Terms of Service — The Inner Arc' }

export default function TermsPage() {
  return (
    <SiteShell>
      <main className="mx-auto max-w-3xl px-6 py-20 lg:py-28">
        <Link href="/" className="group inline-flex items-center gap-2 text-sm text-accent">
          <span className="transition-transform duration-300 group-hover:-translate-x-1">←</span> Home
        </Link>
        <h1 className="mt-8 font-serif text-5xl text-foreground">Terms of Service</h1>
        <p className="mt-4 text-sm text-muted-foreground">Last updated: September 2026</p>

        <div className="mt-12 space-y-8 text-sm leading-7 text-muted-foreground">
          <section>
            <h2 className="font-serif text-xl text-foreground">1. About The Inner Arc</h2>
            <p className="mt-3">
              The Inner Arc is an online platform that connects clients with independent spiritual
              readers and practitioners. Our services include tarot readings, astrology, birth chart
              analysis, dream interpretation, coffee cup readings, zodiac compatibility, and energy
              stone consultations.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-foreground">2. Entertainment Disclaimer</h2>
            <p className="mt-3">
              All readings and services provided through The Inner Arc are for entertainment and
              spiritual reflection purposes only. They are not scientifically proven and should not
              be used as a substitute for professional medical, legal, financial, or psychological
              advice. Our readers do not diagnose illnesses, guarantee financial outcomes, or
              predict specific future events.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-foreground">3. User Accounts</h2>
            <p className="mt-3">
              You are responsible for maintaining the security of your account credentials. You must
              provide accurate information when creating an account. You may not share your account
              with others or use another person&apos;s account without permission.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-foreground">4. Coins and Payments</h2>
            <p className="mt-3">
              The Inner Arc uses a virtual currency system (&quot;Coins&quot;). Coins are purchased
              with real money and can be used to access readings and services on the platform.
              Coins are non-refundable and non-transferable. They hold no monetary value outside
              the platform and cannot be exchanged for cash.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-foreground">5. Readings and Services</h2>
            <p className="mt-3">
              Once a reading is requested and coins are deducted, the request is processed by our
              team. Readings are typically delivered within 5-10 minutes but may take longer during
              peak times. If a reading cannot be delivered, your coins will be refunded to your
              account balance.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-foreground">6. Privacy and Communication</h2>
            <p className="mt-3">
              All sessions and readings are confidential. Personal contact information (phone
              numbers, email addresses, social media) cannot be shared between clients and readers
              through the platform. Any attempt to share contact information will be filtered and
              may result in account suspension.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-foreground">7. Prohibited Conduct</h2>
            <p className="mt-3">
              You may not use the platform to harass, abuse, or threaten others. You may not attempt
              to circumvent the platform to contact readers directly. You may not use the platform
              for any illegal purpose or in violation of any applicable laws.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-foreground">8. Cancellation and Refunds</h2>
            <p className="mt-3">
              For live sessions: full refund if cancelled 24+ hours before the scheduled time,
              50% refund if cancelled 6-24 hours before, and no refund if cancelled less than
              6 hours before. For instant readings: refunds are provided only if the reading
              cannot be delivered.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-foreground">9. Intellectual Property</h2>
            <p className="mt-3">
              All content on The Inner Arc, including text, graphics, logos, and software, is the
              property of The Inner Arc and is protected by copyright laws. Readings provided to
              you are for your personal use only and may not be redistributed.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-foreground">10. Changes to Terms</h2>
            <p className="mt-3">
              We reserve the right to modify these terms at any time. Continued use of the platform
              after changes constitutes acceptance of the updated terms.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-foreground">11. Contact</h2>
            <p className="mt-3">
              For questions about these terms, please contact us through the{' '}
              <Link href="/contact" className="text-accent hover:underline">contact page</Link>.
            </p>
          </section>
        </div>
      </main>
    </SiteShell>
  )
}
