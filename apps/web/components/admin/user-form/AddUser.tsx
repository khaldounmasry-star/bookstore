'use client';

import { FC, useState } from 'react';
import { Button, Stack, Snackbar, Alert } from '@mui/material';
import { NewUserPayload } from '../../../types';
import { AddUserModal } from './AddUserModal';
import { usersApi } from '../../../lib';
import { useRouter } from 'next/navigation';

export const AddUser: FC = () => {
  const router = useRouter();
  const [openDialog, setOpenDialog] = useState(false);
  const [success, setSuccess] = useState(false);
  const [user, setUser] = useState('');
  const [alert, setAlert] = useState<{ message: string; severity: 'error' | 'success' } | null>(
    null
  );

  const handleAddUser = async (data: NewUserPayload) => {
    const { admin } = await usersApi.createAdmin(data);
    setUser(admin.firstName);
    setSuccess(true);
    router.refresh();
  };

  return (
    <>
      <Stack direction="row" alignItems="center" justifyContent="flex-end" mb={3}>
        <Button variant="contained" color="primary" onClick={() => setOpenDialog(true)}>
          Add User
        </Button>
      </Stack>

      <AddUserModal
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        onSubmit={handleAddUser}
        setAlert={setAlert}
      />

      <Snackbar open={success} autoHideDuration={3000} onClose={() => setSuccess(false)}>
        <Alert severity="success" variant="filled">
          Admin {user} added successfully!
        </Alert>
      </Snackbar>

      {(success || alert) && (
        <Snackbar
          open
          autoHideDuration={3000}
          onClose={() => {
            setSuccess(false);
            setAlert(null);
          }}
        >
          <Alert
            severity={success ? 'success' : (alert?.severity ?? 'info')}
            variant="filled"
            sx={{ mb: 2 }}
          >
            {success ? `Admin ${user} added successfully!` : (alert?.message ?? '')}
          </Alert>
        </Snackbar>
      )}
    </>
  );
};
