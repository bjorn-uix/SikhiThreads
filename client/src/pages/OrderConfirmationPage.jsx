import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { CheckCircle, Package, ArrowRight } from 'lucide-react'
import SEO from '../components/SEO'
import { api } from '../lib/api'

export default function OrderConfirmationPage() {
  const { orderNumber } = useParams()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get(`/api/orders/${orderNumber}`)
      .then(data => setOrder(data.order || data))
      .catch(() => setOrder(null))
      .finally(() => setLoading(false))
  }, [orderNumber])

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
      <SEO title="Order Confirmed | SikhiThreads" noindex />
      <CheckCircle size={72} className="mx-auto text-success mb-6" />
      <h1 className="font-heading text-4xl font-bold text-charcoal mb-4">Thank You for Your Order!</h1>
      <p className="text-warm-gray text-lg mb-2">Your order has been placed successfully.</p>

      <div className="bg-warm-white rounded-xl p-8 border border-gold-light/20 mt-8 mb-8">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Package size={20} className="text-brown" />
          <span className="text-sm font-medium text-warm-gray uppercase tracking-wide">Order Number</span>
        </div>
        <p className="text-3xl font-heading font-bold text-charcoal">{orderNumber}</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin w-6 h-6 border-2 border-gold border-t-transparent rounded-full" />
        </div>
      ) : order ? (
        <div className="bg-warm-white rounded-xl p-6 border border-gold-light/20 text-left mb-8">
          <h3 className="font-heading text-lg font-semibold text-charcoal mb-4">Order Summary</h3>
          <div className="space-y-2 text-sm">
            {(order.items || []).map((item, idx) => (
              <div key={idx} className="flex justify-between text-charcoal-light">
                <span>{item.product_name || item.name} x{item.quantity}</span>
                <span>${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
            <div className="border-t border-gold-light/20 pt-2 flex justify-between font-semibold text-charcoal">
              <span>Total</span>
              <span>${Number(order.total).toFixed(2)}</span>
            </div>
          </div>
        </div>
      ) : null}

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link
          to="/track-order"
          className="inline-flex items-center justify-center gap-2 border-2 border-gold text-brown px-8 py-3 rounded-lg font-semibold no-underline transition-colors hover:bg-gold/5"
        >
          Track Your Order
        </Link>
        <Link
          to="/shop"
          className="inline-flex items-center justify-center gap-2 bg-gold hover:bg-gold-dark text-warm-white px-8 py-3 rounded-lg font-semibold no-underline transition-colors"
        >
          Continue Shopping <ArrowRight size={18} />
        </Link>
      </div>
    </div>
  )
}
