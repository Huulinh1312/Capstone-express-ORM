import axiosClient from './axiosClient';

export interface LoginPayload {
  email: string;
  mat_khau: string;
}
export interface RegisterPayload {
  email: string;
  mat_khau: string;
  ho_ten: string;
  tuoi?: number;
}

export const loginApi = (payload: LoginPayload) =>
  axiosClient.post<{ token: string }>('/auth/login', payload);
export const registerApi = (payload: RegisterPayload) =>
  axiosClient.post<{ message: string }>('/auth/register', payload);
