import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

function getTimeLeft() {
  const diff = new Date('2026-04-13T00:00:00') - new Date()
  if (diff <= 0) return null
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  }
}

export default function CountdownBanner() {
  const [timeLeft, setTimeLeft] = useState(getTimeLeft)

  useEffect(() => {
    const id = setInterval(() => setTimeLeft(getTimeLeft()), 1000)
    return () => clearInterval(id)
  }, [])

  const expired = !timeLeft

  return (
    <div className="bg-gold text-charcoal py-3 px-4">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm font-medium">
        {expired ? (
          <span>Happy Vaisakhi! Celebrate with our special collection</span>
        ) : (
          <>
            <span>Vaisakhi Collection</span>
            <span className="font-bold tabular-nums">
              {timeLeft.days}d {String(timeLeft.hours).padStart(2, '0')}h{' '}
              {String(timeLeft.minutes).padStart(2, '0')}m{' '}
              {String(timeLeft.seconds).padStart(2, '0')}s until Vaisakhi Day
            </span>
          </>
        )}
        <Link
          to="/collections/vaisakhi"
          className="bg-charcoal text-cream px-4 py-1.5 rounded-full text-xs font-semibold hover:bg-brown transition-colors no-underline"
        >
          Shop Now &rarr;
        </Link>
      </div>
    </div>
  )
}
