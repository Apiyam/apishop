import { Box, Typography, Button, Link } from '@mui/joy';

const products = [
  {
    title: 'Calzón menstrual',
    description: `Siéntete como en cualquier otro día pero con un calzón menstrual reutilizable y cómodo, en un diseño anatómico y con excelente y súper absorción, no altera tus ciclos menstruales y no tendrás fugas. Ir al gym, salir a correr, ir de paseo serán actividades que harás sin temor a tener accidentes.`,
    cta: 'Quiero mi Calzón menstrual',
    img: '/imgs/calzon.png',
    slug: 'calzon-menstrual',
  }
  ,
  
  {
    title: 'Toalla Femenina Regular',
    description: `La tela exterior de nuestras toallas se llama PUL, es ideal ya que es impermeable pero a la vez transpirable, por lo que te mantiene fresca y sin accidentes. En su interior cuentan con capas absorbentes de microfibra, el cual tiene la propiedad de ser sumamente absorbente, antibacterial y no guarda olores. La tela que va en contacto con la piel se mantiene seca y fresca, además de ser sumamente fácil de desmanchar sin necesidad de usar cloro. Cuentan con una forma anatómica que se adapta a tu cuerpo, y traen alas para abrocharlas en tu pantaleta con un botón de poliresina.\n\nPuedes ver que contamos con muchos diseños diferentes, para que elijas la que más te guste:`,
    cta: 'Quiero mi Toalla Regular',
    img: '/imgs/regular.png',
    slug: 'toalla-femenina-regular',
  },
  {
    title: 'Toallas femenina Nocturna',
    description: `La tela exterior de nuestras toallas se llama PUL, es ideal ya que es impermeable pero a la vez transpirable, por lo que te mantiene fresca y sin accidentes. En su interior cuentan con capas absorbentes de microfibra, el cual tiene la propiedad de ser sumamente absorbente, antibacterial y no guarda olores. La tela que va en contacto con la piel se mantiene seca y fresca, además de ser sumamente fácil de desmanchar sin necesidad de usar cloro. Cuentan con una forma anatómica que se adapta a tu cuerpo, y traen alas para abrocharlas en tu pantaleta con un botón de poliresina.\n\n¡Tenemos muchísimos diseños diferentes, puedes elegir el que mas te guste!`,
    cta: 'Quiero mi Toalla Nocturna',
    img: '/imgs/nocturna.png',
    slug: 'toalla-femenina-nocturna',
  },
  {
    title: 'Toalla femenina Teen',
    description: `Nuestras toallas femeninas de tela Regular Teen, son ideales para las niñas que van comenzando con su periodo menstrual, ya que es muy anatómica y muy absorbente, por lo que te mantienen fresca y sin accidentes.\n\nLa tela exterior de nuestras toallas se llama PUL, es ideal ya que es impermeable pero a la vez transpirable. En su interior cuentan con 3 capas absorbentes de microfibra, el cual tiene la propiedad de ser sumamente absorbente, antibacterial y no guarda olores.`,
    cta: 'Quiero mi Toalla Teen',
    img: '/imgs/teen.jpg',
    slug: 'toalla-femenina-teen',
  },
  {
    title: 'Pantiprotector',
    description: `Ideal para los días con poco flujo menstrual, ya sea al principio o final tu ciclo. No pierdas comodidad, y protección con nuestros pantiprotectores. Cuida tu salud, tu bolsillo y el planeta.\n\nPuedes ver que contamos con muchos diseños diferentes, para que elijas la que más te guste.`,
    cta: 'Quiero mi Pantiprotector',
    img: '/imgs/pantiprotector.png',
    slug: 'pantiprotector',
  },
  {
    title: 'Panti Tanga',
    description: `Nuestros Pantis Tanga, son ideales para poco flujo, tus primeros o últimos días de tu periodo o simplemente para uso diario. Cuentan con una forma anatómica que se adapta a tu cuerpo y a tu prenda interior.`,
    cta: 'Quiero mi Panti Tanga',
    img: '/imgs/tanga.png',
    slug: 'pantiprotector-tanga',
  },
  {
    title: 'Wet Bag Sobre',
    description: `Esta bolsita es ideal para llevar tus toallas sanitarias limpias y almacenar las sucias ya que cuentan con un doble cierre. La tela es impermeable así que no saldrá ningún olor ni humedad.\n\nTiene una medida aproximada de 15 × 24 cm. y le caben entre 7 y 9 toallas.`,
    cta: 'Quiero mi Wet Bag',
    img: '/imgs/sobre.png',
    slug: 'sobre',
  },
];

export default function ProductsRow() {
    return (
        <Box sx={{ maxWidth: 1200, mx: 'auto', py: 6, px: 2 }}>
          <Typography level="h3" textAlign="center" sx={{ color: '#d81b60', mb: 6, fontWeight: 'xl' }}>
            ¡Conoce nuestros productos!
          </Typography>
    
          {products.map((product, index) => {
            const isEven = index % 2 === 0;
            return (
              <Box
                key={index}
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
                  gridTemplateRows: { xs: '1fr 1fr', md: '1fr' },
                  gap: 4,
                  alignItems: 'center',
                  bgcolor: isEven ? 'rgba(252, 228, 236, 0.3)' : 'rgba(248, 187, 208, 0.3)',
                  borderRadius: 'md',
                  py: { xs: 2, md: 6 },
                  px: { xs: 0, md: 4 },
                  mb: { xs: 2, md: 4 },
                  direction: isEven ? 'ltr' : 'rtl', // para alternar imagen/texto
                  '& > *': { direction: 'ltr' }, // para que el texto no se invierta
                }}
              >
                <Box
                  sx={{
                    borderRadius: 'md',
                    height: 320,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    fontWeight: 'xl',
                    fontSize: 24,
                    color: '#999',
                  }}
                >
                  <img 
                  src={product.img} 
                  alt={product.title} 
                  width={320} 
                  style={{ maxHeight: '320px', objectFit: 'contain' }} />
                </Box>
    
                <Box p={2}>
                  <Typography level="h4" sx={{ color: '#d81b60', fontWeight: 'xl', mb: 2 }}>
                    {product.title}
                  </Typography>
                  <Typography
                    sx={{ whiteSpace: 'pre-line', mb: 3, color: 'text.tertiary' }}
                    textColor="neutral.700"
                  >
                    {product.description}
                  </Typography>
                  <Link href={`/tienda/${product.slug}`} underline="none">
                    <Button
                      variant="solid"
                      color="primary"
                      sx={{
                        bgcolor: '#d81b60',
                        '&:hover': { bgcolor: '#ad1457' },
                        fontWeight: 'xl',
                      }}
                    >
                      {product.cta}
                    </Button>
                  </Link>
                </Box>
              </Box>
            );
          })}
        </Box>
  );
}