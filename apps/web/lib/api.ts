export const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export async function fetcher<T>(url: string): Promise<T> {
  const res = await fetch(`${API_BASE}${url}`, {
    headers: { Accept: 'application/json' },
  });
  if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);
  return res.json();
}
