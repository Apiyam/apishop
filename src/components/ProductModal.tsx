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
}

export default function ProductModal({ open, onClose, product }: QuickViewModalProps) {
  if (!product) return <LoadingIndicator />
  const { name, images, public_price, description, stock } = product
  return (
    <Modal open={open} onClose={onClose}>
      <ModalDialog layout="center" size="lg" sx={{ maxWidth: "800px", width: "90%" }}>
        <ModalClose />

        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
          {/* Imagen */}
          <AspectRatio ratio="1" sx={{ minWidth: 280, flex: 1 }}>
            <img src={images} alt={name} />
          </AspectRatio>

          {/* Detalles */}
          <Sheet variant="plain" sx={{ flex: 2 }}>
            <Typography level="h4">{name}</Typography>
            <Chip color={stock === 0 || stock === null ? 'danger' : 'success'} sx={{ mb: 2 }}>
              {stock} {stock === 1 ? 'disponible' : 'disponibles'}
            </Chip>
            <Typography level="title-lg" sx={{ mb: 2 }}>
              {Number(public_price).toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })}
            </Typography>
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