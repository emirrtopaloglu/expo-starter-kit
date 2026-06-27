import client from '../client';
import { ApiResponse } from '../types/api.types';

export const uploadService = {
  uploadImage: async (uri: string, onProgress?: (progress: number) => void) => {
    const formData = new FormData();
    // FormData requires standard name, type, and uri objects in React Native
    formData.append('file', { uri, type: 'image/jpeg', name: 'upload.jpg' } as any);

    return client.post<ApiResponse<{ url: string }>>('/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: (e) => {
        onProgress?.(Math.round((e.loaded * 100) / (e.total ?? 1)));
      },
    });
  },
};
