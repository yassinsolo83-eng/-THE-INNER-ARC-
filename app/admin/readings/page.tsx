import { createServerClient } from '@/lib/supabase/server'
import { ReadingEditor } from '@/components/admin/reading-editor'

export default async function AdminReadingsPage() {
  const supabase = await createServerClient()

  const { data: reports } = await supabase
    .from('ai_reports')
    .select('id, report_type, generation_status, input_data, content_en, content_ar, coins_charged, created_at, client_id, profiles!ai_reports_client_id_fkey(first_name, full_name)')
    .order('created_at', { ascending: false })
    .limit(50)

  return (
    <div>
      <h1 className="font-serif text-3xl text-foreground">Reading Requests</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        View and respond to client reading requests.
      </p>
      <div className="mt-8">
        <ReadingEditor initialReports={reports || []} />
      </div>
    </div>
  )
}
