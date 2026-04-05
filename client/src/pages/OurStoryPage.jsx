import { Link } from 'react-router-dom'
import { ArrowRight, Heart } from 'lucide-react'

export default function OurStoryPage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-charcoal via-brown-dark to-charcoal py-24 text-center">
        <div className="max-w-4xl mx-auto px-4">
          <p className="text-gold-light text-sm font-medium tracking-[0.2em] uppercase mb-4">About Us</p>
          <h1 className="font-heading text-5xl sm:text-6xl font-bold text-cream mb-6">Our Story</h1>
          <p className="text-cream/60 text-lg max-w-2xl mx-auto">
            How a love for Sikhi and a passion for art became SikhiThreads.
          </p>
        </div>
      </section>

      {/* Brand Story */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="prose prose-lg max-w-none">
          <p className="text-charcoal-light text-lg leading-relaxed mb-6">
            SikhiThreads began with a simple question: how do we tell the stories of Sikhi in a way
            that feels both timeless and fresh? The teachings of the Gurus, the bravery of Sikh
            history, the warmth of the Sangat — these stories deserve to be seen and felt in new ways.
          </p>
          <p className="text-charcoal-light text-lg leading-relaxed mb-6">
            We found our answer in the crochet aesthetic. There is something deeply human about
            textured, handcrafted art. It carries warmth. It carries the feeling of something made
            with love, patience, and intention — much like the values we grew up with in Sikhi.
          </p>
          <p className="text-charcoal-light text-lg leading-relaxed mb-6">
            Every piece we create tells a story. Whether it is a depiction of Guru Nanak Dev Ji's
            travels, a vibrant scene from Vaisakhi, or a custom family portrait rendered in our
            signature style — each work is an act of love and remembrance.
          </p>
          <p className="text-charcoal-light text-lg leading-relaxed">
            We believe that art is one of the most powerful ways to connect generations.
            A child who sees a beautiful, modern depiction of Sikh history on their wall grows up
            knowing these stories are worth celebrating. That is what SikhiThreads is about.
          </p>
        </div>
      </section>

      {/* Quote */}
      <section className="bg-cream-dark">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <Heart size={32} className="mx-auto text-gold mb-6" />
          <blockquote className="font-heading text-3xl sm:text-4xl italic text-charcoal leading-snug mb-6">
            &ldquo;The crochet aesthetic is the medium.<br />
            Sikh storytelling is the soul.&rdquo;
          </blockquote>
          <p className="text-warm-gray font-medium">— SikhiThreads</p>
        </div>
      </section>

      {/* Mission */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h2 className="font-heading text-3xl font-bold text-charcoal mb-6 text-center">Our Mission</h2>
        <p className="text-charcoal-light text-lg leading-relaxed text-center mb-8">
          To make Sikh stories visible, beautiful, and accessible to everyone — through art that
          honors tradition while embracing a modern, handcrafted aesthetic. We want every home to
          have a piece of Sikhi they are proud to display.
        </p>
        <div className="grid sm:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto bg-gold/10 rounded-full flex items-center justify-center mb-4">
              <span className="text-2xl">🪡</span>
            </div>
            <h3 className="font-heading text-lg font-semibold text-charcoal mb-2">Handcrafted</h3>
            <p className="text-warm-gray text-sm">Every piece created with intention and care.</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 mx-auto bg-gold/10 rounded-full flex items-center justify-center mb-4">
              <span className="text-2xl">📖</span>
            </div>
            <h3 className="font-heading text-lg font-semibold text-charcoal mb-2">Story-Driven</h3>
            <p className="text-warm-gray text-sm">Art rooted in the richness of Sikh history.</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 mx-auto bg-gold/10 rounded-full flex items-center justify-center mb-4">
              <span className="text-2xl">🏠</span>
            </div>
            <h3 className="font-heading text-lg font-semibold text-charcoal mb-2">For Every Home</h3>
            <p className="text-warm-gray text-sm">Making Sikhi visible in modern living spaces.</p>
          </div>
        </div>
      </section>

      {/* Team Placeholder */}
      <section className="bg-cream-dark">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <h2 className="font-heading text-3xl font-bold text-charcoal mb-4">The Team</h2>
          <p className="text-warm-gray mb-10 max-w-lg mx-auto">
            A small team driven by a big purpose. More about our team coming soon.
          </p>
          <div className="grid sm:grid-cols-3 gap-8">
            {['Founder & Artist', 'Creative Director', 'Community Lead'].map((role, i) => (
              <div key={i} className="bg-warm-white rounded-xl p-6 border border-gold-light/20">
                <div className="w-20 h-20 bg-gold-light/20 rounded-full mx-auto mb-4" />
                <p className="font-heading font-semibold text-charcoal">Coming Soon</p>
                <p className="text-warm-gray text-sm">{role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <h2 className="font-heading text-3xl font-bold text-charcoal mb-4">See Our Work</h2>
        <p className="text-warm-gray mb-8">Explore the collection and find a piece that speaks to you.</p>
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 bg-gold hover:bg-gold-dark text-warm-white px-8 py-4 rounded-lg font-semibold no-underline transition-colors"
        >
          Explore the Collection <ArrowRight size={18} />
        </Link>
      </section>
    </div>
  )
}
