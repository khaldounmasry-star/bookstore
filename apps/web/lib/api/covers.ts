import { apiClient } from './client';

export const coversApi = {
  addCovers: (bookId: number, data: { imageUrl?: string; imageUrls?: string[] }) =>
    apiClient['request'](`/books/${bookId}/covers`, {
      method: 'POST',
      body: JSON.stringify(data)
    }),

  updateCover: (coverId: number, data: { imageUrl: string }) =>
    apiClient['request'](`/books/covers/${coverId}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    }),

  deleteCover: (coverId: number) =>
    apiClient['request'](`/books/covers/${coverId}`, { method: 'DELETE' })
};
