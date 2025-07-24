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
import { useEffect, useState } from 'react'
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
  const [isMobile, setIsMobile] = useState(false)

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

  useEffect(() => {
    setIsMobile(window.innerWidth < 600)
  }, [])

  return (
    <Modal open={open} onClose={onClose}>
      <ModalDialog layout="center" size="lg" sx={{ maxWidth: "1200px", width: "98%" }}>
        <ModalClose />
        <Typography level="h4" sx={{ mb: 2 }}>
          Carrito de compras Lubella
        </Typography>

        <Box
  sx={{
    overflowX: { xs: 'auto', md: 'visible' },
    borderRadius: 'md',
    border: '1px solid',
    borderColor: 'neutral.outlinedBorder',
    maxHeight: '70vh',
  }}
>
  <Table
    stickyHeader
    size="md"
    hoverRow
    borderAxis="bothBetween"
    sx={{
      minWidth: 600,
      '& thead th': {
        bgcolor: 'neutral.softBg',
        fontSize: 'sm',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
      },
      '& tbody td': {
        verticalAlign: 'middle',
      },
      '& tbody tr:nth-of-type(even)': {
        backgroundColor: 'neutral.softBg',
      },
    }}
  >
    <thead>
      <tr>
        {!isMobile && <th style={{ width: 70 }}></th>}
        <th style={{ width: '250px' }}>Producto</th>
        {!isMobile && <th style={{ width: 130 }}>Cantidad</th>}
        <th style={{ width: 130 }}>Precio Unitario</th>
        <th style={{ width: 130 }}>Total</th>
        <th style={{ width: 60 }}></th>
      </tr>
    </thead>
    <tbody>
      {cartItems.length === 0 ? (
        <tr>
          <td colSpan={6}>
            <Typography level="body-sm" sx={{ py: 2, textAlign: 'center' }}>
              No hay productos en el carrito.
            </Typography>
          </td>
        </tr>
      ) : (
        cartItems.map((item) => (
          <tr key={item.product.id}>
            {!isMobile && (
             <td>
             <Box
               component="img"
               src={item.product.images}
               alt={item.product.name}
               sx={{
                 width: 48,
                 height: 48,
                 objectFit: 'cover',
                 borderRadius: 'md',
               }}
             />
           </td> 
            )}
            <td>
              <Typography level="body-md" fontWeight="md">
                {item.product.name}
                <br />
                {isMobile && <QuantitySelector product={item.product} simple />}
              </Typography>
            </td>
            {!isMobile && (
              <td>
                <QuantitySelector product={item.product} simple />
              </td>
            )}
            <td>
              {Number(item.product.public_price).toLocaleString('es-MX', {
                style: 'currency',
                currency: 'MXN',
              })}
            </td>
            <td>
              {Number(
                parseFloat(item.product.public_price) * item.quantity
              ).toLocaleString('es-MX', {
                style: 'currency',
                currency: 'MXN',
              })}
            </td>
            <td>
              <IconButton
                size="sm"
                color="danger"
                variant="outlined"
                onClick={() => removeFromCart(item.product.id)}
              >
                <DeleteForever />
              </IconButton>
            </td>
          </tr>
        ))
      )}
    </tbody>
  </Table>
</Box>
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