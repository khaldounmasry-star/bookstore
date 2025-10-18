import Cookies from 'js-cookie';

export const setCookie = (apiToken: string): void => {
  Cookies.set('token', apiToken, {
    expires: 7,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/'
  });
};
