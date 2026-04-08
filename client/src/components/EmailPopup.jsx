import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import toast from 'react-hot-toast'
import { api } from '../lib/api'

const DISMISS_KEY = 'emailPopup_dismissed'
const SUBSCRIBED_KEY = 'emailPopup_subscribed'

export default function EmailPopup() {
  const [visible, setVisible] = useState(false)
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [subscribed, setSubscribed] = useState(false)

  useEffect(() => {
    // Don't show if already subscribed
    if (localStorage.getItem(SUBSCRIBED_KEY)) return

    // Don't show if dismissed within 7 days
    const dismissed = localStorage.getItem(DISMISS_KEY)
    if (dismissed) {
      const dismissedAt = parseInt(dismissed, 10)
      if (Date.now() - dismissedAt < 7 * 24 * 60 * 60 * 1000) return
    }

    // Show after 5 seconds or on 50% scroll
    const timer = setTimeout(() => setVisible(true), 5000)

    function onScroll() {
      const scrollPct = window.scrollY / (document.body.scrollHeight - window.innerHeight)
      if (scrollPct >= 0.5) {
        setVisible(true)
        window.removeEventListener('scroll', onScroll)
      }
    }
    window.addEventListener('scroll', onScroll)

    return () => {
      clearTimeout(timer)
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  function dismiss() {
    setVisible(false)
    localStorage.setItem(DISMISS_KEY, String(Date.now()))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!email) return
    setLoading(true)
    try {
      await api.post('/api/subscribe', { email, source: 'lead_magnet' })
      setSubscribed(true)
      localStorage.setItem(SUBSCRIBED_KEY, 'true')
      toast.success('Check your email!')
    } catch (err) {
      toast.error(err.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  if (!visible) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 animate-slide-up">
      <div className="max-w-lg mx-auto px-4 pb-4">
        <div className="bg-white rounded-2xl shadow-2xl border border-gold-light/20 p-6 relative">
          <button
            onClick={dismiss}
            className="absolute top-3 right-3 text-warm-gray hover:text-charcoal transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X size={20} />
          </button>

          {!subscribed ? (
            <>
              <h3 className="font-heading text-xl font-bold text-charcoal mb-1">
                Get Free Vaisakhi Wallpapers
              </h3>
              <p className="text-warm-gray text-sm mb-4">
                Join the SikhiThreads Sangat and get a free wallpaper pack instantly.
              </p>
              <form onSubmit={handleSubmit} className="flex gap-2">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="flex-1 px-4 py-3 rounded-lg border border-gold-light/30 focus:border-gold focus:outline-none text-charcoal text-sm"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-gold hover:bg-gold-dark text-warm-white px-5 py-3 rounded-lg font-semibold text-sm transition-colors whitespace-nowrap disabled:opacity-50 cursor-pointer"
                >
                  {loading ? '...' : 'Get Free Wallpapers'}
                </button>
              </form>
              <button
                onClick={dismiss}
                className="text-warm-gray hover:text-charcoal text-xs mt-3 cursor-pointer underline"
              >
                No thanks
              </button>
            </>
          ) : (
            <div className="text-center py-2">
              <p className="font-heading text-xl font-bold text-charcoal">Check your email!</p>
              <p className="text-warm-gray text-sm mt-1">Your wallpapers are on the way.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
