/** @deprecated Importar desde @/lib/salePack */
import {
  SALE_DETERGENT,
  EXPO_NACIONAL_PACKS,
  PACK_SELECTION_STORAGE_KEY,
  type SalePack,
} from '@/lib/salePack'

export { SALE_DETERGENT as LUBELLA_DETERGENT, EXPO_NACIONAL_PACKS as LUBELLA_PACKS, type SalePack as LubellaPack }

export const LUBELLA_PACK_SELECTION_STORAGE_KEY = (packId: string) =>
  PACK_SELECTION_STORAGE_KEY('expo-nacional', packId)
