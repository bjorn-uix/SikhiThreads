import { useState, useEffect } from 'react'
import { api } from '../../lib/api'
import { Loader2, X, Eye, Save } from 'lucide-react'
import toast from 'react-hot-toast'

const statusColors = {
  inquiry: 'bg-gray-100 text-gray-600',
  quoted: 'bg-blue-100 text-blue-800',
  accepted: 'bg-green-100 text-green-800',
  in_progress: 'bg-orange-100 text-orange-800',
  completed: 'bg-purple-100 text-purple-800',
  cancelled: 'bg-red-100 text-red-800',
}

const STATUSES = ['inquiry', 'quoted', 'accepted', 'in_progress', 'completed', 'cancelled']

export default function CustomOrdersPage() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState(null)
  const [editStatus, setEditStatus] = useState('')
  const [quotedPrice, setQuotedPrice] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    loadOrders()
  }, [])

  async function loadOrders() {
    try {
      const res = await api.get('/api/admin/custom-orders')
      setOrders(res.customOrders || res.orders || res || [])
    } catch (err) {
      toast.error('Failed to load custom orders: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  function openDetail(order) {
    setSelected(order)
    setEditStatus(order.status || 'inquiry')
    setQuotedPrice(order.quotedPrice || '')
  }

  async function handleUpdate() {
    if (!selected) return
    setSaving(true)
    try {
      await api.put(`/api/admin/custom-orders/${selected._id}`, {
        status: editStatus,
        quotedPrice: quotedPrice ? Number(quotedPrice) : undefined,
      })
      toast.success('Custom order updated')
      setSelected(null)
      loadOrders()
    } catch (err) {
      toast.error('Update failed: ' + err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-charcoal font-heading">Custom Orders</h1>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="animate-spin text-gold" size={32} />
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-gray-500 font-medium">Name</th>
                  <th className="text-left py-3 px-4 text-gray-500 font-medium">Email</th>
                  <th className="text-left py-3 px-4 text-gray-500 font-medium">Type</th>
                  <th className="text-left py-3 px-4 text-gray-500 font-medium">Date</th>
                  <th className="text-left py-3 px-4 text-gray-500 font-medium">Budget</th>
                  <th className="text-left py-3 px-4 text-gray-500 font-medium">Status</th>
                  <th className="text-right py-3 px-4 text-gray-500 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-gray-400">
                      No custom orders yet
                    </td>
                  </tr>
                ) : (
                  orders.map((order) => (
                    <tr key={order._id} className="border-b border-gray-50 hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium text-charcoal">{order.name || order.fullName || 'N/A'}</td>
                      <td className="py-3 px-4 text-gray-600">{order.email}</td>
                      <td className="py-3 px-4 text-gray-600 capitalize">{order.type || order.orderType || '-'}</td>
                      <td className="py-3 px-4 text-gray-500">
                        {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : '-'}
                      </td>
                      <td className="py-3 px-4 text-gray-600">
                        {order.budget
                          ? new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(order.budget)
                          : '-'}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                          statusColors[order.status] || 'bg-gray-100 text-gray-600'
                        }`}>
                          {(order.status || 'inquiry').replace('_', ' ')}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => openDetail(order)}
                          className="inline-flex items-center gap-1 text-sm text-gold hover:text-gold-dark font-medium"
                        >
                          <Eye size={15} />
                          View
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-2xl shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 sticky top-0 bg-white">
              <h2 className="text-lg font-semibold text-charcoal">Custom Order Details</h2>
              <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-charcoal">
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-5">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Name:</span>
                  <p className="font-medium text-charcoal">{selected.name || selected.fullName}</p>
                </div>
                <div>
                  <span className="text-gray-500">Email:</span>
                  <p className="font-medium text-charcoal">{selected.email}</p>
                </div>
                <div>
                  <span className="text-gray-500">Phone:</span>
                  <p className="font-medium text-charcoal">{selected.phone || '-'}</p>
                </div>
                <div>
                  <span className="text-gray-500">Type:</span>
                  <p className="font-medium text-charcoal capitalize">{selected.type || selected.orderType || '-'}</p>
                </div>
                <div>
                  <span className="text-gray-500">Budget:</span>
                  <p className="font-medium text-charcoal">
                    {selected.budget
                      ? new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(selected.budget)
                      : 'Not specified'}
                  </p>
                </div>
                <div>
                  <span className="text-gray-500">Date:</span>
                  <p className="font-medium text-charcoal">
                    {selected.createdAt ? new Date(selected.createdAt).toLocaleDateString() : '-'}
                  </p>
                </div>
              </div>

              <div>
                <span className="text-sm text-gray-500">Description:</span>
                <p className="text-sm text-charcoal mt-1 whitespace-pre-wrap bg-gray-50 rounded-lg p-3">
                  {selected.description || selected.message || 'No description provided'}
                </p>
              </div>

              {selected.referenceImages?.length > 0 && (
                <div>
                  <span className="text-sm text-gray-500">Reference Images:</span>
                  <div className="grid grid-cols-3 gap-2 mt-2">
                    {selected.referenceImages.map((img, idx) => (
                      <img key={idx} src={img} alt="" className="w-full aspect-square object-cover rounded-lg bg-gray-100" />
                    ))}
                  </div>
                </div>
              )}

              <div className="border-t border-gray-100 pt-4 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select
                      value={editStatus}
                      onChange={(e) => setEditStatus(e.target.value)}
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold"
                    >
                      {STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {s.replace('_', ' ').replace(/^\w/, (c) => c.toUpperCase())}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Quoted Price</label>
                    <input
                      type="number"
                      min="0"
                      value={quotedPrice}
                      onChange={(e) => setQuotedPrice(e.target.value)}
                      placeholder="Enter quoted price"
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setSelected(null)}
                    className="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Close
                  </button>
                  <button
                    onClick={handleUpdate}
                    disabled={saving}
                    className="inline-flex items-center gap-2 px-5 py-2 text-sm text-white bg-gold hover:bg-gold-dark rounded-lg font-medium transition-colors disabled:opacity-50"
                  >
                    {saving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
                    Update
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
