import Cookies from 'js-cookie';

export const setCookie = (cookieName: string, value: string): void => {
  Cookies.set(cookieName, value, {
    expires: 7,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/'
  });
};
