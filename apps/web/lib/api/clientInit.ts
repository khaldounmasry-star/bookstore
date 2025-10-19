import Cookies from 'js-cookie';
import { ApiClient } from './client';

export const clientInit = () => {
  const token = Cookies.get('token');
  return new ApiClient({ token });
};
