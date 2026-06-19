import axiosInstance from './axiosInstance';
import type { ApiResponse, PaginatedResponse, ProductRequest, ProductResponse } from '../types';

export const getAllProductsApi = (params?: {
  page?: number;
  size?: number;
  sortBy?: string;
  sortDir?: string;
}) => axiosInstance.get<ApiResponse<PaginatedResponse<ProductResponse>>>('/products', { params });

export const searchProductsApi = (params: {
  keyword?: string;
  category?: string;
  page?: number;
  size?: number;
}) => axiosInstance.get<ApiResponse<PaginatedResponse<ProductResponse>>>('/products/search', { params });

export const getProductByIdApi = (id: number) =>
  axiosInstance.get<ApiResponse<ProductResponse>>(`/products/${id}`);

export const addProductApi = (data: ProductRequest) =>
  axiosInstance.post<ApiResponse<ProductResponse>>('/products', data);

export const updateProductApi = (id: number, data: ProductRequest) =>
  axiosInstance.put<ApiResponse<ProductResponse>>(`/products/${id}`, data);

export const deleteProductApi = (id: number) =>
  axiosInstance.delete<ApiResponse<null>>(`/products/${id}`);