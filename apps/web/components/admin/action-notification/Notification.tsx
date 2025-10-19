import { Alert, Snackbar } from '@mui/material';
import { NotificationProps } from '../../../types';

export const ActionNotification = ({
  callbacks,
  success,
  successMessage,
  alert
}: NotificationProps) => {
  if (!success && !alert) return null;

  const handleClose = () => {
    callbacks.forEach(cb => {
      try {
        cb();
      } catch (err) {
        console.error('Notification callback error:', err);
      }
    });
  };

  return (
    <Snackbar open autoHideDuration={3000} onClose={handleClose}>
      <Alert
        severity={success ? 'success' : (alert?.severity ?? 'info')}
        variant="filled"
        sx={{ mb: 2 }}
      >
        {success ? successMessage : (alert?.message ?? '')}
      </Alert>
    </Snackbar>
  );
};
