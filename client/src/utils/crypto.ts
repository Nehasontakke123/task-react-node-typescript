import CryptoJS from 'crypto-js';

const frontendSecretKey = import.meta.env.VITE_FRONTEND_SECRET_KEY;

if (!frontendSecretKey) {
  throw new Error('VITE_FRONTEND_SECRET_KEY is missing');
}

export const encryptField = (value: string): string => {
  if (value === undefined || value === null) return '';
  return CryptoJS.AES.encrypt(String(value), frontendSecretKey).toString();
};

export const decryptField = (cipherText: string): string => {
  if (!cipherText) return '';
  const bytes = CryptoJS.AES.decrypt(cipherText, frontendSecretKey);
  const decrypted = bytes.toString(CryptoJS.enc.Utf8);

  if (!decrypted) {
    throw new Error('Unable to decrypt frontend field');
  }

  return decrypted;
};

export const encryptPayload = <T>(payload: T): string => {
  return CryptoJS.AES.encrypt(JSON.stringify(payload), frontendSecretKey).toString();
};

export const decryptPayload = <T>(cipherText: string): T => {
  const bytes = CryptoJS.AES.decrypt(cipherText, frontendSecretKey);
  const decrypted = bytes.toString(CryptoJS.enc.Utf8);

  if (!decrypted) {
    throw new Error('Unable to decrypt frontend payload');
  }

  return JSON.parse(decrypted) as T;
};

