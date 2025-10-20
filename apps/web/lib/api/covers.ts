import { AddCoverProps } from '../../types';
import { apiClient } from './client';

export const coversApi = {
  addCover: ({ bookId, imageUrl }: AddCoverProps) =>
    apiClient['request'](`/books/${bookId}/covers`, {
      method: 'POST',
      body: JSON.stringify({ imageUrl })
    }),

  updateCover: (coverId: number, data: { imageUrl: string }) =>
    apiClient['request'](`/books/covers/${coverId}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    }),

  deleteCover: (coverId: number) =>
    apiClient['request'](`/books/covers/${coverId}`, { method: 'DELETE' })
};
