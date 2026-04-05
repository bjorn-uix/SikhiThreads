import { useState, useEffect } from 'react'
import { api } from '../../lib/api'
import { DollarSign, ShoppingCart, TrendingUp, Package, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-blue-100 text-blue-800',
  processing: 'bg-orange-100 text-orange-800',
  shipped: 'bg-purple-100 text-purple-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
}

function formatCurrency(val) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val || 0)
}

export default function DashboardPage() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDashboard()
  }, [])

  async function loadDashboard() {
    try {
      const res = await api.get('/api/admin/dashboard')
      setData(res?.data || res)
    } catch (err) {
      toast.error('Failed to load dashboard: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="animate-spin text-gold" size={32} />
      </div>
    )
  }

  if (!data) {
    return (
      <div className="text-center py-20 text-gray-500">
        Failed to load dashboard data.
      </div>
    )
  }

  const stats = [
    { label: 'Revenue Today', value: formatCurrency(data.revenue?.today), icon: DollarSign, color: 'bg-green-50 text-green-600' },
    { label: 'Revenue This Week', value: formatCurrency(data.revenue?.week), icon: TrendingUp, color: 'bg-blue-50 text-blue-600' },
    { label: 'Revenue This Month', value: formatCurrency(data.revenue?.month), icon: TrendingUp, color: 'bg-purple-50 text-purple-600' },
    { label: 'Total Orders', value: data.orders?.total || 0, icon: ShoppingCart, color: 'bg-orange-50 text-orange-600' },
  ]

  const orderStatuses = [
    { key: 'pending', label: 'Pending' },
    { key: 'processing', label: 'Processing' },
    { key: 'shipped', label: 'Shipped' },
    { key: 'delivered', label: 'Delivered' },
  ]

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-charcoal font-heading">Dashboard</h1>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center gap-3">
              <div className={`p-2.5 rounded-lg ${stat.color}`}>
                <stat.icon size={20} />
              </div>
              <div>
                <p className="text-sm text-gray-500">{stat.label}</p>
                <p className="text-xl font-bold text-charcoal">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Orders by Status */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="text-lg font-semibold text-charcoal mb-4">Orders by Status</h2>
          <div className="space-y-3">
            {orderStatuses.map(({ key, label }) => {
              const count = data.orders?.[key] || 0
              const total = data.orders?.total || 1
              const pct = Math.round((count / total) * 100)
              return (
                <div key={key} className="flex items-center gap-3">
                  <span className="text-sm text-gray-600 w-24">{label}</span>
                  <div className="flex-1 bg-gray-100 rounded-full h-2.5">
                    <div
                      className={`h-2.5 rounded-full ${
                        key === 'pending' ? 'bg-yellow-400' :
                        key === 'processing' ? 'bg-orange-400' :
                        key === 'shipped' ? 'bg-purple-400' :
                        'bg-green-400'
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium text-charcoal w-10 text-right">{count}</span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Top Selling Products */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="text-lg font-semibold text-charcoal mb-4">Top Selling Products</h2>
          {data.topProducts?.length > 0 ? (
            <div className="space-y-3">
              {data.topProducts.slice(0, 5).map((product, idx) => (
                <div key={product._id || idx} className="flex items-center gap-3">
                  <span className="text-sm font-medium text-gray-400 w-5">{idx + 1}.</span>
                  {product.images?.[0] && (
                    <img
                      src={product.images[0]}
                      alt=""
                      className="w-9 h-9 rounded object-cover"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-charcoal truncate">{product.name}</p>
                    <p className="text-xs text-gray-500">{product.totalSold || 0} sold</p>
                  </div>
                  <span className="text-sm font-medium text-charcoal">
                    {formatCurrency(product.price)}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-400">No data available</p>
          )}
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h2 className="text-lg font-semibold text-charcoal mb-4">Recent Orders</h2>
        {data.recentOrders?.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left py-2 px-3 text-gray-500 font-medium">Order</th>
                  <th className="text-left py-2 px-3 text-gray-500 font-medium">Customer</th>
                  <th className="text-left py-2 px-3 text-gray-500 font-medium">Date</th>
                  <th className="text-left py-2 px-3 text-gray-500 font-medium">Total</th>
                  <th className="text-left py-2 px-3 text-gray-500 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {data.recentOrders.slice(0, 10).map((order) => (
                  <tr key={order._id} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="py-2.5 px-3 font-medium text-charcoal">
                      #{order.orderNumber || order._id?.slice(-6)}
                    </td>
                    <td className="py-2.5 px-3 text-gray-600">
                      {order.shippingAddress?.fullName || order.customer?.name || 'N/A'}
                    </td>
                    <td className="py-2.5 px-3 text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-2.5 px-3 font-medium">{formatCurrency(order.total)}</td>
                    <td className="py-2.5 px-3">
                      <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                        statusColors[order.status] || 'bg-gray-100 text-gray-600'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-sm text-gray-400">No recent orders</p>
        )}
      </div>
    </div>
  )
}
