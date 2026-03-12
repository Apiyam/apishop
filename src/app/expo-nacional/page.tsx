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
import { LUBELLA_PACKS } from './types'
import LubellaWizard from './LubellaWizard'
import { HealthAndSafety } from '@mui/icons-material'

const LUBELLA_PINK = '#e91e8c'
const LUBELLA_PINK_HOVER = '#c41a75'
const LUBELLA_ROSE = '#d81b60'
const LUBELLA_ROSE_HOVER = '#ad1649'
const BRAND_GREEN = '#7CBB48'

export default function EspecialPage() {
  const [wizardPack, setWizardPack] = useState<(typeof LUBELLA_PACKS)[0] | null>(null)

  return (
    <Box sx={{ bgcolor: '#F8F8F8', minHeight: '100vh', color: '#333', pb: { xs: 6, sm: 0 } }}>
      <Box sx={{ bgcolor: '#FCE4EC', py: 1, textAlign: 'center' }}>
        <Container>
        <img src="/imgs/expo.jpg" alt="Kit Expo 2026" style={{ width: '100%', height: 'auto', maxWidth: '600px', margin: '0 auto' }} />
          <Typography level="h4" sx={{ fontWeight: 600, color: LUBELLA_ROSE }}>
            LUBELLA — Expo Nacional 2026
          </Typography>
          <Typography sx={{ fontWeight: 400, color: '#444', mt: 2 }}>
            Elige tu kit según tu flujo. Incluye calzones y detergente
          </Typography> 
        
          <Box sx={{ textAlign: 'center', mt: 2 }}>
            <Button
              component={Link}
              href="/expo-nacional/como-funcionan"
              variant="outlined"
              size="md"
              sx={{
                borderColor: LUBELLA_ROSE,
                color: LUBELLA_ROSE,
                fontWeight: 600,
                textDecoration: 'none',
                '&:hover': { borderColor: LUBELLA_ROSE_HOVER, bgcolor: 'rgba(216,27,96,0.06)' },
              }}
            >
              ¿Cómo funcionan los kits?
            </Button>
          </Box>
        </Container>
      </Box>

      <Container sx={{ py: 4 }} id="kits-lubella">
        <Typography level="h2" textAlign="center" sx={{ mb: 2, color: LUBELLA_ROSE, fontWeight: 800 }}>
          Escoge tu kit
        </Typography>

        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 4 }}>
          {LUBELLA_PACKS.map((pack) => {
            const isPink = pack.color === 'pink'
            const accent = isPink ? LUBELLA_PINK : LUBELLA_ROSE
            const accentHover = isPink ? LUBELLA_PINK_HOVER : LUBELLA_ROSE_HOVER
            const content = [
              `${pack.ligeroModerado} Ligero / Moderado`,
              `${pack.moderadoAbundante} Moderado / Abundante`,
              '1 Detergente',
              '',
            ].join(' · ')
            return (
              <Box key={pack.id}>
                <Card
                  sx={{
                    borderRadius: 'lg',
                    overflow: 'hidden',
                    boxShadow: 'lg',
                    width: '100%',
                    transition: 'all 0.3s ease',
                    '&:hover': { boxShadow: 'xl', transform: 'translateY(-4px)' },
                  }}
                >
                  <Box
                    component="img"
                    src={pack.image}
                    alt={pack.name}
                    sx={{ width: '100%', height: 400, objectFit: 'cover', bgcolor: '#FCE4EC' }}
                  />
                  <CardContent>
                    <Typography level="h4" sx={{ fontWeight: 700, color: accent }}>
                      {pack.name}
                    </Typography>
                    <Typography level="body-sm" sx={{ mt: 1, mb: 2, color: '#444' }}>
                      {content}
                    </Typography>
                    <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2, flexWrap: 'wrap' }}>
                      <LocalOfferIcon sx={{ color: BRAND_GREEN }} />
                      <Typography sx={{ color: LUBELLA_ROSE, fontWeight: 600 }}>
                        De ${pack.priceOriginal.toLocaleString('es-MX')} → $
                        {pack.priceDiscounted.toLocaleString('es-MX')} (15% Expo)
                      </Typography>
                    </Stack>
                    <Button
                      variant="solid"
                      fullWidth
                      sx={{
                        mt: 1,
                        bgcolor: accent,
                        color: 'white',
                        fontWeight: 600,
                        borderRadius: 'md',
                        minHeight: 44,
                        '&:hover': { bgcolor: accentHover, transform: 'translateY(-2px)' },
                      }}
                      onClick={() => setWizardPack(pack)}
                    >
                      Elegir kit
                    </Button>
                  </CardContent>
                </Card>
              </Box>
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
          color: 'white',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
        }}
      >
        <Container maxWidth="sm" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <HealthAndSafety sx={{ color: LUBELLA_PINK, fontSize: 48, mb: 1.5 }} />
          <Typography level="h4" sx={{ fontWeight: 600, lineHeight: 1.4, maxWidth: 420, mx: 'auto' }}>
            Cuidado íntimo sustentable para ti
          </Typography>
          <Typography level="body-sm" sx={{ opacity: 0.9, mt: 1.5 }}>
            Lubella — Empresa 100% mexicana.
          </Typography>
        </Container>
      </Box>

      {wizardPack && (
        <LubellaWizard
          pack={wizardPack}
          open={!!wizardPack}
          onClose={() => setWizardPack(null)}
        />
      )}
    </Box>
  )
}
