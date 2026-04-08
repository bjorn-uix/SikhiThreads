import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Copy, Check } from 'lucide-react'
import SEO from '../components/SEO'

export default function VaisakhiGreetingPage() {
  const [copied, setCopied] = useState(false)
  const pageUrl = 'https://sikhithreads.com/vaisakhi'
  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent('Happy Vaisakhi 2026! \u{1F64F} ' + pageUrl)}`
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent('Happy Vaisakhi 2026! \u{1F64F} Waheguru Ji Ka Khalsa, Waheguru Ji Ki Fateh')}&url=${encodeURIComponent(pageUrl)}`
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageUrl)}`

  function copyLink() {
    navigator.clipboard.writeText(pageUrl).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 3000)
    })
  }

  return (
    <div className="min-h-[80vh] flex flex-col">
      <SEO
        title="Happy Vaisakhi 2026 — From SikhiThreads \u{1F64F}"
        description="Wishing you a blessed Vaisakhi 2026. May this Vaisakhi bring you closer to Waheguru, to your family, and to the values that make us who we are. Share this greeting with your loved ones."
        keywords="happy vaisakhi, vaisakhi 2026, vaisakhi greeting, sikh festival, waheguru"
        url={pageUrl}
        image="https://sikhithreads.com/og-default.png"
      />

      {/* Greeting Card */}
      <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-gold-light/40 via-cream to-gold-light/20 px-4 py-16 sm:py-24">
        <div className="max-w-2xl mx-auto text-center">
          {/* Khanda-inspired decorative element */}
          <div className="text-6xl mb-6">{'\u{2620}'}</div>
          <p className="text-brown font-medium text-lg sm:text-xl mb-4 tracking-wide">
            Waheguru Ji Ka Khalsa, Waheguru Ji Ki Fateh
          </p>

          <h1 className="font-heading text-5xl sm:text-7xl lg:text-8xl font-bold text-charcoal mb-8 leading-tight">
            Happy Vaisakhi<br />
            <span className="text-gold">2026</span>
          </h1>

          <p className="text-charcoal-light text-lg sm:text-xl leading-relaxed max-w-xl mx-auto mb-10">
            May this Vaisakhi bring you closer to Waheguru, to your family, and to the
            values that make us who we are.
          </p>

          {/* Decorative divider */}
          <div className="flex items-center justify-center gap-4 mb-10">
            <div className="h-px w-16 bg-gold/40" />
            <span className="text-gold text-2xl">{'\u{2022}'}</span>
            <div className="h-px w-16 bg-gold/40" />
          </div>

          {/* Share Buttons */}
          <p className="text-warm-gray text-sm font-medium uppercase tracking-wider mb-4">
            Share this greeting
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-green-600 text-white px-5 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors no-underline text-sm"
            >
              WhatsApp
            </a>
            <a
              href={twitterUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-charcoal text-white px-5 py-3 rounded-lg font-medium hover:bg-charcoal/80 transition-colors no-underline text-sm"
            >
              Twitter/X
            </a>
            <a
              href={facebookUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-blue-600 text-white px-5 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors no-underline text-sm"
            >
              Facebook
            </a>
            <button
              onClick={copyLink}
              className="flex items-center gap-2 bg-cream-dark text-charcoal px-5 py-3 rounded-lg font-medium hover:bg-gold-light/30 transition-colors cursor-pointer text-sm"
            >
              {copied ? <Check size={16} /> : <Copy size={16} />}
              {copied ? 'Copied!' : 'Copy Link'}
            </button>
          </div>
        </div>
      </div>

      {/* Footer CTA */}
      <div className="bg-charcoal py-8 px-4 text-center">
        <p className="text-cream/60 text-sm mb-3">Created with love by SikhiThreads</p>
        <Link
          to="/collections/vaisakhi"
          className="inline-block text-gold hover:text-gold-light font-semibold no-underline transition-colors"
        >
          Explore our Vaisakhi Collection &rarr;
        </Link>
      </div>
    </div>
  )
}
