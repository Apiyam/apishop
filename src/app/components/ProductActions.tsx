import * as React from 'react'
import { Box, Button, IconButton } from '@mui/joy'
import { ShoppingCart, Visibility } from '@mui/icons-material'
import { ProductItem } from '../lib/wooApi'
import QuantitySelector from './QuantitySelector'
import { useCart } from '../context/CartContext'
import { useEffect, useState } from 'react'
import Notification from './Notification'

type ProductActionsProps = {
  onViewDetails: () => void,
  product: ProductItem
  overrideActions?: boolean
}

export default function ProductActions({ onViewDetails, product, overrideActions }: ProductActionsProps) {
  const { addToCart, updatedCart, setShouldDisplayCart } = useCart()
  const [addedToCart, setAddedToCart] = useState(false)
  useEffect(() => {
    if (updatedCart) {
      setAddedToCart(true)
    }
  }, [updatedCart])
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        borderTopLeftRadius: '12px',
        borderTopRightRadius: '12px',
        
        gap: 1,
      }}
    >
      <Box sx={{ display: 'flex', flexDirection:{xs: overrideActions ? 'column' : 'row', sm: 'row'}, justifyContent: 'flex-start', alignItems: 'flex-start', gap: 1 }}>
      {overrideActions ? 
      <QuantitySelector product={product} /> : (
        <Button
          startDecorator={<ShoppingCart />}
          color="primary"
          variant="solid"
          sx={{ width: '50%' }}
          disabled={product.stock === 0 || product.stock === null}
          onClick={() => {
            addToCart({ product: product, quantity: 1 })
            setAddedToCart(true)
            setShouldDisplayCart(true)
          }}
        >
          Comprar
        </Button>
      )}
      {/* addedToCart && (
        <Notification message="El carrito ha sido actualizado" open={addedToCart} onClose={() => setAddedToCart(false)} />
      ) */}
      <Button
        startDecorator={<Visibility />}
        color="neutral"
        variant="outlined"
        sx={{ width: {xs: overrideActions ? '100%' : '50%', sm: '50%' } }}
        onClick={onViewDetails}
      >
        Detalles
      </Button>
      </Box>
    </Box>
  )
}