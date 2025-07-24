'use client'

import {
  Modal, ModalDialog, Typography, Table, ModalClose, Box,
  IconButton, Button, Alert
} from '@mui/joy'
import { useEffect, useState } from 'react'
import { DeleteForever } from '@mui/icons-material'
import QuantitySelector from './QuantitySelector'
import { useCart } from '../context/CartContext'
import { CategoryItem, getCategories, ProductItem } from '../lib/wooApi'
import ConfirmationModal from './ConfirmationModal'

export default function CartModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { cartItems, removeFromCart, clearCart } = useCart()
  const [categories, setCategories] = useState<CategoryItem[]>([])
  const [clearCartModal, setClearCartModal] = useState(false)
  const [goingToWordpress, setGoingToWordpress] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    getCategories().then((categories) => setCategories(categories))
    setIsMobile(window.innerWidth < 600)
  }, [])

  const getDiscountedPrice = (product: ProductItem) => {
    const discount = categories.find(cat => cat.name.includes(product.parent_name))?.discount || 0
    return parseFloat(product.public_price) * (1 - discount / 100)
  }

  const getTotal = () => cartItems.reduce((acc, item) =>
    acc + getDiscountedPrice(item.product) * item.quantity, 0)

  const goToWordpress = () => {
    setGoingToWordpress(true)
    const data = encodeURIComponent(JSON.stringify(cartItems.map(i => ({ id: i.product.id, quantity: i.quantity }))))
    window.location.href = `https://ecopipo.com/matriz/?items=${data}`
  }

  return (
    <Modal open={open} onClose={onClose}>
      <ModalDialog size="lg" sx={{ maxWidth: 1200, width: '98%' }}>
        <ModalClose />
        <Typography level="h4">Carrito de compras Lubella</Typography>

        <Box sx={{ overflowX: 'auto', border: '1px solid', borderColor: 'neutral.outlinedBorder', maxHeight: '70vh', my: 2 }}>
          <Table stickyHeader>
            <thead>
              <tr>
                {!isMobile && <th></th>}
                <th>Producto</th>
                {!isMobile && <th>Cantidad</th>}
                <th>Precio</th>
                <th>Total</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {cartItems.length === 0 ? (
                <tr>
                  <td colSpan={6}>
                    <Typography sx={{ py: 2, textAlign: 'center' }}>No hay productos en el carrito.</Typography>
                  </td>
                </tr>
              ) : cartItems.map(({ product, quantity }) => {
                const price = getDiscountedPrice(product)
                return (
                  <tr key={product.id}>
                    {!isMobile && (
                      <td>
                        <Box component="img" src={product.images} alt={product.name} sx={{ width: 48, height: 48, borderRadius: 'md' }} />
                      </td>
                    )}
                    <td>
                      <Typography fontWeight="md">{product.name}</Typography>
                      {isMobile && <QuantitySelector product={product} simple />}
                    </td>
                    {!isMobile && <td><QuantitySelector product={product} simple /></td>}
                    <td>
                      <Typography>{price.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })}</Typography>
                    </td>
                    <td>
                      <Typography>{(price * quantity).toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })}</Typography>
                    </td>
                    <td>
                      <IconButton size="sm" color="danger" onClick={() => removeFromCart(product.id)}>
                        <DeleteForever />
                      </IconButton>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </Table>
        </Box>

        {cartItems.length > 0 && (
          <>
            {goingToWordpress && (
              <Alert color="primary" variant="soft">
                <Typography fontWeight="lg">Vas a ser redirigido para pagar.</Typography>
              </Alert>
            )}
            {!goingToWordpress && (
              <>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button fullWidth color="primary" onClick={goToWordpress}>
                  Ir a pagar: {getTotal().toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })}
                </Button>
                <Button fullWidth variant="outlined" onClick={() => setClearCartModal(true)}>
                  Limpiar carrito
                </Button>
              </Box>
              <Typography sx={{ fontSize: '12px' }}>*Precios de envío y descuentos adicionales se calculan en el siguiente paso.</Typography>
              </>
            )}
            <ConfirmationModal
              open={clearCartModal}
              title="¿Estás seguro?"
              message="Esto eliminará todos los productos del carrito."
              onCancel={() => setClearCartModal(false)}
              onConfirm={() => {
                clearCart()
                setClearCartModal(false)
                onClose()
              }}
            />
          </>
        )}
      </ModalDialog>
    </Modal>
  )
}