'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { coversApi, isValidImageUrl } from '../lib';
import { AlertState } from '../types';

export const useCoverAddition = (bookId: number | '') => {
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState<AlertState | undefined>();
  const [success, setSuccess] = useState(false);
  const [invalid, setInvalid] = useState('');
  const router = useRouter();

  const handleAdd = async () => {
    if (!bookId) {
      setAlert({ severity: 'error', message: 'Please select a book first.' });
      return;
    }

    if (!isValidImageUrl(imageUrl)) {
      setInvalid('Please enter a valid image URL.');
      return;
    }

    setLoading(true);
    try {
      await coversApi.addCover({
        bookId: Number(bookId),
        imageUrl
      });

      setSuccess(true);
      setImageUrl('');
      router.refresh();
    } catch (err) {
      console.error('Failed to add cover:', err);
      setAlert({ severity: 'error', message: 'Failed to add cover. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const resetNotifications = () => {
    setAlert(undefined);
    setSuccess(false);
    setInvalid('');
  };

  return {
    imageUrl,
    setImageUrl,
    loading,
    alert,
    success,
    invalid,
    handleAdd,
    resetNotifications
  };
};
