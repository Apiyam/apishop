'use client'

import {
  Modal,
  ModalDialog,
  Typography,
  Table,
  ModalClose,
  Sheet,
  Box,
  Chip,
  Button,
  IconButton,
  DialogActions,
  Alert,
} from '@mui/joy'
import { useState } from 'react'
import QuantitySelector from './QuantitySelector'
import { useCart } from '../context/CartContext'
import { ProductItem } from '../lib/wooApi'
import { DeleteForever } from '@mui/icons-material'
import ConfirmationModal from './ConfirmationModal'

type CartModalProps = {
  open: boolean
  onClose: () => void
  }

export default function CartModal({ open, onClose }: CartModalProps) {
  const { cartItems, removeFromCart, clearCart } = useCart()
  const [clearCartModal, setClearCartModal] = useState(false)
  const [goingToWordpress, setGoingToWordpress] = useState(false)

  const goToWordpress = () => {
    setGoingToWordpress(true)
    const items = cartItems.map((item) => ({
      id: item.product.id,
      quantity: item.quantity
    }));
    
    const json = JSON.stringify(items);
    const encoded = encodeURIComponent(json);
    
    const wordpressURL = `https://ecopipo.com/matriz/?items=${encoded}`;
    window.location.href = wordpressURL;
  }

  return (
    <Modal open={open} onClose={onClose}>
      <ModalDialog layout="center" size="lg" sx={{ maxWidth: 1200 }}>
        <ModalClose />
        <Typography level="h4" sx={{ mb: 2 }}>
          Carrito de compras Lubella
        </Typography>

        <Sheet
          variant="outlined"
          sx={{
            borderRadius: 'md',
            overflow: 'auto',
            maxHeight: '70vh',
            border: '1px solid',
            borderColor: 'neutral.outlinedBorder',
          }}
        >
          <Table
            borderAxis="bothBetween"
            stickyHeader
            hoverRow
            size="md"
            sx={{
              '& thead th': {
                bgcolor: 'neutral.softBg',
              },
              '& tbody tr:nth-of-type(even)': {
                backgroundColor: 'neutral.softBg',
              },
              minWidth: 600,
            }}
          >
            <thead>
              <tr>
                <th style={{ width: '70px' }}></th>
                <th>Producto</th>
                <th style={{ width: '150px' }}>Cantidad</th>
                <th>Precio Unitario</th>
                <th>Precio Total</th>
                <th style={{ width: '70px' }}></th>
              </tr>
            </thead>
            <tbody>
              {cartItems.length === 0 ? (
                <tr>
                  <td colSpan={4}>
                    <Typography level="body-sm" sx={{ py: 2, textAlign: 'center' }}>
                      No hay productos en el carrito.
                    </Typography>
                  </td>
                </tr>
              ) : (
                cartItems.map((item) => (
                  <tr key={item.product.id}>
                    <td >
                      <img width={50} src={item.product.images} alt={item.product.name} />
                    </td>
                    <td>
                      <Typography fontWeight="md">{item.product.name}</Typography>
                    </td>
                    <td>
                      <QuantitySelector product={item.product} simple />
                    </td>
                    <td>
                      {Number(item.product.public_price).toLocaleString('es-MX', {
                        style: 'currency',
                        currency: 'MXN',
                      })}
                    </td>
                    <td>
                      {Number(parseFloat(item.product.public_price) * item.quantity).toLocaleString('es-MX', {
                        style: 'currency',
                        currency: 'MXN',
                      })}
                    </td>
                    <td>
                      <IconButton size="sm" color="danger" variant="outlined"onClick={() => {
                        removeFromCart(item.product.id)
                      }}>
                        <DeleteForever />
                      </IconButton>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
          
        </Sheet>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
       {
        cartItems.length > 0 && (
          <>
          {goingToWordpress && (
            <Alert color="primary" variant="soft" sx={{ width: '100%', marginTop: '10px' }}>
              <Typography level="body-lg" sx={{ fontWeight: 'bold' }}>
                Vas a ser redirigido a nuestra tienda para realizar el pago.
              </Typography>
            </Alert>
          )}
          {
            !goingToWordpress && (
              <>
               <Button color="primary" variant="solid" sx={{ width: '50%', marginTop: '10px' }} onClick={goToWordpress}>
            <Typography level="body-lg" sx={{ fontWeight: 'bold', color: 'white' }}>
              Ir a pagar: {Number(cartItems.reduce((acc, item) => acc + parseFloat(item.product.public_price) * item.quantity, 0)).toLocaleString('es-MX', {
                style: 'currency',
                currency: 'MXN',
              })}
            </Typography>
          </Button>
          <Button  variant="outlined" sx={{ width: '50%', marginTop: '10px' }} onClick={() => setClearCartModal(true)}>
            <Typography level="body-lg">
              Limpiar carrito
            </Typography>
          </Button>
              </>
            )
          }

          {clearCartModal && (
            <ConfirmationModal 
              open={clearCartModal} 
              title="¿Estás seguro?" 
              message="Esto eliminará todos los productos del carrito." 
              onCancel={() => setClearCartModal(false)} 
              onConfirm={() => {
                clearCart()
                setClearCartModal(false)
                onClose()
              }} />
            )}
          </>
        )
       }
        </Box>
      </ModalDialog>
    </Modal>
  )
}