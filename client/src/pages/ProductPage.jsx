import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ShoppingBag, Minus, Plus, ArrowLeft } from 'lucide-react'
import toast from 'react-hot-toast'
import { useCart } from '../context/CartContext'
import ProductCard from '../components/ProductCard'
import SEO from '../components/SEO'
import { api } from '../lib/api'

export default function ProductPage() {
  const { slug } = useParams()
  const { addToCart } = useCart()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedVariant, setSelectedVariant] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [relatedProducts, setRelatedProducts] = useState([])

  useEffect(() => {
    setLoading(true)
    setQuantity(1)
    setSelectedImage(0)
    setSelectedVariant(null)

    api.get(`/api/products/${slug}`)
      .then(data => {
        const p = data.product || data
        setProduct(p)
        if (p.variants?.length) setSelectedVariant(p.variants[0])
        return p
      })
      .then(p => {
        if (p.collection_id) {
          return api.get(`/api/products?collection=${p.collection_id}&limit=4`)
            .then(data => {
              const prods = (data.products || data || []).filter(r => r.id !== p.id)
              setRelatedProducts(prods.slice(0, 4))
            })
        }
      })
      .catch(() => setProduct(null))
      .finally(() => setLoading(false))
  }, [slug])

  function handleAddToCart() {
    if (!product) return
    addToCart(product, quantity, selectedVariant?.name || null)
    toast.success(`${product.name} added to cart`)
  }

  if (loading) {
    return (
      <div className="flex justify-center py-32">
        <div className="animate-spin w-8 h-8 border-2 border-gold border-t-transparent rounded-full" />
      </div>
    )
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h1 className="font-heading text-3xl text-charcoal mb-4">Product Not Found</h1>
        <Link to="/shop" className="text-brown hover:text-brown-dark font-medium no-underline">
          Back to Shop
        </Link>
      </div>
    )
  }

  const images = product.images?.length ? product.images : []
  const hasDiscount = product.compare_at_price && product.compare_at_price > product.price

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <SEO
        title={`${product.name} | SikhiThreads`}
        description={product.short_description || (product.seo_description ? product.seo_description.slice(0, 160) : `${product.name} — Handcrafted Sikh crochet art by SikhiThreads. Shop now with free shipping on orders over $50.`)}
        keywords={product.collection_tags ? product.collection_tags.join(', ') : 'sikh art, sikh gifts, crochet art'}
        image={product.images?.[0] || undefined}
        url={`https://sikhithreads.com/products/${slug}`}
        type="product"
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'Product',
          name: product.name,
          description: product.short_description || product.name,
          image: product.images?.[0] || 'https://sikhithreads.com/og-default.png',
          offers: {
            '@type': 'Offer',
            price: Number(product.price).toFixed(2),
            priceCurrency: 'USD',
            availability: 'https://schema.org/InStock',
          },
        }}
      />
      {/* Breadcrumb */}
      <Link to="/shop" className="inline-flex items-center gap-1 text-warm-gray hover:text-brown text-sm no-underline mb-8 transition-colors">
        <ArrowLeft size={16} /> Back to Shop
      </Link>

      <div className="grid lg:grid-cols-2 gap-12">
        {/* Image Gallery */}
        <div>
          <div className="aspect-square bg-cream-dark rounded-2xl overflow-hidden mb-4">
            {images[selectedImage] ? (
              <img
                src={images[selectedImage]}
                alt={`${product.name} — Sikh Crochet Art by SikhiThreads`}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-warm-gray">No image available</span>
              </div>
            )}
          </div>
          {images.length > 1 && (
            <div className="flex gap-3">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                    i === selectedImage ? 'border-gold' : 'border-transparent'
                  }`}
                >
                  <img src={img} alt={`${product.name} view ${i + 1} — Sikh Crochet Art by SikhiThreads`} className="w-full h-full object-cover" loading="lazy" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Details */}
        <div>
          {product.collection_name && (
            <span className="text-gold text-sm font-medium tracking-[0.1em] uppercase">
              {product.collection_name}
            </span>
          )}
          <h1 className="font-heading text-4xl font-bold text-charcoal mt-2 mb-4">{product.name}</h1>

          <div className="flex items-center gap-3 mb-6">
            <span className="text-3xl font-bold text-brown">${Number(product.price).toFixed(2)}</span>
            {hasDiscount && (
              <span className="text-xl text-warm-gray line-through">
                ${Number(product.compare_at_price).toFixed(2)}
              </span>
            )}
          </div>

          {/* Description */}
          {product.description && (
            <div
              className="text-charcoal-light leading-relaxed mb-8 prose prose-sm"
              dangerouslySetInnerHTML={{ __html: product.description }}
            />
          )}

          {/* Variant Selector */}
          {product.variants?.length > 0 && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-charcoal mb-2">Size / Variant</label>
              <div className="flex flex-wrap gap-2">
                {product.variants.map(v => (
                  <button
                    key={v.name}
                    onClick={() => setSelectedVariant(v)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
                      selectedVariant?.name === v.name
                        ? 'border-gold bg-gold/10 text-brown'
                        : 'border-gold-light/30 text-charcoal-light hover:border-gold'
                    }`}
                  >
                    {v.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity */}
          <div className="mb-8">
            <label className="block text-sm font-medium text-charcoal mb-2">Quantity</label>
            <div className="inline-flex items-center border border-gold-light/30 rounded-lg">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="p-3 text-charcoal-light hover:text-brown transition-colors"
              >
                <Minus size={16} />
              </button>
              <span className="px-5 py-3 text-charcoal font-medium min-w-[3rem] text-center">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="p-3 text-charcoal-light hover:text-brown transition-colors"
              >
                <Plus size={16} />
              </button>
            </div>
          </div>

          {/* Add to Cart */}
          <button
            onClick={handleAddToCart}
            className="w-full flex items-center justify-center gap-3 bg-gold hover:bg-gold-dark text-warm-white py-4 px-8 rounded-lg text-lg font-semibold transition-colors shadow-lg hover:shadow-xl cursor-pointer"
          >
            <ShoppingBag size={20} />
            Add to Cart
          </button>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="mt-20">
          <h2 className="font-heading text-3xl font-bold text-charcoal mb-8">You Might Also Like</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
