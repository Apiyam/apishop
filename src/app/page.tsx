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

export default function HomePage() {

  return (
    <>
    <Box>
      {/* Hero section */}
      
      <HeroMain />
      <Box id="section-calzon-menstruals" component="section">
        <BenefitCards />
      </Box>
      
      <Box
        id="section-toallas"
        component="section"
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

          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, justifyContent: 'center', mt: 4, flexWrap: 'wrap' }}>
            <Link href="/tienda" underline="none">
              <Button
                variant="contained"
                size="large"
                sx={{ backgroundColor: 'white', color: '#f50086', fontWeight: 'bold', width: { xs: '100%', sm: 'auto' } }}
              >
                ¿Quieres saber más?
              </Button>
            </Link>
            <Link href="/especial" underline="none">
              <Button
                variant="outlined"
                size="large"
                sx={{ borderColor: '#f50086', color: '#f50086', fontWeight: 'bold', width: { xs: '100%', sm: 'auto' } }}
              >
                Kits especial
              </Button>
            </Link>
          </Box>
        </Container>
      </Box>
      <ProductsRow />
      <AboutContact />
      <Footer />
    </Box>
    
    </>
  );
}