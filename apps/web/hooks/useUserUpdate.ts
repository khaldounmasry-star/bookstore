'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { usersApi } from '../lib';
import { AlertState, User } from '../types';

export const useUserUpdate = () => {
  const [editOpen, setEditOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [success, setSuccess] = useState(false);
  const [alert, setAlert] = useState<AlertState | undefined>();
  const router = useRouter();

  const openUpdateDialog = (user: User) => {
    setSelectedUser(user);
    setEditOpen(true);
  };

  const closeUpdateDialog = () => setEditOpen(false);

  const handleUpdateUser = async (data: User) => {
    try {
      const { user } = await usersApi.updateUser(data);
      setSelectedUser(user);
      setSuccess(true);
      router.refresh();
    } catch (err) {
      console.error('Update user failed:', err);
      setAlert({ severity: 'error', message: 'Failed to update user.' });
    }
  };

  const resetUpdateNotifications = () => [
    () => setAlert(undefined),
    () => setSuccess(false),
    () => setSelectedUser(null)
  ];

  return {
    editOpen,
    selectedUser,
    success,
    alert,
    openUpdateDialog,
    closeUpdateDialog,
    handleUpdateUser,
    resetUpdateNotifications,
    setAlert
  };
};
