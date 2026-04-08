import { useState, useEffect } from 'react'
import { X } from 'lucide-react'

const MESSAGES = [
  '\u{1F3A8} Someone from California just viewed the Langar print',
  '\u{1F64F} 12 people are browsing the Vaisakhi Collection right now',
  '\u{2B50} New 5-star review on Golden Temple Canvas',
  '\u{1F4E6} Someone from London just added to cart',
  '\u{1F3A8} Someone from Toronto just viewed the Panj Pyare print',
  '\u{1F64F} 8 people are viewing this collection right now',
  '\u{2B50} "Beautiful craftsmanship!" — New review on Guru Nanak print',
  '\u{1F4E6} Someone from New York just added to cart',
  '\u{1F3A8} Someone from Melbourne just viewed the Seva print',
  '\u{1F6D2} 3 people added Vaisakhi items to their cart today',
  '\u{2B50} New 5-star review on Nagar Kirtan print',
  '\u{1F4E6} Someone from Birmingham just added to cart',
  '\u{1F3A8} Someone from Vancouver just viewed the Amrit Vela print',
  '\u{1F64F} 15 people browsed the shop in the last hour',
  '\u{2B50} "A perfect gift!" — New review on Khalsa Pride Phone Case',
]

export default function SocialProof() {
  const [current, setCurrent] = useState(null)
  const [visible, setVisible] = useState(false)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    if (sessionStorage.getItem('socialproof_dismissed')) {
      setDismissed(true)
      return
    }

    let msgIndex = 0
    let showTimer, hideTimer

    function showNext() {
      setCurrent(MESSAGES[msgIndex % MESSAGES.length])
      setVisible(true)
      msgIndex++

      hideTimer = setTimeout(() => {
        setVisible(false)
      }, 4000)

      showTimer = setTimeout(showNext, 30000 + Math.random() * 15000)
    }

    // First show after 10 seconds
    showTimer = setTimeout(showNext, 10000)

    return () => {
      clearTimeout(showTimer)
      clearTimeout(hideTimer)
    }
  }, [dismissed])

  function handleDismiss() {
    setVisible(false)
    setDismissed(true)
    sessionStorage.setItem('socialproof_dismissed', 'true')
  }

  if (dismissed || !current) return null

  return (
    <div
      className={`fixed bottom-4 left-4 z-40 max-w-xs transition-all duration-500 ${
        visible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0 pointer-events-none'
      }`}
    >
      <div className="bg-white rounded-xl shadow-lg border border-gold-light/20 p-4 pr-10 text-sm text-charcoal relative">
        {current}
        <button
          onClick={handleDismiss}
          className="absolute top-2 right-2 text-warm-gray hover:text-charcoal cursor-pointer"
          aria-label="Dismiss"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  )
}
