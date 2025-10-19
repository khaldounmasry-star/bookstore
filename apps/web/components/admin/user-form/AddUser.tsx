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

  const handleAddUser = async (data: NewUserPayload) => {
    try {
      const { admin } = await usersApi.createAdmin(data);
      setUser(admin.firstName);
      setSuccess(true);
      router.refresh();
    } catch (err) {
      console.error(err);
    }
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
      />

      <Snackbar open={success} autoHideDuration={3000} onClose={() => setSuccess(false)}>
        <Alert severity="success" variant="filled">
          Admin {user} added successfully!
        </Alert>
      </Snackbar>
    </>
  );
};
