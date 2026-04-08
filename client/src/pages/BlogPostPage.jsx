import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Calendar, User, ArrowLeft, ArrowRight, Share2, Copy, Check, ChevronDown, ChevronUp } from 'lucide-react'
import SEO from '../components/SEO'
import RelatedContent from '../components/RelatedContent'
import { api } from '../lib/api'

// FAQ data for blog posts — keyed by slug
const BLOG_FAQS = {
  'what-is-vaisakhi': [
    { q: 'When is Vaisakhi celebrated?', a: 'Vaisakhi is celebrated on April 13th or 14th each year. It marks the founding of the Khalsa by Guru Gobind Singh Ji in 1699 and is also a traditional harvest festival in Punjab.' },
    { q: 'How is Vaisakhi celebrated?', a: 'Vaisakhi is celebrated with Nagar Kirtan processions, special Gurdwara services, Gatka martial arts demonstrations, Langar feasts, and community gatherings. Many Sikhs also take Amrit (baptism) on this day.' },
    { q: 'What is the significance of Vaisakhi in Sikhism?', a: 'Vaisakhi holds immense significance as the day Guru Gobind Singh Ji created the Khalsa in 1699 at Anandpur Sahib. The Panj Pyare (Five Beloved Ones) were baptized, establishing the distinct Sikh identity and the tradition of Amrit.' },
    { q: 'Is Vaisakhi a public holiday?', a: 'Vaisakhi is a gazetted holiday in Punjab, India, and is recognized by Sikh communities worldwide. In countries like Canada and the UK with large Sikh populations, major Nagar Kirtan celebrations draw thousands of participants.' },
  ],
  'golden-temple-harmandir-sahib': [
    { q: 'Why is the Golden Temple called Harmandir Sahib?', a: 'Harmandir Sahib translates to "The Abode of God." It is the formal name for the Golden Temple, reflecting its role as the most sacred Gurdwara in Sikhism. The name "Golden Temple" comes from its gold-plated exterior.' },
    { q: 'Can anyone visit the Golden Temple?', a: 'Yes. The Golden Temple welcomes all visitors regardless of religion, caste, gender, or nationality. This open-door policy reflects the core Sikh principle of equality. Visitors are asked to cover their heads and remove their shoes as a sign of respect.' },
    { q: 'How many people does the Golden Temple feed daily?', a: 'The Golden Temple Langar (community kitchen) serves free meals to approximately 50,000 to 100,000 people every day, making it one of the largest free kitchens in the world. Everyone sits together on the floor as equals.' },
    { q: 'When was the Golden Temple built?', a: 'The construction of Harmandir Sahib was initiated by the fourth Guru, Guru Ram Das Ji, who created the sacred pool (Amrit Sarovar) in the 1570s. The first Harmandir Sahib structure was completed under the fifth Guru, Guru Arjan Dev Ji, in 1604.' },
  ],
  'guru-nanak-dev-ji': [
    { q: 'Who was Guru Nanak Dev Ji?', a: 'Guru Nanak Dev Ji (1469-1539) was the founder of Sikhism and the first of the ten Sikh Gurus. Born in Talwandi (now Nankana Sahib, Pakistan), he traveled extensively spreading a message of equality, devotion to one God, and honest living.' },
    { q: 'What are the three pillars of Guru Nanak\'s teachings?', a: 'Guru Nanak Dev Ji taught three fundamental principles: Naam Japna (meditating on God\'s name), Kirat Karni (earning an honest living), and Vand Chakna (sharing with others). These form the foundation of Sikh daily practice.' },
    { q: 'What is Guru Nanak Gurpurab?', a: 'Guru Nanak Gurpurab is the celebration of Guru Nanak Dev Ji\'s birth anniversary. It is one of the most important Sikh festivals, typically falling in November. It is celebrated with Prabhat Pheris (morning processions), Akhand Path, Langar, and community gatherings.' },
    { q: 'How far did Guru Nanak travel?', a: 'Guru Nanak Dev Ji undertook four major journeys called Udasis, traveling across South Asia, the Middle East, and possibly parts of Central Asia. He visited Hindu and Muslim holy sites, engaging with people of all faiths and spreading his universal message.' },
  ],
  'what-is-langar': [
    { q: 'What is Langar in Sikhism?', a: 'Langar is the community kitchen and the free meal served at every Gurdwara. Established by Guru Nanak Dev Ji, Langar embodies the Sikh principles of equality, sharing, and selfless service. Everyone sits together on the floor and eats the same food regardless of background.' },
    { q: 'Who can eat Langar?', a: 'Everyone is welcome to eat Langar regardless of religion, caste, gender, social status, or nationality. The tradition was specifically designed to break down social barriers and demonstrate that all people are equal in the eyes of God.' },
    { q: 'Is Langar always vegetarian?', a: 'Yes. Langar is always vegetarian to ensure that everyone can partake, regardless of dietary restrictions or religious food laws. The food is simple, nutritious, and prepared with devotion by volunteers.' },
    { q: 'How is Langar prepared and served?', a: 'Langar is prepared and served entirely by volunteers (Sevadars) as an act of Seva (selfless service). Volunteers cook, serve, and clean as a devotional practice. The food is funded by donations from the Sangat (congregation).' },
  ],
  'sikh-art-home-decorating-guide': [
    { q: 'Where should I place Sikh art in my home?', a: 'Sikh art works beautifully in living rooms as a focal point, in prayer rooms for spiritual ambiance, in hallways to greet visitors, and in bedrooms for contemplative settings. Consider the size of the wall and the lighting when choosing placement.' },
    { q: 'What types of Sikh art are best for home decor?', a: 'Canvas wraps and framed art prints are popular for wall decor. For a modern touch, crochet-style art from SikhiThreads offers a unique aesthetic. Digital downloads are great for creating custom arrangements. Consider mixing different sizes and subjects for visual interest.' },
    { q: 'How do I choose the right size Sikh art for my wall?', a: 'For a statement piece above a sofa, choose art that is roughly two-thirds the width of the furniture. For smaller walls or grouped displays, 8x10 or 11x14 inch prints work well. Large canvas wraps (24x36 inches or bigger) are ideal for open walls with plenty of space.' },
    { q: 'Can I mix Sikh art with other decor styles?', a: 'Absolutely. Sikh art, especially modern interpretations like crochet-style pieces, blends well with contemporary, minimalist, bohemian, and traditional decor. The warm earth tones in SikhiThreads pieces complement most color palettes.' },
  ],
}

