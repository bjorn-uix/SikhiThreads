import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { ShoppingBag, Search, Menu, X, Shield } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'

const navLinks = [
  { to: '/shop', label: 'Shop' },
  { to: '/collections/vaisakhi', label: 'Collections' },
  { to: '/custom-orders', label: 'Custom Orders' },
  { to: '/our-story', label: 'Our Story' },
  { to: '/blog', label: 'Blog' },
]

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const { itemCount } = useCart()
  const { isAdmin } = useAuth()

  return (
    <>
      {/* Announcement Bar */}
      <div className="bg-gold text-warm-white text-center py-2 px-4 text-sm font-medium tracking-wide">
        Free shipping on orders over $50
      </div>

      {/* Main Navbar */}
      <nav className="sticky top-0 z-50 bg-cream/95 backdrop-blur-sm border-b border-gold-light/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 no-underline">
              <span className="font-heading text-2xl font-semibold text-charcoal tracking-tight">
                SikhiThreads
              </span>
            </Link>

            {/* Desktop Nav Links */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map(link => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) =>
                    `text-sm font-medium tracking-wide no-underline transition-colors ${
                      isActive
                        ? 'text-brown-dark border-b-2 border-gold pb-0.5'
                        : 'text-charcoal-light hover:text-brown'
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
            </div>

            {/* Right Icons */}
            <div className="flex items-center gap-4">
              <button className="text-charcoal-light hover:text-brown transition-colors" aria-label="Search">
                <Search size={20} />
              </button>

              <Link to="/cart" className="relative text-charcoal-light hover:text-brown transition-colors">
                <ShoppingBag size={20} />
                {itemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-gold text-warm-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-semibold">
                    {itemCount}
                  </span>
                )}
              </Link>

              {isAdmin && (
                <Link to="/admin" className="text-brown hover:text-brown-dark transition-colors" title="Admin">
                  <Shield size={20} />
                </Link>
              )}

              {/* Mobile Menu Toggle */}
              <button
                className="md:hidden text-charcoal-light hover:text-brown transition-colors"
                onClick={() => setMobileOpen(!mobileOpen)}
                aria-label="Toggle menu"
              >
                {mobileOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="md:hidden bg-cream border-t border-gold-light/40">
            <div className="px-4 py-4 space-y-3">
              {navLinks.map(link => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `block text-base font-medium no-underline py-2 ${
                      isActive ? 'text-brown-dark' : 'text-charcoal-light'
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
            </div>
          </div>
        )}
      </nav>
    </>
  )
}
