import { useState, useEffect } from 'react'
import { api } from '../../lib/api'
import { Loader2, Save } from 'lucide-react'
import toast from 'react-hot-toast'

const FIELDS = [
  { key: 'announcementBarText', label: 'Announcement Bar Text', type: 'text', placeholder: 'Free shipping on orders over ...' },
  { key: 'freeShippingThreshold', label: 'Free Shipping Threshold', type: 'number', placeholder: '999' },
  { key: 'heroImageUrl', label: 'Hero Image URL', type: 'text', placeholder: 'https://...' },
  { key: 'heroTitle', label: 'Hero Title', type: 'text', placeholder: 'Welcome to SikhiThreads' },
  { key: 'heroSubtitle', label: 'Hero Subtitle', type: 'text', placeholder: 'Authentic Sikh art and merchandise' },
  { key: 'contactEmail', label: 'Contact Email', type: 'email', placeholder: 'contact@sikhithreads.com' },
  { key: 'instagramUrl', label: 'Instagram URL', type: 'text', placeholder: 'https://instagram.com/...' },
  { key: 'metaPixelId', label: 'Meta Pixel ID', type: 'text', placeholder: 'Pixel ID' },
]

export default function SettingsPage() {
  const [form, setForm] = useState({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    loadSettings()
  }, [])

  async function loadSettings() {
    try {
      const res = await api.get('/api/admin/settings')
      const settings = res.settings || res || {}
      const data = {}
      FIELDS.forEach((f) => {
        data[f.key] = settings[f.key] ?? ''
      })
      setForm(data)
    } catch (err) {
      toast.error('Failed to load settings: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSaving(true)
    try {
      const payload = { ...form }
      if (payload.freeShippingThreshold) {
        payload.freeShippingThreshold = Number(payload.freeShippingThreshold)
      }
      await api.put('/api/admin/settings', payload)
      toast.success('Settings saved')
    } catch (err) {
      toast.error('Save failed: ' + err.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="animate-spin text-gold" size={32} />
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-charcoal font-heading">Settings</h1>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
        {FIELDS.map((field) => (
          <div key={field.key}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {field.label}
            </label>
            <input
              type={field.type}
              value={form[field.key] || ''}
              onChange={(e) => setForm((p) => ({ ...p, [field.key]: e.target.value }))}
              placeholder={field.placeholder}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold"
            />
          </div>
        ))}

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-gold hover:bg-gold-dark text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
          >
            {saving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
            Save Settings
          </button>
        </div>
      </form>
    </div>
  )
}