const CATEGORY_LABELS = {
  'sikh-history': 'Sikh History',
  'culture': 'Culture',
  'festivals': 'Festivals',
  'art': 'Art',
  'guides': 'Guides',
  'news': 'News',
}

function formatDate(dateStr) {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export default function BlogPostPage() {
  const { slug } = useParams()
  const [post, setPost] = useState(null)
  const [relatedPosts, setRelatedPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)
  const [openFAQ, setOpenFAQ] = useState(0)

  useEffect(() => {
    async function fetchPost() {
      setLoading(true)
      try {
        const data = await api.get(`/api/blog/${slug}`)
        setPost(data)

        // Fetch related posts from same category
        if (data.category) {
          const related = await api.get(`/api/blog?category=${data.category}&limit=4`)
          setRelatedPosts(
            (related.posts || []).filter(p => p.slug !== slug).slice(0, 3)
          )
        }
      } catch (err) {
        console.error('Failed to fetch blog post:', err)
        setPost(null)
      } finally {
        setLoading(false)
      }
    }
    fetchPost()
    window.scrollTo(0, 0)
  }, [slug])

  function handleCopyLink() {
    navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  function handleShareTwitter() {
    if (!post) return
    const url = encodeURIComponent(window.location.href)
    const text = encodeURIComponent(post.title)
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank')
  }

  if (loading) {
    return (
      <div className="bg-cream min-h-screen">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 animate-pulse">
          <div className="h-8 bg-gold-light/20 rounded w-3/4 mb-4" />
          <div className="h-4 bg-gold-light/20 rounded w-1/2 mb-8" />
          <div className="aspect-[16/9] bg-gold-light/20 rounded-xl mb-8" />
          <div className="space-y-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-4 bg-gold-light/20 rounded w-full" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="bg-cream min-h-screen">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <h1 className="font-heading text-3xl font-bold text-charcoal mb-4">Post Not Found</h1>
          <p className="text-warm-gray mb-8">The blog post you are looking for does not exist or has been removed.</p>
          <Link to="/blog" className="inline-flex items-center gap-2 text-gold hover:text-gold-dark font-semibold no-underline">
            <ArrowLeft size={16} /> Back to Blog
          </Link>
        </div>
      </div>
    )
  }

  const faqs = BLOG_FAQS[slug] || []

  const blogJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.seo_description || post.excerpt,
    author: { '@type': 'Organization', name: post.author || 'SikhiThreads' },
    datePublished: post.published_at,
    dateModified: post.updated_at,
    publisher: {
      '@type': 'Organization',
      name: 'SikhiThreads',
      url: 'https://sikhithreads.com',
    },
    speakable: {
      '@type': 'SpeakableSpecification',
      cssSelector: ['h1', '.post-excerpt', '.faq-answer'],
    },
  }

  const jsonLd = faqs.length > 0
    ? [
        blogJsonLd,
        {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: faqs.map((f) => ({
            '@type': 'Question',
            name: f.q,
            acceptedAnswer: { '@type': 'Answer', text: f.a },
          })),
        },
      ]
    : blogJsonLd

  return (
    <div className="bg-cream min-h-screen">
      <SEO
        title={post.seo_title || `${post.title} | SikhiThreads`}
        description={post.seo_description || post.excerpt}
        keywords={post.seo_keywords}
        url={`https://sikhithreads.com/blog/${post.slug}`}
        type="article"
        image={post.cover_image}
        jsonLd={jsonLd}
      />

      {/* Back to blog */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <Link to="/blog" className="inline-flex items-center gap-2 text-warm-gray hover:text-brown text-sm no-underline transition-colors">
          <ArrowLeft size={14} /> Back to Blog
        </Link>
      </div>

      {/* Article Header */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {post.category && (
          <Link
            to={`/blog?category=${post.category}`}
            className="inline-block text-xs font-semibold tracking-wider uppercase text-gold bg-gold-light/20 px-3 py-1 rounded-full mb-4 no-underline hover:bg-gold-light/40 transition-colors"
          >
            {CATEGORY_LABELS[post.category] || post.category}
          </Link>
        )}

        <h1 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-charcoal mb-4 leading-tight">
          {post.title}
        </h1>

        <div className="flex flex-wrap items-center gap-4 text-warm-gray text-sm mb-8">
          <div className="flex items-center gap-2">
            <User size={14} />
            <span>{post.author || 'SikhiThreads'}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar size={14} />
            <span>{formatDate(post.published_at)}</span>
          </div>
        </div>

        {/* Cover Image */}
        {post.cover_image && (
          <div className="aspect-[16/9] rounded-xl overflow-hidden mb-10">
            <img
              src={post.cover_image}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Content */}
        <div
          className="prose prose-lg max-w-none
            prose-headings:font-heading prose-headings:text-charcoal
            prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4
            prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3
            prose-p:text-charcoal-light prose-p:leading-relaxed
            prose-a:text-gold prose-a:no-underline hover:prose-a:text-gold-dark
            prose-strong:text-charcoal
            prose-li:text-charcoal-light
            prose-ul:my-4 prose-li:my-1"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="mt-10 pt-8 border-t border-gold-light/30">
            <div className="flex flex-wrap gap-2">
              {post.tags.map(tag => (
                <span
                  key={tag}
                  className="text-xs font-medium text-warm-gray bg-white px-3 py-1.5 rounded-full"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Share */}
        <div className="mt-8 flex items-center gap-4">
          <span className="text-warm-gray text-sm flex items-center gap-1">
            <Share2 size={14} /> Share:
          </span>
          <button
            onClick={handleCopyLink}
            className="flex items-center gap-1.5 text-sm text-charcoal-light hover:text-brown bg-white px-3 py-1.5 rounded-lg transition-colors"
          >
            {copied ? <Check size={14} className="text-green-600" /> : <Copy size={14} />}
            {copied ? 'Copied!' : 'Copy link'}
          </button>
          <button
            onClick={handleShareTwitter}
            className="flex items-center gap-1.5 text-sm text-charcoal-light hover:text-brown bg-white px-3 py-1.5 rounded-lg transition-colors"
          >
            Share on X
          </button>
        </div>
      </article>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 mt-8 border-t border-gold-light/30">
          <h2 className="font-heading text-2xl font-bold text-charcoal mb-8">Related Posts</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {relatedPosts.map(rp => (
              <Link
                key={rp.id}
                to={`/blog/${rp.slug}`}
                className="group block bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all no-underline"
              >
                <div className="aspect-[16/9] bg-gold-light/20 overflow-hidden">
                  {rp.cover_image ? (
                    <img src={rp.cover_image} alt={rp.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="font-heading text-3xl text-gold/40">ST</span>
                    </div>
                  )}
                </div>
                <div className="p-5">
                  <h3 className="font-heading font-bold text-charcoal group-hover:text-brown transition-colors mb-2 line-clamp-2">
                    {rp.title}
                  </h3>
                  <p className="text-warm-gray text-sm line-clamp-2">{rp.excerpt}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* FAQ Section */}
      {faqs.length > 0 && (
        <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h2 className="font-heading text-2xl font-bold text-charcoal mb-8 text-center">
            Frequently Asked Questions
          </h2>
          <div className="bg-warm-white rounded-xl shadow-sm border border-gold-light/20 px-6 md:px-8">
            {faqs.map((faq, i) => (
              <div key={i} className="border-b border-gold-light/30 last:border-b-0">
                <button
                  onClick={() => setOpenFAQ(openFAQ === i ? -1 : i)}
                  className="w-full flex items-center justify-between py-5 text-left cursor-pointer bg-transparent border-none"
                >
                  <span className="font-heading text-lg font-semibold text-charcoal pr-4">{faq.q}</span>
                  {openFAQ === i ? (
                    <ChevronUp size={20} className="text-gold flex-shrink-0" />
                  ) : (
                    <ChevronDown size={20} className="text-warm-gray flex-shrink-0" />
                  )}
                </button>
                {openFAQ === i && (
                  <div className="pb-5 pr-8">
                    <p className="text-charcoal-light leading-relaxed">{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Related Content — Cross-links for topical authority */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <RelatedContent currentType="blog" currentSlug={slug} />
      </div>

      {/* CTA */}
      <section className="bg-charcoal text-cream py-16 mt-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-heading text-3xl font-bold mb-4">Bring Sikhi Into Your Home</h2>
          <p className="text-warm-gray text-lg mb-8">
            Explore our collection of Sikh art prints, canvas wraps, and more — each piece crafted with love and reverence.
          </p>
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 bg-gold hover:bg-gold-dark text-warm-white px-8 py-4 rounded-lg font-semibold no-underline transition-colors"
          >
            Explore Our Collection <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </div>
  )
}
