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
  SalePack,
  SaleCampaign,
  PACK_SELECTION_STORAGE_KEY,
  productMatchesLine,
  formatPackPrice,
} from '@/lib/salePack'

const ACCENTS = {
  pink: { main: '#e91e8c', hover: '#c41a75' },
  rose: { main: '#d81b60', hover: '#ad1649' },
  green: { main: '#7CBB48', hover: '#6aab3d' },
} as const

const IMG_PLACEHOLDER = '/imgs/calzon.png'

function getDisplayName(p: ProductItem): string {
  const n = (p.name || '').trim()
  const parent = (p.parent_name || '').replace(/^Privado:\s*/i, '').trim()
  if (parent && n.toLowerCase().startsWith(parent.toLowerCase())) {
    return n.slice(parent.length).replace(/^[\s\-–]+/, '').trim() || n
  }
  return n || p.name
}

type SalePackWizardProps = {
  pack: SalePack
  campaign: SaleCampaign
  open: boolean
  onClose: () => void
  onComplete?: () => void
}

export default function SalePackWizard({ pack, campaign, open, onClose, onComplete }: SalePackWizardProps) {
  const { setSalePackInCart } = useCart()
  const router = useRouter()
  const [products, setProducts] = useState<ProductItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [step, setStep] = useState(0)
  const [selections, setSelections] = useState<Record<string, ProductItem[]>>({})
  const historyKeyRef = useRef<string | null>(null)

  const lineCount = pack.lines.length
  const isSummaryStep = step === lineCount
  const stepLabels = [...pack.lines.map((l) => l.label), 'Resumen']
  const currentLine = pack.lines[step]

  const accent = ACCENTS[pack.color]
  const storageKey = PACK_SELECTION_STORAGE_KEY(campaign, pack.id)

  const initSelections = useCallback(() => {
    const empty: Record<string, ProductItem[]> = {}
    pack.lines.forEach((l) => {
      empty[l.id] = []
    })
    return empty
  }, [pack.lines])

  const productsForLine = (line: (typeof pack.lines)[0]) =>
    products.filter((p) => productMatchesLine(p, line))

  const saveSelection = useCallback(() => {
    try {
      const payload: Record<string, number[]> = {}
      pack.lines.forEach((l) => {
        payload[l.id] = (selections[l.id] ?? []).map((p) => p.id)
      })
      sessionStorage.setItem(storageKey, JSON.stringify(payload))
    } catch {}
  }, [pack.lines, selections, storageKey])

  useEffect(() => {
    if (loading) return
    saveSelection()
  }, [saveSelection, loading])

  useEffect(() => {
    if (!open) return
    setLoading(true)
    setError(null)
    setStep(0)
    setSelections(initSelections())
    getProducts()
      .then((data) => {
        setProducts(data)
        try {
          const saved = sessionStorage.getItem(storageKey)
          if (saved) {
            const parsed = JSON.parse(saved) as Record<string, number[]>
            const byId = new Map(data.map((p) => [p.id, p]))
            const getProduct = (id: number | string) => byId.get(Number(id))
            const restored = initSelections()
            pack.lines.forEach((l) => {
              const ids = parsed[l.id]
              if (Array.isArray(ids)) {
                const items = ids.map((id) => getProduct(id)).filter(Boolean) as ProductItem[]
                if (items.length <= l.quantity) restored[l.id] = items
              }
            })
            setSelections(restored)
          }
        } catch {}
      })
      .catch(() => setError('No se pudieron cargar los productos.'))
      .finally(() => setLoading(false))
  }, [open, pack.id, campaign, initSelections, pack.lines, storageKey])

  useEffect(() => {
    if (!open) return
    const key = `${campaign}-${pack.id}-${Date.now()}`
    historyKeyRef.current = key
    if (typeof window !== 'undefined') {
      window.history.pushState({ salePackWizard: key, step: 0 }, '')
    }
    const onPopState = (e: PopStateEvent) => {
      const state = (e.state ?? window.history.state) as { salePackWizard?: string; step?: number } | null
      if (state?.salePackWizard === historyKeyRef.current && typeof state.step === 'number') {
        setStep(Math.max(0, Math.min(state.step, stepLabels.length - 1)))
      } else {
        onClose()
      }
    }
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [open, pack.id, campaign, onClose, stepLabels.length])

  const canNext = useCallback(() => {
    if (isSummaryStep) return true
    const line = pack.lines[step]
    return (selections[line.id]?.length ?? 0) === line.quantity
  }, [isSummaryStep, pack.lines, step, selections])

  const handleNext = () => {
    if (step < stepLabels.length - 1) {
      const next = step + 1
      setStep(next)
      if (typeof window !== 'undefined' && historyKeyRef.current) {
        window.history.pushState({ salePackWizard: historyKeyRef.current, step: next }, '')
      }
    }
  }

  const handleBack = () => {
    if (step > 0) setStep((s) => s - 1)
  }

  const addProduct = (lineId: string, product: ProductItem, maxQty: number, e?: React.MouseEvent) => {
    e?.stopPropagation()
    setSelections((prev) => {
      const list = prev[lineId] ?? []
      const countThis = list.filter((p) => p.id === product.id).length
      const stock = Math.max(0, product.stock ?? 0)
      if (list.length >= maxQty || countThis >= stock) return prev
      return { ...prev, [lineId]: [...list, product] }
    })
  }

  const removeProduct = (lineId: string, product: ProductItem, e?: React.MouseEvent) => {
    e?.stopPropagation()
    setSelections((prev) => {
      const list = prev[lineId] ?? []
      const idx = list.findIndex((p) => p.id === product.id)
      if (idx < 0) return prev
      return { ...prev, [lineId]: [...list.slice(0, idx), ...list.slice(idx + 1)] }
    })
  }

  const handlePagar = () => {
    setSalePackInCart({ pack, selections: { ...selections }, campaign })
    try {
      sessionStorage.removeItem(storageKey)
    } catch {}
    onComplete?.()
    onClose()
    router.push('/carrito')
  }

  const renderProductGrid = (line: (typeof pack.lines)[0]) => {
    const list = productsForLine(line)
    const selected = selections[line.id] ?? []
    return (
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2, px: 1 }}>
        {list.map((p) => {
          const countThis = selected.filter((x) => x.id === p.id).length
          const isSelected = countThis > 0
          const stock = Math.max(0, p.stock ?? 0)
          const canAdd = selected.length < line.quantity && countThis < stock
          const canRemove = countThis > 0
          const disabled = !canAdd && !canRemove
          return (
            <Card
              key={p.id}
              variant="outlined"
              sx={{
                borderRadius: 'md',
                border: isSelected ? `3px solid ${accent.main}` : undefined,
                opacity: disabled ? 0.7 : 1,
              }}
            >
              <Box
                component="img"
                src={p.images || IMG_PLACEHOLDER}
                alt={p.name}
                sx={{ width: '100%', aspectRatio: '1', objectFit: 'cover', borderRadius: 'md' }}
              />
              <Box sx={{ p: 1, textAlign: 'center', minWidth: 0 }}>
                <Typography
                  level="body-sm"
                  sx={{
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    minHeight: 36,
                    fontSize: '0.8rem',
                  }}
                  title={p.name}
                >
                  {getDisplayName(p)}
                </Typography>
                <Stack direction="row" alignItems="center" justifyContent="center" spacing={0.5} sx={{ mt: 0.75 }} useFlexGap flexWrap="nowrap">
                  <IconButton
                    size="sm"
                    onClick={(e) => removeProduct(line.id, p, e)}
                    disabled={!canRemove}
                    sx={{
                      minWidth: 32,
                      width: 32,
                      height: 32,
                      border: '1.5px solid',
                      borderColor: canRemove ? accent.main : 'neutral.outlinedBorder',
                      color: canRemove ? accent.main : 'neutral',
                    }}
                  >
                    <RemoveIcon sx={{ fontSize: 18 }} />
                  </IconButton>
                  <Typography level="body-sm" sx={{ minWidth: 22, textAlign: 'center', fontWeight: 700, color: isSelected ? accent.main : 'neutral' }}>
                    {countThis}
                  </Typography>
                  <IconButton
                    size="sm"
                    onClick={(e) => addProduct(line.id, p, line.quantity, e)}
                    disabled={!canAdd}
                    sx={{
                      minWidth: 32,
                      width: 32,
                      height: 32,
                      border: '1.5px solid',
                      borderColor: canAdd ? accent.main : 'neutral.outlinedBorder',
                      color: canAdd ? accent.main : 'neutral',
                    }}
                  >
                    <AddIcon sx={{ fontSize: 18 }} />
                  </IconButton>
                </Stack>
                <Typography level="body-sm" color="neutral" sx={{ display: 'block', mt: 0.25, fontSize: '0.7rem' }}>
                  {selected.length}/{line.quantity}
                </Typography>
              </Box>
            </Card>
          )
        })}
      </Box>
    )
  }

  const renderStepContent = () => {
    if (loading) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
          <CircularProgress sx={{ color: accent.main }} />
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

    if (isSummaryStep) {
      return (
        <Box sx={{ px: 1 }}>
          {pack.lines.map((line) => {
            const grouped = new Map<number, { product: ProductItem; count: number }>()
            ;(selections[line.id] ?? []).forEach((p) => {
              const prev = grouped.get(p.id)
              if (prev) prev.count += 1
              else grouped.set(p.id, { product: p, count: 1 })
            })
            return (
              <Box key={line.id} sx={{ mb: 2 }}>
                <Typography level="body-sm" color="neutral" sx={{ mb: 1 }}>
                  {line.label} ({(selections[line.id] ?? []).length})
                </Typography>
                <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
                  {Array.from(grouped.values()).map(({ product: p, count }) => (
                    <Box key={`${line.id}-${p.id}`} sx={{ position: 'relative' }}>
                      <Box
                        component="img"
                        src={p.images || IMG_PLACEHOLDER}
                        alt={p.name}
                        sx={{ width: 56, height: 56, borderRadius: 'md', objectFit: 'cover' }}
                      />
                      {count > 1 && (
                        <Box
                          sx={{
                            position: 'absolute',
                            top: -4,
                            right: -4,
                            bgcolor: accent.main,
                            color: 'white',
                            borderRadius: 'full',
                            minWidth: 18,
                            height: 18,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '0.7rem',
                          }}
                        >
                          {count}
                        </Box>
                      )}
                    </Box>
                  ))}
                </Stack>
              </Box>
            )
          })}
          <Typography level="body-sm" color="neutral" sx={{ mb: 2 }}>
            1 detergente incluido
          </Typography>
          <Box
            component="img"
            src={'https://ecopipo.com/matriz/wp-content/uploads/2022/11/Ecopipo_DetergenteToallas.jpeg'}
            alt="Detergente"
            sx={{ width: 56, height: 56, borderRadius: 'md', objectFit: 'cover', mb: 2 }}
          />
          <Typography level="h4" sx={{ fontWeight: 700, color: accent.main }}>
            Precio del pack: ${formatPackPrice(pack.priceDiscounted)} MXN
          </Typography>
          <Button
            fullWidth
            variant="solid"
            size="lg"
            onClick={handlePagar}
            sx={{ mt: 2, bgcolor: accent.main, fontWeight: 600, '&:hover': { bgcolor: accent.hover } }}
          >
            Ir a pagar
          </Button>
        </Box>
      )
    }

    if (!currentLine) return null
    return renderProductGrid(currentLine)
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
          border: `2px solid ${accent.main}`,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 2, py: 1.5, borderBottom: `1px solid ${accent.main}40` }}>
          <IconButton onClick={handleBack} disabled={step === 0} size="sm" sx={{ color: accent.main }}>
            <ArrowBackIosNewIcon fontSize="small" />
          </IconButton>
          <Typography level="title-md" sx={{ fontWeight: 700, color: accent.main }}>
            {stepLabels[step]}
          </Typography>
          <IconButton onClick={onClose} size="sm" sx={{ color: accent.main }}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Box sx={{ overflowY: 'auto', flex: 1, py: 2 }}>{renderStepContent()}</Box>
        {!loading && !error && !isSummaryStep && (
          <Box sx={{ p: 2, borderTop: `1px solid ${accent.main}40` }}>
            <Button
              fullWidth
              variant="solid"
              onClick={handleNext}
              disabled={!canNext()}
              endDecorator={<ArrowForwardIosIcon />}
              sx={{ bgcolor: accent.main, fontWeight: 600, '&:hover': { bgcolor: accent.hover } }}
            >
              Siguiente
            </Button>
          </Box>
        )}
      </Box>
    </Modal>
  )
}
