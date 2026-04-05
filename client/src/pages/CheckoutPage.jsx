import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, ArrowRight, CreditCard, Check } from 'lucide-react'
import toast from 'react-hot-toast'
import { useCart } from '../context/CartContext'
import { api } from '../lib/api'

const steps = ['Shipping', 'Payment', 'Review']

export default function CheckoutPage() {
  const navigate = useNavigate()
  const { items, subtotal, clearCart } = useCart()
  const [currentStep, setCurrentStep] = useState(0)
  const [submitting, setSubmitting] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState('stripe')

  const [shipping, setShipping] = useState({
    firstName: '', lastName: '', email: '', phone: '',
    address: '', city: '', state: '', zip: '', country: 'US',
  })

  const shippingCost = subtotal >= 50 ? 0 : 7.99
  const total = subtotal + shippingCost

  function handleShippingChange(e) {
    setShipping(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  function handleShippingSubmit(e) {
    e.preventDefault()
    setCurrentStep(1)
  }

  function handlePaymentSubmit(e) {
    e.preventDefault()
    setCurrentStep(2)
  }

  async function handlePlaceOrder() {
    setSubmitting(true)
    try {
      const orderData = {
        items: items.map(item => ({
          product_id: item.product.id,
          quantity: item.quantity,
          variant: item.variant,
          price: item.product.price,
        })),
        shipping,
        payment_method: paymentMethod,
        subtotal,
        shipping_cost: shippingCost,
        total,
      }
      const data = await api.post('/api/orders', orderData)
      clearCart()
      navigate(`/order-confirmation/${data.order_number || data.id}`)
    } catch (err) {
      toast.error(err.message || 'Failed to place order')
    } finally {
      setSubmitting(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h1 className="font-heading text-3xl text-charcoal mb-4">Your cart is empty</h1>
        <Link to="/shop" className="text-brown hover:text-brown-dark font-medium no-underline">
          Go to Shop
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Steps */}
      <div className="flex items-center justify-center gap-4 mb-12">
        {steps.map((step, i) => (
          <div key={step} className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
              i < currentStep ? 'bg-success text-warm-white' :
              i === currentStep ? 'bg-gold text-warm-white' :
              'bg-cream-dark text-warm-gray'
            }`}>
              {i < currentStep ? <Check size={16} /> : i + 1}
            </div>
            <span className={`text-sm font-medium ${
              i <= currentStep ? 'text-charcoal' : 'text-warm-gray'
            }`}>
              {step}
            </span>
            {i < steps.length - 1 && (
              <div className={`w-12 h-px mx-2 ${i < currentStep ? 'bg-success' : 'bg-gold-light/30'}`} />
            )}
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-10">
        {/* Form Area */}
        <div className="lg:col-span-2">
          {/* Step 1: Shipping */}
          {currentStep === 0 && (
            <form onSubmit={handleShippingSubmit}>
              <h2 className="font-heading text-2xl font-bold text-charcoal mb-6">Shipping Information</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-1">First Name</label>
                  <input name="firstName" value={shipping.firstName} onChange={handleShippingChange} required
                    className="w-full px-4 py-3 bg-warm-white border border-gold-light/30 rounded-lg text-sm focus:outline-none focus:border-gold text-charcoal" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-1">Last Name</label>
                  <input name="lastName" value={shipping.lastName} onChange={handleShippingChange} required
                    className="w-full px-4 py-3 bg-warm-white border border-gold-light/30 rounded-lg text-sm focus:outline-none focus:border-gold text-charcoal" />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-charcoal mb-1">Email</label>
                  <input name="email" type="email" value={shipping.email} onChange={handleShippingChange} required
                    className="w-full px-4 py-3 bg-warm-white border border-gold-light/30 rounded-lg text-sm focus:outline-none focus:border-gold text-charcoal" />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-charcoal mb-1">Phone</label>
                  <input name="phone" type="tel" value={shipping.phone} onChange={handleShippingChange}
                    className="w-full px-4 py-3 bg-warm-white border border-gold-light/30 rounded-lg text-sm focus:outline-none focus:border-gold text-charcoal" />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-charcoal mb-1">Address</label>
                  <input name="address" value={shipping.address} onChange={handleShippingChange} required
                    className="w-full px-4 py-3 bg-warm-white border border-gold-light/30 rounded-lg text-sm focus:outline-none focus:border-gold text-charcoal" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-1">City</label>
                  <input name="city" value={shipping.city} onChange={handleShippingChange} required
                    className="w-full px-4 py-3 bg-warm-white border border-gold-light/30 rounded-lg text-sm focus:outline-none focus:border-gold text-charcoal" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-1">State</label>
                  <input name="state" value={shipping.state} onChange={handleShippingChange} required
                    className="w-full px-4 py-3 bg-warm-white border border-gold-light/30 rounded-lg text-sm focus:outline-none focus:border-gold text-charcoal" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-1">ZIP Code</label>
                  <input name="zip" value={shipping.zip} onChange={handleShippingChange} required
                    className="w-full px-4 py-3 bg-warm-white border border-gold-light/30 rounded-lg text-sm focus:outline-none focus:border-gold text-charcoal" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-1">Country</label>
                  <select name="country" value={shipping.country} onChange={handleShippingChange}
                    className="w-full px-4 py-3 bg-warm-white border border-gold-light/30 rounded-lg text-sm focus:outline-none focus:border-gold text-charcoal">
                    <option value="US">United States</option>
                    <option value="CA">Canada</option>
                    <option value="GB">United Kingdom</option>
                    <option value="IN">India</option>
                    <option value="AU">Australia</option>
                  </select>
                </div>
              </div>
              <button type="submit"
                className="mt-6 flex items-center gap-2 bg-gold hover:bg-gold-dark text-warm-white px-8 py-3 rounded-lg font-semibold transition-colors cursor-pointer">
                Continue to Payment <ArrowRight size={18} />
              </button>
            </form>
          )}

          {/* Step 2: Payment */}
          {currentStep === 1 && (
            <form onSubmit={handlePaymentSubmit}>
              <h2 className="font-heading text-2xl font-bold text-charcoal mb-6">Payment Method</h2>
              <div className="space-y-4">
                <label className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-colors ${
                  paymentMethod === 'stripe' ? 'border-gold bg-gold/5' : 'border-gold-light/30 bg-warm-white'
                }`}>
                  <input type="radio" name="payment" value="stripe" checked={paymentMethod === 'stripe'}
                    onChange={e => setPaymentMethod(e.target.value)} className="accent-gold" />
                  <CreditCard size={20} className="text-brown" />
                  <div>
                    <p className="text-charcoal font-medium text-sm">Credit / Debit Card</p>
                    <p className="text-warm-gray text-xs">Pay securely with Stripe</p>
                  </div>
                </label>

                <label className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-colors ${
                  paymentMethod === 'razorpay' ? 'border-gold bg-gold/5' : 'border-gold-light/30 bg-warm-white'
                }`}>
                  <input type="radio" name="payment" value="razorpay" checked={paymentMethod === 'razorpay'}
                    onChange={e => setPaymentMethod(e.target.value)} className="accent-gold" />
                  <div className="w-5 h-5 bg-blue-600 rounded text-white flex items-center justify-center text-xs font-bold">R</div>
                  <div>
                    <p className="text-charcoal font-medium text-sm">Razorpay</p>
                    <p className="text-warm-gray text-xs">UPI, Netbanking, Cards & more</p>
                  </div>
                </label>
              </div>

              {paymentMethod === 'stripe' && (
                <div className="mt-6 p-6 bg-cream-dark rounded-xl border border-gold-light/20">
                  <p className="text-warm-gray text-sm text-center">
                    Stripe card input will appear here after integration.
                  </p>
                </div>
              )}

              <div className="flex gap-4 mt-6">
                <button type="button" onClick={() => setCurrentStep(0)}
                  className="flex items-center gap-2 text-charcoal-light hover:text-brown px-6 py-3 rounded-lg font-medium transition-colors cursor-pointer">
                  <ArrowLeft size={18} /> Back
                </button>
                <button type="submit"
                  className="flex items-center gap-2 bg-gold hover:bg-gold-dark text-warm-white px-8 py-3 rounded-lg font-semibold transition-colors cursor-pointer">
                  Review Order <ArrowRight size={18} />
                </button>
              </div>
            </form>
          )}

          {/* Step 3: Review */}
          {currentStep === 2 && (
            <div>
              <h2 className="font-heading text-2xl font-bold text-charcoal mb-6">Review Your Order</h2>

              <div className="bg-warm-white rounded-xl p-6 border border-gold-light/20 mb-6">
                <h3 className="font-semibold text-charcoal mb-3">Shipping to</h3>
                <p className="text-charcoal-light text-sm">
                  {shipping.firstName} {shipping.lastName}<br />
                  {shipping.address}<br />
                  {shipping.city}, {shipping.state} {shipping.zip}<br />
                  {shipping.email}
                </p>
              </div>

              <div className="bg-warm-white rounded-xl p-6 border border-gold-light/20 mb-6">
                <h3 className="font-semibold text-charcoal mb-3">Items</h3>
                <div className="space-y-3">
                  {items.map((item, idx) => (
                    <div key={idx} className="flex justify-between text-sm">
                      <span className="text-charcoal-light">
                        {item.product.name} {item.variant ? `(${item.variant})` : ''} x {item.quantity}
                      </span>
                      <span className="text-charcoal font-medium">${(item.product.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-4">
                <button type="button" onClick={() => setCurrentStep(1)}
                  className="flex items-center gap-2 text-charcoal-light hover:text-brown px-6 py-3 rounded-lg font-medium transition-colors cursor-pointer">
                  <ArrowLeft size={18} /> Back
                </button>
                <button
                  onClick={handlePlaceOrder}
                  disabled={submitting}
                  className="flex-1 bg-gold hover:bg-gold-dark text-warm-white py-4 rounded-lg font-semibold transition-colors disabled:opacity-60 cursor-pointer"
                >
                  {submitting ? 'Placing Order...' : `Place Order \u2014 $${total.toFixed(2)}`}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-warm-white rounded-xl p-6 border border-gold-light/20 sticky top-24">
            <h3 className="font-heading text-lg font-semibold text-charcoal mb-4">Order Summary</h3>
            <div className="space-y-3 text-sm">
              {items.map((item, idx) => (
                <div key={idx} className="flex justify-between text-charcoal-light">
                  <span className="truncate mr-2">{item.product.name} x{item.quantity}</span>
                  <span>${(item.product.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
              <div className="border-t border-gold-light/20 pt-3 flex justify-between text-charcoal-light">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-charcoal-light">
                <span>Shipping</span>
                <span>{shippingCost === 0 ? 'Free' : `$${shippingCost.toFixed(2)}`}</span>
              </div>
              <div className="border-t border-gold-light/20 pt-3 flex justify-between text-charcoal font-semibold text-base">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
