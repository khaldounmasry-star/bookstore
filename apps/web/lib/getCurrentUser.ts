'use server';

import { cookies } from 'next/headers';
import { CurrentUser, Role } from '../types';

export const getCurrentUser = async (): Promise<CurrentUser | undefined> => {
  const cookieStore = cookies();
  const role = (await cookieStore).get('role')?.value as Role;
  const token = (await cookieStore).get('token')?.value;

  return role && token ? { token, role } : undefined;
};
