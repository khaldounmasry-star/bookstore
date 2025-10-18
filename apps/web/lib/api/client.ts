import { ApiError } from './error';
import { ValidationIssue } from '../../types';

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
      let message = `HTTP ${res.status}`;
      let issues: ValidationIssue[] | undefined;

      try {
        const data = await res.json();
        if (data.error === 'ValidationError' && Array.isArray(data.issues)) {
          message = data.error;
          issues = data.issues;
        } else if (data.message) {
          message = data.message;
        } else if (typeof data === 'string') {
          message = data;
        } else {
          message = JSON.stringify(data);
        }
      } catch {
        message = await res.text();
      }

      throw new ApiError(res.status, message, issues);
    }

    if (res.status === 204) return {} as T;
    return res.json() as Promise<T>;
  }

  setToken(token?: string) {
    this.token = token;
  }
}

export const apiClient = new ApiClient();
