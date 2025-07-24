import { Modal, ModalDialog,  Button, Typography, Box } from '@mui/joy';

type ConfirmationModalProps = {
  open: boolean;
  title: string;
  message: string;
  onCancel: () => void;
  onConfirm: () => void;
};

export default function ConfirmationModal({ open, title, message, onCancel, onConfirm }: ConfirmationModalProps) {
  return (
    <Modal open={open} onClose={onCancel}>
      <ModalDialog layout="center" size="lg" sx={{ maxWidth: 1200 }}>
        <Typography level="h2">{title}</Typography>
        <Typography level="body-lg">{message}</Typography>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', marginTop: '20px', gap: '10px' }}>
            <Button fullWidth variant="outlined" onClick={onCancel}>Cancelar</Button>
            <Button fullWidth variant="solid" color="primary" onClick={onConfirm}>Aceptar</Button>
        </Box>
      </ModalDialog>
    </Modal>
  );
}