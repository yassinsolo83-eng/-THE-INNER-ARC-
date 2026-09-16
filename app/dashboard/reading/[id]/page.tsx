import Link from 'next/link'
import { redirect, notFound } from 'next/navigation'
import { SiteShell } from '@/components/site'
import { HeroEntrance } from '@/components/hero-entrance'
import { ReadingContent } from '@/components/reading-content'
import { createServerClient } from '@/lib/supabase/server'

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  return { title: 'Your Reading — The Inner Arc' }
}

export default async function ReadingViewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: report } = await supabase
    .from('ai_reports')
    .select('*')
    .eq('id', id)
    .eq('client_id', user.id)
    .single()

  if (!report) notFound()

  const typeName = report.report_type.replace(/_/g, ' ')

  return (
    <SiteShell>
      <main className="mx-auto max-w-3xl px-6 py-20 lg:py-28">
        <HeroEntrance>
          <Link href="/dashboard" className="group inline-flex items-center gap-2 text-sm text-accent">
            <span className="transition-transform duration-300 group-hover:-translate-x-1">←</span> Dashboard
          </Link>

          <div className="mt-8">
            <p className="text-xs uppercase tracking-[0.3em] text-accent capitalize">{typeName}</p>
            <h1 className="mt-4 font-serif text-4xl text-foreground">Your Reading</h1>
            <p className="mt-2 text-xs text-muted-foreground">
              Requested on {new Date(report.created_at).toLocaleDateString()}
              {report.generated_at && ` · Delivered on ${new Date(report.generated_at).toLocaleDateString()}`}
            </p>
          </div>
        </HeroEntrance>

        {report.generation_status === 'completed' && report.content_en ? (
          <ReadingContent contentEn={report.content_en} contentAr={report.content_ar} />
        ) : report.generation_status === 'pending' ? (
          <div className="mt-10 border border-border bg-card p-8 text-center">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent" />
            <h2 className="mt-4 font-serif text-xl text-foreground">Your reading is being prepared</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              One of our specialists is working on it. Check back shortly.
            </p>
          </div>
        ) : (
          <div className="mt-10 border border-border bg-card p-8 text-center">
            <p className="text-sm text-red-400">
              There was an issue with this reading. Your coins have been refunded.
            </p>
          </div>
        )}
      </main>
    </SiteShell>
  )
}
