import { useState } from 'react'
import { Share2, Copy, Check } from 'lucide-react'
import toast from 'react-hot-toast'

export default function ShareDiscount({ productName, productSlug }) {
  const [copied, setCopied] = useState(false)
  const shareUrl = `https://sikhithreads.com/products/${productSlug}?ref=share`
  const shareText = `Check out ${productName} from SikhiThreads!`

  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`

  function copyLink() {
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true)
      toast.success('Link copied!')
      setTimeout(() => setCopied(false), 3000)
    })
  }

  return (
    <div className="mt-6 p-5 bg-cream-dark/50 rounded-xl border border-gold-light/20">
      <div className="flex items-center gap-2 mb-3">
        <Share2 size={18} className="text-gold" />
        <span className="font-semibold text-charcoal text-sm">Share with friends & get 10% off your order</span>
      </div>
      <div className="flex flex-wrap gap-2">
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 bg-green-600 text-white px-3 py-2 rounded-lg text-xs font-medium hover:bg-green-700 transition-colors no-underline"
        >
          WhatsApp
        </a>
        <a
          href={twitterUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 bg-charcoal text-white px-3 py-2 rounded-lg text-xs font-medium hover:bg-charcoal/80 transition-colors no-underline"
        >
          Twitter/X
        </a>
        <a
          href={facebookUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 bg-blue-600 text-white px-3 py-2 rounded-lg text-xs font-medium hover:bg-blue-700 transition-colors no-underline"
        >
          Facebook
        </a>
        <button
          onClick={copyLink}
          className="flex items-center gap-1.5 bg-white text-charcoal px-3 py-2 rounded-lg text-xs font-medium hover:bg-gold-light/20 transition-colors border border-gold-light/30 cursor-pointer"
        >
          {copied ? <Check size={14} /> : <Copy size={14} />}
          {copied ? 'Copied!' : 'Copy Link'}
        </button>
      </div>
    </div>
  )
}
