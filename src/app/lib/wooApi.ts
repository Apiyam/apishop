import axios from 'axios'
import { NextApiRequest, NextApiResponse } from 'next'

const WOO_URL = '/api/bd.json'
const CONSUMER_KEY = 'ck_xxxxxx'
const CONSUMER_SECRET = 'cs_xxxxxx'

export const wooApi = axios.create({
  baseURL: WOO_URL,
  auth: {
    username: CONSUMER_KEY,
    password: CONSUMER_SECRET,
  },
})

export type ProductItem = {
    sku: string
    id: number
    parent: number
    parent_name: string
    name: string
    stock: number
    description: string
    cedis_universo: string
    cedis_galaxia: string
    cedis_constelacion: string
    cedis_sol: string
    mayorista_luna: string
    mayorista_estrella: string
    minorista_nebulosa: string
    promotora_cometa: string
    sat: string
    public_price: string
    categories: string
    images: string
  }

  export type CategoryItem = {
    parent: number[]
    name: string
    image: string
  }

  export const getCategories = async (): Promise<CategoryItem[]> => {
    const res = await axios.get('/api/categories.json')
    const data = res.data
    return data
  }

export const getProducts = async (): Promise<ProductItem[]> => {
    const res = await axios.get('https://n8n.srv912585.hstgr.cloud/webhook/lubella')
    const data = res.data;
    const products: ProductItem[] = data.filter((product: ProductItem) => product.categories.includes('Mujer'))
    const parentMap = new Map<number, string[]>()

    products.forEach((product) => {
      if (product.parent) {
        parentMap.set(product.parent, [product.parent_name, product.images])
      }
    })
  
    const parents = Array.from(parentMap.entries()).map(([parent, name]) => ({
      parent,
      name,
    }))
  
    console.log('PARENTS:', parents)
    return products
  }
