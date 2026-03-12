'use client'

import React, { useCallback, useEffect, useState, useRef } from 'react'
import {
  Box,
  Button,
  IconButton,
  Typography,
  Modal,
  Stack,
  Card,
  CircularProgress,
} from '@mui/joy'
import CloseIcon from '@mui/icons-material/Close'
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import AddIcon from '@mui/icons-material/Add'
import RemoveIcon from '@mui/icons-material/Remove'
import { ProductItem, getProducts } from '@/lib/wooApi'
import { useCart } from '@/context/CartContext'
import { useRouter } from 'next/navigation'
import {
  LubellaPack,
  LUBELLA_PACK_SELECTION_STORAGE_KEY,
} from './types'

const LUBELLA_PINK = '#e91e8c'
const LUBELLA_PINK_HOVER = '#c41a75'
const LUBELLA_ROSE = '#d81b60'
const LUBELLA_ROSE_HOVER = '#ad1649'
const IMG_PLACEHOLDER = '/imgs/calzon.png'

function getDisplayName(p: ProductItem): string {
  const n = (p.name || '').trim()
  const parent = (p.parent_name || '').replace(/^Privado:\s*/i, '').trim()
  if (parent && n.toLowerCase().startsWith(parent.toLowerCase())) {
    return n.slice(parent.length).replace(/^[\s\-–]+/, '').trim() || n
  }
  return n || p.name
}

function filterByKeyword(keyword: string, exclude?: string) {
  return (p: ProductItem) => {
    const text = ((p.name || '') + ' ' + (p.categories || '')).toLowerCase()
    const has = keyword.split('|').some((k) => text.includes(k.trim().toLowerCase()))
    const excludeMatch = exclude ? text.includes(exclude.toLowerCase()) : false
    return has && !excludeMatch && (p.stock ?? 0) > 0
  }
}

/** Excluye solo productos que digan "nude". Tiro Alto y Tiro Bikini sí aplican. */
function excludeNude(p: ProductItem): boolean {
  const text = ((p.name || '') + ' ' + (p.categories || '')).toLowerCase()
  return !/\bnude(s)?\b/.test(text)
}

/** Excluye productos que digan "tiro alto". */
function excludeTiroAlto(p: ProductItem): boolean {
  const text = ((p.name || '') + ' ' + (p.categories || '')).toLowerCase()
  return !text.includes('tiro alto')
}

/** Excluye talla 12/14; no aplican en la selección del wizard. */
function excludeTalla1214(p: ProductItem): boolean {
  const text = ((p.name || '') + ' ' + (p.categories || '')).toLowerCase()
  return !text.includes('12/14') && !text.includes('12-14')
}

type LubellaWizardProps = {
  pack: LubellaPack
  open: boolean
  onClose: () => void
  onComplete?: () => void
}

type StepIndex = 0 | 1 | 2

