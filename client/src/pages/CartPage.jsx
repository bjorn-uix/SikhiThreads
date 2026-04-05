import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Trash2, Minus, Plus, ShoppingBag, ArrowRight, Tag } from 'lucide-react'
import toast from 'react-hot-toast'
import { useCart } from '../context/CartContext'

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, subtotal } = useCart()
  const [couponCode, setCouponCode] = useState('')

  const shipping = subtotal >= 50 ? 0 : 7.99
  const total = subtotal + shipping

  function handleApplyCoupon(e) {
    e.preventDefault()
    toast.error('Invalid coupon code')
  }

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <ShoppingBag size={64} className="mx-auto text-warm-gray/40 mb-6" />
        <h1 className="font-heading text-4xl font-bold text-charcoal mb-4">Your Cart is Empty</h1>
        <p className="text-warm-gray mb-8 max-w-md mx-auto">
          Discover our collection of handcrafted Sikh storytelling art and add something special.
        </p>
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 bg-gold hover:bg-gold-dark text-warm-white px-8 py-4 rounded-lg font-semibold no-underline transition-colors"
        >
          Start Shopping <ArrowRight size={18} />
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="font-heading text-4xl font-bold text-charcoal mb-10">Your Cart</h1>

      <div className="grid lg:grid-cols-3 gap-10">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-6">
          {items.map((item, idx) => (
            <div key={idx} className="flex gap-4 bg-warm-white rounded-xl p-4 border border-gold-light/20">
              {/* Image */}
              <div className="w-24 h-24 sm:w-32 sm:h-32 bg-cream-dark rounded-lg overflow-hidden flex-shrink-0">
                {item.product.images?.[0] ? (
                  <img src={item.product.images[0]} alt={item.product.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-warm-gray text-xs">No image</div>
                )}
              </div>

              {/* Details */}
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start">
                  <div>
                    <Link to={`/products/${item.product.slug}`} className="font-heading text-lg font-semibold text-charcoal no-underline hover:text-brown transition-colors">
                      {item.product.name}
                    </Link>
                    {item.variant && (
                      <p className="text-warm-gray text-sm mt-1">{item.variant}</p>
                    )}
                  </div>
                  <button
                    onClick={() => removeFromCart(item.product.id, item.variant)}
                    className="text-warm-gray hover:text-error transition-colors p-1"
                    aria-label="Remove item"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>

                <div className="flex items-center justify-between mt-4">
                  {/* Quantity Controls */}
                  <div className="inline-flex items-center border border-gold-light/30 rounded-lg">
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity - 1, item.variant)}
                      className="p-2 text-charcoal-light hover:text-brown transition-colors"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="px-3 py-2 text-sm text-charcoal font-medium">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity + 1, item.variant)}
                      className="p-2 text-charcoal-light hover:text-brown transition-colors"
                    >
                      <Plus size={14} />
                    </button>
                  </div>

                  <span className="text-brown font-semibold">
                    ${(item.product.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          ))}

          <Link
            to="/shop"
            className="inline-flex items-center gap-2 text-brown hover:text-brown-dark font-medium text-sm no-underline transition-colors"
          >
            <ArrowRight size={16} className="rotate-180" /> Continue Shopping
          </Link>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-warm-white rounded-xl p-6 border border-gold-light/20 sticky top-24">
            <h2 className="font-heading text-xl font-semibold text-charcoal mb-6">Order Summary</h2>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-charcoal-light">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-charcoal-light">
                <span>Shipping</span>
                <span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
              </div>
              {shipping === 0 && (
                <p className="text-success text-xs">You qualify for free shipping!</p>
              )}
              <div className="border-t border-gold-light/20 pt-3 flex justify-between text-charcoal font-semibold text-base">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>

            {/* Coupon */}
            <form onSubmit={handleApplyCoupon} className="mt-6 flex gap-2">
              <div className="relative flex-1">
                <Tag size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-warm-gray" />
                <input
                  type="text"
                  value={couponCode}
                  onChange={e => setCouponCode(e.target.value)}
                  placeholder="Coupon code"
                  className="w-full pl-9 pr-3 py-2.5 bg-cream border border-gold-light/30 text-sm rounded-lg focus:outline-none focus:border-gold text-charcoal"
                />
              </div>
              <button
                type="submit"
                className="px-4 py-2.5 bg-cream-dark text-charcoal-light text-sm font-medium rounded-lg hover:bg-gold-light/30 transition-colors"
              >
                Apply
              </button>
            </form>

            <Link
              to="/checkout"
              className="block mt-6 w-full text-center bg-gold hover:bg-gold-dark text-warm-white py-4 rounded-lg font-semibold no-underline transition-colors"
            >
              Proceed to Checkout
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
