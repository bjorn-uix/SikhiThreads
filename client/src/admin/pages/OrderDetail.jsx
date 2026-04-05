import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { api } from '../../lib/api'
import { ArrowLeft, Loader2, Truck, Save } from 'lucide-react'
import toast from 'react-hot-toast'

const STATUS_STEPS = ['pending', 'confirmed', 'processing', 'shipped', 'delivered']

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  confirmed: 'bg-blue-100 text-blue-800 border-blue-200',
  processing: 'bg-orange-100 text-orange-800 border-orange-200',
  shipped: 'bg-purple-100 text-purple-800 border-purple-200',
  delivered: 'bg-green-100 text-green-800 border-green-200',
  cancelled: 'bg-red-100 text-red-800 border-red-200',
}

function formatCurrency(val) {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val || 0)
}

export default function OrderDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [newStatus, setNewStatus] = useState('')
  const [trackingNumber, setTrackingNumber] = useState('')
  const [notes, setNotes] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    loadOrder()
  }, [id])

  async function loadOrder() {
    try {
      const res = await api.get(`/api/admin/orders/${id}`)
      const o = res.order || res
      setOrder(o)
      setNewStatus(o.status || 'pending')
      setTrackingNumber(o.trackingNumber || '')
      setNotes(o.notes || '')
    } catch (err) {
      toast.error('Failed to load order: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  async function handleSave() {
    setSaving(true)
    try {
      await api.put(`/api/admin/orders/${id}`, {
        status: newStatus,
        trackingNumber,
        notes,
      })
      toast.success('Order updated')
      loadOrder()
    } catch (err) {
      toast.error('Update failed: ' + err.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="animate-spin text-gold" size={32} />
      </div>
    )
  }

  if (!order) {
    return (
      <div className="text-center py-20 text-gray-500">Order not found.</div>
    )
  }

  const currentStep = STATUS_STEPS.indexOf(order.status)

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate('/admin/orders')}
          className="p-2 text-gray-400 hover:text-charcoal hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-charcoal font-heading">
            Order #{order.orderNumber || order._id?.slice(-6)}
          </h1>
          <p className="text-sm text-gray-500">
            Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', {
              year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit',
            })}
          </p>
        </div>
      </div>

      {/* Status Timeline */}
      {order.status !== 'cancelled' && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-5">Order Progress</h2>
          <div className="flex items-center">
            {STATUS_STEPS.map((step, idx) => {
              const isCompleted = idx <= currentStep
              const isCurrent = idx === currentStep
              return (
                <div key={step} className="flex-1 flex items-center">
                  <div className="flex flex-col items-center flex-1">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                        isCompleted
                          ? 'bg-gold text-white'
                          : 'bg-gray-100 text-gray-400'
                      } ${isCurrent ? 'ring-2 ring-gold/30' : ''}`}
                    >
                      {idx + 1}
                    </div>
                    <span className={`text-xs mt-1.5 capitalize ${
                      isCompleted ? 'text-charcoal font-medium' : 'text-gray-400'
                    }`}>
                      {step}
                    </span>
                  </div>
                  {idx < STATUS_STEPS.length - 1 && (
                    <div
                      className={`h-0.5 flex-1 mx-1 ${
                        idx < currentStep ? 'bg-gold' : 'bg-gray-200'
                      }`}
                    />
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Items */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Items</h2>
            <div className="space-y-3">
              {(order.items || []).map((item, idx) => (
                <div key={idx} className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0">
                  {item.image || item.product?.images?.[0] ? (
                    <img
                      src={item.image || item.product?.images?.[0]}
                      alt=""
                      className="w-12 h-12 rounded-lg object-cover bg-gray-100"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-lg bg-gray-100" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-charcoal truncate">
                      {item.name || item.product?.name}
                    </p>
                    {item.variant && (
                      <p className="text-xs text-gray-500">{item.variant}</p>
                    )}
                    <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
                  </div>
                  <span className="text-sm font-medium">{formatCurrency(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100 space-y-1">
              {order.subtotal && (
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Subtotal</span>
                  <span>{formatCurrency(order.subtotal)}</span>
                </div>
              )}
              {order.shippingCost > 0 && (
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Shipping</span>
                  <span>{formatCurrency(order.shippingCost)}</span>
                </div>
              )}
              {order.discount > 0 && (
                <div className="flex justify-between text-sm text-green-600">
                  <span>Discount</span>
                  <span>-{formatCurrency(order.discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-base font-semibold text-charcoal pt-1">
                <span>Total</span>
                <span>{formatCurrency(order.total)}</span>
              </div>
            </div>
          </div>

          {/* Update section */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Update Order</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold"
                >
                  {[...STATUS_STEPS, 'cancelled'].map((s) => (
                    <option key={s} value={s}>
                      {s.charAt(0).toUpperCase() + s.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tracking Number</label>
                <div className="relative">
                  <Truck className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <input
                    value={trackingNumber}
                    onChange={(e) => setTrackingNumber(e.target.value)}
                    placeholder="Enter tracking number"
                    className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                placeholder="Internal notes about this order..."
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold"
              />
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleSave}
                disabled={saving}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-gold hover:bg-gold-dark text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
              >
                {saving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
                Save Changes
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar info */}
        <div className="space-y-6">
          {/* Customer */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Customer</h3>
            <p className="text-sm font-medium text-charcoal">
              {order.shippingAddress?.fullName || order.customer?.name || 'N/A'}
            </p>
            <p className="text-sm text-gray-500">{order.customer?.email || order.email || ''}</p>
            <p className="text-sm text-gray-500">{order.shippingAddress?.phone || order.customer?.phone || ''}</p>
          </div>

          {/* Shipping Address */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Shipping Address</h3>
            {order.shippingAddress ? (
              <div className="text-sm text-gray-600 space-y-0.5">
                <p>{order.shippingAddress.fullName}</p>
                <p>{order.shippingAddress.addressLine1}</p>
                {order.shippingAddress.addressLine2 && <p>{order.shippingAddress.addressLine2}</p>}
                <p>
                  {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.pincode}
                </p>
                <p>{order.shippingAddress.country}</p>
              </div>
            ) : (
              <p className="text-sm text-gray-400">No address provided</p>
            )}
          </div>

          {/* Payment */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Payment</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Method</span>
                <span className="text-charcoal font-medium capitalize">{order.paymentMethod || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Status</span>
                <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                  order.paymentStatus === 'paid'
                    ? 'bg-green-100 text-green-700'
                    : order.paymentStatus === 'failed'
                    ? 'bg-red-100 text-red-700'
                    : 'bg-yellow-100 text-yellow-700'
                }`}>
                  {order.paymentStatus || 'pending'}
                </span>
              </div>
              {order.paymentId && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Ref ID</span>
                  <span className="text-charcoal font-mono text-xs">{order.paymentId}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
