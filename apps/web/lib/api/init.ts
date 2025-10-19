import { clientInit } from './clientInit';
import { serverInit } from './serverInit';

export const init = async () => {
  return typeof window === 'undefined' ? serverInit() : clientInit();
};
