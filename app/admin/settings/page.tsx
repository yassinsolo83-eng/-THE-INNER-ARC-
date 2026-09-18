'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getSupabaseBrowserClient } from '@/lib/supabase/client'

export default function AdminSettingsPage() {
  const router = useRouter()
  const [settings, setSettings] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    async function load() {
      const supabase = getSupabaseBrowserClient()
      const { data } = await supabase.from('platform_settings').select('key, value')
      const map: Record<string, string> = {}
      for (const row of data || []) map[row.key] = row.value
      setSettings(map)
      setLoading(false)
    }
    load()
  }, [])

  async function handleSave() {
    setSaving(true)
    setSuccess(false)
    try {
      const supabase = getSupabaseBrowserClient()
      for (const [key, value] of Object.entries(settings)) {
        await supabase
          .from('platform_settings')
          .upsert({ key, value, updated_at: new Date().toISOString() }, { onConflict: 'key' })
      }
      setSuccess(true)
    } catch {}
    setSaving(false)
  }

  if (loading) {
    return <p className="text-sm text-muted-foreground">Loading settings...</p>
  }

  return (
    <div>
      <h1 className="font-serif text-3xl text-foreground">Platform Settings</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Edit platform-wide settings. Changes apply immediately.
      </p>

      <div className="mt-8 space-y-6 border border-border bg-card p-6">
        <div>
          <label className="block text-xs uppercase tracking-[0.2em] text-accent">WhatsApp Number</label>
          <input
            type="text"
            value={settings.whatsapp_number || ''}
            onChange={(e) => setSettings({ ...settings, whatsapp_number: e.target.value })}
            placeholder="+201234567890"
            className="mt-2 w-full border border-border bg-background px-4 py-3 text-sm text-foreground focus:border-accent focus:outline-none"
          />
          <p className="mt-1 text-xs text-muted-foreground">Include country code (e.g. +20 for Egypt)</p>
        </div>

        <div>
          <label className="block text-xs uppercase tracking-[0.2em] text-accent">Contact Email</label>
          <input
            type="email"
            value={settings.contact_email || ''}
            onChange={(e) => setSettings({ ...settings, contact_email: e.target.value })}
            placeholder="hello@theinnerarc.co"
            className="mt-2 w-full border border-border bg-background px-4 py-3 text-sm text-foreground focus:border-accent focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs uppercase tracking-[0.2em] text-accent">Platform Name</label>
          <input
            type="text"
            value={settings.platform_name || ''}
            onChange={(e) => setSettings({ ...settings, platform_name: e.target.value })}
            className="mt-2 w-full border border-border bg-background px-4 py-3 text-sm text-foreground focus:border-accent focus:outline-none"
          />
        </div>

        {success && <p className="text-sm text-emerald-400">Settings saved successfully.</p>}

        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="rounded-full bg-primary px-8 py-3 text-sm font-medium text-primary-foreground transition-all hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Save settings'}
        </button>
      </div>
    </div>
  )
}
