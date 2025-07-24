'use client';

import { Box, Button, FormControl, FormLabel, Input, Textarea } from '@mui/joy';

export default function ContactForm() {
  return (
    <Box
      component="form"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        width: '100%',
        maxWidth: 400,
        p: 2,
      }}
    >
      <FormControl required>
        <FormLabel>Nombre</FormLabel>
        <Input placeholder="Tu nombre" variant="soft" />
      </FormControl>

      <FormControl required>
        <FormLabel>Email</FormLabel>
        <Input type="email" placeholder="Tu correo electrónico" variant="soft" />
      </FormControl>

      <FormControl>
        <FormLabel>País</FormLabel>
        <Input placeholder="¿De qué país nos escribes?" variant="soft" />
      </FormControl>

      <FormControl required>
        <FormLabel>Mensaje</FormLabel>
        <Textarea minRows={3} placeholder="Tu mensaje" variant="soft" />
      </FormControl>

      <Button
        type="submit"
        size="lg"
        variant="solid"
        sx={{
          mt: 1,
          backgroundColor: '#f50086',
          color: 'white',
          fontWeight: 'lg',
          '&:hover': {
            backgroundColor: '#c2185b',
          },
        }}
      >
        Enviar mensaje
      </Button>
    </Box>
  );
}