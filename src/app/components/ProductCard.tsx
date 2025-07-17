import { Card, Typography, AspectRatio, Chip, Box, Button } from '@mui/joy'
import { ProductItem } from '../lib/wooApi'
import ProductActions from './ProductActions'
import { useState } from 'react'
import ProductModal from './ProductModal'

type ProductCardProps = {
  product: ProductItem
  viewMode: 'grid' | 'list'
}

export default function ProductCard({ product, viewMode }: ProductCardProps) {
  const { name, images, public_price, stock, description } = product
  const [open, setOpen] = useState(false)

  if (viewMode === 'list') {
    return (
      <Box sx={{ width: '100%' }}>
        <Card
          variant="outlined"
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            gap: 2,
            width: '100%',
            p: 2,
            alignItems: 'flex-start',
          }}
        >
          <AspectRatio
            ratio="1"
            sx={{ width: { xs: '100%', sm: 120 }, flexShrink: 0, borderRadius: 'md' }}
          >
            <img src={images} alt={name} loading="lazy" />
          </AspectRatio>

          <Box sx={{ flexGrow: 1 }}>
            <Typography level="title-md">{name}</Typography>
            <Typography level="body-sm" sx={{ my: 1 }}>
              {description}
            </Typography>
            <Chip
              variant="solid"
              color={stock > 0 ? 'success' : 'danger'}
              size="sm"
              sx={{ mb: 1 }}
            >
              {stock} {stock === 1 ? 'disponible' : 'disponibles'}
            </Chip>
            <Typography fontWeight="lg">
              {Number(public_price).toLocaleString('es-MX', {
                style: 'currency',
                currency: 'MXN',
              })}
            </Typography>
            <Box sx={{ mt: 1 }}>
              <ProductActions onViewDetails={() => setOpen(true)} product={product} overrideActions />
            </Box>
          </Box>
        </Card>

        <ProductModal open={open} onClose={() => setOpen(false)} product={product} />
      </Box>
    )
  }else{
    return (
      <Card sx={{ width: { xs: '100%', sm: 250 } }} variant="outlined">
        <div>
          <Typography level="title-lg" sx={{ mb: 1 }}>{name}</Typography>
          <Chip variant="solid" color={stock > 0 ? 'success' : 'danger'} size="sm">
            {stock} {stock === 1 ? 'disponible' : 'disponibles'}
          </Chip>
        </div>
        <AspectRatio minHeight="120px" maxHeight="200px">
          <img src={images} loading="lazy" alt={name} />
        </AspectRatio>
        <div>
          <Typography level="body-xs">Precio:</Typography>
          <Typography sx={{ fontSize: 'lg', fontWeight: 'lg' }}>
            {Number(public_price).toLocaleString('es-MX', {
              style: 'currency',
              currency: 'MXN',
            })}
          </Typography>
        </div>
        <ProductActions onViewDetails={() => setOpen(true)} product={product} />
        <ProductModal open={open} onClose={() => setOpen(false)} product={product} />
      </Card>
    )
  }
  
}