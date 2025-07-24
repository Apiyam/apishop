'use client'
import { createContext, useContext, useEffect, useState } from 'react'
import { getProducts, ProductItem } from '@/lib/wooApi'

const ProductContext = createContext<{ products: ProductItem[], loaded: boolean } | undefined>(undefined)

export function ProductProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<ProductItem[]>([])
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      const cached = localStorage.getItem('lubella_products')
      const lastFetched = localStorage.getItem('lubella_products_timestamp')
      const expired = !lastFetched || Date.now() - parseInt(lastFetched) > 1000 * 60 * 15 // 15 minutos
  
      if (cached && !expired) {
        const parsed = JSON.parse(cached)
        setProducts(parsed)
        setLoaded(true)
        return
      }

      try {
        const products = await getProducts()
        setProducts(products)
        setLoaded(true)
  
        localStorage.setItem('lubella_products', JSON.stringify(products))
        localStorage.setItem('lubella_products_timestamp', Date.now().toString())
      } catch (error) {
        console.error('Error fetching products:', error)
      }
    }
  
    fetchData()
  }, [])

  return (
    <ProductContext.Provider value={{ products, loaded }}>
      {children}
    </ProductContext.Provider>
  )
}

export function useProducts() {
  const context = useContext(ProductContext)
  if (!context) {
    throw new Error('useProducts must be used within a ProductProvider')
  }
  return context
}