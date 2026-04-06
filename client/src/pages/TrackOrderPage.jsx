import { useState } from 'react'
import { Search, Package, Truck, CheckCircle, Clock } from 'lucide-react'
import toast from 'react-hot-toast'
import SEO from '../components/SEO'
import { api } from '../lib/api'

const statusSteps = [
  { key: 'confirmed', label: 'Order Confirmed', icon: Package },
  { key: 'processing', label: 'Processing', icon: Clock },
  { key: 'shipped', label: 'Shipped', icon: Truck },
  { key: 'delivered', label: 'Delivered', icon: CheckCircle },
]

export default function TrackOrderPage() {
  const [orderNumber, setOrderNumber] = useState('')
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)

  async function handleSearch(e) {
    e.preventDefault()
    if (!orderNumber.trim()) return

    setLoading(true)
    setSearched(true)
    try {
      const data = await api.get(`/api/orders/${orderNumber.trim()}`)
      setOrder(data.order || data)
    } catch {
      setOrder(null)
      toast.error('Order not found. Please check the order number.')
    } finally {
      setLoading(false)
    }
  }

  function getStatusIndex(status) {
    const idx = statusSteps.findIndex(s => s.key === status)
    return idx >= 0 ? idx : 0
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <SEO title="Track Your Order | SikhiThreads" noindex />
      <div className="text-center mb-12">
        <h1 className="font-heading text-4xl font-bold text-charcoal mb-4">Track Your Order</h1>
        <p className="text-warm-gray">Enter your order number to see the latest status.</p>
      </div>

      <form onSubmit={handleSearch} className="flex gap-3 mb-12">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-warm-gray" />
          <input
            type="text"
            value={orderNumber}
            onChange={e => setOrderNumber(e.target.value)}
            placeholder="Enter order number"
            className="w-full pl-11 pr-4 py-4 bg-warm-white border border-gold-light/30 rounded-xl text-sm focus:outline-none focus:border-gold text-charcoal"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="px-8 py-4 bg-gold hover:bg-gold-dark text-warm-white rounded-xl font-semibold transition-colors disabled:opacity-60 cursor-pointer"
        >
          {loading ? 'Searching...' : 'Track'}
        </button>
      </form>

      {loading && (
        <div className="flex justify-center py-12">
          <div className="animate-spin w-8 h-8 border-2 border-gold border-t-transparent rounded-full" />
        </div>
      )}

      {!loading && searched && !order && (
        <div className="text-center py-12">
          <p className="text-warm-gray">No order found with that number. Please try again.</p>
        </div>
      )}

      {!loading && order && (
        <div className="bg-warm-white rounded-xl p-8 border border-gold-light/20">
          <div className="text-center mb-8">
            <p className="text-sm text-warm-gray uppercase tracking-wide">Order</p>
            <p className="font-heading text-2xl font-bold text-charcoal">{order.order_number || order.id}</p>
          </div>

          {/* Status Timeline */}
          <div className="relative">
            {statusSteps.map((step, i) => {
              const active = i <= getStatusIndex(order.status || 'confirmed')
              const Icon = step.icon
              return (
                <div key={step.key} className="flex items-start gap-4 pb-8 last:pb-0">
                  <div className="relative">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      active ? 'bg-success text-warm-white' : 'bg-cream-dark text-warm-gray'
                    }`}>
                      <Icon size={18} />
                    </div>
                    {i < statusSteps.length - 1 && (
                      <div className={`absolute top-10 left-1/2 -translate-x-1/2 w-0.5 h-8 ${
                        i < getStatusIndex(order.status || 'confirmed') ? 'bg-success' : 'bg-cream-dark'
                      }`} />
                    )}
                  </div>
                  <div className="pt-2">
                    <p className={`font-medium text-sm ${active ? 'text-charcoal' : 'text-warm-gray'}`}>
                      {step.label}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
