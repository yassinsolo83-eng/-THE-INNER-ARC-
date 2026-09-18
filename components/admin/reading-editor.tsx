'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { getSupabaseBrowserClient } from '@/lib/supabase/client'

export function ReadingEditor({ initialReports }: { initialReports: any[] }) {
  const router = useRouter()
  const [editing, setEditing] = useState<string | null>(null)
  const [contentEn, setContentEn] = useState('')
  const [contentAr, setContentAr] = useState('')
  const [saving, setSaving] = useState(false)

  const pending = initialReports.filter((r) => r.generation_status === 'pending')
  const completed = initialReports.filter((r) => r.generation_status === 'completed')

  function startEditing(report: any) {
    setEditing(report.id)
    setContentEn(report.content_en || '')
    setContentAr(report.content_ar || '')
  }

  async function handleSave(reportId: string, clientId: string, readingType: string) {
    if (!contentEn.trim()) return
    setSaving(true)

    try {
      const supabase = getSupabaseBrowserClient()
      const { error } = await supabase
        .from('ai_reports')
        .update({
          content_en: contentEn,
          content_ar: contentAr || null,
          generation_status: 'completed',
          generated_at: new Date().toISOString(),
          model_used: 'manual',
        })
        .eq('id', reportId)

      if (error) throw error

      // Notify client via email
      fetch('/api/email/reading-ready', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reportId, clientId, readingType }),
      }).catch(() => {})

      setEditing(null)
      router.refresh()
    } catch (err: any) {
      alert('Failed to save: ' + (err?.message || 'Unknown error'))
    } finally {
      setSaving(false)
    }
  }

  function formatInputData(data: any) {
    if (!data) return null
    return {
      birth: `${data.birth_date || '?'} · ${data.birth_time || 'Time unknown'} · ${data.birth_city || '?'}, ${data.birth_country || '?'}`,
      sign: data.zodiac_sign || '?',
      gender: data.gender || 'Not specified',
      question: data.question || 'No specific question',
      partner: data.partner ? `${data.partner.name || 'Unknown'} · Born: ${data.partner.birth_date || '?'} · Sign: ${data.partner.sign || '?'}` : null,
    }
  }

  return (
    <div>
      {/* Pending requests */}
      <div className="mb-8">
        <h2 className="flex items-center gap-3 text-xs uppercase tracking-[0.2em] text-accent">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-yellow-950/60 text-xs text-yellow-400">
            {pending.length}
          </span>
          Pending requests
        </h2>

        {pending.length === 0 ? (
          <p className="mt-4 border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
            No pending requests right now.
          </p>
        ) : (
          <div className="mt-4 space-y-4">
            {pending.map((report: any) => {
              const info = formatInputData(report.input_data)
              return (
                <div key={report.id} className="border border-yellow-500/20 bg-card p-5">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="font-serif text-lg text-foreground capitalize">
                        {report.report_type.replace(/_/g, ' ')}
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        Client: {report.profiles?.first_name || report.profiles?.full_name || 'Unknown'} · {report.coins_charged} coins · {new Date(report.created_at).toLocaleString()}
                      </p>

                      {info && (
                        <div className="mt-3 space-y-1.5 rounded bg-background/50 p-3">
                          <p className="text-xs text-muted-foreground">
                            <span className="text-accent">Birth:</span> {info.birth}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            <span className="text-accent">Sign:</span> {info.sign} · <span className="text-accent">Gender:</span> {info.gender}
                          </p>
                          <p className="text-sm text-foreground">
                            <span className="text-xs text-accent">Question:</span> {info.question}
                          </p>
                          {info.partner && (
                            <p className="text-xs text-muted-foreground">
                              <span className="text-accent">Partner:</span> {info.partner}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                    {editing !== report.id && (
                      <button
                        type="button"
                        onClick={() => startEditing(report)}
                        className="ml-4 flex-shrink-0 rounded-full bg-primary px-5 py-2 text-sm font-medium text-primary-foreground transition-all hover:-translate-y-0.5 hover:shadow-lg"
                      >
                        Write reading
                      </button>
                    )}
                  </div>

                  {editing === report.id && (
                    <div className="mt-5 space-y-4">
                      <div>
                        <label className="block text-xs uppercase tracking-[0.2em] text-accent">
                          Reading (English) *
                        </label>
                        <textarea
                          value={contentEn}
                          onChange={(e) => setContentEn(e.target.value)}
                          rows={12}
                          className="mt-2 w-full border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none"
                          placeholder="Write the reading here..."
                        />
                      </div>
                      <div>
                        <label className="block text-xs uppercase tracking-[0.2em] text-accent">
                          Reading (Arabic) <span className="normal-case text-muted-foreground">— optional</span>
                        </label>
                        <textarea
                          value={contentAr}
                          onChange={(e) => setContentAr(e.target.value)}
                          rows={8}
                          dir="rtl"
                          className="mt-2 w-full border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none"
                          placeholder="اكتب القراءة بالعربي هنا..."
                        />
                      </div>
                      <div className="flex gap-3">
                        <button
                          type="button"
                          onClick={() => handleSave(report.id, report.client_id, report.report_type)}
                          disabled={saving || !contentEn.trim()}
                          className="rounded-full bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground transition-all hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-50"
                        >
                          {saving ? 'Saving...' : 'Submit reading'}
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditing(null)}
                          className="rounded-full border border-border px-6 py-2.5 text-sm text-muted-foreground hover:border-accent hover:text-accent"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Completed readings */}
      <div>
        <h2 className="flex items-center gap-3 text-xs uppercase tracking-[0.2em] text-accent">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-950/60 text-xs text-emerald-400">
            {completed.length}
          </span>
          Completed readings
        </h2>

        {completed.length === 0 ? (
          <p className="mt-4 border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
            No completed readings yet.
          </p>
        ) : (
          <div className="mt-4 space-y-3">
            {completed.map((report: any) => (
              <div key={report.id} className="flex items-center justify-between border border-border bg-card p-4">
                <div>
                  <p className="text-sm text-foreground capitalize">
                    {report.report_type.replace(/_/g, ' ')}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {report.profiles?.first_name || 'Unknown'} · {new Date(report.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="rounded-full bg-emerald-950/60 px-2 py-0.5 text-[10px] text-emerald-400">
                    Delivered
                  </span>
                  <button
                    type="button"
                    onClick={() => startEditing(report)}
                    className="text-xs text-accent hover:underline"
                  >
                    Edit
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
