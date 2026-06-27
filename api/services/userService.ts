import client from '../client';
import { ApiResponse } from '../types/api.types';

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: string;
  createdAt: string;
}

export const userService = {
  getUser: async (id: string): Promise<ApiResponse<UserProfile>> => {
    // Under the hood, this would do:
    // const res = await client.get<ApiResponse<UserProfile>>(`/users/${id}`);
    // return res.data;

    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          data: {
            id,
            email: 'admin@starter.kit',
            name: 'Admin User',
            role: 'Administrator',
            createdAt: new Date().toISOString(),
          },
          message: 'User profile fetched successfully',
          success: true,
        });
      }, 500);
    });
  },

  getUsers: async (filters?: { search?: string }): Promise<ApiResponse<UserProfile[]>> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          data: [
            {
              id: 'usr_1001',
              email: 'admin@starter.kit',
              name: 'Admin User',
              role: 'Administrator',
              createdAt: new Date().toISOString(),
            },
          ],
          message: 'Users list fetched successfully',
          success: true,
        });
      }, 500);
    });
  },
};
