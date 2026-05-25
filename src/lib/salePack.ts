import { ProductItem } from './wooApi'

/** IDs de producto padre en WooCommerce */
export const PRODUCT_PARENT_IDS = {
  TOALLA_REGULAR: 4176,
  TOALLA_NOCTURNA: 4236,
  PANTIPROTECTOR: 4057,
  PANTIPROTECTOR_TANGA: 4024,
} as const

export type SalePackLine = {
  id: string
  label: string
  quantity: number
  /** Filtra por parent id del producto */
  parentIds?: number[]
  /** Palabras clave en nombre/categorías (separadas por |) */
  includeKeywords?: string
  excludeKeywords?: string
  /** Filtros extra del wizard (calzones expo) */
  wizardFilters?: ('excludeNude' | 'excludeTiroAlto' | 'excludeTalla1214')[]
}

export type SalePack = {
  id: string
  name: string
  image: string
  lines: SalePackLine[]
  detergente: 1
  priceOriginal: number
  priceDiscounted: number
  discountPercent: number
  color: 'pink' | 'rose' | 'green'
}

export type SaleCampaign = 'lubellasale' | 'expo-nacional'

export const SALE_DETERGENT = {
  id: 4275,
  sku: '01040290000000000000000',
  name: 'Detergente Lubella',
  image: 'https://ecopipo.com/matriz/wp-content/uploads/2022/11/Ecopipo_DetergenteToallas.jpeg',
} as const

export const PACK_SELECTION_STORAGE_KEY = (campaign: SaleCampaign, packId: string) =>
  `${campaign}_pack_${packId}_selection`

/** Precio sin decimales (banners / UI) */
export function formatPackPrice(amount: number): string {
  return amount.toLocaleString('es-MX', {
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  })
}

export const LUBELLASALE_PACKS: SalePack[] = [
  {
    id: 'ligero',
    name: 'Pack Ligero',
    image:
      '/imgs/luexpo1.jpg',
    priceOriginal: 1493,
    priceDiscounted: 1194,
    discountPercent: 20,
    color: 'pink',
    detergente: 1,
    lines: [
      {
        id: 'regulares',
        label: 'Toallas regulares',
        quantity: 6,
        parentIds: [PRODUCT_PARENT_IDS.TOALLA_REGULAR],
      },
      {
        id: 'pantiprotectores',
        label: 'Pantiprotectores',
        quantity: 4,
        parentIds: [PRODUCT_PARENT_IDS.PANTIPROTECTOR],
      },
    ],
  },
  {
    id: 'moderado',
    name: 'Pack Moderado',
    image:
      '/imgs/luexpo2.jpg',
    priceOriginal: 1602,
    priceDiscounted: 1281,
    discountPercent: 20,
    color: 'rose',
    detergente: 1,
    lines: [
      {
        id: 'regulares',
        label: 'Toallas regulares',
        quantity: 5,
        parentIds: [PRODUCT_PARENT_IDS.TOALLA_REGULAR],
      },
      {
        id: 'nocturnas',
        label: 'Toallas nocturnas',
        quantity: 3,
        parentIds: [PRODUCT_PARENT_IDS.TOALLA_NOCTURNA],
      },
      {
        id: 'pantiprotectores',
        label: 'Pantiprotectores',
        quantity: 2,
        parentIds: [PRODUCT_PARENT_IDS.PANTIPROTECTOR],
      },
    ],
  },
  {
    id: 'abundante',
    name: 'Pack Abundante',
    image:
      '/imgs/luexpo3.jpg',
    priceOriginal: 1711,
    priceDiscounted: 1368,
    discountPercent: 20,
    color: 'green',
    detergente: 1,
    lines: [
      {
        id: 'regulares',
        label: 'Toallas regulares',
        quantity: 4,
        parentIds: [PRODUCT_PARENT_IDS.TOALLA_REGULAR],
      },
      {
        id: 'nocturnas',
        label: 'Toallas nocturnas',
        quantity: 6,
        parentIds: [PRODUCT_PARENT_IDS.TOALLA_NOCTURNA],
      },
    ],
  },
]

export const EXPO_NACIONAL_PACKS: SalePack[] = [
  {
    id: 'regular',
    name: 'Kit Flujo Regular',
    image: '/imgs/expo2.jpeg',
    priceOriginal: 2417,
    priceDiscounted: 2050,
    discountPercent: 15,
    color: 'pink',
    detergente: 1,
    lines: [
      {
        id: 'ligero-moderado',
        label: 'Ligero / Moderado',
        quantity: 3,
        includeKeywords: 'ligero|ligero moderado|moderado',
        excludeKeywords: 'abundante',
        wizardFilters: ['excludeNude', 'excludeTalla1214'],
      },
      {
        id: 'moderado-abundante',
        label: 'Moderado / Abundante',
        quantity: 2,
        includeKeywords: 'abundante|moderado abundante',
        wizardFilters: ['excludeNude', 'excludeTiroAlto', 'excludeTalla1214'],
      },
    ],
  },
  {
    id: 'abundante',
    name: 'Kit Flujo Abundante',
    image: '/imgs/expo1.jpeg',
    priceOriginal: 2595,
    priceDiscounted: 2199,
    discountPercent: 15,
    color: 'rose',
    detergente: 1,
    lines: [
      {
        id: 'ligero-moderado',
        label: 'Ligero / Moderado',
        quantity: 1,
        includeKeywords: 'ligero|ligero moderado|moderado',
        excludeKeywords: 'abundante',
        wizardFilters: ['excludeNude', 'excludeTalla1214'],
      },
      {
        id: 'moderado-abundante',
        label: 'Moderado / Abundante',
        quantity: 4,
        includeKeywords: 'abundante|moderado abundante',
        wizardFilters: ['excludeNude', 'excludeTiroAlto', 'excludeTalla1214'],
      },
    ],
  },
]

export function productMatchesLine(p: ProductItem, line: SalePackLine): boolean {
  if ((p.stock ?? 0) <= 0) return false
  const text = ((p.name || '') + ' ' + (p.categories || '') + ' ' + (p.parent_name || '')).toLowerCase()

  if (line.parentIds?.length) {
    if (!line.parentIds.includes(p.parent)) return false
    if (line.parentIds.includes(PRODUCT_PARENT_IDS.PANTIPROTECTOR) && p.parent === PRODUCT_PARENT_IDS.PANTIPROTECTOR_TANGA) {
      return false
    }
  }

  if (line.includeKeywords) {
    const has = line.includeKeywords.split('|').some((k) => text.includes(k.trim().toLowerCase()))
    if (!has) return false
  }
  if (line.excludeKeywords && text.includes(line.excludeKeywords.toLowerCase())) return false

  if (line.wizardFilters?.includes('excludeNude') && /\bnude(s)?\b/.test(text)) return false
  if (line.wizardFilters?.includes('excludeTiroAlto') && text.includes('tiro alto')) return false
  if (line.wizardFilters?.includes('excludeTalla1214') && (text.includes('12/14') || text.includes('12-14'))) {
    return false
  }

  return true
}

export function packContentSummary(pack: SalePack): string {
  const parts = pack.lines.map((l) => `${l.quantity} ${l.label.toLowerCase()}`)
  parts.push('1 detergente')
  return parts.join(' · ')
}