export default function LubellaWizard({ pack, open, onClose, onComplete }: LubellaWizardProps) {
  const { setLubellaPackInCart } = useCart()
  const router = useRouter()
  const [products, setProducts] = useState<ProductItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [step, setStep] = useState<StepIndex>(0)
  const [selectedLigeroModerado, setSelectedLigeroModerado] = useState<ProductItem[]>([])
  const [selectedModeradoAbundante, setSelectedModeradoAbundante] = useState<ProductItem[]>([])
  const historyKeyRef = useRef<string | null>(null)

  const stepLabels: string[] = ['Ligero / Moderado', 'Moderado / Abundante', 'Resumen']

  const ligeroModeradoList = products
    .filter(filterByKeyword('ligero|ligero moderado|moderado', 'abundante'))
    .filter(excludeNude)
    .filter(excludeTalla1214)
  const moderadoAbundanteList = products
    .filter(filterByKeyword('abundante|moderado abundante'))
    .filter(excludeNude)
    .filter(excludeTiroAlto)
    .filter(excludeTalla1214)

  const saveSelection = useCallback(() => {
    try {
      const payload = {
        ligeroModerado: selectedLigeroModerado.map((p) => p.id),
        moderadoAbundante: selectedModeradoAbundante.map((p) => p.id),
      }
      sessionStorage.setItem(LUBELLA_PACK_SELECTION_STORAGE_KEY(pack.id), JSON.stringify(payload))
    } catch {}
  }, [pack.id, selectedLigeroModerado, selectedModeradoAbundante])

  useEffect(() => {
    if (loading) return
    saveSelection()
  }, [saveSelection, loading])

  useEffect(() => {
    if (!open) return
    setLoading(true)
    setError(null)
    setStep(0)
    setSelectedLigeroModerado([])
    setSelectedModeradoAbundante([])
    getProducts()
      .then((data) => {
        setProducts(data)
        try {
          const saved = sessionStorage.getItem(LUBELLA_PACK_SELECTION_STORAGE_KEY(pack.id))
          if (saved) {
            const { ligeroModerado, moderadoAbundante } = JSON.parse(saved)
            console.log('ligeroModerado', ligeroModerado)
            console.log('moderadoAbundante', moderadoAbundante)
            const byId = new Map(data.map((p) => [p.id, p]))
            const getProduct = (id: number | string) => byId.get(Number(id)) ?? byId.get(id as number)
            if (Array.isArray(ligeroModerado)) {
              const rest = ligeroModerado.map((id) => getProduct(id)).filter(Boolean) as ProductItem[]
              if (rest.length <= pack.ligeroModerado) setSelectedLigeroModerado(rest)
            }
            if (Array.isArray(moderadoAbundante)) {
              const rest = moderadoAbundante.map((id) => getProduct(id)).filter(Boolean) as ProductItem[]
             
              if (rest.length <= pack.moderadoAbundante) setSelectedModeradoAbundante(rest)
            }
          }
        } catch {}
      })
      .catch(() => setError('No se pudieron cargar los productos.'))
      .finally(() => setLoading(false))
  }, [open, pack.id, pack.ligeroModerado, pack.moderadoAbundante])

  useEffect(() => {
    if (!open) return
    const key = `lubella-${pack.id}-${Date.now()}`
    historyKeyRef.current = key
    if (typeof window !== 'undefined') {
      window.history.pushState({ lubellaWizard: key, step: 0 }, '')
    }
    const onPopState = (e: PopStateEvent) => {
      const state = (e.state ?? window.history.state) as { lubellaWizard?: string; step?: number } | null
      if (state?.lubellaWizard === historyKeyRef.current && typeof state.step === 'number') {
        setStep(Math.max(0, Math.min(state.step, stepLabels.length - 1)) as StepIndex)
      } else {
        onClose()
      }
    }
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [open, pack.id, onClose])

  const canNext = useCallback(() => {
    if (step === 0) return selectedLigeroModerado.length === pack.ligeroModerado
    if (step === 1) return selectedModeradoAbundante.length === pack.moderadoAbundante
    return true
  }, [step, pack.ligeroModerado, pack.moderadoAbundante, selectedLigeroModerado.length, selectedModeradoAbundante.length])

  const handleNext = () => {
    if (step < stepLabels.length - 1) {
      const next = (step + 1) as StepIndex
      setStep(next)
      if (typeof window !== 'undefined' && historyKeyRef.current) {
        window.history.pushState({ lubellaWizard: historyKeyRef.current, step: next }, '')
      }
    }
  }

  const handleBack = () => {
    if (step > 0) setStep((s) => (s - 1) as StepIndex)
  }

  const addLigeroModerado = (product: ProductItem, e?: React.MouseEvent) => {
    e?.stopPropagation()
    setSelectedLigeroModerado((prev) => {
      const countThis = prev.filter((p) => p.id === product.id).length
      const stock = Math.max(0, product.stock ?? 0)
      if (prev.length >= pack.ligeroModerado || countThis >= stock) return prev
      return [...prev, product]
    })
  }

  const removeLigeroModerado = (product: ProductItem, e?: React.MouseEvent) => {
    e?.stopPropagation()
    setSelectedLigeroModerado((prev) => {
      const idx = prev.findIndex((p) => p.id === product.id)
      if (idx < 0) return prev
      return [...prev.slice(0, idx), ...prev.slice(idx + 1)]
    })
  }

  const addModeradoAbundante = (product: ProductItem, e?: React.MouseEvent) => {
    e?.stopPropagation()
    setSelectedModeradoAbundante((prev) => {
      const countThis = prev.filter((p) => p.id === product.id).length
      const stock = Math.max(0, product.stock ?? 0)
      if (prev.length >= pack.moderadoAbundante || countThis >= stock) return prev
      return [...prev, product]
    })
  }

  const removeModeradoAbundante = (product: ProductItem, e?: React.MouseEvent) => {
    e?.stopPropagation()
    setSelectedModeradoAbundante((prev) => {
      const idx = prev.findIndex((p) => p.id === product.id)
      if (idx < 0) return prev
      return [...prev.slice(0, idx), ...prev.slice(idx + 1)]
    })
  }

  const handlePagar = () => {
    setLubellaPackInCart({
      pack,
      selectedLigeroModerado: [...selectedLigeroModerado],
      selectedModeradoAbundante: [...selectedModeradoAbundante],
    })
    try {
      sessionStorage.removeItem(LUBELLA_PACK_SELECTION_STORAGE_KEY(pack.id))
    } catch {}
    onComplete?.()
    onClose()
    router.push('/carrito')
  }

  const accent = pack.color === 'pink' ? LUBELLA_PINK : LUBELLA_ROSE
  const accentHover = pack.color === 'pink' ? LUBELLA_PINK_HOVER : LUBELLA_ROSE_HOVER

  const renderStepContent = () => {
    if (loading) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
          <CircularProgress sx={{ color: accent }} />
        </Box>
      )
    }
    if (error) {
      return (
        <Typography color="danger" sx={{ py: 3, textAlign: 'center' }}>
          {error}
        </Typography>
      )
    }

    if (step === 2) {
      const lmGrouped = new Map<number, { product: ProductItem; count: number }>()
      selectedLigeroModerado.forEach((p) => {
        const prev = lmGrouped.get(p.id)
        if (prev) prev.count += 1
        else lmGrouped.set(p.id, { product: p, count: 1 })
      })
      const maGrouped = new Map<number, { product: ProductItem; count: number }>()
      selectedModeradoAbundante.forEach((p) => {
        const prev = maGrouped.get(p.id)
        if (prev) prev.count += 1
        else maGrouped.set(p.id, { product: p, count: 1 })
      })

      return (
        <Box sx={{ px: 1 }}>
          <Typography level="body-sm" color="neutral" sx={{ mb: 1 }}>
            Ligero / Moderado ({selectedLigeroModerado.length})
          </Typography>
          <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1, mb: 2 }}>
            {Array.from(lmGrouped.values()).map(({ product: p, count }) => (
              <Box key={`lm-${p.id}`} sx={{ position: 'relative' }}>
                <Box component="img" src={p.images || IMG_PLACEHOLDER} alt={p.name} sx={{ width: 56, height: 56, borderRadius: 'md', objectFit: 'cover' }} />
                {count > 1 && (
                  <Box sx={{ position: 'absolute', top: -4, right: -4, bgcolor: accent, color: 'white', borderRadius: 'full', minWidth: 18, height: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem' }}>{count}</Box>
                )}
              </Box>
            ))}
          </Stack>
          <Typography level="body-sm" color="neutral" sx={{ mb: 1 }}>
            Moderado / Abundante ({selectedModeradoAbundante.length})
          </Typography>
          <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1, mb: 2 }}>
            {Array.from(maGrouped.values()).map(({ product: p, count }) => (
              <Box key={`ma-${p.id}`} sx={{ position: 'relative' }}>
                <Box component="img" src={p.images || IMG_PLACEHOLDER} alt={p.name} sx={{ width: 56, height: 56, borderRadius: 'md', objectFit: 'cover' }} />
                {count > 1 && (
                  <Box sx={{ position: 'absolute', top: -4, right: -4, bgcolor: accent, color: 'white', borderRadius: 'full', minWidth: 18, height: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem' }}>{count}</Box>
                )}
              </Box>
            ))}
          </Stack>
          <Typography level="body-sm" color="neutral" sx={{ mb: 2 }}>1 detergente incluido</Typography>
          <Typography level="h4" sx={{ fontWeight: 700, color: accent }}>
            Precio del kit: ${pack.priceDiscounted.toLocaleString('es-MX')}
          </Typography>
          <Button
            fullWidth
            variant="solid"
            size="lg"
            onClick={handlePagar}
            sx={{ mt: 2, bgcolor: accent, fontWeight: 600, '&:hover': { bgcolor: accentHover } }}
          >
            Ir a pagar
          </Button>
        </Box>
      )
    }

    if (step === 0) {
      return (
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2, px: 1 }}>
          {ligeroModeradoList.map((p) => {
            const countThis = selectedLigeroModerado.filter((x) => x.id === p.id).length
            const selected = countThis > 0
            const stock = Math.max(0, p.stock ?? 0)
            const canAdd = selectedLigeroModerado.length < pack.ligeroModerado && countThis < stock
            const canRemove = countThis > 0
            const disabled = !canAdd && !canRemove
            return (
              <Card key={p.id} variant="outlined" sx={{ borderRadius: 'md', border: selected ? `3px solid ${accent}` : undefined, opacity: disabled ? 0.7 : 1 }}>
                <Box component="img" src={p.images || IMG_PLACEHOLDER} alt={p.name} sx={{ width: '100%', aspectRatio: '1', objectFit: 'cover', borderRadius: 'md' }} />
                <Box sx={{ p: 1, textAlign: 'center', minWidth: 0 }}>
                  <Typography level="body-sm" sx={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', minHeight: 36, fontSize: '0.8rem' }} title={p.name}>{getDisplayName(p)}</Typography>
                  <Stack direction="row" alignItems="center" justifyContent="center" spacing={0.5} sx={{ mt: 0.75 }} useFlexGap flexWrap="nowrap">
                    <IconButton size="sm" onClick={(e) => removeLigeroModerado(p, e)} disabled={!canRemove} sx={{ minWidth: 32, width: 32, height: 32, '--IconButton-size': '32px', border: '1.5px solid', borderColor: canRemove ? accent : 'neutral.outlinedBorder', color: canRemove ? accent : 'neutral', bgcolor: canRemove ? `${accent}20` : 'transparent' }}><RemoveIcon sx={{ fontSize: 18 }} /></IconButton>
                    <Typography level="body-sm" sx={{ minWidth: 22, textAlign: 'center', fontWeight: 700, color: selected ? accent : 'neutral', fontSize: '0.9rem' }}>{countThis}</Typography>
                    <IconButton size="sm" onClick={(e) => addLigeroModerado(p, e)} disabled={!canAdd} sx={{ minWidth: 32, width: 32, height: 32, '--IconButton-size': '32px', border: '1.5px solid', borderColor: canAdd ? accent : 'neutral.outlinedBorder', color: canAdd ? accent : 'neutral', bgcolor: canAdd ? `${accent}20` : 'transparent' }}><AddIcon sx={{ fontSize: 18 }} /></IconButton>
                  </Stack>
                  <Typography level="body-sm" color="neutral" sx={{ display: 'block', mt: 0.25, fontSize: '0.7rem' }}>{selectedLigeroModerado.length}/{pack.ligeroModerado}</Typography>
                </Box>
              </Card>
            )
          })}
        </Box>
      )
    }

    if (step === 1) {
      return (
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2, px: 1 }}>
          {moderadoAbundanteList.map((p) => {
            const countThis = selectedModeradoAbundante.filter((x) => x.id === p.id).length
            const selected = countThis > 0
            const stock = Math.max(0, p.stock ?? 0)
            const canAdd = selectedModeradoAbundante.length < pack.moderadoAbundante && countThis < stock
            const canRemove = countThis > 0
            const disabled = !canAdd && !canRemove
            return (
              <Card key={p.id} variant="outlined" sx={{ borderRadius: 'md', border: selected ? `3px solid ${accent}` : undefined, opacity: disabled ? 0.7 : 1 }}>
                <Box component="img" src={p.images || IMG_PLACEHOLDER} alt={p.name} sx={{ width: '100%', aspectRatio: '1', objectFit: 'cover', borderRadius: 'md' }} />
                <Box sx={{ p: 1, textAlign: 'center', minWidth: 0 }}>
                  <Typography level="body-sm" sx={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', minHeight: 36, fontSize: '0.8rem' }} title={p.name}>{getDisplayName(p)}</Typography>
                  <Stack direction="row" alignItems="center" justifyContent="center" spacing={0.5} sx={{ mt: 0.75 }} useFlexGap flexWrap="nowrap">
                    <IconButton size="sm" onClick={(e) => removeModeradoAbundante(p, e)} disabled={!canRemove} sx={{ minWidth: 32, width: 32, height: 32, '--IconButton-size': '32px', border: '1.5px solid', borderColor: canRemove ? accent : 'neutral.outlinedBorder', color: canRemove ? accent : 'neutral', bgcolor: canRemove ? `${accent}20` : 'transparent' }}><RemoveIcon sx={{ fontSize: 18 }} /></IconButton>
                    <Typography level="body-sm" sx={{ minWidth: 22, textAlign: 'center', fontWeight: 700, color: selected ? accent : 'neutral', fontSize: '0.9rem' }}>{countThis}</Typography>
                    <IconButton size="sm" onClick={(e) => addModeradoAbundante(p, e)} disabled={!canAdd} sx={{ minWidth: 32, width: 32, height: 32, '--IconButton-size': '32px', border: '1.5px solid', borderColor: canAdd ? accent : 'neutral.outlinedBorder', color: canAdd ? accent : 'neutral', bgcolor: canAdd ? `${accent}20` : 'transparent' }}><AddIcon sx={{ fontSize: 18 }} /></IconButton>
                  </Stack>
                  <Typography level="body-sm" color="neutral" sx={{ display: 'block', mt: 0.25, fontSize: '0.7rem' }}>{selectedModeradoAbundante.length}/{pack.moderadoAbundante}</Typography>
                </Box>
              </Card>
            )
          })}
        </Box>
      )
    }

    return null
  }

  return (
    <Modal open={open} onClose={onClose} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', p: 2 }}>
      <Box
        sx={{
          bgcolor: 'background.surface',
          borderRadius: 'lg',
          boxShadow: 'xl',
          maxWidth: 560,
          width: '100%',
          maxHeight: '90vh',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          border: `2px solid ${accent}`,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 2, py: 1.5, borderBottom: `1px solid ${accent}40` }}>
          <IconButton onClick={handleBack} disabled={step === 0} size="sm" sx={{ color: accent }}><ArrowBackIosNewIcon fontSize="small" /></IconButton>
          <Typography level="title-md" sx={{ fontWeight: 700, color: accent }}>{stepLabels[step]}</Typography>
          <IconButton onClick={onClose} size="sm" sx={{ color: accent }}><CloseIcon /></IconButton>
        </Box>
        <Box sx={{ overflowY: 'auto', flex: 1, py: 2 }}>{renderStepContent()}</Box>
        {!loading && !error && step < 2 && (
          <Box sx={{ p: 2, borderTop: `1px solid ${accent}40` }}>
            <Button fullWidth variant="solid" onClick={handleNext} disabled={!canNext()} endDecorator={<ArrowForwardIosIcon />} sx={{ bgcolor: accent, fontWeight: 600, '&:hover': { bgcolor: accentHover } }}>
              Siguiente
            </Button>
          </Box>
        )}
      </Box>
    </Modal>
  )
}
