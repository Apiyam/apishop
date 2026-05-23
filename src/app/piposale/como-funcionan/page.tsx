'use client'

import React from 'react'
import { Box, Container, Typography, Button, Divider, Stack } from '@mui/joy'
import Link from 'next/link'
import { PIPOSALE_PACKS, formatPackPrice } from '@/lib/salePack'

const LUBELLA_ROSE = '#d81b60'
const LUBELLA_PINK = '#e91e8c'
const LUBELLA_ROSE_HOVER = '#ad1649'

export default function PiposaleComoFuncionanPage() {
  return (
    <Box sx={{ bgcolor: '#F8F8F8', minHeight: '100vh', color: '#333', py: 6 }}>
      <Container maxWidth="sm">
        <Box
          sx={{
            p: 3,
            borderRadius: 'lg',
            boxShadow: 'lg',
            border: `2px solid ${LUBELLA_ROSE}`,
            background: 'linear-gradient(180deg, #fff 0%, #FCE4EC 100%)',
          }}
        >
          <Typography level="h3" sx={{ color: LUBELLA_ROSE, fontWeight: 800, mb: 1, textAlign: 'center' }}>
            ¿Cómo funcionan los packs Lubella?
          </Typography>
          <Typography level="body-sm" sx={{ color: '#444', mb: 3, textAlign: 'center', lineHeight: 1.6 }}>
            Elige tu pack con 20% de descuento, selecciona tus toallas y pantiprotectores paso a paso, y paga el precio del pack en el carrito.
          </Typography>

          <Stack spacing={2} sx={{ mb: 3 }}>
            {PIPOSALE_PACKS.map((pack) => (
              <Box key={pack.id} sx={{ p: 2, borderRadius: 'md', bgcolor: 'background.surface' }}>
                <Typography level="title-md" sx={{ fontWeight: 700, color: LUBELLA_ROSE }}>
                  {pack.name}
                </Typography>
                <Typography level="body-sm" sx={{ color: '#555', mt: 0.5 }}>
                  {pack.lines.map((l) => `${l.quantity} ${l.label.toLowerCase()}`).join(' · ')} · 1 detergente
                </Typography>
                <Typography level="body-sm" sx={{ fontWeight: 600, color: LUBELLA_PINK, mt: 0.5 }}>
                  ${formatPackPrice(pack.priceOriginal)} → ${formatPackPrice(pack.priceDiscounted)} MXN
                </Typography>
              </Box>
            ))}
          </Stack>

          <Stack spacing={2.5} component="ol" sx={{ pl: 2.5, listStyle: 'none', counterReset: 'step' }}>
            <Box component="li" sx={{ '&::before': { counterIncrement: 'step', content: 'counter(step) ".- "', fontWeight: 700, color: LUBELLA_ROSE } }}>
              <Typography level="title-md" sx={{ fontWeight: 700, color: LUBELLA_ROSE }}>Elige tu pack</Typography>
              <Typography level="body-sm" sx={{ color: '#555', lineHeight: 1.7 }}>
                Pack Ligero, Moderado o Abundante según tu flujo.
              </Typography>
            </Box>
            <Box component="li" sx={{ '&::before': { counterIncrement: 'step', content: 'counter(step) ".- "', fontWeight: 700, color: LUBELLA_ROSE } }}>
              <Typography level="title-md" sx={{ fontWeight: 700, color: LUBELLA_ROSE }}>Selecciona tus productos</Typography>
              <Typography level="body-sm" sx={{ color: '#555', lineHeight: 1.7 }}>
                En cada paso eliges las toallas regulares, nocturnas o pantiprotectores que incluye tu pack.
              </Typography>
            </Box>
            <Box component="li" sx={{ '&::before': { counterIncrement: 'step', content: 'counter(step) ".- "', fontWeight: 700, color: LUBELLA_ROSE } }}>
              <Typography level="title-md" sx={{ fontWeight: 700, color: LUBELLA_ROSE }}>Resumen y pago</Typography>
              <Typography level="body-sm" sx={{ color: '#555', lineHeight: 1.7 }}>
                Revisa tu pack (incluye 1 detergente). «Ir a pagar» lo agrega al carrito al precio con descuento del pack.
              </Typography>
            </Box>
          </Stack>

          <Divider sx={{ my: 3, borderColor: LUBELLA_ROSE, opacity: 0.5 }} />

          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Button
              component={Link}
              href="/piposale#packs-piposale"
              variant="solid"
              sx={{
                bgcolor: LUBELLA_PINK,
                color: 'white',
                fontWeight: 700,
                px: 4,
                textDecoration: 'none',
                '&:hover': { bgcolor: LUBELLA_ROSE_HOVER },
              }}
            >
              Ver packs
            </Button>
          </Box>
        </Box>
      </Container>
    </Box>
  )
}
