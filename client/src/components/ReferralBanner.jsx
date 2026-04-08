import { useState, useEffect } from 'react'
import { Copy, Check, X } from 'lucide-react'
import toast from 'react-hot-toast'

const REFERRAL_KEY = 'sikhithreads_referral'

export default function ReferralBanner() {
  const [show, setShow] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    // Check URL for ref=share
    const params = new URLSearchParams(window.location.search)
    if (params.get('ref') === 'share') {
      localStorage.setItem(REFERRAL_KEY, 'true')
    }
    if (localStorage.getItem(REFERRAL_KEY)) {
      setShow(true)
    }
  }, [])

  function copyCode() {
    navigator.clipboard.writeText('FRIEND10').then(() => {
      setCopied(true)
      toast.success('Coupon code copied!')
      setTimeout(() => setCopied(false), 3000)
    })
  }

  if (!show) return null

  return (
    <div className="bg-gradient-to-r from-gold to-gold-dark text-charcoal py-2.5 px-4 text-center text-sm font-medium relative">
      <span>Welcome! Use code </span>
      <button
        onClick={copyCode}
        className="inline-flex items-center gap-1 bg-charcoal text-cream px-2 py-0.5 rounded text-xs font-bold cursor-pointer hover:bg-brown transition-colors mx-1"
      >
        FRIEND10
        {copied ? <Check size={12} /> : <Copy size={12} />}
      </button>
      <span> for 10% off</span>
      <button
        onClick={() => {
          setShow(false)
          localStorage.removeItem(REFERRAL_KEY)
        }}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-charcoal/60 hover:text-charcoal cursor-pointer"
        aria-label="Dismiss"
      >
        <X size={16} />
      </button>
    </div>
  )
}
