import React from 'react';
import {
  Box,
  Typography,
  Input,
  Textarea,
  Button,
  Sheet,
  FormControl,
  FormLabel,
  Card,
  CardContent,
} from '@mui/joy';
import { CheckCircleRounded } from '@mui/icons-material';
import ContactForm from './ContactForm';

const materials = [
    {
      title: 'PUL',
      description:
        'Esta es la tela exterior de tus toallas Lubella es la que tiene los diferentes y hermosos estampados, esta tela PUL usada también en los pañales Ecopipo es un Poliéster laminado con Poliuretano, este laminado a diferencia del plástico es impermeable pero a la vez transpirable, de esta manera tu piel siempre estará fresca y libre de infecciones y tu estarás protegida contra derrames. Todas nuestras toallas cuentan con esta tela.',
    },
    {
      title: 'Microfibra',
      description:
        'Tela interior absorbente. Como lo dice su nombre contiene miles de micro fibras que atrapan los líquidos rápidamente, absorbiendo 7 veces su peso en agua, no contiene químicos gelatinizantes así que estarás libre de químicos dañinos para tu piel.',
    },
    {
      title: 'Microfleece',
      description:
        'Esta es la tela que queda en contacto con tu piel, es super suave, hipoalergénica y tiene la maravillosa característica de permitir que los líquidos entren al interior de la toalla y en cuestión de segundo nuevamente se sienta seca, de ahí que muchos la llaman tela efecto siempre seco, usando la misma tecnología que tiene la ropa deportiva que aísla el sudor de la piel, esta tela te mantendrá fresca y seca, ademas es mucho mas fácil de desmanchar a diferencia del algodón que se usaba en las compresas de antes, basta lavar y colocar unos minutos al sol y las manchas desaparecerán.',
    },
  ];

export default function AboutContact() {
  return (
    <Box
      sx={{
        maxWidth: 1200,
        mx: 'auto',
        py: 8,
        px: 3,
        display: 'flex',
        flexDirection: 'column',
        gap: 6,
      }}
    >
        <Typography level="h3" textAlign="center" sx={{ color: '#d81b60', mb: 6, fontWeight: 'xl' }}>
            ¿De qué están hechas las toallas Lubella?
        </Typography>
       <Box
      sx={{
        maxWidth: 1200,
        mx: 'auto',
        px: 3,
        display: 'flex',
        gap: 4,
        flexDirection: { xs: 'column', md: 'row' },
      }}
    >
        
      {materials.map(({ title, description }) => (
        <Card
          key={title}
          variant="outlined"
          sx={{
            flex: 1,
            borderRadius: 'xl',
            boxShadow: 'md',
            borderColor: '#d81b60',
            borderWidth: 2,
            bgcolor: 'background.surface',
            transition: 'transform 0.3s ease',
            '&:hover': {
              transform: 'scale(1.05)',
              boxShadow: 'lg',
              borderColor: '#ad1457',
            },
            cursor: 'pointer',
          }}
        >
          <CardContent>
            <Typography
              level="h4"
              component="h2"
              sx={{ color: '#d81b60', fontWeight: 'xl', mb: 2, display: 'flex', alignItems: 'center', gap: 2 }}
            > 
              <CheckCircleRounded sx={{ fontSize: 24, color: '#d81b60' }} />
              {title}
            </Typography>
            <Typography level="body-sm" sx={{ color: 'text.secondary', whiteSpace: 'normal' }}>
              {description}
            </Typography>
          </CardContent>
        </Card>
      ))}
    </Box>
    <Typography
        level="h4"
        fontWeight="xl"
        sx={{ color: '#d81b60', mb: 2, textAlign: 'center' }}
      >
        ¿Tienes dudas? ¡Estamos para ti!
      </Typography>

      <Box
        sx={{
          bgcolor: 'background.surface',
          borderRadius: 'md',
          boxShadow: 'sm',
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          gap: 4,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Box
          sx={{
            maxWidth: 320,
            width: '100%',
            borderRadius: 'lg',
            overflow: 'hidden',
            boxShadow: 'md',
          }}
        >
          <img src="/imgs/contact.jpg" alt="Lubella contacto" style={{ width: '100%', display: 'block' }} />
        </Box>

        <ContactForm />
      </Box>

      {/* Footer */}
      
    </Box>
  );
}