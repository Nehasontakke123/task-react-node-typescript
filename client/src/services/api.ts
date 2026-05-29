import axios from 'axios';
import type { LandingStats, LatestStudent } from '../types';

interface LatestStudentsResponse {
  students: LatestStudent[];
  stats: LandingStats;
}

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('studentflow_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear auth data but do not force a full page navigation.
      // The UI can handle token expiration gracefully (e.g., show login page).
      localStorage.clear();
      sessionStorage.clear();
      console.warn('Unauthorized request – token cleared.');
    }
    return Promise.reject(error);
  },
);

export const getLatestStudentsPreview = async () => {
  const { data } = await api.get<LatestStudentsResponse>('/students/latest');
  return data;
};
