import { Link } from 'react-router-dom'
import { ShoppingBag } from 'lucide-react'
import { useCart } from '../context/CartContext'
import toast from 'react-hot-toast'

export default function ProductCard({ product }) {
  const { addToCart } = useCart()

  function handleAddToCart(e) {
    e.preventDefault()
    e.stopPropagation()
    addToCart(product, 1)
    toast.success(`${product.name} added to cart`)
  }

  const hasDiscount = product.compare_at_price && product.compare_at_price > product.price

  return (
    <Link
      to={`/products/${product.slug}`}
      className="group block no-underline yarn-wobble"
    >
      <div className="relative overflow-hidden rounded-xl bg-cream-dark aspect-square mb-3 stitch-border">
        {/* Product Image */}
        {product.images?.[0] ? (
          <img
            src={product.images[0]}
            alt={`${product.name} — Sikh Crochet Art by SikhiThreads`}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gold-light/20">
            <span className="text-warm-gray text-sm">No image</span>
          </div>
        )}

        {/* Collection Badge */}
        {product.collection_name && (
          <span className="absolute top-3 left-3 bg-charcoal/80 text-cream text-xs px-3 py-1 rounded-full font-medium flex items-center gap-1">
            <svg width="10" height="10" viewBox="0 0 60 60" className="inline-block"><circle cx="30" cy="30" r="25" fill="#D4A574" opacity="0.6" /><path d="M15 30 Q30 20 45 30" fill="none" stroke="#D4A574" strokeWidth="2" opacity="0.8" /></svg>
            {product.collection_name}
          </span>
        )}

        {/* Hover Add to Cart */}
        <button
          onClick={handleAddToCart}
          className="absolute bottom-3 right-3 bg-gold hover:bg-gold-dark text-warm-white p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 cursor-pointer"
          aria-label="Add to cart"
        >
          <ShoppingBag size={18} />
        </button>
      </div>

      {/* Product Info */}
      <div>
        <h3 className="font-heading text-lg font-semibold text-charcoal group-hover:text-brown transition-colors">
          {product.name}
        </h3>
        {product.short_description && (
          <p className="text-warm-gray text-sm mt-1 line-clamp-2">{product.short_description}</p>
        )}
        <div className="mt-2 flex items-center gap-2">
          <span className="text-brown font-semibold">${Number(product.price).toFixed(2)}</span>
          {hasDiscount && (
            <span className="text-warm-gray text-sm line-through">
              ${Number(product.compare_at_price).toFixed(2)}
            </span>
          )}
        </div>
      </div>
    </Link>
  )
}
