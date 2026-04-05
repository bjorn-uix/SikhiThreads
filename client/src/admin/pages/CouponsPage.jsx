import { useState, useEffect } from 'react'
import { api } from '../../lib/api'
import { Plus, Loader2, X, ToggleLeft, ToggleRight } from 'lucide-react'
import toast from 'react-hot-toast'

const defaultCoupon = {
  code: '',
  type: 'percentage',
  value: '',
  minOrderAmount: '',
  usageLimit: '',
  startDate: '',
  endDate: '',
}

export default function CouponsPage() {
  const [coupons, setCoupons] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState(defaultCoupon)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    loadCoupons()
  }, [])

  async function loadCoupons() {
    try {
      const res = await api.get('/api/admin/coupons')
      setCoupons(res.coupons || res || [])
    } catch (err) {
      toast.error('Failed to load coupons: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  async function handleCreate(e) {
    e.preventDefault()
    if (!form.code.trim() || !form.value) {
      toast.error('Code and value are required')
      return
    }
    setSaving(true)
    try {
      const payload = {
        ...form,
        value: Number(form.value),
        minOrderAmount: form.minOrderAmount ? Number(form.minOrderAmount) : undefined,
        usageLimit: form.usageLimit ? Number(form.usageLimit) : undefined,
        startDate: form.startDate || undefined,
        endDate: form.endDate || undefined,
      }
      await api.post('/api/admin/coupons', payload)
      toast.success('Coupon created')
      setShowModal(false)
      setForm(defaultCoupon)
      loadCoupons()
    } catch (err) {
      toast.error('Failed to create coupon: ' + err.message)
    } finally {
      setSaving(false)
    }
  }

  async function toggleActive(coupon) {
    try {
      await api.put(`/api/admin/coupons/${coupon._id}`, {
        isActive: !coupon.isActive,
      })
      setCoupons((prev) =>
        prev.map((c) =>
          c._id === coupon._id ? { ...c, isActive: !c.isActive } : c
        )
      )
      toast.success(coupon.isActive ? 'Coupon deactivated' : 'Coupon activated')
    } catch (err) {
      toast.error('Update failed: ' + err.message)
    }
  }

  function formatCurrency(val) {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val || 0)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-charcoal font-heading">Coupons</h1>
        <button
          onClick={() => { setForm(defaultCoupon); setShowModal(true) }}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-gold hover:bg-gold-dark text-white rounded-lg text-sm font-medium transition-colors"
        >
          <Plus size={18} />
          New Coupon
        </button>
      </div>

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
                  <th className="text-left py-3 px-4 text-gray-500 font-medium">Code</th>
                  <th className="text-left py-3 px-4 text-gray-500 font-medium">Type</th>
                  <th className="text-left py-3 px-4 text-gray-500 font-medium">Value</th>
                  <th className="text-left py-3 px-4 text-gray-500 font-medium">Min Order</th>
                  <th className="text-left py-3 px-4 text-gray-500 font-medium">Usage</th>
                  <th className="text-left py-3 px-4 text-gray-500 font-medium">Expiry</th>
                  <th className="text-left py-3 px-4 text-gray-500 font-medium">Status</th>
                  <th className="text-right py-3 px-4 text-gray-500 font-medium">Toggle</th>
                </tr>
              </thead>
              <tbody>
                {coupons.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-gray-400">
                      No coupons yet
                    </td>
                  </tr>
                ) : (
                  coupons.map((coupon) => (
                    <tr key={coupon._id} className="border-b border-gray-50 hover:bg-gray-50">
                      <td className="py-3 px-4 font-mono font-medium text-charcoal uppercase">
                        {coupon.code}
                      </td>
                      <td className="py-3 px-4 text-gray-600 capitalize">
                        {coupon.type === 'percentage' ? 'Percentage' : 'Fixed'}
                      </td>
                      <td className="py-3 px-4 font-medium">
                        {coupon.type === 'percentage' ? `${coupon.value}%` : formatCurrency(coupon.value)}
                      </td>
                      <td className="py-3 px-4 text-gray-500">
                        {coupon.minOrderAmount ? formatCurrency(coupon.minOrderAmount) : '-'}
                      </td>
                      <td className="py-3 px-4 text-gray-600">
                        {coupon.usedCount || 0}{coupon.usageLimit ? `/${coupon.usageLimit}` : ''}
                      </td>
                      <td className="py-3 px-4 text-gray-500">
                        {coupon.endDate ? new Date(coupon.endDate).toLocaleDateString() : 'No expiry'}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                          coupon.isActive !== false ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                        }`}>
                          {coupon.isActive !== false ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => toggleActive(coupon)}
                          className="text-gray-400 hover:text-gold transition-colors"
                          title={coupon.isActive ? 'Deactivate' : 'Activate'}
                        >
                          {coupon.isActive !== false ? (
                            <ToggleRight size={22} className="text-green-500" />
                          ) : (
                            <ToggleLeft size={22} />
                          )}
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

      {/* Create modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-lg shadow-xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-charcoal">New Coupon</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-charcoal">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleCreate} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Coupon Code *</label>
                <input
                  value={form.code}
                  onChange={(e) => setForm((p) => ({ ...p, code: e.target.value.toUpperCase() }))}
                  placeholder="e.g. SAVE20"
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm font-mono uppercase focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                  <select
                    value={form.type}
                    onChange={(e) => setForm((p) => ({ ...p, type: e.target.value }))}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Value *</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.value}
                    onChange={(e) => setForm((p) => ({ ...p, value: e.target.value }))}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Min Order Amount</label>
                  <input
                    type="number"
                    min="0"
                    value={form.minOrderAmount}
                    onChange={(e) => setForm((p) => ({ ...p, minOrderAmount: e.target.value }))}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Usage Limit</label>
                  <input
                    type="number"
                    min="0"
                    value={form.usageLimit}
                    onChange={(e) => setForm((p) => ({ ...p, usageLimit: e.target.value }))}
                    placeholder="Unlimited"
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                  <input
                    type="date"
                    value={form.startDate}
                    onChange={(e) => setForm((p) => ({ ...p, startDate: e.target.value }))}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                  <input
                    type="date"
                    value={form.endDate}
                    onChange={(e) => setForm((p) => ({ ...p, endDate: e.target.value }))}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={saving} className="px-5 py-2 text-sm text-white bg-gold hover:bg-gold-dark rounded-lg font-medium transition-colors disabled:opacity-50 flex items-center gap-2">
                  {saving && <Loader2 className="animate-spin" size={16} />}
                  Create Coupon
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
