'use client'

import {
  Box,
  Typography,
  IconButton,
  Button,
  Alert,
  Container,
  Card,
  Modal,
  ModalDialog,
  Stack,
} from '@mui/joy'
import { useEffect, useState } from 'react'
import {
  DeleteForever,
  Visibility,
  Edit,
  ArrowBack,
} from '@mui/icons-material'
import QuantitySelector from '@/components/QuantitySelector'
import { useCart } from '@/context/CartContext'
import { CategoryItem, getCategories, ProductItem } from '@/lib/wooApi'
import ConfirmationModal from '@/components/ConfirmationModal'
import { LUBELLA_DETERGENT } from '@/app/expo-nacional/types'
import Link from 'next/link'

// Colores apishop / Lubella
const BRAND_PINK = '#E9416C'
const BRAND_GREEN = '#7CBB48'
const BRAND_BLUE = '#2196F3'
const CARD_BG = '#f5f5f5'
const CARD_BORDER = '#e0e0e0'
const DETERGENT_PLACEHOLDER = 'https://placehold.co/96x96/e8e8e8/666?text=Detergente'

export default function CarritoPage() {
  const { cartItems, lubellaPackInCart, removeFromCart, removeLubellaPackFromCart, clearCart } = useCart()
  const [categories, setCategories] = useState<CategoryItem[]>([])
  const [clearCartModal, setClearCartModal] = useState(false)
  const [removeLubellaModal, setRemoveLubellaModal] = useState(false)
  const [detailsKitOpen, setDetailsKitOpen] = useState(false)
  const [goingToWordpress, setGoingToWordpress] = useState(false)

  useEffect(() => {
    getCategories().then((categories) => setCategories(categories))
  }, [])

  const getDiscountedPrice = (product: ProductItem) => {
    const discount = categories.find(cat => cat.name.includes(product.parent_name))?.discount || 0
    return parseFloat(product.public_price) * (1 - discount / 100)
  }

  const getTotal = () => {
    const itemsTotal = cartItems.reduce((acc, item) => acc + getDiscountedPrice(item.product) * item.quantity, 0)
    const kitTotal = lubellaPackInCart ? lubellaPackInCart.pack.priceDiscounted : 0
    return itemsTotal + kitTotal
  }

  const goToWordpress = () => {
    setGoingToWordpress(true)

    type ItemPayload = { id: number; quantity: number; kit?: boolean }
    const items: ItemPayload[] = []

    if (lubellaPackInCart) {
      const { selectedLigeroModerado, selectedModeradoAbundante, pack } = lubellaPackInCart
      const byId = (arr: { id: number }[]) =>
        arr.reduce<Record<number, number>>((acc, p) => {
          acc[p.id] = (acc[p.id] ?? 0) + 1
          return acc
        }, {})
      const lmQty = byId(selectedLigeroModerado)
      const maQty = byId(selectedModeradoAbundante)
      Object.entries(lmQty).forEach(([id, qty]) => {
        items.push({ id: Number(id), quantity: qty, kit: true })
      })
      Object.entries(maQty).forEach(([id, qty]) => {
        items.push({ id: Number(id), quantity: qty, kit: true })
      })
      items.push({ id: LUBELLA_DETERGENT.id, quantity: 1, kit: true })
    }

    cartItems.forEach((i) => {
      items.push({ id: i.product.id, quantity: i.quantity })
    })

    const data = encodeURIComponent(JSON.stringify(items))
    const base = `https://ecopipo.com/matriz/?items=${data}`
    const url = lubellaPackInCart
      ? `${base}&kitTotal=${lubellaPackInCart.pack.priceDiscounted}`
      : base
    //console.log(url)
    //console.log(data)
    //console.log(base)
    window.location.href = url
  }

  const hasAnything = cartItems.length > 0 || !!lubellaPackInCart
  const detergentImage = LUBELLA_DETERGENT.image || DETERGENT_PLACEHOLDER

  return (
    <Container maxWidth="md" sx={{ py: 3, bgcolor: 'background.body', minHeight: '80vh' }}>
      <Typography level="h4" sx={{ fontWeight: 700, color: '#111', mb: 3 }}>
        Carrito de compras Lubella
      </Typography>

      {/* Card Kit (Paquete especial) - estilo Ecopipo */}
      {lubellaPackInCart && (
        <Card
          variant="outlined"
          sx={{
            mb: 2,
            p: 2,
            borderRadius: '12px',
            border: `1px solid ${CARD_BORDER}`,
            bgcolor: CARD_BG,
          }}
        >
          <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 1.5, mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
              <Typography fontWeight="700" sx={{ color: '#111', fontSize: '1.05rem' }}>
                {lubellaPackInCart.pack.name}
              </Typography>
              <Typography level="body-sm" sx={{ color: 'neutral.600', fontSize: '0.85rem' }}>
                Paquete especial
              </Typography>
            </Box>
            <Typography fontWeight="700" sx={{ color: '#111', fontSize: '1.1rem' }}>
              {lubellaPackInCart.pack.priceDiscounted.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })}
            </Typography>
          </Box>

          {/* Sub-item: detergente con imagen */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              py: 1.5,
              px: 1.5,
              borderRadius: '8px',
              bgcolor: 'background.surface',
              border: '1px solid',
              borderColor: 'neutral.outlinedBorder',
              mb: 2,
            }}
          >
            <Box
              component="img"
              src={detergentImage}
              alt={LUBELLA_DETERGENT.name}
              sx={{ width: 56, height: 56, borderRadius: '8px', objectFit: 'cover' }}
            />
            <Typography level="body-sm" sx={{ color: 'neutral.700' }}>
              1 {LUBELLA_DETERGENT.name}
            </Typography>
          </Box>

          {/* Botones Detalles, Editar, Eliminar */}
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            <Button
              size="sm"
              variant="outlined"
              startDecorator={<Visibility />}
              onClick={() => setDetailsKitOpen(true)}
              sx={{
                borderColor: BRAND_GREEN,
                color: BRAND_GREEN,
                '&:hover': { borderColor: BRAND_GREEN, bgcolor: `${BRAND_GREEN}14` },
              }}
            >
              Detalles
            </Button>
            <Button
              size="sm"
              variant="outlined"
              component={Link}
              href="/especial"
              startDecorator={<Edit />}
              sx={{
                borderColor: BRAND_BLUE,
                color: BRAND_BLUE,
                textDecoration: 'none',
                '&:hover': { borderColor: BRAND_BLUE, bgcolor: `${BRAND_BLUE}14` },
              }}
            >
              Editar
            </Button>
            <Button
              size="sm"
              variant="outlined"
              color="danger"
              startDecorator={<DeleteForever />}
              onClick={() => setRemoveLubellaModal(true)}
              sx={{
                borderColor: 'danger.500',
                color: 'danger.600',
                '&:hover': { bgcolor: 'danger.softBg' },
              }}
            >
              Eliminar
            </Button>
          </Box>

          <ConfirmationModal
            open={removeLubellaModal}
            title="¿Quitar kit?"
            message="El kit se quitará del carrito. Podrás volver a elegirlo desde la página Especial."
            onCancel={() => setRemoveLubellaModal(false)}
            onConfirm={() => {
              removeLubellaPackFromCart()
              setRemoveLubellaModal(false)
            }}
          />
        </Card>
      )}

      {/* Modal Detalles del kit */}
      <Modal open={detailsKitOpen} onClose={() => setDetailsKitOpen(false)}>
        <ModalDialog size="sm" sx={{ maxWidth: 400 }}>
          <Typography level="title-sm">Contenido del kit</Typography>
          {lubellaPackInCart && (
            <Stack spacing={1.5} sx={{ mt: 1 }}>
              {lubellaPackInCart.selectedLigeroModerado.map((p) => (
                <Box key={p.id} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box component="img" src={p.images} alt="" sx={{ width: 40, height: 40, borderRadius: '8px', objectFit: 'cover' }} />
                  <Typography level="body-sm">Ligero/Moderado: {p.name}</Typography>
                </Box>
              ))}
              {lubellaPackInCart.selectedModeradoAbundante.map((p) => (
                <Box key={p.id} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box component="img" src={p.images} alt="" sx={{ width: 40, height: 40, borderRadius: '8px', objectFit: 'cover' }} />
                  <Typography level="body-sm">Moderado/Abundante: {p.name}</Typography>
                </Box>
              ))}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, pt: 1, borderTop: '1px solid', borderColor: 'neutral.outlinedBorder' }}>
                <Box component="img" src={detergentImage} alt="" sx={{ width: 40, height: 40, borderRadius: '8px', objectFit: 'cover' }} />
                <Typography level="body-sm">1 {LUBELLA_DETERGENT.name}</Typography>
              </Box>
            </Stack>
          )}
          <Button fullWidth sx={{ mt: 2 }} onClick={() => setDetailsKitOpen(false)}>
            Cerrar
          </Button>
        </ModalDialog>
      </Modal>

      {/* Productos individuales: una card por producto (estilo Ecopipo) */}
      {cartItems.map(({ product, quantity }) => {
        const price = getDiscountedPrice(product)
        const subtotal = price * quantity
        return (
          <Card
            key={product.id}
            variant="outlined"
            sx={{
              mb: 2,
              p: 2,
              borderRadius: '12px',
              border: `1px solid ${CARD_BORDER}`,
              bgcolor: CARD_BG,
            }}
          >
            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                alignItems: { xs: 'stretch', sm: 'center' },
                gap: 2,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1, minWidth: 0 }}>
                <Box
                  component="img"
                  src={product.images}
                  alt={product.name}
                  sx={{ width: 72, height: 72, borderRadius: '12px', objectFit: 'cover', flexShrink: 0 }}
                />
                <Box sx={{ minWidth: 0, flex: 1 }}>
                  <Typography fontWeight="md" sx={{ color: '#111', mb: 1 }}>
                    {product.name}
                  </Typography>
                  <QuantitySelector product={product} simple />
                </Box>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, alignSelf: { xs: 'flex-end', sm: 'center' } }}>
                <Typography fontWeight="700" sx={{ color: '#111', fontSize: '1rem' }}>
                  {subtotal.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })}
                </Typography>
                <IconButton
                  size="sm"
                  color="danger"
                  variant="plain"
                  onClick={() => removeFromCart(product.id)}
                  sx={{ color: 'danger.600' }}
                >
                  <DeleteForever />
                </IconButton>
              </Box>
            </Box>
          </Card>
        )
      })}

      {cartItems.length === 0 && !lubellaPackInCart && (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography sx={{ mb: 2, color: 'neutral.600' }}>No hay productos en el carrito.</Typography>
          <Button component={Link} href="/" variant="solid" sx={{ bgcolor: BRAND_GREEN }}>
            Ver productos
          </Button>
        </Box>
      )}

      {cartItems.length === 0 && lubellaPackInCart && (
        <Typography level="body-sm" sx={{ color: 'neutral.600', mb: 2 }}>
          No hay otros productos en el carrito.
        </Typography>
      )}

      {/* Botones inferiores - estilo Ecopipo */}
      {hasAnything && (
        <Box sx={{ mt: 3 }}>
          {goingToWordpress && (
            <Alert color="primary" variant="soft" sx={{ mb: 2 }}>
              Vas a ser redirigido para pagar.
            </Alert>
          )}
          {!goingToWordpress && (
            <Stack spacing={2}>
              <Button
                fullWidth
                size="lg"
                onClick={goToWordpress}
                sx={{
                  bgcolor: BRAND_GREEN,
                  color: 'white',
                  fontWeight: 700,
                  py: 1.5,
                  borderRadius: '12px',
                  '&:hover': { bgcolor: '#6aab3d' },
                }}
              >
                Ir a pagar: {getTotal().toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })}
              </Button>
              <Button
                fullWidth
                variant="solid"
                onClick={() => setClearCartModal(true)}
                sx={{
                  bgcolor: BRAND_PINK,
                  color: 'white',
                  fontWeight: 700,
                  py: 1.5,
                  borderRadius: '12px',
                  '&:hover': { bgcolor: '#d1385a' },
                }}
              >
                Limpiar carrito
              </Button>
              <Button
                fullWidth
                variant="outlined"
                component={Link}
                href="/"
                startDecorator={<ArrowBack />}
                sx={{
                  borderColor: BRAND_BLUE,
                  color: BRAND_BLUE,
                  fontWeight: 600,
                  py: 1.5,
                  borderRadius: '12px',
                  bgcolor: 'white',
                  textDecoration: 'none',
                  '&:hover': { borderColor: BRAND_BLUE, bgcolor: `${BRAND_BLUE}08` },
                }}
              >
                Continuar comprando
              </Button>
              <Typography level="body-sm" sx={{ color: 'neutral.600', fontStyle: 'italic', textAlign: 'center' }}>
                *Precios de envío y descuentos adicionales se calculan en el siguiente paso.
              </Typography>
            </Stack>
          )}
          <ConfirmationModal
            open={clearCartModal}
            title="¿Estás seguro?"
            message="Esto eliminará todos los productos y el kit del carrito."
            onCancel={() => setClearCartModal(false)}
            onConfirm={() => {
              clearCart()
              setClearCartModal(false)
            }}
          />
        </Box>
      )}
    </Container>
  )
}
