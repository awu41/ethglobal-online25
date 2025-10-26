import Cookies from 'js-cookie';

const COOKIE_NAME = 'wallet_address';
const EXPIRATION_DAYS = 1;

export const setWalletCookie = (address: string) => {
  Cookies.set(COOKIE_NAME, address, {
    expires: EXPIRATION_DAYS,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
  });
};

export const getWalletCookie = (): string | undefined => {
  return Cookies.get(COOKIE_NAME);
};

export const removeWalletCookie = () => {
  Cookies.remove(COOKIE_NAME);
};
