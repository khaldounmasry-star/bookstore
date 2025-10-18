import { Book, FilterResults } from '../../types';
import { init } from './init';

export const booksApi = {
  fetchBooks: async (): Promise<Book[]> => {
    const client = await init();
    return client.request<Book[]>(`/books`);
  },

  searchBooks: async (params: { q: string; limit?: number; offset?: number }): Promise<Book[]> => {
    const query = new URLSearchParams(
      Object.entries(params).map(([k, v]) => [k, String(v)])
    ).toString();

    const client = await init();
    return client.request<Book[]>(`/books/search?${query}`);
  },

  filterBooks: async (params: {
    genre?: string;
    sort?: string;
    order?: string;
    limit?: number;
    offset?: number;
  }) => {
    const client = await init();
    const query = new URLSearchParams(params as Record<string, string>).toString();
    return client.request<FilterResults>(`/books/filter?${query}`);
  },

  getBook: async (id: number) => {
    const client = await init();
    return client.request<Book>(`/books/${id}`);
  },

  createBook: async (data: Record<string, unknown>) => {
    const client = await init();
    return client.request<Book>(`/books`, { method: 'POST', body: JSON.stringify(data) });
  },

  updateBook: async (id: number, data: Record<string, unknown>) => {
    const client = await init();
    return client.request<Book>(`/books/${id}`, { method: 'PUT', body: JSON.stringify(data) });
  },

  deleteBook: async (id: number) => {
    const client = await init();
    return client.request<void>(`/books/${id}`, { method: 'DELETE' });
  }
};
