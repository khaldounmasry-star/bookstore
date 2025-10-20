'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AlertState, Cover } from '../types';
import { coversApi, isValidImageUrl } from '../lib';

export const useCoverUpdate = (setCovers: React.Dispatch<React.SetStateAction<Cover[]>>) => {
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [alert, setAlert] = useState<AlertState | undefined>();
  const [success, setSuccess] = useState(false);
  const [invalidMap, setInvalidMap] = useState<Record<number, string>>({});
  const router = useRouter();

  const handleImageChange = (coverId: number, newUrl: string) => {
    setCovers(prev => prev.map(c => (c.id === coverId ? { ...c, imageUrl: newUrl } : c)));
    setInvalidMap(prev => ({ ...prev, [coverId]: '' }));
  };

  const handleUpdate = async (cover: Cover) => {
    setUpdatingId(cover.id);
    const isValid = isValidImageUrl(cover.imageUrl);

    if (!isValid) {
      setInvalidMap(prev => ({
        ...prev,
        [cover.id]: 'Please enter a valid image URL'
      }));
      setUpdatingId(null);
      return;
    }

    try {
      await coversApi.updateCover(cover.id, { imageUrl: cover.imageUrl });
      setSuccess(true);
      router.refresh();
    } catch (err) {
      console.error('Update failed:', err);
      setAlert({
        severity: 'error',
        message: 'Failed to update cover.'
      });
    } finally {
      setUpdatingId(null);
    }
  };

  const resetUpdateNotifications = () => [() => setAlert(undefined), () => setSuccess(false)];

  return {
    updatingId,
    handleImageChange,
    handleUpdate,
    alert,
    success,
    invalidMap,
    resetUpdateNotifications
  };
};
