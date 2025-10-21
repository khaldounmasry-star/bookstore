'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { usersApi } from '../lib';
import { AlertState, NewUserPayload } from '../types';

export const useUserAddition = () => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [alert, setAlert] = useState<AlertState | undefined>();
  const [createdName, setCreatedName] = useState('');
  const router = useRouter();

  const handleAddUser = async (data: NewUserPayload) => {
    setLoading(true);
    try {
      const { admin } = await usersApi.createAdmin(data);
      setCreatedName(admin.firstName);
      setSuccess(true);
      router.refresh();
    } catch (err) {
      console.error('Add user failed:', err);
      setAlert({ severity: 'error', message: 'Failed to add user.' });
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  const resetAddNotifications = () => [() => setSuccess(false), () => setAlert(undefined)];

  return {
    open,
    loading,
    success,
    alert,
    createdName,
    setOpen,
    setAlert,
    handleAddUser,
    resetAddNotifications
  };
};
