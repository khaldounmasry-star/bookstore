'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { booksApi } from '../lib';
import type { Book, AlertState } from '../types';

export const useBookDeletion = () => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [alert, setAlert] = useState<AlertState | undefined>(undefined);

  const router = useRouter();

  const openConfirmDialog = (book: Book) => {
    setSelectedBook(book);
    setConfirmOpen(true);
  };

  const closeConfirmDialog = () => {
    setConfirmOpen(false);
  };

  const handleConfirmDelete = async () => {
    if (!selectedBook) return;
    setLoading(true);
    try {
      await booksApi.deleteBook(Number(selectedBook.id));
      setTimeout(() => {
        setSuccess(true);
        router.refresh();
      }, 400);
    } catch (err) {
      console.error('Delete error:', err);
      setAlert({
        severity: 'error',
        message: 'Failed to delete book. Please try again later.'
      });
    } finally {
      setLoading(false);
      closeConfirmDialog();
    }
  };

  const resetNotificationsCallbacks = () => [
    () => setSuccess(false),
    () => setSelectedBook(null),
    () => setAlert(undefined)
  ];

  return {
    loading,
    success,
    alert,
    confirmOpen,
    selectedBook,
    openConfirmDialog,
    closeConfirmDialog,
    handleConfirmDelete,
    resetNotificationsCallbacks
  };
};
