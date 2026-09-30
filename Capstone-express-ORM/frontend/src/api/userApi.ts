import axiosClient from "./axiosClient";
import type { ImagePin, SavedImage, User } from "../types";

export const getProfileApi = () => axiosClient.get<User>("/users/profile");
export const updateProfileApi = (payload: FormData) =>
  axiosClient.put<{ data: User }>("/users/profile", payload, {
    headers: { "Content-Type": "multipart/form-data" },
  });
export const getCreatedImagesApi = () =>
  axiosClient.get<ImagePin[]>("/users/created-images");
export const getSavedImagesApi = () =>
  axiosClient.get<SavedImage[]>("/users/saved-images");
