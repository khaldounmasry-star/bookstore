import { apiClient } from './client';
import { LoginResponse, SignUpResponse } from '../../types';

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

  createAdmin: (data: Record<string, unknown>) =>
    apiClient.request(`/users/create-admin`, { method: 'POST', body: JSON.stringify(data) }),

  deleteUser: (id: number) => apiClient.request(`/users/${id}`, { method: 'DELETE' })
};
