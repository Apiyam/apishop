'use client'

import React, { useState } from 'react'
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  Stack,
} from '@mui/joy'
import LocalOfferIcon from '@mui/icons-material/LocalOffer'
import Link from 'next/link'
import { LUBELLASALE_PACKS, packContentSummary, formatPackPrice } from '@/lib/salePack'
import SalePackWizard from '@/components/SalePackWizard'
import { HealthAndSafety } from '@mui/icons-material'
import type { SalePack } from '@/lib/salePack'

const ACCENTS = {
  pink: { main: '#e91e8c', hover: '#c41a75' },
  rose: { main: '#d81b60', hover: '#ad1649' },
  green: { main: '#7CBB48', hover: '#6aab3d' },
} as const

const BRAND_GREEN = '#7CBB48'

export default function LubellasalePage() {
  const [wizardPack, setWizardPack] = useState<SalePack | null>(null)

  return (
    <Box sx={{ bgcolor: '#F8F8F8', minHeight: '100vh', color: '#333', pb: { xs: 6, sm: 0 } }}>
      <Box sx={{ bgcolor: '#FCE4EC', py: 3, textAlign: 'center' }}>
        <Container>
          <Typography level="h3" sx={{ fontWeight: 800, color: ACCENTS.rose.main }}>
            Packs Lubella 2026
          </Typography>
          <Typography level="body-md" sx={{ fontWeight: 500, color: '#444', mt: 1.5, maxWidth: 560, mx: 'auto' }}>
            Todos con 20% de descuento Lubella. Elige tu pack, selecciona tus toallas y pantiprotectores, y agrega al carrito.
          </Typography>
          <Box sx={{ textAlign: 'center', mt: 2 }}>
            <Button
              component={Link}
              href="/lubellasale/como-funcionan"
              variant="outlined"
              size="md"
              sx={{
                borderColor: ACCENTS.rose.main,
                color: ACCENTS.rose.main,
                fontWeight: 600,
                textDecoration: 'none',
                '&:hover': { borderColor: ACCENTS.rose.hover, bgcolor: 'rgba(216,27,96,0.06)' },
              }}
            >
              ¿Cómo funcionan los packs?
            </Button>
          </Box>
        </Container>
      </Box>

      <Container sx={{ py: 4 }} id="packs-lubellasale">
        <Typography level="h2" textAlign="center" sx={{ mb: 2, color: ACCENTS.rose.main, fontWeight: 800 }}>
          Escoge tu pack
        </Typography>

        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 4 }}>
          {LUBELLASALE_PACKS.map((pack) => {
            const accent = ACCENTS[pack.color]
            return (
              <Card
                key={pack.id}
                sx={{
                  borderRadius: 'lg',
                  overflow: 'hidden',
                  boxShadow: 'lg',
                  transition: 'all 0.3s ease',
                  '&:hover': { boxShadow: 'xl', transform: 'translateY(-4px)' },
                }}
              >
                <Box
                  component="img"
                  src={pack.image}
                  alt={pack.name}
                  sx={{ width: '100%',  objectFit: 'cover', bgcolor: '#FCE4EC' }}
                />
                <CardContent>
                  <Typography level="h4" sx={{ fontWeight: 700, color: accent.main }}>
                    {pack.name}
                  </Typography>
                  <Typography level="body-sm" sx={{ mt: 1, mb: 2, color: '#444' }}>
                    {packContentSummary(pack)}
                  </Typography>
                  <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2, flexWrap: 'wrap' }}>
                    <LocalOfferIcon sx={{ color: BRAND_GREEN }} />
                    <Typography sx={{ color: ACCENTS.rose.main, fontWeight: 600 }}>
                      <Box component="span" sx={{ textDecoration: 'line-through', color: 'neutral.600', mr: 1 }}>
                        ${formatPackPrice(pack.priceOriginal)} MXN
                      </Box>
                      ${formatPackPrice(pack.priceDiscounted)} MXN (20% descuento)
                    </Typography>
                  </Stack>
                  <Button
                    variant="solid"
                    fullWidth
                    sx={{
                      bgcolor: accent.main,
                      color: 'white',
                      fontWeight: 600,
                      minHeight: 44,
                      '&:hover': { bgcolor: accent.hover },
                    }}
                    onClick={() => setWizardPack(pack)}
                  >
                    Elegir pack
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </Box>
      </Container>

      <Box
        component="footer"
        sx={{
          bgcolor: '#FCE4EC',
          py: 6,
          px: 2,
          textAlign: 'center',
        }}
      >
        <Container maxWidth="sm">
          <HealthAndSafety sx={{ color: ACCENTS.pink.main, fontSize: 48, mb: 1.5 }} />
          <Typography level="h4" sx={{ fontWeight: 600, lineHeight: 1.4 }}>
            Cuidado íntimo sustentable para ti
          </Typography>
          <Typography level="body-sm" sx={{ mt: 1.5, color: '#555' }}>
            Lubella — Empresa 100% mexicana.
          </Typography>
        </Container>
      </Box>

      {wizardPack && (
        <SalePackWizard
          pack={wizardPack}
          campaign="lubellasale"
          open={!!wizardPack}
          onClose={() => setWizardPack(null)}
        />
      )}
    </Box>
  )
}
