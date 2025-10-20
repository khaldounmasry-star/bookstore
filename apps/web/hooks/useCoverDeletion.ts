'use client';

import { useState } from 'react';
import { AlertState, Cover } from '../types';
import { coversApi } from '../lib';

export const useCoverDeletion = (setCovers: React.Dispatch<React.SetStateAction<Cover[]>>) => {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedCover, setSelectedCover] = useState<Cover | null>(null);
  const [loading, setLoading] = useState(false);
  const [successDelete, setSuccessDelete] = useState(false);
  const [alertDelete, setAlertDelete] = useState<AlertState | undefined>();

  const openConfirmDialog = (cover: Cover) => {
    setSelectedCover(cover);
    setConfirmOpen(true);
  };

  const closeConfirmDialog = () => {
    setConfirmOpen(false);
  };

  const handleConfirmDelete = async () => {
    if (!selectedCover) return;
    setLoading(true);
    try {
      await coversApi.deleteCover(selectedCover.id);
      setCovers(prev => prev.filter(c => c.id !== selectedCover.id));
      setSuccessDelete(true);
    } catch (err) {
      console.error('Delete failed:', err);
      setAlertDelete({
        severity: 'error',
        message: 'Failed to delete cover. Please try again.'
      });
    } finally {
      setLoading(false);
      closeConfirmDialog();
    }
  };

  const resetDeleteNotifications = () => [
    () => setAlertDelete(undefined),
    () => setSuccessDelete(false),
    () => setSelectedCover(null)
  ];

  return {
    confirmOpen,
    loading,
    selectedCover,
    successDelete,
    alertDelete,
    openConfirmDialog,
    closeConfirmDialog,
    handleConfirmDelete,
    resetDeleteNotifications
  };
};
