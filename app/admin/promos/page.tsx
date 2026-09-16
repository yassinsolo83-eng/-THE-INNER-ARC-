import { createServerClient } from '@/lib/supabase/server'
import { PromoManager } from '@/components/admin/promo-manager'

export default async function AdminPromosPage() {
  const supabase = await createServerClient()

  const { data: promos } = await supabase
    .from('promo_codes')
    .select('*, promo_redemptions(count)')
    .order('created_at', { ascending: false })

  return (
    <div>
      <h1 className="font-serif text-3xl text-foreground">Promo Codes</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Create and manage promotional codes for your clients.
      </p>
      <div className="mt-8">
        <PromoManager initialPromos={promos || []} />
      </div>
    </div>
  )
}
