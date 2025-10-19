'use client';

import { FC, useState } from 'react';
import { Button, Stack, Snackbar, Alert } from '@mui/material';
import { AlertState, NewUserPayload } from '../../../types';
import { AddUserModal } from './AddUserModal';
import { usersApi } from '../../../lib';
import { useRouter } from 'next/navigation';
import { ActionNotification } from '../action-notification';

export const AddUser: FC = () => {
  const router = useRouter();
  const [openDialog, setOpenDialog] = useState(false);
  const [success, setSuccess] = useState(false);
  const [user, setUser] = useState('');
  const [alert, setAlert] = useState<AlertState | undefined>(undefined);

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
        <ActionNotification
          success={success}
          callbacks={[() => setSuccess(false), () => setAlert(undefined)]}
          successMessage={`Admin ${user} added successfully!`}
          alert={alert}
        />
      )}
    </>
  );
};
