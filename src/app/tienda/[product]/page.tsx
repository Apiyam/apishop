'use client'
import { ProductProvider } from '@/context/ProductContext'
import MainView from '../_components/MainView'
import { useParams } from 'next/navigation'

export default function ProductPage() {
  const { product } = useParams()
  console.log(product)
  return (
    <ProductProvider>
      <MainView selectedProduct={`${product}`} />
    </ProductProvider>
  )
}