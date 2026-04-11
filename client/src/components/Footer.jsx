import { Link } from 'react-router-dom'
import { Globe, ExternalLink } from 'lucide-react'
import EmailSignup from './EmailSignup'
import YarnDivider from './YarnDivider'

const shopLinks = [
  { to: '/shop', label: 'All Products' },
  { to: '/collections/vaisakhi', label: 'Vaisakhi Collection' },
  { to: '/custom-orders', label: 'Custom Orders' },
]

const aboutLinks = [
  { to: '/our-story', label: 'Our Story' },
  { to: '/blog', label: 'Blog' },
  { to: '/glossary', label: 'Sikh Glossary' },
  { to: '/contact', label: 'Contact' },
]

const supportLinks = [
  { to: '/track-order', label: 'Track Your Order' },
  { to: '/contact', label: 'Help & Support' },
]

const popularSearchLinks = [
  { to: '/l/golden-temple-wallpaper', label: 'Golden Temple Wallpaper' },
  { to: '/l/waheguru-wallpaper', label: 'Waheguru Wallpaper' },
  { to: '/l/sikh-wedding-gifts', label: 'Sikh Wedding Gifts' },
  { to: '/l/vaisakhi-decorations', label: 'Vaisakhi Decorations' },
  { to: '/l/sikh-home-decor', label: 'Sikh Home Decor' },
]

export default function Footer() {
  return (
    <footer className="bg-charcoal text-cream knit-texture">
      <YarnDivider color="#E8C9A0" className="opacity-30" />
      {/* Email Signup */}
      <div className="border-b border-charcoal-light/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <EmailSignup />
        </div>
      </div>

      {/* Links Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* Shop */}
          <div>
            <h3 className="font-heading text-lg font-semibold text-cream mb-4">Shop</h3>
            <ul className="space-y-2">
              {shopLinks.map(link => (
                <li key={link.to}>
                  <Link to={link.to} className="text-warm-gray hover:text-gold-light text-sm no-underline transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* About */}
          <div>
            <h3 className="font-heading text-lg font-semibold text-cream mb-4">About</h3>
            <ul className="space-y-2">
              {aboutLinks.map(link => (
                <li key={link.to}>
                  <Link to={link.to} className="text-warm-gray hover:text-gold-light text-sm no-underline transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-heading text-lg font-semibold text-cream mb-4">Support</h3>
            <ul className="space-y-2">
              {supportLinks.map(link => (
                <li key={link.to}>
                  <Link to={link.to} className="text-warm-gray hover:text-gold-light text-sm no-underline transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Popular Searches */}
          <div>
            <h3 className="font-heading text-lg font-semibold text-cream mb-4">Popular Searches</h3>
            <ul className="space-y-2">
              {popularSearchLinks.map(link => (
                <li key={link.to}>
                  <Link to={link.to} className="text-warm-gray hover:text-gold-light text-sm no-underline transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h3 className="font-heading text-lg font-semibold text-cream mb-4">Connect</h3>
            <div className="flex gap-4">
              <a href="https://instagram.com/sikhithreads" target="_blank" rel="noopener noreferrer" className="text-warm-gray hover:text-gold-light transition-colors" aria-label="Instagram">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
              </a>
              <a href="https://tiktok.com/@sikhithreads" target="_blank" rel="noopener noreferrer" className="text-warm-gray hover:text-gold-light transition-colors" aria-label="TikTok">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" /></svg>
              </a>
              <a href="https://youtube.com/@sikhithreads" target="_blank" rel="noopener noreferrer" className="text-warm-gray hover:text-gold-light transition-colors" aria-label="YouTube">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17"/><path d="m10 15 5-3-5-3z"/></svg>
              </a>
              <a href="https://pinterest.com/sikhithreads" target="_blank" rel="noopener noreferrer" className="text-warm-gray hover:text-gold-light transition-colors" aria-label="Pinterest">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="17" x2="12" y2="22"/><path d="M5 17h14v-1.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V6h1a2 2 0 0 0 0-4H8a2 2 0 0 0 0 4h1v4.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24Z"/></svg>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-charcoal-light/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center">
          <p className="text-warm-gray text-sm">
            &copy; {new Date().getFullYear()} SikhiThreads. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
