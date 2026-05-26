import CryptoJS from 'crypto-js';

export interface StudentPayload {
  fullName: string;
  email: string;
  phoneNumber: string;
  dateOfBirth: string;
  gender: 'Male' | 'Female' | 'Other';
  address: string;
  courseEnrolled: string;
  password?: string;
}

const getFrontendSecret = () => {
  const secret = process.env.FRONTEND_SECRET_KEY;
  if (!secret) throw new Error('FRONTEND_SECRET_KEY is required');
  return secret;
};

const getBackendSecret = () => {
  const secret = process.env.BACKEND_SECRET_KEY;
  if (!secret) throw new Error('BACKEND_SECRET_KEY is required');
  return secret;
};

export const decryptFrontendPayload = <T>(cipherText: string): T => {
  const bytes = CryptoJS.AES.decrypt(cipherText, getFrontendSecret());
  const decrypted = bytes.toString(CryptoJS.enc.Utf8);

  if (!decrypted) {
    throw new Error('Unable to decrypt frontend payload');
  }

  return JSON.parse(decrypted) as T;
};

export const encryptFrontendPayload = <T>(payload: T): string => {
  return CryptoJS.AES.encrypt(JSON.stringify(payload), getFrontendSecret()).toString();
};

export const encryptBackendLayer = (frontendCipherText: string): string => {
  // Stores the frontend AES cipher inside a second backend AES envelope.
  return CryptoJS.AES.encrypt(frontendCipherText, getBackendSecret()).toString();
};

export const decryptBackendLayer = (backendCipherText: string): string => {
  // Fetch flow returns only the inner frontend cipher; the UI performs the final decrypt.
  const bytes = CryptoJS.AES.decrypt(backendCipherText, getBackendSecret());
  const decrypted = bytes.toString(CryptoJS.enc.Utf8);

  if (!decrypted) {
    throw new Error('Unable to decrypt backend payload');
  }

  return decrypted;
};

export const createEmailHash = (email: string): string => {
  return CryptoJS.HmacSHA256(email.trim().toLowerCase(), getBackendSecret()).toString();
};
