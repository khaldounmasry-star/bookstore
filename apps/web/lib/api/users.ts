import { apiClient } from './client';
import { LoginResponse, SignUpResponse, User } from '../../types';
import { init } from './init';

export const usersApi = {
  register: (data: { firstName: string; lastName: string; email: string; password: string }) =>
    apiClient.request<SignUpResponse>(`/users/register`, {
      method: 'POST',
      body: JSON.stringify(data)
    }),

  login: (data: { email: string; password: string }) =>
    apiClient.request<LoginResponse>(`/users/login`, {
      method: 'POST',
      body: JSON.stringify(data)
    }),

  fetchUsers: async (): Promise<User[]> => {
    const client = await init();
    return client.request<User[]>(`/users`);
  },

  createAdmin: (data: Record<string, unknown>) =>
    apiClient.request(`/users/create-admin`, { method: 'POST', body: JSON.stringify(data) }),

  deleteUser: (id: number) => apiClient.request(`/users/${id}`, { method: 'DELETE' })
};
