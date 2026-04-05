import { createContext, useContext, useState, useEffect, useMemo } from 'react'

const CartContext = createContext()

const CART_STORAGE_KEY = 'sikhithreads_cart'

function loadCart() {
  try {
    const stored = localStorage.getItem(CART_STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(loadCart)

  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items))
  }, [items])

  function addToCart(product, quantity = 1, variant = null) {
    setItems(prev => {
      const existingIndex = prev.findIndex(
        item => item.product.id === product.id && item.variant === variant
      )
      if (existingIndex > -1) {
        const updated = [...prev]
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + quantity,
        }
        return updated
      }
      return [...prev, { product, quantity, variant }]
    })
  }

  function removeFromCart(productId, variant = null) {
    setItems(prev =>
      prev.filter(item => !(item.product.id === productId && item.variant === variant))
    )
  }

  function updateQuantity(productId, quantity, variant = null) {
    if (quantity <= 0) {
      removeFromCart(productId, variant)
      return
    }
    setItems(prev =>
      prev.map(item =>
        item.product.id === productId && item.variant === variant
          ? { ...item, quantity }
          : item
      )
    )
  }

  function clearCart() {
    setItems([])
  }

  const itemCount = useMemo(() => items.reduce((sum, item) => sum + item.quantity, 0), [items])
  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + (item.product.price || 0) * item.quantity, 0),
    [items]
  )

  return (
    <CartContext.Provider
      value={{ items, addToCart, removeFromCart, updateQuantity, clearCart, itemCount, subtotal }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) throw new Error('useCart must be used within a CartProvider')
  return context
}
