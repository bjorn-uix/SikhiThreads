import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Star } from 'lucide-react'
import SEO from '../components/SEO'
import YarnDivider, { YarnBall } from '../components/YarnDivider'
import CrochetPattern from '../components/CrochetPattern'

function InstagramIcon({ size = 24, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
    </svg>
  )
}
import ProductCard from '../components/ProductCard'
import EmailSignup from '../components/EmailSignup'
import { api } from '../lib/api'

const testimonials = [
  {
    name: 'Harpreet K.',
    text: 'The Guru Nanak piece is absolutely stunning. It brought tears to my eyes. The crochet texture gives it such a unique warmth that you can feel the love in every stitch.',
    rating: 5,
  },
  {
    name: 'Jasmine S.',
    text: 'I ordered a custom family portrait in the SikhiThreads style for my parents\u2019 anniversary. They were speechless. This is art that tells our story beautifully.',
    rating: 5,
  },
  {
    name: 'Ranjit M.',
    text: 'Finally, Sikh art that feels modern and soulful at the same time. The Vaisakhi collection is gorgeous. I\u2019ve already ordered three pieces for our home.',
    rating: 5,
  },
]

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/api/products?featured=true&limit=4')
      .then(data => setFeaturedProducts(data.products || data || []))
      .catch(() => setFeaturedProducts([]))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div>
      <SEO
        title="SikhiThreads — Sikh Art & Crochet Storytelling | Handcrafted Wall Art, Prints & Gifts"
        description="Discover handcrafted crochet-aesthetic Sikh art that brings the beauty of Sikhi to life. Shop wall art, canvas prints, phone cases, and unique gifts. Free shipping over $50."
        keywords="sikh art, sikh wall art, sikh gifts, crochet art, sikh home decor, vaisakhi gifts, golden temple art, guru nanak art"
        url="https://sikhithreads.com/"
        jsonLd={[
          {
            '@context': 'https://schema.org',
            '@type': 'Organization',
            name: 'SikhiThreads',
            url: 'https://sikhithreads.com',
            logo: 'https://sikhithreads.com/og-default.png',
            sameAs: ['https://instagram.com/sikhithreads'],
          },
          {
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            name: 'SikhiThreads',
            url: 'https://sikhithreads.com',
            potentialAction: {
              '@type': 'SearchAction',
              target: 'https://sikhithreads.com/shop?search={search_term_string}',
              'query-input': 'required name=search_term_string',
            },
          },
          {
            '@context': 'https://schema.org',
            '@type': 'Store',
            name: 'SikhiThreads',
            description: 'Sikh cultural art brand creating crochet-aesthetic storytelling art',
            url: 'https://sikhithreads.com',
            image: 'https://sikhithreads.com/og-default.png',
            priceRange: '$5 - $180',
            currenciesAccepted: 'USD',
            paymentAccepted: 'Credit Card, Debit Card',
            areaServed: ['US', 'CA', 'UK', 'IN', 'AU'],
            hasOfferCatalog: {
              '@type': 'OfferCatalog',
              name: 'Sikh Art Collection',
              itemListElement: [
                { '@type': 'OfferCatalog', name: 'Wall Art' },
                { '@type': 'OfferCatalog', name: 'Phone Cases' },
                { '@type': 'OfferCatalog', name: 'Home & Living' },
                { '@type': 'OfferCatalog', name: 'Digital Downloads' },
                { '@type': 'OfferCatalog', name: 'Apparel' },
              ],
            },
          },
        ]}
      />
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-yarn-cream via-cream to-gold-light/20 min-h-[80vh] flex items-center yarn-texture">
        <YarnBall size={120} className="absolute top-10 left-6 opacity-20 hidden md:block" />
        <YarnBall size={80} className="absolute bottom-16 right-10 opacity-15 hidden md:block" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
          <p className="text-brown text-sm font-medium tracking-[0.2em] uppercase mb-6">
            Handcrafted with Love
          </p>
          <h1 className="font-heading text-5xl sm:text-6xl lg:text-7xl font-bold text-charcoal leading-tight mb-4">
            Sikh Stories<br />
            <span className="text-gold-dark italic">Woven in Thread</span>
          </h1>
          {/* Decorative thread under headline */}
          <div className="max-w-xs mx-auto mb-6">
            <svg viewBox="0 0 200 12" fill="none" className="w-full">
              <path d="M0 6 Q25 2 50 6 Q75 10 100 6 Q125 2 150 6 Q175 10 200 6" stroke="#D4A574" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
            </svg>
          </div>
          <p className="text-charcoal-light text-lg sm:text-xl max-w-2xl mx-auto mb-10 font-light">
            Handcrafted crochet-aesthetic art that brings the beauty of Sikhi to life.
            Each piece tells a story of faith, courage, and love.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 bg-gold hover:bg-gold-dark text-warm-white px-8 py-4 rounded-lg text-base font-semibold transition-all no-underline shadow-lg hover:shadow-xl"
            >
              Explore the Collection
              <ArrowRight size={18} />
            </Link>
            <Link
              to="/custom-orders"
              className="inline-flex items-center gap-2 border-2 border-charcoal/30 hover:border-gold text-charcoal px-8 py-4 rounded-lg text-base font-semibold transition-all no-underline"
            >
              Custom Orders
            </Link>
          </div>
        </div>
      </section>

      <YarnDivider />

      {/* Featured Collection */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <p className="text-gold text-sm font-medium tracking-[0.15em] uppercase mb-2">Featured</p>
          <div className="flex items-center justify-center gap-3">
            <YarnBall size={28} color="#D4A574" />
            <h2 className="font-heading text-4xl font-bold text-charcoal mb-0">Vaisakhi Collection</h2>
          </div>
          <p className="text-warm-gray max-w-xl mx-auto">
            Celebrating the harvest festival of new beginnings, rendered in our signature crochet-aesthetic style.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin w-8 h-8 border-2 border-gold border-t-transparent rounded-full" />
          </div>
        ) : featuredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-warm-gray">
            <p>New pieces coming soon. Follow us for updates.</p>
          </div>
        )}

        <div className="text-center mt-10">
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 text-brown hover:text-brown-dark font-semibold no-underline transition-colors"
          >
            View All Products <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      <YarnDivider />

      {/* Our Story Teaser */}
      <section className="bg-cream-dark relative yarn-texture">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-gold text-sm font-medium tracking-[0.15em] uppercase mb-2">Our Story</p>
              <h2 className="font-heading text-4xl font-bold text-charcoal mb-6">
                Where Faith Meets Art
              </h2>
              <p className="text-charcoal-light leading-relaxed mb-4">
                SikhiThreads was born from a simple belief: that the stories of Sikhi deserve to be
                told in new, beautiful ways. Our crochet-aesthetic art transforms the teachings of the
                Gurus, the spirit of Vaisakhi, and the warmth of Sangat into pieces you can hold close.
              </p>
              <p className="text-charcoal-light leading-relaxed mb-8">
                Every thread carries intention. Every color carries meaning. Every piece carries a story
                that has been told for generations.
              </p>
              <Link
                to="/our-story"
                className="inline-flex items-center gap-2 text-brown hover:text-brown-dark font-semibold no-underline transition-colors"
              >
                Read Our Story <ArrowRight size={16} />
              </Link>
            </div>
            <div className="bg-gradient-to-br from-gold-light/30 to-gold/10 rounded-2xl aspect-square flex items-center justify-center relative overflow-hidden">
              <CrochetPattern variant="stitch" opacity={0.08} />
              <span className="font-heading text-6xl text-gold/40 italic relative z-10">ST</span>
            </div>
          </div>
        </div>
      </section>

      <YarnDivider />

      {/* Testimonials */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <p className="text-gold text-sm font-medium tracking-[0.15em] uppercase mb-2">Testimonials</p>
          <h2 className="font-heading text-4xl font-bold text-charcoal">What Our Community Says</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <div key={i} className="crochet-card p-8 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <YarnBall size={18} color="#D4A574" />
                <div className="flex gap-1">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} size={16} className="text-gold fill-gold" />
                  ))}
                </div>
              </div>
              <p className="text-charcoal-light text-sm leading-relaxed mb-6 italic">
                &ldquo;{t.text}&rdquo;
              </p>
              <p className="text-brown font-semibold text-sm">{t.name}</p>
            </div>
          ))}
        </div>
      </section>

      <YarnDivider />

      {/* Email Signup */}
      <section className="bg-charcoal knit-texture">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <EmailSignup />
        </div>
      </section>

      <YarnDivider />

      {/* Instagram Teaser */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <InstagramIcon size={24} className="text-brown" />
          <h2 className="font-heading text-3xl font-bold text-charcoal">Follow @sikhithreads</h2>
        </div>
        <p className="text-warm-gray mb-8 max-w-lg mx-auto">
          Join our community for daily inspiration, behind-the-scenes stories, and new collection previews.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="aspect-square bg-cream-dark rounded-xl flex items-center justify-center">
              <InstagramIcon size={32} className="text-warm-gray/30" />
            </div>
          ))}
        </div>
        <a
          href="https://instagram.com/sikhithreads"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 mt-8 text-brown hover:text-brown-dark font-semibold no-underline transition-colors stitch-border px-6 py-3"
        >
          Follow Us on Instagram <ArrowRight size={16} />
        </a>
      </section>
    </div>
  )
}
