import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import SEO from '../components/SEO'

export default function NotFoundPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-32 text-center">
      <SEO title="Page Not Found | SikhiThreads" noindex />
      <h1 className="font-heading text-8xl font-bold text-gold-light mb-4">404</h1>
      <h2 className="font-heading text-3xl font-bold text-charcoal mb-4">Page Not Found</h2>
      <p className="text-warm-gray text-lg mb-8">
        The page you are looking for does not exist or has been moved.
      </p>
      <Link
        to="/"
        className="inline-flex items-center gap-2 bg-gold hover:bg-gold-dark text-warm-white px-8 py-4 rounded-lg font-semibold no-underline transition-colors"
      >
        Back to Home <ArrowRight size={18} />
      </Link>
    </div>
  )
}
