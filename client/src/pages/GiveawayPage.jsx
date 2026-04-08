import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Gift, Share2, Users, Check, Copy, Clock } from 'lucide-react'
import toast from 'react-hot-toast'
import SEO from '../components/SEO'
import { api } from '../lib/api'

function useCountdown(targetDate) {
  const [timeLeft, setTimeLeft] = useState(getTimeLeft(targetDate))
  useEffect(() => {
    const id = setInterval(() => setTimeLeft(getTimeLeft(targetDate)), 1000)
    return () => clearInterval(id)
  }, [targetDate])
  return timeLeft
}

function getTimeLeft(target) {
  const diff = new Date(target) - new Date()
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, expired: true }
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
    expired: false,
  }
}

function CountdownUnit({ value, label }) {
  return (
    <div className="flex flex-col items-center">
      <span className="text-4xl sm:text-5xl font-bold text-charcoal font-heading tabular-nums">
        {String(value).padStart(2, '0')}
      </span>
      <span className="text-xs sm:text-sm text-warm-gray uppercase tracking-wider mt-1">{label}</span>
    </div>
  )
}

export default function GiveawayPage() {
  const countdown = useCountdown('2026-04-13T00:00:00')
  const [form, setForm] = useState({ name: '', email: '', instagram: '' })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [linkCopied, setLinkCopied] = useState(false)

  const shareUrl = 'https://sikhithreads.com/giveaway'
  const shareText = 'Win a FREE Signed SikhiThreads Art Print for Vaisakhi 2026! Enter now:'

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.name || !form.email) return
    setLoading(true)
    try {
      await api.post('/api/subscribe', {
        email: form.email,
        name: form.name,
        instagram: form.instagram || undefined,
        source: 'lead_magnet',
      })
      setSubmitted(true)
      toast.success('You\'re entered!')
    } catch (err) {
      toast.error(err.message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  function copyLink() {
    navigator.clipboard.writeText(shareUrl).then(() => {
      setLinkCopied(true)
      toast.success('Link copied!')
      setTimeout(() => setLinkCopied(false), 3000)
    })
  }

  return (
    <div className="min-h-screen bg-cream">
      <SEO
        title="Win a FREE Signed Art Print — Vaisakhi 2026 Giveaway | SikhiThreads"
        description="Enter our Vaisakhi 2026 giveaway for a chance to win a free signed SikhiThreads art print. Follow, share, and tag friends for extra entries!"
        keywords="vaisakhi giveaway, sikh art giveaway, free sikh art print, sikhithreads giveaway, vaisakhi 2026"
        url="https://sikhithreads.com/giveaway"
        image="https://sikhithreads.com/og-default.png"
      />

      {/* Hero */}
      <section className="bg-gradient-to-br from-gold-light/30 via-cream to-gold-light/20 py-16 sm:py-24 text-center px-4">
        <div className="max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-gold/10 text-brown px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Gift size={16} />
            Vaisakhi 2026 Giveaway
          </div>
          <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-charcoal mb-6 leading-tight">
            Win a FREE Signed SikhiThreads Art Print
          </h1>
          <p className="text-lg sm:text-xl text-charcoal-light max-w-2xl mx-auto">
            Celebrate Vaisakhi with us! Enter for a chance to win a hand-signed, limited edition
            art print from our Vaisakhi Collection.
          </p>
        </div>
      </section>

      {/* Countdown */}
      <section className="py-12 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-6 text-brown">
            <Clock size={18} />
            <span className="text-sm font-medium uppercase tracking-wider">
              {countdown.expired ? 'Giveaway has ended!' : 'Time until Vaisakhi Day'}
            </span>
          </div>
          {!countdown.expired && (
            <div className="flex justify-center gap-6 sm:gap-10">
              <CountdownUnit value={countdown.days} label="Days" />
              <CountdownUnit value={countdown.hours} label="Hours" />
              <CountdownUnit value={countdown.minutes} label="Minutes" />
              <CountdownUnit value={countdown.seconds} label="Seconds" />
            </div>
          )}
        </div>
      </section>

      {/* What You Win */}
      <section className="py-12 px-4">
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-10 items-center">
          <div className="aspect-square bg-cream-dark rounded-2xl flex items-center justify-center border-2 border-dashed border-gold-light/50">
            <div className="text-center p-8">
              <Gift size={48} className="mx-auto text-gold mb-4" />
              <p className="text-warm-gray text-sm">Art print preview coming soon</p>
            </div>
          </div>
          <div>
            <h2 className="font-heading text-3xl font-bold text-charcoal mb-4">What You Win</h2>
            <ul className="space-y-3 text-charcoal-light">
              <li className="flex items-start gap-3">
                <Check size={18} className="text-gold mt-0.5 flex-shrink-0" />
                <span>A hand-signed, limited edition art print from the Vaisakhi Collection</span>
              </li>
              <li className="flex items-start gap-3">
                <Check size={18} className="text-gold mt-0.5 flex-shrink-0" />
                <span>Museum-quality archival paper, ready to frame</span>
              </li>
              <li className="flex items-start gap-3">
                <Check size={18} className="text-gold mt-0.5 flex-shrink-0" />
                <span>Free shipping anywhere in the world</span>
              </li>
              <li className="flex items-start gap-3">
                <Check size={18} className="text-gold mt-0.5 flex-shrink-0" />
                <span>A personal thank-you note from the artist</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Entry Form */}
      <section className="py-12 px-4" id="enter">
        <div className="max-w-lg mx-auto">
          {!submitted ? (
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="font-heading text-2xl font-bold text-charcoal mb-2 text-center">Enter the Giveaway</h2>
              <p className="text-warm-gray text-center mb-6 text-sm">Winner announced on Vaisakhi Day (April 13)</p>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-1">Name *</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-gold-light/30 focus:border-gold focus:outline-none text-charcoal bg-cream/50"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-1">Email *</label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={e => setForm({ ...form, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-gold-light/30 focus:border-gold focus:outline-none text-charcoal bg-cream/50"
                    placeholder="you@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-1">Instagram Handle (optional)</label>
                  <input
                    type="text"
                    value={form.instagram}
                    onChange={e => setForm({ ...form, instagram: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-gold-light/30 focus:border-gold focus:outline-none text-charcoal bg-cream/50"
                    placeholder="@yourusername"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gold hover:bg-gold-dark text-warm-white py-4 rounded-lg font-semibold text-lg transition-colors shadow-lg hover:shadow-xl disabled:opacity-50 cursor-pointer"
                >
                  {loading ? 'Entering...' : 'Enter to Win'}
                </button>
              </form>
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
              <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check size={32} className="text-gold" />
              </div>
              <h2 className="font-heading text-2xl font-bold text-charcoal mb-2">You're In!</h2>
              <p className="text-charcoal-light mb-6">
                We'll announce the winner on Vaisakhi Day (April 13). Share this page to earn extra entries!
              </p>
              {/* Social Sharing */}
              <div className="flex justify-center gap-3 flex-wrap">
                <a
                  href={`https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors no-underline"
                >
                  WhatsApp
                </a>
                <a
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-charcoal text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-charcoal/80 transition-colors no-underline"
                >
                  Twitter/X
                </a>
                <button
                  onClick={copyLink}
                  className="flex items-center gap-2 bg-cream-dark text-charcoal px-4 py-2 rounded-lg text-sm font-medium hover:bg-gold-light/30 transition-colors cursor-pointer"
                >
                  <Copy size={14} />
                  {linkCopied ? 'Copied!' : 'Copy Link'}
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Extra Entries */}
      <section className="py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-heading text-3xl font-bold text-charcoal text-center mb-8">
            Earn Extra Entries
          </h2>
          <div className="grid sm:grid-cols-3 gap-6">
            <a
              href="https://instagram.com/sikhithreads"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white rounded-2xl p-6 text-center shadow-md hover:shadow-lg transition-shadow no-underline group"
            >
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
              </div>
              <h3 className="font-heading text-lg font-bold text-charcoal mb-2 group-hover:text-brown transition-colors">
                Follow Us
              </h3>
              <p className="text-warm-gray text-sm">Follow @sikhithreads on Instagram for +1 entry</p>
            </a>

            <button
              onClick={copyLink}
              className="bg-white rounded-2xl p-6 text-center shadow-md hover:shadow-lg transition-shadow cursor-pointer group"
            >
              <div className="w-14 h-14 bg-gold/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Share2 size={24} className="text-gold" />
              </div>
              <h3 className="font-heading text-lg font-bold text-charcoal mb-2 group-hover:text-brown transition-colors">
                Share This Page
              </h3>
              <p className="text-warm-gray text-sm">Copy the link and share with friends for +1 entry</p>
            </button>

            <a
              href="https://instagram.com/sikhithreads"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white rounded-2xl p-6 text-center shadow-md hover:shadow-lg transition-shadow no-underline group"
            >
              <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Users size={24} className="text-blue-600" />
              </div>
              <h3 className="font-heading text-lg font-bold text-charcoal mb-2 group-hover:text-brown transition-colors">
                Tag 2 Friends
              </h3>
              <p className="text-warm-gray text-sm">Tag 2 friends on our latest Instagram post for +1 entry</p>
            </a>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 text-center">
        <Link
          to="/collections/vaisakhi"
          className="inline-block bg-charcoal text-cream px-8 py-4 rounded-lg font-semibold hover:bg-brown transition-colors no-underline"
        >
          Explore the Vaisakhi Collection
        </Link>
      </section>
    </div>
  )
}
