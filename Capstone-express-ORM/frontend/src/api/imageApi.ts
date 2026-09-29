import axiosClient from './axiosClient';
import type { Comment, ImagePin } from '../types';

export const getImagesApi = (name = '') =>
  axiosClient.get<ImagePin[]>('/images', { params: name ? { name } : undefined });
export const getImageDetailApi = (id: number) => axiosClient.get<ImagePin>(`/images/${id}`);
export const getCommentsApi = (id: number) => axiosClient.get<Comment[]>(`/images/${id}/comments`);
export const addCommentApi = (id: number, noi_dung: string) =>
  axiosClient.post(`/images/${id}/comments`, { noi_dung });
export const checkSavedApi = (id: number) =>
  axiosClient.get<{ isSaved: boolean }>(`/images/${id}/saved`);
export const saveImageApi = (id: number) => axiosClient.post(`/images/${id}/saved`);
export const uploadImageApi = (formData: FormData) =>
  axiosClient.post<{ data: ImagePin }>('/images', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
export const deleteImageApi = (id: number) => axiosClient.delete(`/images/${id}`);
