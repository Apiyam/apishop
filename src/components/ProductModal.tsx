'use client'

import {
  Modal,
  ModalDialog,
  Typography,
  AspectRatio,
  Sheet,
  Box,
  ModalClose,
  Chip,
} from '@mui/joy'
import { ProductItem } from '../lib/wooApi'
import LoadingIndicator from './LoadingIndicator'
import { useState } from 'react'
import QuantitySelector from './QuantitySelector'




type QuickViewModalProps = {
  open: boolean
  onClose: () => void
  product: ProductItem | undefined
  discount: number
}

export default function ProductModal({ open, onClose, product, discount }: QuickViewModalProps) {
  if (!product) return <LoadingIndicator />
  const { name, images, public_price, description, stock } = product
  return (
    <Modal open={open} onClose={onClose}>
      <ModalDialog layout="center" size="lg" sx={{ maxWidth: '800px', width: '90%' }}>
        <ModalClose />
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
          {/* Imagen con globo de descuento */}
          <Box sx={{ position: 'relative', flex: 1 }}>
            {discount > 0 && (
              <Box
                sx={{
                  position: 'absolute',
                  top: 8,
                  left: 8,
                  backgroundColor: '#e8416c',
                  color: '#fff',
                  px: 1.5,
                  py: 0.5,
                  borderRadius: 'md',
                  fontSize: 'sm',
                  fontWeight: 'bold',
                  zIndex: 1,
                }}
              >
                -{discount}%
              </Box>
            )}
            <AspectRatio ratio="1" sx={{ minWidth: 280 }}>
              <img src={images} alt={name} />
            </AspectRatio>
          </Box>

          {/* Detalles del producto */}
          <Sheet variant="plain" sx={{ flex: 2 }}>
            <Typography level="h4">{name}</Typography>

            <Chip color={stock === 0 || stock === null ? 'danger' : 'success'} sx={{ mb: 2 }}>
              {stock} {stock === 1 ? 'disponible' : 'disponibles'}
            </Chip>

            {/* Precios con y sin descuento */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              {discount > 0 && (
                <Typography sx={{ textDecoration: 'line-through', color: 'text.secondary' }}>
                  {Number(public_price).toLocaleString('es-MX', {
                    style: 'currency',
                    currency: 'MXN',
                  })}
                </Typography>
              )}
              <Typography level="title-lg">
                {Number(discount > 0 ? parseFloat(public_price) * (1 - discount / 100) : parseFloat(public_price)).toLocaleString(
                  'es-MX',
                  {
                    style: 'currency',
                    currency: 'MXN',
                  }
                )}
              </Typography>
            </Box>

            <QuantitySelector product={product} />

            <Box overflow="auto" maxHeight="200px">
              <Typography level="body-sm" sx={{ my: 1 }}>
                {description}
              </Typography>
            </Box>
          </Sheet>
        </Box>
      </ModalDialog>
    </Modal>
  )
}