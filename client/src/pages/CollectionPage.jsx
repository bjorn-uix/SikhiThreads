import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import ProductCard from '../components/ProductCard'
import SEO from '../components/SEO'
import { api } from '../lib/api'

export default function CollectionPage() {
  const { slug } = useParams()
  const [collection, setCollection] = useState(null)
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    Promise.all([
      api.get(`/api/collections/${slug}`).catch(() => null),
      api.get(`/api/products?collection=${slug}`).catch(() => ({ products: [] })),
    ])
      .then(([colData, prodData]) => {
        setCollection(colData?.collection || colData)
        setProducts(prodData?.products || prodData || [])
      })
      .finally(() => setLoading(false))
  }, [slug])

  if (loading) {
    return (
      <div className="flex justify-center py-32">
        <div className="animate-spin w-8 h-8 border-2 border-gold border-t-transparent rounded-full" />
      </div>
    )
  }

  return (
    <div>
      <SEO
        title={`${collection?.name || slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())} — Sikh Art Collection | SikhiThreads`}
        description={collection?.description || `Browse our ${collection?.name || slug.replace(/-/g, ' ')} collection of handcrafted Sikh crochet art at SikhiThreads. Unique wall art, prints, and gifts celebrating Sikhi.`}
        keywords={`sikh art, ${slug.replace(/-/g, ' ')}, sikh collection, sikh gifts`}
        url={`https://sikhithreads.com/collections/${slug}`}
      />
      {/* Collection Hero */}
      <section className="bg-gradient-to-br from-charcoal via-brown-dark to-charcoal py-20 text-center">
        <div className="max-w-4xl mx-auto px-4">
          <Link to="/shop" className="inline-flex items-center gap-1 text-cream/50 hover:text-cream text-sm no-underline mb-6 transition-colors">
            <ArrowLeft size={16} /> Back to Shop
          </Link>
          <h1 className="font-heading text-5xl font-bold text-cream mb-4">
            {collection?.name || slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
          </h1>
          {collection?.description && (
            <p className="text-cream/60 text-lg max-w-2xl mx-auto">{collection.description}</p>
          )}
        </div>
      </section>

      {/* Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {products.length > 0 ? (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-warm-gray text-lg">No products in this collection yet.</p>
            <Link to="/shop" className="text-brown hover:text-brown-dark font-medium no-underline mt-4 inline-block">
              Browse All Products
            </Link>
          </div>
        )}
      </section>
    </div>
  )
}
