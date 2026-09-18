import Link from 'next/link'
import { SiteShell } from '@/components/site'

export const metadata = { title: 'Privacy Policy — The Inner Arc' }

export default function PrivacyPage() {
  return (
    <SiteShell>
      <main className="mx-auto max-w-3xl px-6 py-20 lg:py-28">
        <Link href="/" className="group inline-flex items-center gap-2 text-sm text-accent">
          <span className="transition-transform duration-300 group-hover:-translate-x-1">←</span> Home
        </Link>
        <h1 className="mt-8 font-serif text-5xl text-foreground">Privacy Policy</h1>
        <p className="mt-4 text-sm text-muted-foreground">Last updated: September 2026</p>

        <div className="mt-12 space-y-8 text-sm leading-7 text-muted-foreground">
          <section>
            <h2 className="font-serif text-xl text-foreground">1. Information We Collect</h2>
            <p className="mt-3">
              We collect information you provide directly: your name, email address, birth date,
              birth time, birth location, gender, and relationship status. We also collect
              payment information through our secure payment providers — we never store your
              card details directly.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-foreground">2. How We Use Your Information</h2>
            <p className="mt-3">
              Your birth details are used exclusively to provide personalized astrological readings
              and services. Your email is used for account management, reading delivery, and
              platform communications. We do not sell, rent, or share your personal information
              with third parties for marketing purposes.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-foreground">3. Reading Content</h2>
            <p className="mt-3">
              The content of your readings is private and accessible only to you and the assigned
              reader. Readings are stored securely in your account for future reference. We do not
              share reading content with other users or third parties.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-foreground">4. Session Privacy</h2>
            <p className="mt-3">
              Live sessions are not recorded. Chat messages within sessions are stored for your
              reference in your session summary. Contact information shared in chat is automatically
              filtered to protect both clients and readers.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-foreground">5. Data Security</h2>
            <p className="mt-3">
              We use industry-standard security measures including encryption, secure authentication,
              and row-level security policies to protect your data. Access to your data is strictly
              limited to authorized personnel and the services you use.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-foreground">6. Cookies</h2>
            <p className="mt-3">
              We use essential cookies for authentication and session management. We do not use
              third-party advertising cookies or tracking pixels.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-foreground">7. Data Retention</h2>
            <p className="mt-3">
              Your account data and reading history are retained as long as your account is active.
              You may request deletion of your account and all associated data by contacting us.
              Upon deletion, your data will be permanently removed within 30 days.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-foreground">8. Your Rights</h2>
            <p className="mt-3">
              You have the right to access, correct, or delete your personal data. You may update
              your birth profile and account information at any time through your dashboard. To
              request data export or account deletion, please contact us.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-foreground">9. Contact</h2>
            <p className="mt-3">
              For privacy-related inquiries, please reach out through our{' '}
              <Link href="/contact" className="text-accent hover:underline">contact page</Link>.
            </p>
          </section>
        </div>
      </main>
    </SiteShell>
  )
}
