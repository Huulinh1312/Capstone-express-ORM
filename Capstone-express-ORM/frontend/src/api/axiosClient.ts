import axios from 'axios';
import { storage } from '../utils/storage';

export const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';
export const SERVER_BASE = API_BASE.replace(/\/api\/?$/, '');

const axiosClient = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
});

axiosClient.interceptors.request.use((config) => {
  const token = storage.getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

axiosClient.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error),
);

export const getApiMessage = (error: unknown) => {
  if (axios.isAxiosError(error))
    return error.response?.data?.message || 'Có lỗi xảy ra, vui lòng thử lại.';
  return error instanceof Error ? error.message : 'Có lỗi xảy ra, vui lòng thử lại.';
};

export const imageUrl = (path?: string | null) => {
  if (!path) return '';
  return path.startsWith('http')
    ? path
    : `${SERVER_BASE}${path.startsWith('/') ? path : `/${path}`}`;
};

export default axiosClient;
