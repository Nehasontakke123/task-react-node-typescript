export type Gender = 'Male' | 'Female' | 'Other';

export interface StudentFormValues {
  fullName: string;
  email: string;
  phoneNumber: string;
  dateOfBirth: string;
  gender: Gender;
  address: string;
  courseEnrolled: string;
  password: string;
  confirmPassword?: string;
}

export interface Student {
  _id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  dateOfBirth: string;
  gender: Gender;
  address: string;
  courseEnrolled: string;
  createdAt: string;
  updatedAt: string;
}

export interface EncryptedStudent {
  _id: string;
  payload: string;
  createdAt: string;
  updatedAt: string;
}

export interface LatestStudent {
  _id: string;
  fullName: string;
  courseEnrolled: string;
  createdAt: string;
}

export interface LandingStats {
  totalStudents: number;
  activeCourses: number;
  registeredToday: number;
  encryptionLayers: number;
}

export interface AuthUser {
  id: string;
  email: string;
  fullName: string;
}
