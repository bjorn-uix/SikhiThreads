import { useState, useEffect } from 'react'
import { api } from '../../lib/api'
import { Search, Loader2, Users } from 'lucide-react'
import toast from 'react-hot-toast'

function formatCurrency(val) {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val || 0)
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    loadCustomers()
  }, [])

  async function loadCustomers() {
    try {
      const res = await api.get('/api/admin/customers')
      setCustomers(res.customers || res || [])
    } catch (err) {
      toast.error('Failed to load customers: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  const filtered = customers.filter((c) => {
    if (!search) return true
    const s = search.toLowerCase()
    return (
      (c.name || c.fullName || '').toLowerCase().includes(s) ||
      (c.email || '').toLowerCase().includes(s)
    )
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-bold text-charcoal font-heading">Customers</h1>
        <span className="text-sm text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
          {customers.length}
        </span>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        <input
          type="text"
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold bg-white"
        />
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
                  <th className="text-left py-3 px-4 text-gray-500 font-medium">Name</th>
                  <th className="text-left py-3 px-4 text-gray-500 font-medium">Email</th>
                  <th className="text-left py-3 px-4 text-gray-500 font-medium">Phone</th>
                  <th className="text-left py-3 px-4 text-gray-500 font-medium">Orders</th>
                  <th className="text-left py-3 px-4 text-gray-500 font-medium">Total Spent</th>
                  <th className="text-left py-3 px-4 text-gray-500 font-medium">Joined</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-gray-400">
                      <Users className="mx-auto mb-2 text-gray-300" size={32} />
                      No customers found
                    </td>
                  </tr>
                ) : (
                  filtered.map((customer) => (
                    <tr key={customer._id || customer.id} className="border-b border-gray-50 hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium text-charcoal">
                        {customer.name || customer.fullName || 'N/A'}
                      </td>
                      <td className="py-3 px-4 text-gray-600">{customer.email}</td>
                      <td className="py-3 px-4 text-gray-500">{customer.phone || '-'}</td>
                      <td className="py-3 px-4 text-gray-600">{customer.totalOrders || customer.orderCount || 0}</td>
                      <td className="py-3 px-4 font-medium">{formatCurrency(customer.totalSpent)}</td>
                      <td className="py-3 px-4 text-gray-500">
                        {customer.createdAt
                          ? new Date(customer.createdAt).toLocaleDateString()
                          : '-'}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
