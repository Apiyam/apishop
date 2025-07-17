'use client'
import { Box, CircularProgress, LinearProgress, Typography } from "@mui/joy";

export default function LoadingIndicator() {
    return (
        <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
            <CircularProgress color="primary" size="sm" />
            <Typography level="body-md" sx={{ ml: 2 }}>Cargando contenido...</Typography>
        </Box>
    )
}
