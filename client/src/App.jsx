import { Routes, Route, Outlet } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import HomePage from './pages/HomePage'
import ShopPage from './pages/ShopPage'
import CollectionPage from './pages/CollectionPage'
import ProductPage from './pages/ProductPage'
import CartPage from './pages/CartPage'
import CheckoutPage from './pages/CheckoutPage'
import OrderConfirmationPage from './pages/OrderConfirmationPage'
import TrackOrderPage from './pages/TrackOrderPage'
import OurStoryPage from './pages/OurStoryPage'
import CustomOrdersPage from './pages/CustomOrdersPage'
import ContactPage from './pages/ContactPage'
import BlogPage from './pages/BlogPage'
import BlogPostPage from './pages/BlogPostPage'
import GlossaryPage from './pages/GlossaryPage'
import LandingPage from './pages/LandingPage'
import GiveawayPage from './pages/GiveawayPage'
import VaisakhiGreetingPage from './pages/VaisakhiGreetingPage'
import NotFoundPage from './pages/NotFoundPage'
import AdminLayout from './admin/AdminLayout'
import EmailPopup from './components/EmailPopup'
import ReferralBanner from './components/ReferralBanner'

function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <ReferralBanner />
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <EmailPopup />
    </div>
  )
}

export default function App() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/shop" element={<ShopPage />} />
        <Route path="/collections/:slug" element={<CollectionPage />} />
        <Route path="/products/:slug" element={<ProductPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/order-confirmation/:orderNumber" element={<OrderConfirmationPage />} />
        <Route path="/track-order" element={<TrackOrderPage />} />
        <Route path="/our-story" element={<OurStoryPage />} />
        <Route path="/custom-orders" element={<CustomOrdersPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/blog/:slug" element={<BlogPostPage />} />
        <Route path="/glossary" element={<GlossaryPage />} />
        <Route path="/l/:slug" element={<LandingPage />} />
        <Route path="/giveaway" element={<GiveawayPage />} />
        <Route path="/vaisakhi" element={<VaisakhiGreetingPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
      <Route path="/admin/*" element={<AdminLayout />} />
    </Routes>
  )
}
