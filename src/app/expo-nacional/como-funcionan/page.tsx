'use client'

import React from 'react'
import { Box, Container, Typography, Button, Divider, Stack } from '@mui/joy'
import Link from 'next/link'

const LUBELLA_ROSE = '#d81b60'
const LUBELLA_PINK = '#e91e8c'
const LUBELLA_ROSE_HOVER = '#ad1649'

export default function EspecialComoFuncionanPage() {
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
          <Typography
            level="h3"
            sx={{
              color: LUBELLA_ROSE,
              fontWeight: 800,
              mb: 1,
              textAlign: 'center',
            }}
          >
            ¿Cómo funcionan los kits especial?
          </Typography>
          <Typography
            level="body-sm"
            sx={{
              color: '#444',
              mb: 3,
              textAlign: 'center',
              lineHeight: 1.6,
            }}
          >
            Elige tu kit según tu flujo, selecciona tus calzones y listo. 15% Expo.
          </Typography>

          <Stack spacing={2.5} component="ol" sx={{ pl: 2.5, listStyle: 'none', counterReset: 'step' }}>
            <Box component="li" sx={{ '&::before': { counterIncrement: 'step', content: 'counter(step) ".- "', fontWeight: 700, color: LUBELLA_ROSE } }}>
              <Typography level="title-md" sx={{ fontWeight: 700, color: LUBELLA_ROSE }}>Elige tu kit</Typography>
              <Typography level="body-sm" sx={{ color: '#555', lineHeight: 1.7 }}>
                Kit Flujo Regular (3 Ligero/Moderado + 2 Moderado/Abundante + 1 detergente) o Kit Flujo Abundante (1 + 4 + 1 detergente). 15% Expo.
              </Typography>
            </Box>
            <Box component="li" sx={{ '&::before': { counterIncrement: 'step', content: 'counter(step) ".- "', fontWeight: 700, color: LUBELLA_ROSE } }}>
              <Typography level="title-md" sx={{ fontWeight: 700, color: LUBELLA_ROSE }}>Ligero / Moderado</Typography>
              <Typography level="body-sm" sx={{ color: '#555', lineHeight: 1.7 }}>
                Selecciona los calzones en esta categoría.
              </Typography>
            </Box>
            <Box component="li" sx={{ '&::before': { counterIncrement: 'step', content: 'counter(step) ".- "', fontWeight: 700, color: LUBELLA_ROSE } }}>
              <Typography level="title-md" sx={{ fontWeight: 700, color: LUBELLA_ROSE }}>Moderado / Abundante</Typography>
              <Typography level="body-sm" sx={{ color: '#555', lineHeight: 1.7 }}>
                Elige tus calzones.
              </Typography>
            </Box>
            <Box component="li" sx={{ '&::before': { counterIncrement: 'step', content: 'counter(step) ".- "', fontWeight: 700, color: LUBELLA_ROSE } }}>
              <Typography level="title-md" sx={{ fontWeight: 700, color: LUBELLA_ROSE }}>Resumen y pago</Typography>
              <Typography level="body-sm" sx={{ color: '#555', lineHeight: 1.7 }}>
                Revisa tu kit (incluye 1 detergente). «Ir a pagar» lo agrega al carrito al precio del kit.
              </Typography>
            </Box>
            <Box component="li" sx={{ '&::before': { counterIncrement: 'step', content: 'counter(step) ".- "', fontWeight: 700, color: LUBELLA_ROSE } }}>
              <Typography level="title-md" sx={{ fontWeight: 700, color: LUBELLA_ROSE }}>Promoción preventa</Typography>
              <Typography level="body-sm" sx={{ color: '#555', lineHeight: 1.7 }}>
              Envío de kits a partir del 30 de marzo. Compra hoy y sé de las primeras en recibir.
              </Typography>
            </Box>
            
          </Stack>

          <Divider sx={{ my: 3, borderColor: LUBELLA_ROSE, opacity: 0.5 }} />

          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Button
              component={Link}
              href="/expo-nacional#kits-lubella"
              variant="solid"
              sx={{
                bgcolor: LUBELLA_PINK,
                color: 'white',
                fontWeight: 700,
                px: 4,
                py: 1.5,
                minHeight: 44,
                textDecoration: 'none',
                '&:hover': { bgcolor: LUBELLA_ROSE_HOVER },
              }}
            >
              ENTENDIDO VER KITS
            </Button>
          </Box>
        </Box>
      </Container>
    </Box>
  )
}
