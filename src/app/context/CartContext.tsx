'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { ProductItem } from '../lib/wooApi'

export type CartItem = {
  product: ProductItem
  quantity: number
}

type CartContextType = {
  cartItems: CartItem[]
  totalItems: number
  updatedCart: boolean
  shouldDisplayCart: boolean
  addToCart: (item: CartItem) => void
  updateQuantity: (id: number, quantity: number) => void
  removeFromCart: (id: number) => void
  clearCart: () => void
  searchItem: (id: number) => CartItem | undefined
  setShouldDisplayCart: (shouldDisplay: boolean) => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)



export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [updatedCart, setUpdatedCart] = useState(false)
  const [totalItems, setTotalItems] = useState(0)
  const [shouldDisplayCart, setShouldDisplayCart] = useState(false)
  const getLocalCart = () => {
    const cart = localStorage.getItem('lubella_cart')
    return cart ? JSON.parse(cart) : []
  }
  useEffect(() => {
    setCartItems(getLocalCart())
    setTotalItems(getLocalCart().reduce((acc: number, item: CartItem) => acc + item.quantity, 0))
  }, [])

  const addToCart = (item: CartItem) => {
    const existing = cartItems.find((i) => i.product.id === item.product.id)
    if (existing) {
      updateQuantity(item.product.id, item.quantity)
    } else {
      setCartItems([...cartItems, item])
      setTotalItems(totalItems + item.quantity)
    }
    setUpdatedCart(true)
    localStorage.setItem('lubella_cart', JSON.stringify(cartItems))
    setTimeout(() => {
      setUpdatedCart(false)
    }, 3000)
   
  }

  const searchItem = (id: number) => {
    return cartItems.find((i) => i.product.id === id)
  }

  const updateQuantity = (id: number, quantity: number) => {
    const existing = cartItems.find((i) => i.product.id === id)
    setCartItems((prev) =>
      prev.map((item) => (item.product.id === id ? { ...item, quantity } : item))
    )
    setTotalItems(totalItems + (quantity - (existing?.quantity || 0)))
    localStorage.setItem('lubella_cart', JSON.stringify(cartItems))
  }

  const removeFromCart = (id: number) => {
    const qty = cartItems.find((item) => item.product.id === id)?.quantity
    setCartItems((prev) => prev.filter((item) => item.product.id !== id))
    setTotalItems(totalItems - (qty || 0))
    localStorage.setItem('lubella_cart', JSON.stringify(cartItems))
  }

  const clearCart = () => {
    setCartItems([])
    setTotalItems(0)
    localStorage.removeItem('lubella_cart')
  }

  return (
    <CartContext.Provider
      value={{ cartItems, addToCart, totalItems, updateQuantity, removeFromCart, clearCart, searchItem, updatedCart, shouldDisplayCart, setShouldDisplayCart }}
    >
      {children}
    </CartContext.Provider>
  )
}

// Custom hook para usar más fácil
export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) throw new Error('useCart must be used inside a CartProvider')
  return context
}