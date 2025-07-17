'use client'
import { Box, CircularProgress, LinearProgress, Typography } from "@mui/joy";
type LoadingIndicatorProps = {
    isFullScreen?: boolean
}
export default function LoadingIndicator({ isFullScreen = false }: LoadingIndicatorProps) {
    return (
        <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', height: isFullScreen ? '100vh' : '100%' }}>
            <CircularProgress color="primary" size="sm" />
            <Typography level="body-md" sx={{ ml: 2 }}>Cargando contenido...</Typography>
        </Box >
    )
}
