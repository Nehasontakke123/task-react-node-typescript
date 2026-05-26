import CryptoJS from 'crypto-js';

const frontendSecretKey = import.meta.env.VITE_FRONTEND_SECRET_KEY;

if (!frontendSecretKey) {
  throw new Error('VITE_FRONTEND_SECRET_KEY is missing');
}

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
