import { apiClient } from './client';
import {
  CreateAdminResponse,
  LoginResponse,
  NewUserPayload,
  SignUpResponse,
  UpdateUserResponse,
  User
} from '../../types';
import { init } from './init';

export const usersApi = {
  register: (data: { firstName: string; lastName: string; email: string; password: string }) =>
    apiClient.request<SignUpResponse>(`/users/register`, {
      method: 'POST',
      body: JSON.stringify(data)
    }),

  login: (data: { email: string; password: string; extended: boolean }) =>
    apiClient.request<LoginResponse>(`/users/login`, {
      method: 'POST',
      body: JSON.stringify(data)
    }),

  fetchUsers: async (): Promise<User[]> => {
    const client = await init();
    return client.request<User[]>(`/users`);
  },

  createAdmin: async (data: NewUserPayload) => {
    const client = await init();
    return client.request<CreateAdminResponse>(`/users/create-admin`, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  updateUser: async (user: User) => {
    const client = await init();
    return client.request<UpdateUserResponse>(`/users/${user.id}`, {
      method: 'PUT',
      body: JSON.stringify(user)
    });
  },

  deleteUser: async (id: number) => {
    const client = await init();
    client.request(`/users/${id}`, { method: 'DELETE' });
  }
};
