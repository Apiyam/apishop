'use client';
import { Box, Typography, Grid, Card, CardContent, AspectRatio, IconButton } from '@mui/joy';
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import HeatPumpRoundedIcon from '@mui/icons-material/HeatPumpRounded';

const benefits = [
  {
    title: 'Salud',
    icon: <HealthAndSafetyIcon sx={{ fontSize: 40, color: '#d81b60' }} />,
    description: `Las toallas desechables elaboradas con papel, químicos gelatinizantes y plástico son las principales causantes de infecciones vaginales.

Al utilizar Lubella mantienes tu piel seca, fresca y libre de químicos nocivos, reduciendo considerablemente la probabilidad de infección.`,
    image: '/imgs/health.png',
  },
  {
    title: 'Economía',
    icon: <AttachMoneyIcon sx={{ fontSize: 40, color: '#d81b60' }} />,
    description: `Una mujer puede gastar más de $26,000 pesos en toallas desechables en su vida fértil.

Con Lubella solo inviertes alrededor de $2,700 para un paquete completo, ahorrando muchísimo dinero.`,
    image: '/imgs/money.png',
  },
  {
    title: 'Ecología',
    icon: <HeatPumpRoundedIcon sx={{ fontSize: 40, color: '#d81b60' }} />,
    description: `Las toallas desechables tardan más de 300 años en degradarse y usan miles de litros de agua en su fabricación.

Cambia a Lubella, evita toneladas de basura y protege el ambiente.`,
    image: '/imgs/eco.png',
  },
];

export default function BenefitsCardsJoy() {
  return (
    <Box sx={{ py: 8, px: 2, maxWidth: 1200, mx: 'auto' }}>
      <Typography
        level="h2"
        textAlign="center"
        sx={{ color: '#d81b60', fontWeight: 'lg', mb: 6 }}
      >
        Beneficios de usar toallas femeninas Lubella
      </Typography>

      <Grid container spacing={4}>
        {benefits.map(({ title, icon, description, image }, i) => (
          <Grid key={i} xs={12} md={4}>
            <Card
              variant="outlined"
              sx={{
                p: 3,
                borderRadius: 'xl',
                height: '100%',
                boxShadow: 'md',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                '&:hover': {
                  boxShadow: 'lg',
                  transform: 'translateY(-6px)',
                  borderColor: '#d81b60',
                },
              }}
            >
              <Box
                sx={{
                    mb: 2,
                    width: 64,
                    height: 64,
                    display: 'inline-flex', // centrado seguro
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: '#fce4ec',
                    borderRadius: '50%',
                    boxShadow: 'sm',
                    mx: 'auto', // este centra horizontalmente si el contenedor no es flex
                }}
                >
                {icon}
                </Box>
              <CardContent>
                <Typography sx={{ color: '#d81b60' }} level="h4" fontWeight="lg" gutterBottom textAlign="center">
                  {title}
                </Typography>
                <Typography level="body-sm" color="neutral" sx={{ whiteSpace: 'pre-line' }}>
                  {description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}