'use client'

import {
  Sheet,
  Box,
  Typography,
  IconButton,
  Badge,
  Button,
  Container,
} from '@mui/joy'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import MenuIcon from '@mui/icons-material/Menu'
import CartModal from './CartModal'
import { useEffect, useState } from 'react'
import { useCart } from '../context/CartContext'
import Notification from './Notification'

export default function Header() {
  const [openCart, setOpenCart] = useState(false)
  const { totalItems, shouldDisplayCart, setShouldDisplayCart } = useCart()
  useEffect(() => {
    if (shouldDisplayCart) {
      setOpenCart(true)
      setTimeout(() => {
        setShouldDisplayCart(false)
      }, 1000)
    }
  }, [shouldDisplayCart])
  return (
    <Sheet
      variant="solid"
      color="neutral"
      sx={{
        bgcolor: '#e8416c', // fondo rosa claro
        borderBottom: '1px solidrgb(230, 120, 147)',
        py: 1,
        position: 'sticky',
        top: 0,
        zIndex: 1000,
      }}
    >
      <Container
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 2,
        }}
      >
        {/* Logo / Título */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton variant="plain" sx={{ display: { xs: 'inline-flex', sm: 'none' } }}>
            <MenuIcon />
          </IconButton>
          <img src="/imgs/logo.png" alt="Logo" width={120}  />
        </Box>

        {/* Navegación */}
        <Box sx={{ display: { xs: 'none', sm: 'flex' }, gap: 2 }}>
          <Button variant="plain" sx={{ color: 'white' }}>
            Contacto
          </Button>
        </Box>

        {/* Carrito */}
        <IconButton size="sm" variant="plain" sx={{ color: 'white' }} onClick={() => setOpenCart(true)}>
          <Typography level="body-lg" sx={{ color: 'white', marginRight: '10px' }}> Ver carrito</Typography>
          <Badge badgeContent={(totalItems > 10 ? "+9":totalItems)} color="danger">
            <ShoppingCartIcon />
          </Badge>
          
        </IconButton>
        <CartModal open={openCart} onClose={() => setOpenCart(false)} />
      </Container>
    </Sheet>
  )
}