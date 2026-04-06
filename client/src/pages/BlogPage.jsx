import { ArrowRight } from 'lucide-react'
import SEO from '../components/SEO'

function InstagramIcon({ size = 24 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
    </svg>
  )
}

export default function BlogPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-32 text-center">
      <SEO
        title="Blog — Sikh Stories, Culture & Art | SikhiThreads"
        description="Explore stories of Sikh history, culture, and values through our blog. Learn about Vaisakhi, Guru Nanak, Langar, and more."
        keywords="sikh blog, sikh stories, sikh history, vaisakhi, sikh culture"
        url="https://sikhithreads.com/blog"
      />
      <div className="w-20 h-20 bg-gold-light/20 rounded-full flex items-center justify-center mx-auto mb-8">
        <span className="font-heading text-3xl text-gold">ST</span>
      </div>
      <h1 className="font-heading text-4xl font-bold text-charcoal mb-4">Coming Soon</h1>
      <p className="text-warm-gray text-lg mb-8 max-w-md mx-auto">
        Our blog is launching soon. Follow us on Instagram for daily stories,
        behind-the-scenes content, and the latest from SikhiThreads.
      </p>
      <a
        href="https://instagram.com/sikhithreads"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 bg-gold hover:bg-gold-dark text-warm-white px-8 py-4 rounded-lg font-semibold no-underline transition-colors"
      >
        <InstagramIcon size={20} />
        Follow @sikhithreads
        <ArrowRight size={16} />
      </a>
    </div>
  )
}
