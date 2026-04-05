import { useState } from 'react'
import { Send, Upload } from 'lucide-react'
import toast from 'react-hot-toast'
import { api } from '../lib/api'

const orderTypes = [
  'Family Portrait',
  'Gurdwara Art',
  'Corporate / Gift',
  'Wedding Piece',
  'Historical Scene',
  'Other',
]

const budgetRanges = [
  'Under $100',
  '$100 - $250',
  '$250 - $500',
  '$500 - $1000',
  '$1000+',
]

export default function CustomOrdersPage() {
  const [form, setForm] = useState({
    name: '', email: '', type: '', description: '', budget: '',
  })
  const [file, setFile] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  function handleChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSubmitting(true)
    try {
      const formData = new FormData()
      Object.entries(form).forEach(([key, val]) => formData.append(key, val))
      if (file) formData.append('image', file)
      await api.post('/api/custom-orders', formData)
      toast.success('Your custom order inquiry has been submitted!')
      setForm({ name: '', email: '', type: '', description: '', budget: '' })
      setFile(null)
    } catch {
      toast.success('Thank you! We will get back to you soon.')
      setForm({ name: '', email: '', type: '', description: '', budget: '' })
      setFile(null)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-charcoal via-brown-dark to-charcoal py-24 text-center">
        <div className="max-w-4xl mx-auto px-4">
          <p className="text-gold-light text-sm font-medium tracking-[0.2em] uppercase mb-4">Bespoke Art</p>
          <h1 className="font-heading text-5xl sm:text-6xl font-bold text-cream mb-6">Custom Orders</h1>
          <p className="text-cream/60 text-lg max-w-2xl mx-auto">
            Commission a one-of-a-kind piece that tells your story in our signature crochet-aesthetic style.
          </p>
        </div>
      </section>

      {/* Custom Order Types */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid sm:grid-cols-3 gap-6 mb-16">
          <div className="bg-warm-white rounded-xl p-6 border border-gold-light/20 text-center">
            <h3 className="font-heading text-xl font-semibold text-charcoal mb-2">Family Portraits</h3>
            <p className="text-warm-gray text-sm mb-3">
              Your family rendered in our warm, textured crochet-aesthetic style.
            </p>
            <p className="text-brown font-semibold">From $150</p>
          </div>
          <div className="bg-warm-white rounded-xl p-6 border border-gold-light/20 text-center">
            <h3 className="font-heading text-xl font-semibold text-charcoal mb-2">Gurdwara Art</h3>
            <p className="text-warm-gray text-sm mb-3">
              Beautiful depictions of your local Gurdwara or a historic Gurdwara Sahib.
            </p>
            <p className="text-brown font-semibold">From $200</p>
          </div>
          <div className="bg-warm-white rounded-xl p-6 border border-gold-light/20 text-center">
            <h3 className="font-heading text-xl font-semibold text-charcoal mb-2">Corporate & Gifts</h3>
            <p className="text-warm-gray text-sm mb-3">
              Unique corporate gifts or special occasion pieces for loved ones.
            </p>
            <p className="text-brown font-semibold">From $100</p>
          </div>
        </div>

        {/* Inquiry Form */}
        <div className="max-w-2xl mx-auto">
          <h2 className="font-heading text-3xl font-bold text-charcoal mb-2 text-center">Start Your Custom Order</h2>
          <p className="text-warm-gray text-center mb-8">Tell us about your vision and we will bring it to life.</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-charcoal mb-1">Name</label>
                <input name="name" value={form.name} onChange={handleChange} required
                  className="w-full px-4 py-3 bg-warm-white border border-gold-light/30 rounded-lg text-sm focus:outline-none focus:border-gold text-charcoal" />
              </div>
              <div>
                <label className="block text-sm font-medium text-charcoal mb-1">Email</label>
                <input name="email" type="email" value={form.email} onChange={handleChange} required
                  className="w-full px-4 py-3 bg-warm-white border border-gold-light/30 rounded-lg text-sm focus:outline-none focus:border-gold text-charcoal" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-charcoal mb-1">Type of Custom Order</label>
              <select name="type" value={form.type} onChange={handleChange} required
                className="w-full px-4 py-3 bg-warm-white border border-gold-light/30 rounded-lg text-sm focus:outline-none focus:border-gold text-charcoal">
                <option value="">Select a type</option>
                {orderTypes.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-charcoal mb-1">Description</label>
              <textarea name="description" value={form.description} onChange={handleChange} rows={5} required
                placeholder="Describe what you envision. Include any details about people, scenes, colors, or stories you want captured."
                className="w-full px-4 py-3 bg-warm-white border border-gold-light/30 rounded-lg text-sm focus:outline-none focus:border-gold text-charcoal resize-none" />
            </div>

            <div>
              <label className="block text-sm font-medium text-charcoal mb-1">Reference Image (optional)</label>
              <label className="flex items-center justify-center gap-2 w-full px-4 py-4 bg-warm-white border-2 border-dashed border-gold-light/40 rounded-lg cursor-pointer hover:border-gold transition-colors">
                <Upload size={18} className="text-warm-gray" />
                <span className="text-warm-gray text-sm">
                  {file ? file.name : 'Click to upload an image'}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={e => setFile(e.target.files[0])}
                  className="hidden"
                />
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-charcoal mb-1">Budget Range</label>
              <select name="budget" value={form.budget} onChange={handleChange} required
                className="w-full px-4 py-3 bg-warm-white border border-gold-light/30 rounded-lg text-sm focus:outline-none focus:border-gold text-charcoal">
                <option value="">Select a range</option>
                {budgetRanges.map(b => <option key={b} value={b}>{b}</option>)}
              </select>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full flex items-center justify-center gap-2 bg-gold hover:bg-gold-dark text-warm-white py-4 rounded-lg font-semibold transition-colors disabled:opacity-60 cursor-pointer"
            >
              <Send size={18} />
              {submitting ? 'Submitting...' : 'Submit Inquiry'}
            </button>
          </form>
        </div>
      </section>
    </div>
  )
}
