import { Box,  Typography } from "@mui/joy";


export default function Footer() {
    return (
        <Box sx={{ bgcolor: '#d81b60', width: '100%', display: 'flex', justifyContent: 'center', mt: 4, flexDirection: 'column', gap: 2, py: 4 }}>
    <img style={{ margin: '0 auto' }} src="/imgs/logo.png" alt="Lubella" width={320} />
    <Typography
      textAlign="center"
      sx={{ mt: 6, mb: 2, color: 'white' }}
    >
      Lubella es parte de la Gran Familia Ecopipo
    </Typography>
    <Typography
      textAlign="center"
      sx={{ color: 'white', fontWeight: 'lg' }}
    >
      Ama tu cuerpo, cuida el planeta.
    </Typography>
    <Typography
      textAlign="center"
      sx={{ mt: 4, color: 'white' }}
    >
      Lubella ® – Todos los Derechos Reservados {new Date().getFullYear()}
    </Typography>
    </Box>
    )
}