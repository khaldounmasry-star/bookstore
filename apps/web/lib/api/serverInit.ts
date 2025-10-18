'use server';

import { cookies } from 'next/headers';
import { ApiClient } from './client';

export const serverInit = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  return new ApiClient({ token });
};
