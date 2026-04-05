import { useState } from 'react'
import { Send } from 'lucide-react'
import toast from 'react-hot-toast'
import { api } from '../lib/api'

export default function EmailSignup() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    if (!email) return

    setLoading(true)
    try {
      await api.post('/api/subscribe', { email })
      toast.success('Welcome to the SikhiThreads Sangat!')
      setEmail('')
    } catch {
      toast.success('Thank you for subscribing!')
      setEmail('')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="text-center max-w-lg mx-auto">
      <h3 className="font-heading text-2xl font-semibold text-cream mb-2">
        Join the SikhiThreads Sangat
      </h3>
      <p className="text-warm-gray text-sm mb-6">
        Be the first to know about new collections, stories, and exclusive offers.
      </p>
      <form onSubmit={handleSubmit} className="flex gap-3">
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="Your email address"
          required
          className="flex-1 px-4 py-3 bg-charcoal-light/50 border border-charcoal-light text-cream placeholder-warm-gray rounded-lg text-sm focus:outline-none focus:border-gold transition-colors"
        />
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-3 bg-gold hover:bg-gold-dark text-warm-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2 disabled:opacity-60"
        >
          <Send size={16} />
          {loading ? 'Joining...' : 'Join'}
        </button>
      </form>
    </div>
  )
}
