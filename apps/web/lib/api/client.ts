import { ApiError } from './error';

export class ApiClient {
  private baseUrl: string;
  private token?: string;

  constructor(config?: { baseUrl?: string; token?: string }) {
    this.baseUrl = config?.baseUrl ?? process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';
    this.token = config?.token;
  }

  async request<T = unknown>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...(this.token ? { Authorization: `Bearer ${this.token}` } : {}),
      ...options.headers
    };

    const res = await fetch(`${this.baseUrl}${endpoint}`, { ...options, headers });

    if (!res.ok) {
      let message: string;
      try {
        const data = await res.json();
        message = data.message || JSON.stringify(data);
      } catch {
        message = await res.text();
      }

      throw new ApiError(res.status, message);
    }

    if (res.status === 204) return {} as T;
    return res.json() as Promise<T>;
  }

  setToken(token?: string) {
    this.token = token;
  }
}

export const apiClient = new ApiClient();
