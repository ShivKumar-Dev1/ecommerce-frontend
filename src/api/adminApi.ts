import axiosInstance from './axiosInstance';
import type { ApiResponse, UserResponse } from '../types';

export const getAllUsersApi = () =>
  axiosInstance.get<ApiResponse<UserResponse[]>>('/admin/users');