import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Play, ExternalLink } from 'lucide-react'
import SEO from '../components/SEO'
import YarnDivider, { YarnBall } from '../components/YarnDivider'
import CrochetPattern from '../components/CrochetPattern'

const FEATURED_REELS = [
  { caption: 'Langar Scene', description: 'The warmth of community seva, stitched in thread' },
  { caption: 'Vaisakhi Celebration', description: 'A festival of colors and new beginnings' },
  { caption: 'Golden Temple at Dawn', description: 'Harmandir Sahib glowing in morning light' },
  { caption: 'Guru Nanak Dev Ji', description: 'The first Guru, rendered in crochet art' },
  { caption: 'Panj Pyare', description: 'The five beloved ones, standing strong' },
  { caption: 'Nagar Kirtan', description: 'A procession of faith through the streets' },
]

const REEL_GRADIENTS = [
  'from-gold/30 to-yarn-amber/20',
  'from-dusty-rose/30 to-coral/20',
  'from-sage/30 to-gold-light/20',
  'from-yarn-amber/30 to-gold/20',
  'from-coral/20 to-dusty-rose/30',
  'from-gold-light/30 to-sage/20',
]

function InstagramIcon({ size = 24, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
    </svg>
  )
}

export default function InstagramPage() {
  useEffect(() => {
    // Load Instagram embed script for future real embeds
    try {
      if (!document.querySelector('script[src*="instagram.com/embed.js"]')) {
        const script = document.createElement('script')
        script.src = '//www.instagram.com/embed.js'
        script.async = true
        document.body.appendChild(script)
      } else if (window.instgrm) {
        window.instgrm.Embeds.process()
      }
    } catch (e) {
      // Silently handle if embed script fails
    }
  }, [])

  return (
    <div>
      <SEO
        title="Follow @sikhithreads on Instagram | Sikh Crochet Art Stories"
        description="Follow SikhiThreads on Instagram for daily Sikh crochet art stories, behind-the-scenes content, and new collection previews. Join 500+ followers celebrating Sikh culture through handcrafted art."
        keywords="sikhithreads instagram, sikh art instagram, crochet art reels, sikh storytelling art"
        url="https://sikhithreads.com/instagram"
      />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-yarn-cream via-cream to-gold-light/20 py-20 yarn-texture">
        <YarnBall size={90} className="absolute top-6 right-8 opacity-15 hidden md:block" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gold to-yarn-amber flex items-center justify-center">
              <InstagramIcon size={28} className="text-warm-white" />
            </div>
          </div>
          <h1 className="font-heading text-4xl sm:text-5xl font-bold text-charcoal mb-3">
            @sikhithreads
          </h1>
          <p className="text-brown font-medium mb-2">500+ Followers</p>
          <p className="text-charcoal-light max-w-xl mx-auto mb-8">
            Sikh stories woven in thread. Handcrafted crochet-aesthetic art celebrating faith, culture, and community.
          </p>
          <a
            href="https://instagram.com/sikhithreads"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-gold hover:bg-gold-dark text-warm-white px-8 py-4 rounded-lg text-base font-semibold transition-all no-underline shadow-lg hover:shadow-xl"
          >
            <InstagramIcon size={20} />
            Follow @sikhithreads
          </a>
        </div>
      </section>

      <YarnDivider />

      {/* Featured Reels Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <p className="text-gold text-sm font-medium tracking-[0.15em] uppercase mb-2">Our Reels</p>
          <div className="flex items-center justify-center gap-3">
            <YarnBall size={24} color="#D4A574" />
            <h2 className="font-heading text-4xl font-bold text-charcoal">Featured Stories</h2>
          </div>
          <p className="text-warm-gray max-w-xl mx-auto mt-4">
            Each reel brings a Sikh story to life through our signature crochet art style.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURED_REELS.map((reel, i) => (
            <a
              key={i}
              href="https://instagram.com/sikhithreads"
              target="_blank"
              rel="noopener noreferrer"
              className="group no-underline"
            >
              <div className={`crochet-card overflow-hidden`}>
                <div className={`aspect-[9/16] sm:aspect-square bg-gradient-to-br ${REEL_GRADIENTS[i]} flex flex-col items-center justify-center p-6 relative`}>
                  <CrochetPattern variant={i % 3 === 0 ? 'yarn' : i % 3 === 1 ? 'knit' : 'stitch'} opacity={0.06} />
                  <div className="relative z-10 text-center">
                    <div className="w-14 h-14 rounded-full bg-warm-white/80 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform shadow-md">
                      <Play size={24} className="text-gold ml-1" fill="currentColor" />
                    </div>
                    <h3 className="font-heading text-lg font-semibold text-charcoal mb-1">{reel.caption}</h3>
                    <p className="text-charcoal-light/70 text-sm">{reel.description}</p>
                  </div>
                </div>
              </div>
            </a>
          ))}
        </div>
      </section>

      <YarnDivider />

      {/* Our Crochet World */}
      <section className="relative bg-cream-dark yarn-texture py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-charcoal mb-6">
            Our Crochet World
          </h2>
          <p className="text-charcoal-light leading-relaxed max-w-2xl mx-auto mb-4">
            Every scene on our Instagram is a handcrafted crochet world. From the warmth of Langar to the majesty of the Golden Temple, we bring Sikh stories to life through thread, color, and love.
          </p>
          <p className="text-charcoal-light leading-relaxed max-w-2xl mx-auto mb-10">
            Follow along to see new art, behind-the-scenes process videos, and stories from the Sikh tradition rendered in our signature style.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 bg-gold hover:bg-gold-dark text-warm-white px-8 py-4 rounded-lg text-base font-semibold transition-all no-underline shadow-lg"
            >
              Want This Art in Your Home?
              <ArrowRight size={18} />
            </Link>
            <a
              href="https://instagram.com/sikhithreads"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 border-2 border-charcoal/30 hover:border-gold text-charcoal px-8 py-4 rounded-lg text-base font-semibold transition-all no-underline"
            >
              Follow on Instagram
              <ExternalLink size={16} />
            </a>
          </div>
        </div>
      </section>

      {/* Instagram Embeds Section (for future real embeds) */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <p className="text-warm-gray text-sm">
            Real-time Instagram content will appear here once reel URLs are added.
          </p>
        </div>
        {/*
          To add real Instagram embeds, replace the placeholder above with:
          <blockquote className="instagram-media" data-instgrm-permalink="https://www.instagram.com/reel/REEL_ID/" data-instgrm-version="14"></blockquote>
        */}
      </section>
    </div>
  )
}
