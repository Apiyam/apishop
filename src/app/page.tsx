'use client';

import {
  Box,
  Typography,
  Button,
  Container,
} from '@mui/material';
import HeroMain from './_components/HeroMain';
import BenefitCards from './_components/BenefitCards';
import BenefitsIcons from './_components/BenefitsIcons';
import ProductsRow from './_components/ProductsRow';
import AboutContact from './_components/AboutContact';
import Footer from './_components/Footer';
import { Link } from '@mui/joy';
import { SEOConfig } from '../components/SEOConfig';

export default function HomePage() {

  return (
    <>
    
    <SEOConfig />
    <Box>
      {/* Hero section */}
      <HeroMain />
      <BenefitCards />
      
      <Box
        sx={{
          backgroundColor: '#7CBB48',
          color: 'white',
          textAlign: 'center',
          py: 6,
        }}
      >
        <Container maxWidth="md">
          <Typography variant="h6">
            Las Toallas Femeninas Lubella están pensadas para apoyar la gestión menstrual,
            el cuidado del cuerpo, el planeta y la economía de las mujeres.
          </Typography>

          <BenefitsIcons />

          <Typography mt={4} fontSize="1.1rem">
            ¡Te van a encantar! Tenemos un tamaño para cada necesidad: pantiprotectores, pantitanga,
            toallas regulares, toallas nocturnas, toallas teen, pero no sólo eso, también tenemos accesorios como
            pañoletas, desmaquillantes y detergente especial para lavar tus toallas.
          </Typography>

          <Link href="/tienda" underline="none">
            <Button
              variant="contained"
              size="large"
              sx={{ mt: 4, backgroundColor: 'white', color: '#f50086', fontWeight: 'bold' }}
            >
              ¿Quieres saber más?
            </Button>
          </Link>
        </Container>
      </Box>
      <ProductsRow />
      <AboutContact />
      <Footer />
    </Box>
    
    </>
  );
}