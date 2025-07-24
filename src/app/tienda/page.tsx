'use client'
import { ProductProvider } from '@/context/ProductContext'
import MainView from './_components/MainView'

export default function ProductsPage() {
  return (
    <ProductProvider>
      <MainView />
    </ProductProvider>
  )
}