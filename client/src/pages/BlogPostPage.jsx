import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Calendar, User, ArrowLeft, ArrowRight, Share2, Copy, Check } from 'lucide-react'
import SEO from '../components/SEO'
import { api } from '../lib/api'

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

  const jsonLd = {
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
  }

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
