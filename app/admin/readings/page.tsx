import { createServerClient } from '@/lib/supabase/server'
import { ReadingEditor } from '@/components/admin/reading-editor'

export default async function AdminReadingsPage() {
  const supabase = await createServerClient()

  // Fetch reports and client profiles separately to avoid FK naming issues
  const { data: reports } = await supabase
    .from('ai_reports')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(50)

  // Get unique client IDs and fetch their profiles
  const clientIds = [...new Set((reports || []).map((r: any) => r.client_id))]
  const { data: profiles } = clientIds.length > 0
    ? await supabase.from('profiles').select('id, first_name, full_name').in('id', clientIds)
    : { data: [] }

  // Merge profiles into reports
  const profileMap: Record<string, any> = {}
  for (const p of profiles || []) {
    profileMap[p.id] = p
  }

  const enrichedReports = (reports || []).map((r: any) => ({
    ...r,
    profiles: profileMap[r.client_id] || null,
  }))

  return (
    <div>
      <h1 className="font-serif text-3xl text-foreground">Reading Requests</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        View and respond to client reading requests.
      </p>
      <div className="mt-8">
        <ReadingEditor initialReports={enrichedReports} />
      </div>
    </div>
  )
}
