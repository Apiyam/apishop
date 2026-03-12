export type LubellaPackId = 'regular' | 'abundante'

export type LubellaPack = {
  id: LubellaPackId
  image: string
  name: string
  ligeroModerado: number
  moderadoAbundante: number
  detergente: 1
  priceOriginal: number
  priceDiscounted: number
  color: 'pink' | 'rose'
}

export const LUBELLA_PACKS: LubellaPack[] = [
  {
    image: '/imgs/expo2.jpeg',
    id: 'regular',  
    name: 'Kit Flujo Regular',
    ligeroModerado: 3,
    moderadoAbundante: 2,
    detergente: 1,
    priceOriginal: 2417,
    priceDiscounted: 2050,
    color: 'pink',
  },
  {
    image: '/imgs/expo1.jpeg',
    id: 'abundante',
    name: 'Kit Flujo Abundante',
    ligeroModerado: 1,
    moderadoAbundante: 4,
    detergente: 1,
    priceOriginal: 2595,
    priceDiscounted: 2199,
    color: 'rose',
  },
]

/** Detergente Lubella: producto fijo incluido en cada kit */
export const LUBELLA_DETERGENT = {
  id: 4275,
  sku: '01040290000000000000000',
  name: 'Detergente Lubella',
  /** URL de la imagen (p. ej. NEXT_PUBLIC_LUBELLA_DETERGENT_IMAGE) */
  image: process.env.NEXT_PUBLIC_LUBELLA_DETERGENT_IMAGE || '',
} as const

export const LUBELLA_PARENT_IDS = {
  LIGERO_MODERADO: 0,
  MODERADO_ABUNDANTE: 0,
  DETERGENTE: LUBELLA_DETERGENT.id,
} as const

export const LUBELLA_WEBHOOK_URL =
  process.env.NEXT_PUBLIC_LUBELLA_WEBHOOK_URL || process.env.NEXT_PUBLIC_PRODUCTS_ENDPOINT || ''

export const LUBELLA_PACK_SELECTION_STORAGE_KEY = (packId: string) =>
  `lubella_pack_${packId}_selection`
