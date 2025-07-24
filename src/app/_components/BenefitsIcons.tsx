'use client';

import { Box } from '@mui/joy';
import Container from '@mui/joy/Container';
import Typography from '@mui/joy/Typography';
import Grid from '@mui/joy/Grid';
import Card from '@mui/joy/Card';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AirIcon from '@mui/icons-material/Air';
import OpacityIcon from '@mui/icons-material/Opacity';
import LocalLaundryServiceIcon from '@mui/icons-material/LocalLaundryService';
import HealingIcon from '@mui/icons-material/Healing';
import FavoriteIcon from '@mui/icons-material/Favorite';

const benefitsList = [
  { icon: <CheckCircleIcon />, text: 'Son muy cómodas.' },
  { icon: <AirIcon />, text: 'No causan malos olores.' },
  { icon: <OpacityIcon />, text: 'Absorben sin que se derrame.' },
  { icon: <LocalLaundryServiceIcon />, text: 'Se lavan fácil y duran años.' },
  { icon: <HealingIcon />, text: 'No causan irritación.' },
  { icon: <FavoriteIcon />, text: 'Son lindas y femeninas.' },
];

export default function BenefitsIcons() {
  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Typography
        level="h3"
        textAlign="center"
        mb={4}
        fontWeight="lg"
        sx={{ color: 'white' }}
      >
        ¿Por qué elegir Lubella?
      </Typography>

      <Grid container spacing={3}>
        {benefitsList.map(({ icon, text }, i) => (
          <Grid key={i} xs={12} sm={4}>
            <Card
              variant="soft"
              sx={{
                display: 'flex',
                alignItems: 'center',
                color: '#d81b60',
                gap: 2,
                p: 2,
                borderRadius: 'lg',
                transition: 'transform 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 'md',
                },
              }}
            >
              <Box
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 32,
                }}
              >
                {icon}
              </Box>
              <Typography level="body-md">{text}</Typography>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}