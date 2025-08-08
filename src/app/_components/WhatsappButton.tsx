'use client'
import React from 'react'
import { Button } from '@mui/material'
import WhatsAppIcon from '@mui/icons-material/WhatsApp'

const phoneNumber = '+5213315744720'
const message = 'Hola, quiero más información sobre sus productos.'

export default function WhatsappButton() {
  const handleClick = () => {
    const encodedMessage = encodeURIComponent(message)
    const url = `https://wa.me/${phoneNumber}?text=${encodedMessage}`
    window.open(url, '_blank')
  }

  return (
    <Button
      variant="contained"
      startIcon={<WhatsAppIcon />}
      onClick={handleClick}
      sx={{
        position: 'fixed',
        bottom: 16,
        right: 16,
        zIndex: 1000,
        backgroundColor: '#25D366',
        color: 'white',
        '&:hover': {
          backgroundColor: '#1EBE5D',
        },
        textTransform: 'none',
      }}
    >
      Chatea con nosotros
    </Button>
  )
}