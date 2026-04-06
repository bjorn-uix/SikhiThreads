import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Calendar, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react'
import SEO from '../components/SEO'
import { api } from '../lib/api'

const CATEGORIES = [
  { value: '', label: 'All' },
  { value: 'sikh-history', label: 'Sikh History' },
  { value: 'culture', label: 'Culture' },
  { value: 'festivals', label: 'Festivals' },
  { value: 'art', label: 'Art' },
  { value: 'guides', label: 'Guides' },
  { value: 'news', label: 'News' },
]

function formatDate(dateStr) {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

function categoryLabel(cat) {
  const found = CATEGORIES.find(c => c.value === cat)
  return found ? found.label : cat
}

function BlogCard({ post, featured = false }) {
  return (
    <Link
      to={`/blog/${post.slug}`}
      className={`group block bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all no-underline ${
        featured ? 'md:grid md:grid-cols-2 md:gap-0' : ''
      }`}
    >
      {/* Image */}
      <div className={`bg-gold-light/20 ${featured ? 'aspect-[16/9] md:aspect-auto md:min-h-full' : 'aspect-[16/9]'} overflow-hidden`}>
        {post.cover_image ? (
          <img
            src={post.cover_image}
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="font-heading text-4xl text-gold/40">ST</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className={`p-6 ${featured ? 'md:p-8 md:flex md:flex-col md:justify-center' : ''}`}>
        {post.category && (
          <span className="inline-block text-xs font-semibold tracking-wider uppercase text-gold bg-gold-light/20 px-3 py-1 rounded-full mb-3">
            {categoryLabel(post.category)}
          </span>
        )}
        <h2 className={`font-heading font-bold text-charcoal mb-2 group-hover:text-brown transition-colors ${
          featured ? 'text-2xl md:text-3xl' : 'text-xl'
        }`}>
          {post.title}
        </h2>
        {post.excerpt && (
          <p className={`text-warm-gray mb-4 line-clamp-2 ${featured ? 'md:line-clamp-3 md:text-lg' : 'text-sm'}`}>
            {post.excerpt}
          </p>
        )}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-warm-gray text-sm">
            <Calendar size={14} />
            <span>{formatDate(post.published_at)}</span>
          </div>
          <span className="text-gold font-semibold text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
            Read more <ArrowRight size={14} />
          </span>
        </div>
      </div>
    </Link>
  )
}

export default function BlogPage() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [category, setCategory] = useState('')
  const [page, setPage] = useState(1)
  const [pagination, setPagination] = useState({ total: 0, totalPages: 1 })

  useEffect(() => {
    async function fetchPosts() {
      setLoading(true)
      try {
        const params = new URLSearchParams({ page, limit: 12 })
        if (category) params.set('category', category)
        const data = await api.get(`/api/blog?${params}`)
        setPosts(data.posts || [])
        setPagination(data.pagination || { total: 0, totalPages: 1 })
      } catch (err) {
        console.error('Failed to fetch blog posts:', err)
        setPosts([])
      } finally {
        setLoading(false)
      }
    }
    fetchPosts()
  }, [category, page])

  const featuredPost = page === 1 && !category ? posts[0] : null
  const gridPosts = featuredPost ? posts.slice(1) : posts

  return (
    <div className="bg-cream min-h-screen">
      <SEO
        title="Blog — Sikh Stories, Culture & Art | SikhiThreads"
        description="Explore stories of Sikh history, culture, and values through our blog. Learn about Vaisakhi, Guru Nanak, Langar, and more."
        keywords="sikh blog, sikh stories, sikh history, vaisakhi, sikh culture, sikh art"
        url="https://sikhithreads.com/blog"
      />

      {/* Hero */}
      <div className="bg-charcoal text-cream py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-heading text-4xl md:text-5xl font-bold mb-4">SikhiThreads Blog</h1>
          <p className="text-warm-gray text-lg max-w-2xl mx-auto">
            Stories of faith, history, and culture. Explore the beauty and depth of Sikhi through our articles.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-10">
          {CATEGORIES.map(cat => (
            <button
              key={cat.value}
              onClick={() => { setCategory(cat.value); setPage(1) }}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                category === cat.value
                  ? 'bg-gold text-warm-white'
                  : 'bg-white text-charcoal-light hover:bg-gold-light/30 hover:text-brown'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="grid md:grid-cols-2 gap-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl overflow-hidden shadow-sm animate-pulse">
                <div className="aspect-[16/9] bg-gold-light/20" />
                <div className="p-6 space-y-3">
                  <div className="h-4 bg-gold-light/20 rounded w-20" />
                  <div className="h-6 bg-gold-light/20 rounded w-3/4" />
                  <div className="h-4 bg-gold-light/20 rounded w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-warm-gray text-lg">No blog posts found.</p>
          </div>
        ) : (
          <>
            {/* Featured Post */}
            {featuredPost && (
              <div className="mb-10">
                <BlogCard post={featuredPost} featured />
              </div>
            )}

            {/* Post Grid */}
            {gridPosts.length > 0 && (
              <div className="grid md:grid-cols-2 gap-8">
                {gridPosts.map(post => (
                  <BlogCard key={post.id} post={post} />
                ))}
              </div>
            )}

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex items-center justify-center gap-4 mt-12">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="flex items-center gap-1 px-4 py-2 rounded-lg bg-white text-charcoal hover:bg-gold-light/30 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft size={16} /> Previous
                </button>
                <span className="text-warm-gray text-sm">
                  Page {page} of {pagination.totalPages}
                </span>
                <button
                  onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))}
                  disabled={page === pagination.totalPages}
                  className="flex items-center gap-1 px-4 py-2 rounded-lg bg-white text-charcoal hover:bg-gold-light/30 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  Next <ChevronRight size={16} />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
