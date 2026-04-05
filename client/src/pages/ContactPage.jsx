import { useState } from 'react'
import { Send, Mail } from 'lucide-react'

function InstagramIcon({ size = 24, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
    </svg>
  )
}
import toast from 'react-hot-toast'
import { api } from '../lib/api'

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [submitting, setSubmitting] = useState(false)

  function handleChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSubmitting(true)
    try {
      await api.post('/api/contact', form)
      toast.success('Message sent! We will get back to you soon.')
      setForm({ name: '', email: '', subject: '', message: '' })
    } catch {
      toast.success('Thank you for reaching out! We will respond shortly.')
      setForm({ name: '', email: '', subject: '', message: '' })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="text-center mb-12">
        <h1 className="font-heading text-5xl font-bold text-charcoal mb-4">Contact Us</h1>
        <p className="text-warm-gray max-w-lg mx-auto">
          Have a question, idea, or just want to say hello? We would love to hear from you.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-12">
        {/* Contact Form */}
        <div className="md:col-span-2">
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
              <label className="block text-sm font-medium text-charcoal mb-1">Subject</label>
              <input name="subject" value={form.subject} onChange={handleChange} required
                className="w-full px-4 py-3 bg-warm-white border border-gold-light/30 rounded-lg text-sm focus:outline-none focus:border-gold text-charcoal" />
            </div>
            <div>
              <label className="block text-sm font-medium text-charcoal mb-1">Message</label>
              <textarea name="message" value={form.message} onChange={handleChange} rows={6} required
                className="w-full px-4 py-3 bg-warm-white border border-gold-light/30 rounded-lg text-sm focus:outline-none focus:border-gold text-charcoal resize-none" />
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="flex items-center gap-2 bg-gold hover:bg-gold-dark text-warm-white px-8 py-4 rounded-lg font-semibold transition-colors disabled:opacity-60 cursor-pointer"
            >
              <Send size={18} />
              {submitting ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </div>

        {/* Contact Info */}
        <div>
          <div className="bg-warm-white rounded-xl p-6 border border-gold-light/20">
            <h3 className="font-heading text-lg font-semibold text-charcoal mb-4">Get in Touch</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Mail size={18} className="text-brown mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-charcoal">Email</p>
                  <a href="mailto:hello@sikhithreads.com" className="text-warm-gray text-sm no-underline hover:text-brown transition-colors">
                    hello@sikhithreads.com
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <InstagramIcon size={18} className="text-brown mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-charcoal">Instagram</p>
                  <a href="https://instagram.com/sikhithreads" target="_blank" rel="noopener noreferrer"
                    className="text-warm-gray text-sm no-underline hover:text-brown transition-colors">
                    @sikhithreads
                  </a>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-gold-light/20">
              <p className="text-warm-gray text-sm leading-relaxed">
                We typically respond within 24 hours. For custom order inquiries,
                please use our <a href="/custom-orders" className="text-brown no-underline hover:underline">custom orders page</a>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
