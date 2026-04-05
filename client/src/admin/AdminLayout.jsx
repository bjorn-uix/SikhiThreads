import { useState } from 'react'
import { Routes, Route, NavLink, Link, Navigate, Outlet } from 'react-router-dom'
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  FolderOpen,
  Ticket,
  Paintbrush,
  Star,
  Mail,
  Settings,
  Menu,
  X,
  ArrowLeft,
  ChevronLeft,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import DashboardPage from './pages/DashboardPage'
import ProductsPage from './pages/ProductsPage'
import ProductForm from './pages/ProductForm'
import OrdersPage from './pages/OrdersPage'
import OrderDetail from './pages/OrderDetail'
import CustomersPage from './pages/CustomersPage'
import CollectionsPage from './pages/CollectionsPage'
import CouponsPage from './pages/CouponsPage'
import CustomOrdersPage from './pages/CustomOrdersPage'
import ReviewsPage from './pages/ReviewsPage'
import SubscribersPage from './pages/SubscribersPage'
import SettingsPage from './pages/SettingsPage'

const navItems = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/products', label: 'Products', icon: Package },
  { to: '/admin/orders', label: 'Orders', icon: ShoppingCart },
  { to: '/admin/customers', label: 'Customers', icon: Users },
  { to: '/admin/collections', label: 'Collections', icon: FolderOpen },
  { to: '/admin/coupons', label: 'Coupons', icon: Ticket },
  { to: '/admin/custom-orders', label: 'Custom Orders', icon: Paintbrush },
  { to: '/admin/reviews', label: 'Reviews', icon: Star },
  { to: '/admin/subscribers', label: 'Email Subscribers', icon: Mail },
  { to: '/admin/settings', label: 'Settings', icon: Settings },
]

function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { signIn, user } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)
    try {
      await signIn(email, password)
    } catch (err) {
      setError(err.message || 'Login failed')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-4">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
        <h1 className="text-2xl font-heading font-bold text-charcoal text-center mb-2">SikhiThreads Admin</h1>
        <p className="text-warm-gray text-center mb-6">Sign in to manage your store</p>
        {user && !useAuth().isAdmin && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-3 mb-4 text-sm">
            {user.email} is not authorized as an admin.
          </div>
        )}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-3 mb-4 text-sm">{error}</div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-charcoal mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent"
              placeholder="your@email.com"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-charcoal mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent"
              placeholder="Enter password"
              required
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gold hover:bg-gold-dark text-white font-medium py-2.5 rounded-lg transition-colors disabled:opacity-50"
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        <div className="mt-4 text-center">
          <Link to="/" className="text-sm text-gold hover:text-gold-dark">Back to Store</Link>
        </div>
      </div>
    </div>
  )
}

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { isAdmin, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-cream">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold" />
      </div>
    )
  }

  if (!isAdmin) {
    return <AdminLogin />
  }

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-charcoal text-cream transform transition-transform duration-200 ease-in-out flex flex-col ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-charcoal-light">
          <h1 className="text-lg font-semibold tracking-tight font-heading text-gold">
            SikhiThreads Admin
          </h1>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-cream/60 hover:text-cream"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {navItems.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-gold/20 text-gold'
                    : 'text-cream/70 hover:text-cream hover:bg-white/5'
                }`
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="px-3 pb-4">
          <Link
            to="/"
            className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm text-cream/50 hover:text-cream hover:bg-white/5 transition-colors"
          >
            <ArrowLeft size={18} />
            Back to Store
          </Link>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-4 shrink-0">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden text-charcoal hover:text-gold transition-colors"
          >
            <Menu size={24} />
          </button>
          <div className="flex-1" />
          <Link
            to="/"
            className="hidden sm:flex items-center gap-1 text-sm text-gray-500 hover:text-charcoal transition-colors"
          >
            <ChevronLeft size={16} />
            Back to Store
          </Link>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <Routes>
            <Route index element={<DashboardPage />} />
            <Route path="products" element={<ProductsPage />} />
            <Route path="products/new" element={<ProductForm />} />
            <Route path="products/:id/edit" element={<ProductForm />} />
            <Route path="orders" element={<OrdersPage />} />
            <Route path="orders/:id" element={<OrderDetail />} />
            <Route path="customers" element={<CustomersPage />} />
            <Route path="collections" element={<CollectionsPage />} />
            <Route path="coupons" element={<CouponsPage />} />
            <Route path="custom-orders" element={<CustomOrdersPage />} />
            <Route path="reviews" element={<ReviewsPage />} />
            <Route path="subscribers" element={<SubscribersPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Routes>
        </main>
      </div>
    </div>
  )
}
