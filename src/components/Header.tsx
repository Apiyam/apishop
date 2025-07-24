'use client'

import {
  Sheet,
  Box,
  Typography,
  IconButton,
  Badge,
  Button,
  Container,
  Link,
  Dropdown,
  MenuButton,
  MenuItem,
  Menu,
  ListDivider,
  Divider,
  List,
  ListItem,
  ListItemButton
} from '@mui/joy'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import MenuIcon from '@mui/icons-material/Menu'
import CloseIcon from '@mui/icons-material/Close'
import ExpandMore from '@mui/icons-material/ExpandMore'
import ExpandLess from '@mui/icons-material/ExpandLess'

import CartModal from './CartModal'
import { useEffect, useState } from 'react'
import { useCart } from '../context/CartContext'


const products = [
  {
    type: 'link',
    name: 'Calzón Menstrual',
    href: '/tienda/calzon-menstrual'
  },
  {
    type: 'link',
    name: 'Delantal',
    href: '/tienda/delantal'
  },

  {
    type: 'link',
    name: 'Delantal Kids',
    href: '/tienda/delantal-kids'
  },

  {
    type: 'link',
    name: 'Pañoleta Estampada',
    href: '/tienda/panoleta-estampada'
  },

  {
    type: 'link',
    name: 'Toalla Femenina Nocturna',
    href: '/tienda/toalla-femenina-nocturna'
  },

  {
    type: 'link',
    name: 'Toalla Femenina Regular',
    href: '/tienda/toalla-femenina-regular'
  },


  {
    type: 'link',
    name: 'Toalla Femenina Teen',
    href: '/tienda/toalla-femenina-teen'
  },

  {
    type: 'link',
    name: 'Pantiprotector',
    href: '/tienda/pantiprotector'
  },

  {
    type: 'link',
    name: 'Pantiprotector Tanga',
    href: '/tienda/pantiprotector-tanga'
  },

  {
    type: 'link',
    name: 'Sobre',
    href: '/tienda/sobre'
  },
  {
    type: 'link',
    name: 'Pads desmaquillantes',
    href: '/tienda/pads-desmaquillantes'
  },
  {
    type: 'link',
    name: 'Detergente lubella',
    href: '/tienda/detergente-lubella'
  }
]

export default function Header() {
  const [openCart, setOpenCart] = useState(false)
  const [openMobileMenu, setOpenMobileMenu] = useState(false)
  const [expandProducts, setExpandProducts] = useState(false)
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
    <>
      <Sheet
        variant="solid"
        color="neutral"
        sx={{
          bgcolor: '#e8416c',
          borderBottom: '1px solid rgb(230, 120, 147)',
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
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {/* Menu mobile */}
            <IconButton
              variant="plain"
              sx={{ color: 'white', display: { sm: 'none' } }}
              onClick={() => setOpenMobileMenu(true)}
            >
              <MenuIcon />
            </IconButton>

            {/* Logo */}
            <Link href="/">
              <img src="/imgs/logo.png" alt="Logo" width={120} />
            </Link>
          </Box>

          {/* Navegación desktop */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ display: { xs: 'none', sm: 'flex' }, gap: 2 }}>
              <Link href="/" underline="none">
                <Button variant="plain" sx={{ color: 'white' }}>
                  Inicio
                </Button>
              </Link>

              <Dropdown>
                <MenuButton variant="plain" sx={{ color: 'white' }}>
                  Productos
                </MenuButton>
                <Menu>
                  {products.map((product) => (
                    <MenuItem key={product.name} component="a" href={product.href}>{product.name}</MenuItem>
                  ))}
                </Menu>
              </Dropdown>
            </Box>

            {/* Carrito */}
            <IconButton
              size="sm"
              variant="plain"
              sx={{ color: 'white' }}
              onClick={() => setOpenCart(true)}
            >
              <Typography level="body-lg" sx={{ color: 'white', marginRight: '10px' }}>
                Ver carrito
              </Typography>
              <Badge badgeContent={(totalItems > 10 ? "+9" : totalItems)} color="danger">
                <ShoppingCartIcon />
              </Badge>
            </IconButton>
          </Box>
        </Container>
      </Sheet>

      {/* Mobile menu drawer */}
      <Sheet
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: 280,
          height: '100dvh',
          bgcolor: 'background.surface',
          zIndex: 2000,
          boxShadow: 'lg',
          transform: openMobileMenu ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 0.3s ease-in-out',
        }}
      >
        <Box sx={{ px: 2, py: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography level="title-md">Menú</Typography>
          <IconButton variant="plain" onClick={() => setOpenMobileMenu(false)}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Divider />

        <List sx={{ pl: 1 }}>
          <ListItem>
            <ListItemButton component="a" href="/" onClick={() => setOpenMobileMenu(false)}>
              Inicio
            </ListItemButton>
          </ListItem>
          <ListItem>
            <ListItemButton onClick={() => setExpandProducts(!expandProducts)}>
              Productos
              {expandProducts ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
          </ListItem>
          {expandProducts && (
            <>
              
                {products.map((product) => (
                  <ListItem sx={{ pl: 4 }}>
                  <ListItemButton key={product.name} component="a" href={product.href} onClick={() => setOpenMobileMenu(false)}>
                    {product.name}
                  </ListItemButton>
                </ListItem>
              ))}



            </>
          )}
        </List>
      </Sheet>

      <CartModal open={openCart} onClose={() => setOpenCart(false)} />
    </>
  )
}