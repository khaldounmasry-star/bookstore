import { apiClient } from './client';
import { serverInit } from './serverInit';

export const init = async () => {
  return typeof window === 'undefined' ? serverInit() : apiClient;
};
