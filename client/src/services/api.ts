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
      localStorage.removeItem('studentflow_token');
      localStorage.removeItem('studentflow_user');
    }
    return Promise.reject(error);
  },
);

export const getLatestStudentsPreview = async () => {
  const { data } = await api.get<LatestStudentsResponse>('/students/latest');
  return data;
};
