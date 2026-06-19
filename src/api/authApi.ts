import axiosInstance from './axiosInstance';
import type { ApiResponse, AuthResponse, LoginRequest, RegisterRequest } from '../types';

export const registerApi = (data: RegisterRequest) =>
  axiosInstance.post<ApiResponse<AuthResponse>>('/auth/register', data);

export const loginApi = (data: LoginRequest) =>
  axiosInstance.post<ApiResponse<AuthResponse>>('/auth/login', data);