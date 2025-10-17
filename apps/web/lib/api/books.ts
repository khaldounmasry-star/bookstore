import { apiClient } from './client';
import { Book, FilterResults } from '../../types';

export const booksApi = {
  fetchBooks: (): Promise<Book[]> => apiClient.request<Book[]>(`/books`),

  searchBooks: (params: { q: string; limit?: number; offset?: number }): Promise<Book[]> => {
    const query = new URLSearchParams(
      Object.entries(params).map(([k, v]) => [k, String(v)])
    ).toString();

    return apiClient.request<Book[]>(`/books/search?${query}`);
  },

  filterBooks: (params: {
    genre?: string;
    sort?: string;
    order?: string;
    limit?: number;
    offset?: number;
  }) => {
    const query = new URLSearchParams(params as Record<string, string>).toString();
    return apiClient.request<FilterResults>(`/books/filter?${query}`);
  },

  getBook: (id: number) => apiClient.request<Book>(`/books/${id}`),

  createBook: (data: Record<string, unknown>) =>
    apiClient.request<Book>(`/books`, { method: 'POST', body: JSON.stringify(data) }),

  updateBook: (id: number, data: Record<string, unknown>) =>
    apiClient.request<Book>(`/books/${id}`, { method: 'PUT', body: JSON.stringify(data) }),

  deleteBook: (id: number) => apiClient.request<void>(`/books/${id}`, { method: 'DELETE' })
};
