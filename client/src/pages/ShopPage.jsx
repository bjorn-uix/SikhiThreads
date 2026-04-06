import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { SlidersHorizontal, ChevronDown } from 'lucide-react'
import ProductCard from '../components/ProductCard'
import SEO from '../components/SEO'
import { api } from '../lib/api'

const sortOptions = [
  { value: 'newest', label: 'Newest' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'best_sellers', label: 'Best Sellers' },
]

export default function ShopPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [collections, setCollections] = useState([])
  const [showFilters, setShowFilters] = useState(false)

  const currentSort = searchParams.get('sort') || 'newest'
  const currentCollection = searchParams.get('collection') || ''
  const currentPage = parseInt(searchParams.get('page') || '1', 10)

  useEffect(() => {
    api.get('/api/collections')
      .then(data => setCollections(data.collections || data || []))
      .catch(() => setCollections([]))
  }, [])

  useEffect(() => {
    setLoading(true)
    const params = new URLSearchParams()
    if (currentSort) params.set('sort', currentSort)
    if (currentCollection) params.set('collection', currentCollection)
    params.set('page', currentPage)
    params.set('limit', 12)

    api.get(`/api/products?${params.toString()}`)
      .then(data => setProducts(data.products || data || []))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false))
  }, [currentSort, currentCollection, currentPage])

  function updateParam(key, value) {
    const next = new URLSearchParams(searchParams)
    if (value) {
      next.set(key, value)
    } else {
      next.delete(key)
    }
    if (key !== 'page') next.set('page', '1')
    setSearchParams(next)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <SEO
        title="Shop Sikh Art — Wall Art, Canvas, Phone Cases & More | SikhiThreads"
        description="Browse our collection of handcrafted Sikh crochet art. Wall art prints, canvas wraps, phone cases, mugs, apparel, and digital downloads. Free shipping on orders over $50."
        keywords="buy sikh art, sikh wall art, sikh prints, sikh canvas, sikh phone case, sikh gifts online"
        url="https://sikhithreads.com/shop"
      />
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="font-heading text-5xl font-bold text-charcoal mb-4">Shop</h1>
        <p className="text-warm-gray max-w-xl mx-auto">
          Explore our collection of handcrafted crochet-aesthetic Sikh storytelling art.
        </p>
      </div>

      {/* Filters & Sort */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-6 border-b border-gold-light/30">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 text-charcoal-light hover:text-brown text-sm font-medium transition-colors md:hidden"
        >
          <SlidersHorizontal size={18} />
          Filters
        </button>

        {/* Desktop Collection Filter */}
        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={() => updateParam('collection', '')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              !currentCollection
                ? 'bg-charcoal text-cream'
                : 'bg-cream-dark text-charcoal-light hover:bg-gold-light/30'
            }`}
          >
            All
          </button>
          {collections.map(col => (
            <button
              key={col.slug}
              onClick={() => updateParam('collection', col.slug)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                currentCollection === col.slug
                  ? 'bg-charcoal text-cream'
                  : 'bg-cream-dark text-charcoal-light hover:bg-gold-light/30'
              }`}
            >
              {col.name}
            </button>
          ))}
        </div>

        {/* Sort */}
        <div className="relative">
          <select
            value={currentSort}
            onChange={e => updateParam('sort', e.target.value)}
            className="appearance-none bg-cream-dark border border-gold-light/30 text-charcoal-light text-sm px-4 py-2 pr-10 rounded-lg focus:outline-none focus:border-gold cursor-pointer"
          >
            {sortOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-warm-gray pointer-events-none" />
        </div>
      </div>

      {/* Mobile Filters */}
      {showFilters && (
        <div className="md:hidden flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => { updateParam('collection', ''); setShowFilters(false) }}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              !currentCollection ? 'bg-charcoal text-cream' : 'bg-cream-dark text-charcoal-light'
            }`}
          >
            All
          </button>
          {collections.map(col => (
            <button
              key={col.slug}
              onClick={() => { updateParam('collection', col.slug); setShowFilters(false) }}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                currentCollection === col.slug ? 'bg-charcoal text-cream' : 'bg-cream-dark text-charcoal-light'
              }`}
            >
              {col.name}
            </button>
          ))}
        </div>
      )}

      {/* Product Grid */}
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin w-8 h-8 border-2 border-gold border-t-transparent rounded-full" />
        </div>
      ) : products.length > 0 ? (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <p className="text-warm-gray text-lg">No products found.</p>
        </div>
      )}

      {/* Pagination */}
      {products.length > 0 && (
        <div className="flex justify-center gap-2 mt-12">
          {currentPage > 1 && (
            <button
              onClick={() => updateParam('page', currentPage - 1)}
              className="px-4 py-2 text-sm font-medium text-charcoal-light hover:text-brown bg-cream-dark rounded-lg transition-colors"
            >
              Previous
            </button>
          )}
          <span className="px-4 py-2 text-sm font-medium text-brown bg-gold-light/20 rounded-lg">
            Page {currentPage}
          </span>
          {products.length >= 12 && (
            <button
              onClick={() => updateParam('page', currentPage + 1)}
              className="px-4 py-2 text-sm font-medium text-charcoal-light hover:text-brown bg-cream-dark rounded-lg transition-colors"
            >
              Next
            </button>
          )}
        </div>
      )}
    </div>
  )
}
