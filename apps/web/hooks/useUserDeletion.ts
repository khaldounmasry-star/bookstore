'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { usersApi } from '../lib';
import { AlertState, User } from '../types';

export const useUserDeletion = () => {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [alert, setAlert] = useState<AlertState | undefined>();
  const router = useRouter();

  const openConfirmDialog = (user: User) => {
    setSelectedUser(user);
    setConfirmOpen(true);
  };

  const closeConfirmDialog = () => setConfirmOpen(false);

  const handleConfirmDelete = async () => {
    if (!selectedUser) return;
    setLoading(true);
    try {
      await usersApi.deleteUser(Number(selectedUser.id));
      // Add short delay to avoid stale cached SSR fetch
      setTimeout(() => {
        setSuccess(true);
        router.refresh();
      }, 400);
    } catch (err) {
      console.error('Delete error:', err);
      setAlert({ severity: 'error', message: 'Failed to delete user.' });
    } finally {
      setLoading(false);
      closeConfirmDialog();
    }
  };

  const resetDeleteNotifications = () => [
    () => setSuccess(false),
    () => setAlert(undefined),
    () => setSelectedUser(null)
  ];

  return {
    confirmOpen,
    selectedUser,
    loading,
    success,
    alert,
    openConfirmDialog,
    closeConfirmDialog,
    handleConfirmDelete,
    resetDeleteNotifications
  };
};
