'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { ProductItem } from '../lib/wooApi'
import type { SalePack, SaleCampaign } from '../lib/salePack'

export type CartItem = {
  product: ProductItem
  quantity: number
}

export type SalePackInCart = {
  pack: SalePack
  selections: Record<string, ProductItem[]>
  campaign: SaleCampaign
}

const SALE_PACK_CART_KEY = 'sale_pack_cart'
const LEGACY_KIT_KEY = 'lubella_kit_cart'

type CartContextType = {
  cartItems: CartItem[]
  totalItems: number
  salePackInCart: SalePackInCart | null
  /** @deprecated usar salePackInCart */
  lubellaPackInCart: SalePackInCart | null
  setSalePackInCart: (data: SalePackInCart) => void
  removeSalePackFromCart: () => void
  /** @deprecated usar removeSalePackFromCart */
  setLubellaPackInCart: (data: SalePackInCart) => void
  removeLubellaPackFromCart: () => void
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

function migrateLegacyKit(raw: string): SalePackInCart | null {
  try {
    const data = JSON.parse(raw)
    if (data.pack?.lines && data.selections) return data as SalePackInCart
    if (data.pack && data.selectedLigeroModerado) {
      return {
        pack: data.pack,
        campaign: 'expo-nacional',
        selections: {
          'ligero-moderado': data.selectedLigeroModerado ?? [],
          'moderado-abundante': data.selectedModeradoAbundante ?? [],
        },
      }
    }
  } catch {}
  return null
}

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [salePackInCart, setSalePackInCartState] = useState<SalePackInCart | null>(null)
  const [updatedCart, setUpdatedCart] = useState(false)
  const [totalItems, setTotalItems] = useState(0)
  const [shouldDisplayCart, setShouldDisplayCart] = useState(false)

  useEffect(() => {
    try {
      let raw = localStorage.getItem(SALE_PACK_CART_KEY)
      if (!raw) raw = localStorage.getItem(LEGACY_KIT_KEY)
      if (raw) {
        const migrated = migrateLegacyKit(raw)
        if (migrated) {
          setSalePackInCartState(migrated)
          localStorage.setItem(SALE_PACK_CART_KEY, JSON.stringify(migrated))
          localStorage.removeItem(LEGACY_KIT_KEY)
        }
      }
    } catch {
      setSalePackInCartState(null)
    }
  }, [])

  const setSalePackInCart = (data: SalePackInCart) => {
    setSalePackInCartState(data)
    localStorage.setItem(SALE_PACK_CART_KEY, JSON.stringify(data))
  }

  const removeSalePackFromCart = () => {
    setSalePackInCartState(null)
    localStorage.removeItem(SALE_PACK_CART_KEY)
    localStorage.removeItem(LEGACY_KIT_KEY)
  }

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
    setTimeout(() => setUpdatedCart(false), 3000)
  }

  const searchItem = (id: number) => cartItems.find((i) => i.product.id === id)

  const updateQuantity = (id: number, quantity: number) => {
    const existing = cartItems.find((i) => i.product.id === id)
    setCartItems((prev) => prev.map((item) => (item.product.id === id ? { ...item, quantity } : item)))
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
    removeSalePackFromCart()
    localStorage.removeItem('lubella_cart')
  }

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        totalItems,
        updateQuantity,
        removeFromCart,
        clearCart,
        searchItem,
        updatedCart,
        shouldDisplayCart,
        setShouldDisplayCart,
        salePackInCart,
        lubellaPackInCart: salePackInCart,
        setSalePackInCart,
        removeSalePackFromCart,
        setLubellaPackInCart: setSalePackInCart,
        removeLubellaPackFromCart: removeSalePackFromCart,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) throw new Error('useCart must be used inside a CartProvider')
  return context
}
