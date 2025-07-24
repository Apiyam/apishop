import React from 'react';
import { Alert, Snackbar, useTheme } from '@mui/material';

type NotificationProps = {
  message: string;
  open: boolean;
  onClose: () => void;
};

export default function Notification({ message, open, onClose }: NotificationProps) {
  const theme = useTheme();

  const handleClose = (event: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') return;
    onClose();
  };

  return (
    <Snackbar
      open={open}
      autoHideDuration={3000}
      onClose={handleClose}
      message={message}
      
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      sx={{
        '& .MuiSnackbarContent-root': {
          zIndex: theme.zIndex.modal + 9999,
          padding: '10px',
          fontSize: '14px',
          width: '200px',
          textAlign: 'center',
          position: 'relative',
          top: '10px',
          right: '10px',
        },
      }}
    >
       <Alert
        onClose={handleClose}
        severity="success"
        sx={{ width: '100%' }}
        variant="filled" // o "standard"
      >
        {message}
      </Alert>
    </Snackbar>
  );
}